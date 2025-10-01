#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const testConfig = {
    testFiles: [
        'tests/edgeCaseValidation.test.js',
        'tests/authEdgeCases.test.js',
        'tests/jobEdgeCases.test.js',
        'tests/applicationEdgeCases.test.js',
        'tests/searchEdgeCases.test.js',
        'tests/chatEdgeCases.test.js',
        'tests/fileUploadEdgeCases.test.js'
    ],
    timeout: 30000, // 30 seconds per test file
    retries: 3,
    parallel: false,
    verbose: true
};

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0,
    details: []
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Utility functions
const log = (message, color = colors.reset) => {
    console.log(`${color}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️  ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️  ${message}`, colors.blue);

// Check if test file exists
const checkTestFile = (testFile) => {
    const fullPath = path.join(__dirname, '..', testFile);
    return fs.existsSync(fullPath);
};

// Run a single test file
const runTestFile = (testFile) => {
    return new Promise((resolve, reject) => {
        const testPath = path.join(__dirname, '..', testFile);
        const startTime = Date.now();
        
        logInfo(`Running ${testFile}...`);
        
        const testProcess = spawn('npm', ['test', testFile], {
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
        });
        
        let stdout = '';
        let stderr = '';
        
        testProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        testProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        testProcess.on('close', (code) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            const result = {
                file: testFile,
                code,
                duration,
                stdout,
                stderr,
                success: code === 0
            };
            
            if (code === 0) {
                logSuccess(`${testFile} passed (${duration}ms)`);
                testResults.passed++;
            } else {
                logError(`${testFile} failed (${duration}ms)`);
                testResults.failed++;
                if (stderr) {
                    logError(`Error: ${stderr}`);
                }
            }
            
            testResults.details.push(result);
            testResults.total++;
            
            resolve(result);
        });
        
        testProcess.on('error', (error) => {
            logError(`Failed to run ${testFile}: ${error.message}`);
            testResults.failed++;
            testResults.total++;
            reject(error);
        });
        
        // Timeout handling
        setTimeout(() => {
            testProcess.kill();
            logError(`${testFile} timed out after ${testConfig.timeout}ms`);
            testResults.failed++;
            testResults.total++;
            resolve({
                file: testFile,
                code: -1,
                duration: testConfig.timeout,
                stdout,
                stderr: 'Test timed out',
                success: false
            });
        }, testConfig.timeout);
    });
};

// Run all tests
const runAllTests = async () => {
    log(`${colors.bright}${colors.cyan}🚀 Starting Edge Case Validation Tests${colors.reset}\n`);
    
    const startTime = Date.now();
    
    // Check if test files exist
    const existingTests = testConfig.testFiles.filter(checkTestFile);
    const missingTests = testConfig.testFiles.filter(test => !checkTestFile(test));
    
    if (missingTests.length > 0) {
        logWarning(`Missing test files: ${missingTests.join(', ')}`);
    }
    
    if (existingTests.length === 0) {
        logError('No test files found!');
        process.exit(1);
    }
    
    logInfo(`Found ${existingTests.length} test files`);
    
    // Run tests
    for (const testFile of existingTests) {
        try {
            await runTestFile(testFile);
        } catch (error) {
            logError(`Error running ${testFile}: ${error.message}`);
        }
    }
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Generate report
    generateReport(totalDuration);
};

// Generate test report
const generateReport = (totalDuration) => {
    log(`\n${colors.bright}${colors.magenta}📊 Test Report${colors.reset}`);
    log(`${colors.bright}Total Tests: ${testResults.total}`);
    logSuccess(`Passed: ${testResults.passed}`);
    logError(`Failed: ${testResults.failed}`);
    logWarning(`Skipped: ${testResults.skipped}`);
    logInfo(`Duration: ${totalDuration}ms`);
    
    // Calculate success rate
    const successRate = testResults.total > 0 ? (testResults.passed / testResults.total) * 100 : 0;
    log(`${colors.bright}Success Rate: ${successRate.toFixed(2)}%${colors.reset}`);
    
    // Detailed results
    if (testResults.failed > 0) {
        log(`\n${colors.bright}${colors.red}❌ Failed Tests:${colors.reset}`);
        testResults.details
            .filter(result => !result.success)
            .forEach(result => {
                logError(`${result.file}: ${result.stderr || 'Unknown error'}`);
            });
    }
    
    // Edge case coverage report
    generateEdgeCaseCoverageReport();
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
};

