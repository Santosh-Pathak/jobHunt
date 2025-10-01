// Simple test script to verify authentication endpoints
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testAuth() {
    console.log('Testing Authentication Endpoints...\n');

    try {
        // Test 1: Public endpoints (should work without authentication)
        console.log('1. Testing public endpoints...');
        
        const jobsResponse = await axios.get(`${BASE_URL}/job/get`);
        console.log('✓ GET /job/get - Status:', jobsResponse.status);
        
        const companiesResponse = await axios.get(`${BASE_URL}/company/get`);
        console.log('✓ GET /company/get - Status:', companiesResponse.status);
        
    } catch (error) {
        console.log('✗ Public endpoint failed:', error.response?.status, error.response?.data?.message);
    }

    try {
        // Test 2: Protected endpoints (should fail without authentication)
        console.log('\n2. Testing protected endpoints without authentication...');
        
        const postJobResponse = await axios.post(`${BASE_URL}/job/post`, {
            title: 'Test Job',
            description: 'Test Description',
            requirements: 'Test Requirements',
            salary: 50000,
            location: 'Test Location',
            jobType: 'Full-time',
            experience: 'Entry',
            position: 'Developer',
            companyId: 'test123'
        });
        console.log('✗ POST /job/post should have failed but got status:', postJobResponse.status);
        
    } catch (error) {
        console.log('✓ POST /job/post correctly failed - Status:', error.response?.status, error.response?.data?.message);
    }

    try {
        // Test 3: Login endpoint
        console.log('\n3. Testing login endpoint...');
        
        const loginResponse = await axios.post(`${BASE_URL}/user/login`, {
            email: 'test@example.com',
            password: 'testpassword',
            role: 'jobseeker'
        });
        console.log('✗ Login should have failed for non-existent user but got status:', loginResponse.status);
        
    } catch (error) {
        console.log('✓ Login correctly failed for non-existent user - Status:', error.response?.status, error.response?.data?.message);
    }

    console.log('\nAuthentication test completed!');
}

// Run the test
testAuth().catch(console.error);
