// Test script to verify job validation
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testValidation() {
    console.log('Testing Job Validation...\n');

    // Test 1: Invalid job type
    console.log('1. Testing invalid job type...');
    try {
        const invalidJobType = {
            title: 'Test Job',
            description: 'Test Description',
            requirements: 'Test Requirements',
            salary: '50000',
            location: 'Test Location',
            jobType: 'InvalidType', // Invalid enum value
            experience: '2',
            position: '1',
            companyId: '507f1f77bcf86cd799439031'
        };
        
        const response = await axios.post(`${BASE_URL}/job/post`, invalidJobType, {
            withCredentials: true
        });
        console.log('✗ Should have failed but got:', response.data);
    } catch (error) {
        console.log('✓ Correctly failed with:', error.response?.data?.message);
    }

    // Test 2: Invalid experience
    console.log('\n2. Testing invalid experience...');
    try {
        const invalidExperience = {
            title: 'Test Job',
            description: 'Test Description',
            requirements: 'Test Requirements',
            salary: '50000',
            location: 'Test Location',
            jobType: 'Full-time',
            experience: 'abc', // Invalid numeric value
            position: '1',
            companyId: '507f1f77bcf86cd799439031'
        };
        
        const response = await axios.post(`${BASE_URL}/job/post`, invalidExperience, {
            withCredentials: true
        });
        console.log('✗ Should have failed but got:', response.data);
    } catch (error) {
        console.log('✓ Correctly failed with:', error.response?.data?.message);
    }

    // Test 3: Valid data
    console.log('\n3. Testing valid data...');
    try {
        const validData = {
            title: 'Test Job',
            description: 'Test Description',
            requirements: 'Test Requirements',
            salary: '50000',
            location: 'Test Location',
            jobType: 'Full-time', // Valid enum value
            experience: '2',
            position: '1',
            companyId: '507f1f77bcf86cd799439031'
        };
        
        const response = await axios.post(`${BASE_URL}/job/post`, validData, {
            withCredentials: true
        });
        console.log('✓ Valid data response:', response.data?.message);
    } catch (error) {
        console.log('✗ Valid data failed:', error.response?.data?.message);
    }

    console.log('\nValidation test completed!');
}

// Run the test
testValidation().catch(console.error);
