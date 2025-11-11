/**
 * Notification Microservice Integration
 * 
 * This service acts as an adapter between JobHunt and the Notification microservice.
 * It handles sending emails, SMS, and push notifications.
 */

import axios from 'axios';

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003';

class NotificationService {
  constructor() {
    this.baseURL = NOTIFICATION_SERVICE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Send email notification
   */
  async sendEmail({ to, subject, body, templateName, templateData, userId }) {
    try {
      const payload = {
        userId: userId || 'jobhunt-system',
        channel: 'EMAIL',
        to,
        subject,
        priority: 'normal',
        metadata: {
          source: 'jobhunt'
        }
      };

      // Use template if provided, otherwise use body
      if (templateName && templateData) {
        payload.templateName = templateName;
        payload.templateData = templateData;
      } else if (body) {
        payload.body = body;
      }

      console.log('Sending email via Notification microservice:', { to, subject, templateName });
      const response = await this.client.post('/notify', payload);
      
      return {
        success: true,
        notificationId: response.data.notificationId
      };
    } catch (error) {
      console.error('Email notification error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Email notification failed'
      };
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to JobHunt!',
      templateName: 'welcome-email',
      templateData: {
        firstName: user.firstName || user.fullName?.split(' ')[0] || 'User',
        email: user.email,
        role: user.role
      },
      userId: user._id || user.authUserId
    });
  }

  /**
   * Send job application confirmation
   */
  async sendApplicationConfirmation({ applicant, job, company }) {
    return this.sendEmail({
      to: applicant.email,
      subject: `Application Submitted: ${job.title}`,
      body: `
        <h2>Application Submitted Successfully</h2>
        <p>Dear ${applicant.fullName},</p>
        <p>Your application for the position of <strong>${job.title}</strong> at <strong>${company.name}</strong> has been submitted successfully.</p>
        <p>We will notify you once the recruiter reviews your application.</p>
        <br>
        <p>Best regards,<br>JobHunt Team</p>
      `,
      userId: applicant._id
    });
  }

  /**
   * Send job posting confirmation to recruiter
   */
  async sendJobPostingConfirmation({ recruiter, job }) {
    return this.sendEmail({
      to: recruiter.email,
      subject: 'Job Posted Successfully',
      body: `
        <h2>Job Posted Successfully</h2>
        <p>Dear ${recruiter.fullName},</p>
        <p>Your job posting for <strong>${job.title}</strong> has been published successfully.</p>
        <p><strong>Position:</strong> ${job.title}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Salary Range:</strong> ${job.salary || 'Not specified'}</p>
        <p>Candidates can now apply for this position.</p>
        <br>
        <p>Best regards,<br>JobHunt Team</p>
      `,
      userId: recruiter._id
    });
  }

  /**
   * Send interview invitation
   */
  async sendInterviewInvitation({ applicant, interview, job }) {
    return this.sendEmail({
      to: applicant.email,
      subject: `Interview Invitation: ${job.title}`,
      body: `
        <h2>Interview Invitation</h2>
        <p>Dear ${applicant.fullName},</p>
        <p>Congratulations! You have been selected for an interview for the position of <strong>${job.title}</strong>.</p>
        <p><strong>Interview Date:</strong> ${new Date(interview.date).toLocaleDateString()}</p>
        <p><strong>Interview Time:</strong> ${interview.time}</p>
        <p><strong>Interview Type:</strong> ${interview.type || 'Not specified'}</p>
        ${interview.location ? `<p><strong>Location:</strong> ${interview.location}</p>` : ''}
        ${interview.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${interview.meetingLink}">${interview.meetingLink}</a></p>` : ''}
        <p>Please confirm your availability and be prepared.</p>
        <br>
        <p>Good luck!<br>JobHunt Team</p>
      `,
      userId: applicant._id
    });
  }

  /**
   * Send application status update
   */
  async sendApplicationStatusUpdate({ applicant, job, company, status }) {
    const statusMessages = {
      'accepted': 'Congratulations! Your application has been accepted.',
      'rejected': 'We regret to inform you that your application was not selected this time.',
      'under_review': 'Your application is currently under review.',
      'shortlisted': 'Great news! You have been shortlisted for the next round.'
    };

    return this.sendEmail({
      to: applicant.email,
      subject: `Application Status Update: ${job.title}`,
      body: `
        <h2>Application Status Update</h2>
        <p>Dear ${applicant.fullName},</p>
        <p>${statusMessages[status] || 'Your application status has been updated.'}</p>
        <p><strong>Position:</strong> ${job.title}</p>
        <p><strong>Company:</strong> ${company.name}</p>
        <p><strong>Status:</strong> ${status}</p>
        <br>
        <p>Best regards,<br>JobHunt Team</p>
      `,
      userId: applicant._id
    });
  }

  /**
   * Send job alert notification
   */
  async sendJobAlert({ user, job, company }) {
    return this.sendEmail({
      to: user.email,
      subject: `Job Alert: ${job.title}`,
      body: `
        <h2>New Job Matching Your Profile</h2>
        <p>Dear ${user.fullName},</p>
        <p>A new job matching your preferences has been posted:</p>
        <p><strong>Position:</strong> ${job.title}</p>
        <p><strong>Company:</strong> ${company.name}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Experience:</strong> ${job.experienceLevel || 'Not specified'}</p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/job/${job._id}">View Job Details</a></p>
        <br>
        <p>Best regards,<br>JobHunt Team</p>
      `,
      userId: user._id
    });
  }

  /**
   * Send SMS notification
   */
  async sendSMS({ to, message, userId }) {
    try {
      const payload = {
        userId: userId || 'jobhunt-system',
        channel: 'SMS',
        to,
        body: message,
        priority: 'normal',
        metadata: {
          source: 'jobhunt'
        }
      };

      console.log('Sending SMS via Notification microservice:', { to });
      const response = await this.client.post('/notify', payload);
      
      return {
        success: true,
        notificationId: response.data.notificationId
      };
    } catch (error) {
      console.error('SMS notification error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'SMS notification failed'
      };
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification({ userId, title, body, data }) {
    try {
      const payload = {
        userId,
        channel: 'PUSH',
        to: userId, // Will use FCM token from notification service
        subject: title,
        body,
        priority: 'normal',
        metadata: {
          source: 'jobhunt',
          ...data
        }
      };

      console.log('Sending push notification via Notification microservice:', { userId, title });
      const response = await this.client.post('/notify', payload);
      
      return {
        success: true,
        notificationId: response.data.notificationId
      };
    } catch (error) {
      console.error('Push notification error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Push notification failed'
      };
    }
  }

  /**
   * Check if Notification microservice is available
   */
  async healthCheck() {
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      console.error('Notification microservice health check failed:', error.message);
      return false;
    }
  }
}

// Singleton instance
const notificationService = new NotificationService();

export default notificationService;

