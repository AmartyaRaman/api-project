import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from './config/logger.js';

import authRoute from './routes/auth.route.js'
import taskRoute from './routes/task.route.js'
import userRoute from './routes/user.route.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

// Direct request to correct routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/users", userRoute);

app.use((req, res) => res.status(404).json({ error: 'Route Not Found' }));

export default app; 
