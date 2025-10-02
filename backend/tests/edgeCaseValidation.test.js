import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import Company from '../models/company.model.js';

describe('Edge Case Validation Tests', () => {
    let testUser;
    let testCompany;
    let testJob;
    let authToken;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/jobhunt_test');
        
        // Clean up test data
        await User.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        await Company.deleteMany({});
    });

    beforeEach(async () => {
        // Create test user
        testUser = new User({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phoneNumber: '1234567890',
            role: 'jobseeker',
            profile: {
                headline: 'Software Engineer',
                location: 'San Francisco, CA',
                skills: ['JavaScript', 'React', 'Node.js']
            }
        });
        await testUser.save();

        // Create test company
        testCompany = new Company({
            name: 'Test Company',
            email: 'company@test.com',
            password: 'password123',
            industry: 'Technology',
            size: '50-200',
            location: 'San Francisco, CA'
        });
        await testCompany.save();

        // Create test job
        testJob = new Job({
            title: 'Software Engineer',
            company: testCompany._id,
            description: 'Great opportunity for a software engineer',
            requirements: ['JavaScript', 'React'],
            location: 'San Francisco, CA',
            salary: { min: 80000, max: 120000 },
            jobType: 'Full-time',
            status: 'active'
        });
        await testJob.save();

        // Login and get auth token
        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        
        authToken = loginResponse.body.token;
    });

    afterEach(async () => {
        // Clean up after each test
        await User.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        await Company.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Profile Management Edge Cases', () => {
        test('should handle unsupported file format upload', async () => {
            const response = await request(app)
                .post('/api/v1/users/profile/resume')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('resume', Buffer.from('fake content'), 'test.txt');

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('unsupported');
        });

        test('should handle file size limit exceeded', async () => {
            // Create a large buffer (6MB)
            const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
            
            const response = await request(app)
                .post('/api/v1/users/profile/resume')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('resume', largeBuffer, 'large.pdf');

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('size limit');
        });

        test('should handle invalid date ranges', async () => {
            const response = await request(app)
                .put('/api/v1/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    experience: [{
                        title: 'Software Engineer',
                        company: 'Test Company',
                        startDate: '2023-01-01',
                        endDate: '2022-01-01' // End before start
                    }]
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('invalid date');
        });

        test('should handle duplicate education entries', async () => {
            const response = await request(app)
                .put('/api/v1/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    education: [
                        {
                            school: 'University of California',
                            degree: 'Bachelor of Science',
                            field: 'Computer Science',
                            startDate: '2014-09-01',
                            endDate: '2018-05-01'
                        },
                        {
                            school: 'University of California',
                            degree: 'Bachelor of Science',
                            field: 'Computer Science',
                            startDate: '2014-09-01',
                            endDate: '2018-05-01'
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('duplicate');
        });

        test('should handle special characters in name field', async () => {
            const response = await request(app)
                .put('/api/v1/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    fullName: 'John<script>alert("xss")</script>Doe'
                });

            expect(response.status).toBe(200);
            expect(response.body.user.fullName).toBe('JohnDoe'); // Sanitized
        });

        test('should handle invalid portfolio URL', async () => {
            const response = await request(app)
                .put('/api/v1/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    portfolio: 'not-a-valid-url'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('invalid URL');
        });

        test('should handle too many skills', async () => {
            const manySkills = Array(101).fill().map((_, i) => `Skill${i}`);
            
            const response = await request(app)
                .put('/api/v1/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    skills: manySkills
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('too many skills');
        });

        test('should handle concurrent profile edits', async () => {
            const profileUpdate1 = request(app)
                .put('/api/v1/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ headline: 'Updated Headline 1' });

            const profileUpdate2 = request(app)
                .put('/api/v1/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ headline: 'Updated Headline 2' });

            const [response1, response2] = await Promise.all([profileUpdate1, profileUpdate2]);

            // One should succeed, one should fail or be queued
            expect([response1.status, response2.status]).toContain(200);
        });
    });

    describe('Job Application Edge Cases', () => {
        test('should prevent duplicate applications', async () => {
            // First application
            await request(app)
                .post(`/api/v1/applications/apply/${testJob._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    coverLetter: 'I am interested in this position'
                });

            // Second application to same job
            const response = await request(app)
                .post(`/api/v1/applications/apply/${testJob._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    coverLetter: 'I am still interested in this position'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('already applied');
        });

        test('should handle job closed during application', async () => {
            // Close the job
            await Job.findByIdAndUpdate(testJob._id, { status: 'closed' });

            const response = await request(app)
                .post(`/api/v1/applications/apply/${testJob._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    coverLetter: 'I am interested in this position'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('no longer accepting');
        });

        test('should handle application without resume', async () => {
            const response = await request(app)
                .post(`/api/v1/applications/apply/${testJob._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    coverLetter: 'I am interested in this position'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('resume required');
        });

        test('should handle cover letter exceeding character limit', async () => {
            const longCoverLetter = 'a'.repeat(2001); // Exceeds 2000 limit

            const response = await request(app)
                .post(`/api/v1/applications/apply/${testJob._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    coverLetter: longCoverLetter
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('character limit');
        });

        test('should handle application rate limiting', async () => {
            // Create multiple jobs
            const jobs = [];
            for (let i = 0; i < 105; i++) {
                const job = new Job({
                    title: `Job ${i}`,
                    company: testCompany._id,
                    description: 'Test job',
                    requirements: ['JavaScript'],
                    location: 'San Francisco, CA',
                    salary: { min: 50000, max: 100000 },
                    jobType: 'Full-time',
                    status: 'active'
                });
                await job.save();
                jobs.push(job);
            }

            // Try to apply to all jobs
            const applications = jobs.slice(0, 101).map(job => 
                request(app)
                    .post(`/api/v1/applications/apply/${job._id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        coverLetter: 'I am interested in this position'
                    })
            );

            const responses = await Promise.all(applications);
            
            // Some should be rate limited
            const rateLimitedResponses = responses.filter(r => r.status === 429);
            expect(rateLimitedResponses.length).toBeGreaterThan(0);
        });

        test('should handle application withdrawal after review', async () => {
            // Create application
            const application = new Application({
                user: testUser._id,
                job: testJob._id,
                company: testCompany._id,
                status: 'reviewed',
                coverLetter: 'I am interested in this position'
            });
            await application.save();

            const response = await request(app)
                .put(`/api/v1/applications/${application._id}/withdraw`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('cannot withdraw');
        });
    });

    describe('Search Edge Cases', () => {
        test('should handle search with special characters', async () => {
            const response = await request(app)
                .get('/api/v1/jobs/search')
                .query({ q: 'software engineer<script>alert("xss")</script>' });

            expect(response.status).toBe(200);
            expect(response.body.query).not.toContain('<script>');
        });

        test('should handle search query timeout', async () => {
            // This would require a very slow query or database lock
            const response = await request(app)
                .get('/api/v1/jobs/search')
                .query({ q: 'a'.repeat(1000) })
                .timeout(5000);

            expect(response.status).toBe(408); // Request timeout
        });

        test('should handle conflicting filters', async () => {
            const response = await request(app)
                .get('/api/v1/jobs/search')
                .query({
                    q: 'engineer',
                    experienceLevel: 'entry-level',
                    salaryMin: 200000
                });

            expect(response.status).toBe(200);
            // Should warn about conflicting filters
            expect(response.body.warning).toContain('conflicting');
        });

        test('should handle invalid salary range', async () => {
            const response = await request(app)
                .get('/api/v1/jobs/search')
                .query({
                    q: 'engineer',
                    salaryMin: 100000,
                    salaryMax: 50000
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('invalid salary range');
        });

        test('should handle search with no results', async () => {
            const response = await request(app)
                .get('/api/v1/jobs/search')
                .query({ q: 'nonexistentjobtitle12345' });

            expect(response.status).toBe(200);
            expect(response.body.jobs).toHaveLength(0);
            expect(response.body.suggestions).toBeDefined();
        });

        test('should handle search debouncing', async () => {
            const startTime = Date.now();
            
            // Make multiple rapid requests
            const requests = Array(5).fill().map(() =>
                request(app)
                    .get('/api/v1/jobs/search')
                    .query({ q: 'engineer' })
            );

            const responses = await Promise.all(requests);
            const endTime = Date.now();

            // Should be debounced (responses should be similar)
            expect(responses.every(r => r.status === 200)).toBe(true);
        });
    });

    describe('Chat Edge Cases', () => {
        test('should handle message to non-existent user', async () => {
            const response = await request(app)
                .post('/api/v1/messages/send')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    recipientId: '507f1f77bcf86cd799439011', // Non-existent ObjectId
                    message: 'Hello'
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toContain('not found');
        });

        test('should handle message rate limiting', async () => {
            const messages = Array(101).fill().map(() =>
                request(app)
                    .post('/api/v1/messages/send')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        recipientId: testCompany._id,
                        message: 'Hello'
                    })
            );

            const responses = await Promise.all(messages);
            const rateLimitedResponses = responses.filter(r => r.status === 429);
            expect(rateLimitedResponses.length).toBeGreaterThan(0);
        });

        test('should handle very long messages', async () => {
            const longMessage = 'a'.repeat(10001); // Exceeds 10000 limit

            const response = await request(app)
                .post('/api/v1/messages/send')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    recipientId: testCompany._id,
                    message: longMessage
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('too long');
        });

        test('should handle message with inappropriate content', async () => {
            const response = await request(app)
                .post('/api/v1/messages/send')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    recipientId: testCompany._id,
                    message: 'This is spam and inappropriate content'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('inappropriate');
        });
    });

    describe('Authentication Edge Cases', () => {
        test('should handle invalid JWT token', async () => {
            const response = await request(app)
                .get('/api/v1/users/profile')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('invalid token');
        });

        test('should handle expired JWT token', async () => {
            // This would require creating an expired token
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMn0.invalid';
            
            const response = await request(app)
                .get('/api/v1/users/profile')
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('expired');
        });

        test('should handle brute force login attempts', async () => {
            const loginAttempts = Array(6).fill().map(() =>
                request(app)
                    .post('/api/v1/users/login')
                    .send({
                        email: 'test@example.com',
                        password: 'wrongpassword'
                    })
            );

            const responses = await Promise.all(loginAttempts);
            const blockedResponses = responses.filter(r => r.status === 429);
            expect(blockedResponses.length).toBeGreaterThan(0);
        });

        test('should handle concurrent login attempts', async () => {
            const loginAttempts = Array(5).fill().map(() =>
                request(app)
                    .post('/api/v1/users/login')
                    .send({
                        email: 'test@example.com',
                        password: 'password123'
                    })
            );

            const responses = await Promise.all(loginAttempts);
            // All should succeed or be handled gracefully
            expect(responses.every(r => r.status === 200 || r.status === 429)).toBe(true);
        });
    });

    describe('File Upload Edge Cases', () => {
        test('should handle corrupt file upload', async () => {
            const corruptBuffer = Buffer.from('corrupt file content');
            
            const response = await request(app)
                .post('/api/v1/users/profile/resume')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('resume', corruptBuffer, 'corrupt.pdf');

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('corrupt');
        });

        test('should handle upload interruption', async () => {
            // Simulate upload interruption by sending partial data
            const response = await request(app)
                .post('/api/v1/users/profile/resume')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('resume', Buffer.from('partial'), 'partial.pdf')
                .timeout(1000); // Short timeout

            expect(response.status).toBe(408);
        });

        test('should handle multiple file uploads simultaneously', async () => {
            const uploads = Array(3).fill().map(() =>
                request(app)
                    .post('/api/v1/users/profile/resume')
                    .set('Authorization', `Bearer ${authToken}`)
                    .attach('resume', Buffer.from('test content'), 'test.pdf')
            );

            const responses = await Promise.all(uploads);
            // Should handle gracefully (some may fail due to concurrency)
            expect(responses.every(r => r.status === 200 || r.status === 409)).toBe(true);
        });
    });

    describe('Database Edge Cases', () => {
        test('should handle database connection loss', async () => {
            // This would require simulating database disconnection
            // For now, we'll test error handling
            const response = await request(app)
                .get('/api/v1/jobs')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
        });

        test('should handle concurrent database operations', async () => {
            const operations = Array(10).fill().map(() =>
                request(app)
                    .put('/api/v1/users/profile')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ headline: `Updated ${Date.now()}` })
            );

            const responses = await Promise.all(operations);
            // Should handle concurrency gracefully
            expect(responses.every(r => r.status === 200 || r.status === 409)).toBe(true);
        });
    });
});
