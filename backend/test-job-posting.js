// Test script to verify job posting functionality
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testJobPosting() {
    console.log('Testing Job Posting Functionality...\n');

    try {
        // Test job posting endpoint
        console.log('1. Testing job posting endpoint...');
        
        const jobData = {
            title: 'Software Developer',
            description: 'We are looking for a skilled software developer',
            requirements: 'JavaScript, React, Node.js',
            salary: '50000',
            location: 'Mumbai, Maharashtra, India',
            jobType: 'Full-time', // Valid enum value
            experience: '2',
            position: '1',
            companyId: '507f1f77bcf86cd799439031'
        };
        
        const response = await axios.post(`${BASE_URL}/job/post`, jobData, {
            withCredentials: true
        });
        
        console.log('✓ Job Posting Response Status:', response.status);
        console.log('✓ Job Posting Response Data:', response.data);
        
    } catch (error) {
        console.log('✗ Job posting failed:', error.response?.status, error.response?.data);
    }

    console.log('\nJob posting test completed!');
}

// Run the test
testJobPosting().catch(console.error);