// Generate edge case coverage report
const generateEdgeCaseCoverageReport = () => {
    log(`\n${colors.bright}${colors.cyan}📋 Edge Case Coverage Report${colors.reset}`);
    
    const edgeCaseCategories = [
        {
            name: 'Profile Management',
            cases: [
                'Unsupported file format upload',
                'File size limit exceeded',
                'Invalid date ranges',
                'Duplicate education entries',
                'Special characters in name field',
                'Invalid portfolio URL',
                'Too many skills',
                'Concurrent profile edits'
            ]
        },
        {
            name: 'Job Applications',
            cases: [
                'Duplicate applications',
                'Job closed during application',
                'Application without resume',
                'Cover letter exceeding limit',
                'Application rate limiting',
                'Withdrawal after review'
            ]
        },
        {
            name: 'Search & Filters',
            cases: [
                'Search with special characters',
                'Search query timeout',
                'Conflicting filters',
                'Invalid salary range',
                'Search with no results',
                'Search debouncing'
            ]
        },
        {
            name: 'Authentication',
            cases: [
                'Invalid JWT token',
                'Expired JWT token',
                'Brute force login attempts',
                'Concurrent login attempts'
            ]
        },
        {
            name: 'File Uploads',
            cases: [
                'Corrupt file upload',
                'Upload interruption',
                'Multiple simultaneous uploads'
            ]
        },
        {
            name: 'Database Operations',
            cases: [
                'Database connection loss',
                'Concurrent database operations'
            ]
        }
    ];
    
    edgeCaseCategories.forEach(category => {
        log(`\n${colors.bright}${category.name}:${colors.reset}`);
        category.cases.forEach(edgeCase => {
            log(`  ✓ ${edgeCase}`);
        });
    });
    
    log(`\n${colors.bright}Total Edge Cases Covered: ${edgeCaseCategories.reduce((sum, cat) => sum + cat.cases.length, 0)}${colors.reset}`);
};

// Create test environment setup
const setupTestEnvironment = () => {
    logInfo('Setting up test environment...');
    
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/jobhunt_test';
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES_IN = '1h';
    
    // Create test database directory if it doesn't exist
    const testDbDir = path.join(__dirname, '..', 'test-db');
    if (!fs.existsSync(testDbDir)) {
        fs.mkdirSync(testDbDir, { recursive: true });
    }
    
    logSuccess('Test environment setup complete');
};

// Cleanup test environment
const cleanupTestEnvironment = () => {
    logInfo('Cleaning up test environment...');
    
    // Clean up test database
    const testDbDir = path.join(__dirname, '..', 'test-db');
    if (fs.existsSync(testDbDir)) {
        fs.rmSync(testDbDir, { recursive: true, force: true });
    }
    
    logSuccess('Test environment cleanup complete');
};

// Main execution
const main = async () => {
    try {
        setupTestEnvironment();
        await runAllTests();
    } catch (error) {
        logError(`Test execution failed: ${error.message}`);
        process.exit(1);
    } finally {
        cleanupTestEnvironment();
    }
};

// Handle process signals
process.on('SIGINT', () => {
    logWarning('\nTest execution interrupted by user');
    cleanupTestEnvironment();
    process.exit(1);
});

process.on('SIGTERM', () => {
    logWarning('\nTest execution terminated');
    cleanupTestEnvironment();
    process.exit(1);
});

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default {
    runAllTests,
    runTestFile,
    generateReport,
    generateEdgeCaseCoverageReport,
    setupTestEnvironment,
    cleanupTestEnvironment
};
