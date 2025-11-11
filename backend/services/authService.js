/**
 * Auth Microservice Integration
 * 
 * This service acts as an adapter between JobHunt and the Auth microservice.
 * It handles user registration, login, and authentication with the central auth service.
 */

import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001/api/v1';

class AuthService {
  constructor() {
    this.baseURL = AUTH_SERVICE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Register a new user via Auth microservice
   * Maps JobHunt user data to Auth microservice format
   */
  async register(userData) {
    try {
      const { fullName, email, phoneNumber, password, role, profile } = userData;
      
      // Split fullName into firstName and lastName for Auth microservice
      const nameParts = fullName?.split(' ') || ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const authData = {
        email,
        password,
        firstName,
        lastName,
        // Store JobHunt-specific data in metadata
        metadata: {
          phoneNumber,
          role,
          profile: profile || {},
          source: 'jobhunt'
        }
      };

      console.log('Registering user with Auth microservice:', email);
      const response = await this.client.post('/auth/register', authData);
      
      return {
        success: true,
        user: {
          authUserId: response.data.user.id || response.data.user._id,
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          fullName: `${response.data.user.firstName} ${response.data.user.lastName}`.trim()
        },
        tokens: response.data.tokens
      };
    } catch (error) {
      console.error('Auth microservice registration error:', error.response?.data || error.message);
      
      // Return standardized error
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * Login user via Auth microservice
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;

      console.log('Logging in user with Auth microservice:', email);
      const response = await this.client.post('/auth/login', {
        email,
        password
      });
      
      return {
        success: true,
        user: {
          authUserId: response.data.user.id || response.data.user._id,
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          fullName: `${response.data.user.firstName} ${response.data.user.lastName}`.trim()
        },
        tokens: response.data.tokens
      };
    } catch (error) {
      console.error('Auth microservice login error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * Validate JWT token with Auth microservice
   */
  async validateToken(token) {
    try {
      const response = await this.client.get('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      console.error('Token validation error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid token'
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken
      });
      
      return {
        success: true,
        tokens: response.data.tokens
      };
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed'
      };
    }
  }

  /**
   * Logout user
   */
  async logout(token) {
    try {
      await this.client.post('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed'
      };
    }
  }

  /**
   * Check if Auth microservice is available
   */
  async healthCheck() {
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      console.error('Auth microservice health check failed:', error.message);
      return false;
    }
  }
}

// Singleton instance
const authService = new AuthService();

export default authService;

