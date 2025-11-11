/**
 * Event Publisher for JobHunt
 * 
 * Publishes JobHunt events to the RabbitMQ event bus
 * so other microservices can react to JobHunt activities
 */

import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672';

class EventPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.connected = false;
    this.reconnectTimeout = null;
    this.exchange = 'jobhunt.events';
  }

  /**
   * Connect to RabbitMQ
   */
  async connect() {
    try {
      console.log('Connecting to RabbitMQ event bus...');
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      // Assert exchange
      await this.channel.assertExchange(this.exchange, 'topic', {
        durable: true
      });

      this.connected = true;
      console.log('Connected to RabbitMQ event bus successfully');

      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.connected = false;
        this.handleDisconnect();
      });

      this.connection.on('close', () => {
        console.warn('RabbitMQ connection closed');
        this.connected = false;
        this.handleDisconnect();
      });

    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error.message);
      this.handleDisconnect();
    }
  }

  /**
   * Handle disconnection and attempt reconnection
   */
  handleDisconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect to RabbitMQ...');
      this.connect().catch(err => {
        console.error('Reconnection failed:', err.message);
      });
    }, 5000);
  }

  /**
   * Publish an event
   */
  async publish(eventType, data, routingKey = null) {
    if (!this.connected || !this.channel) {
      console.warn(`Cannot publish event ${eventType}: Not connected to RabbitMQ`);
      return false;
    }

    try {
      const event = {
        eventId: this.generateEventId(),
        eventType,
        version: '1.0',
        timestamp: new Date().toISOString(),
        source: 'jobhunt',
        data,
        metadata: {
          environment: process.env.NODE_ENV || 'development'
        }
      };

      const key = routingKey || eventType;
      const message = Buffer.from(JSON.stringify(event));

      const published = this.channel.publish(
        this.exchange,
        key,
        message,
        {
          persistent: true,
          contentType: 'application/json',
          messageId: event.eventId
        }
      );

      if (published) {
        console.log(`Event published: ${eventType}`);
        return true;
      } else {
        console.warn(`Event buffered: ${eventType}`);
        return false;
      }
    } catch (error) {
      console.error(`Failed to publish event ${eventType}:`, error.message);
      return false;
    }
  }

  /**
   * JobHunt-specific event publishers
   */

  // Application events
  async publishApplicationSubmitted(applicationData) {
    return this.publish('application.submitted', {
      applicationId: applicationData._id,
      jobId: applicationData.jobId,
      userId: applicationData.userId,
      applicantEmail: applicationData.applicantEmail,
      applicantName: applicationData.applicantName,
      resumeUrl: applicationData.resumeUrl,
      coverLetter: applicationData.coverLetter,
      submittedAt: applicationData.createdAt || new Date().toISOString()
    });
  }

  async publishApplicationStatusChanged(applicationData, oldStatus, newStatus) {
    return this.publish('application.status_changed', {
      applicationId: applicationData._id,
      jobId: applicationData.jobId,
      userId: applicationData.userId,
      oldStatus,
      newStatus,
      changedAt: new Date().toISOString()
    });
  }

  // Job events
  async publishJobPosted(jobData) {
    return this.publish('job.posted', {
      jobId: jobData._id,
      title: jobData.title,
      companyId: jobData.companyId,
      location: jobData.location,
      jobType: jobData.jobType,
      salary: jobData.salary,
      experienceLevel: jobData.experienceLevel,
      postedBy: jobData.createdBy,
      postedAt: jobData.createdAt || new Date().toISOString()
    });
  }

  async publishJobUpdated(jobData) {
    return this.publish('job.updated', {
      jobId: jobData._id,
      title: jobData.title,
      updatedAt: new Date().toISOString()
    });
  }

  async publishJobClosed(jobData) {
    return this.publish('job.closed', {
      jobId: jobData._id,
      title: jobData.title,
      closedAt: new Date().toISOString()
    });
  }

  // Interview events
  async publishInterviewScheduled(interviewData) {
    return this.publish('interview.scheduled', {
      interviewId: interviewData._id,
      applicationId: interviewData.applicationId,
      jobId: interviewData.jobId,
      candidateId: interviewData.candidateId,
      candidateEmail: interviewData.candidateEmail,
      date: interviewData.date,
      time: interviewData.time,
      type: interviewData.type,
      location: interviewData.location,
      meetingLink: interviewData.meetingLink,
      scheduledAt: new Date().toISOString()
    });
  }

  async publishInterviewCompleted(interviewData) {
    return this.publish('interview.completed', {
      interviewId: interviewData._id,
      applicationId: interviewData.applicationId,
      result: interviewData.result,
      completedAt: new Date().toISOString()
    });
  }

  // Company events
  async publishCompanyRegistered(companyData) {
    return this.publish('company.registered', {
      companyId: companyData._id,
      name: companyData.name,
      email: companyData.email,
      website: companyData.website,
      registeredAt: companyData.createdAt || new Date().toISOString()
    });
  }

  // Message events
  async publishMessageSent(messageData) {
    return this.publish('message.sent', {
      messageId: messageData._id,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      conversationId: messageData.conversationId,
      sentAt: messageData.createdAt || new Date().toISOString()
    });
  }

  /**
   * Generate unique event ID
   */
  generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Close connection
   */
  async close() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.channel) {
      await this.channel.close();
    }

    if (this.connection) {
      await this.connection.close();
    }

    this.connected = false;
    console.log('Event publisher closed');
  }
}

// Singleton instance
const eventPublisher = new EventPublisher();

// Auto-connect on module load
eventPublisher.connect().catch(err => {
  console.error('Failed to initialize event publisher:', err.message);
});

export default eventPublisher;

