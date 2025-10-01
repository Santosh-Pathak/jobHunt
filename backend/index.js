//create server
import express from 'express';
import cookieParser from 'cookie-parser'; // to store the user data in the cookies so that the user can be authenticated and authorized in the future requests to the server 
import cors from 'cors'; // to allow the requests from the frontend to the backend server 
import dotenv from 'dotenv'; // to use the environment variables in the project
import helmet from 'helmet'; // Security middleware
import rateLimit from 'express-rate-limit'; // Rate limiting
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './utils/db.js'; // to connect to the database
import userRoute from './routes/user.route.js'; // to use the user routes in the project
import companyRoute from './routes/company.route.js'; // to use the company routes in the project
import jobRoute from './routes/job.route.js'; // to use the job routes in the project
import applicationRoute from './routes/application.route.js'
import chatboatRoutes from './routes/chatboatroutes.route.js'
import notificationRoute from './routes/notification.route.js'
import analyticsRoute from './routes/analytics.route.js'
import adminRoute from './routes/admin.route.js'
import messageRoute from './routes/message.route.js'
import resumeRoute from './routes/resume.route.js'
import interviewRoute from './routes/interview.route.js'
import socialRoute from './routes/social.route.js'
import jobAlertRoute from './routes/jobAlert.route.js'
import bulkOperationsRoute from './routes/bulkOperations.route.js'
import advancedATSRoute from './routes/advancedATS.route.js'
import contentModerationRoute from './routes/contentModeration.route.js'
import systemMonitoringRoute from './routes/systemMonitoring.route.js'
import linkedinImportRoute from './routes/linkedinImport.route.js'
import applicationDraftRoute from './routes/applicationDraft.route.js'

dotenv.config(); // to use the environment variables in the project
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

//middlewares
app.use(express.json({ limit: '10mb' })); // jabham request bhejte hain toh data json me convert karne ke liye
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    
    socket.on('send_message', (data) => {
        socket.to(data.roomId).emit('receive_message', data);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

//API's 
app.use('/api/v1/user', userRoute);
//"https://localhost:3000/api/v1/register" => register USer Route
//"https://localhost:3000/api/v1/login" => userRoute
//"https://localhost:3000/api/v1/profile/update" => userRoute

app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use('/api/v1/application', applicationRoute);
app.use("/api/v1/chatboat", chatboatRoutes);
app.use('/api/v1/notifications', notificationRoute);
app.use('/api/v1/analytics', analyticsRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/messages', messageRoute);
app.use('/api/v1/resume', resumeRoute);
app.use('/api/v1/interviews', interviewRoute);
app.use('/api/v1/social', socialRoute);
app.use('/api/v1/job-alerts', jobAlertRoute);
app.use('/api/v1/bulk-operations', bulkOperationsRoute);
app.use('/api/v1/ats', advancedATSRoute);
app.use('/api/v1/admin/moderation', contentModerationRoute);
app.use('/api/v1/admin/system', systemMonitoringRoute);
app.use('/api/v1/linkedin', linkedinImportRoute);
app.use('/api/v1/application-drafts', applicationDraftRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

server.listen(PORT, () => {
    connectDB(); // to connect to the database
    console.log(`Server started at port ${PORT}`);
});

export { io };
