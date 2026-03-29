import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './config/logger.js';

import authRoute from './routes/auth.route.js'
import taskRoute from './routes/task.route.js'
import userRoute from './routes/user.route.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

// API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/users", userRoute);

// Static file serving from frontend/dist
const buildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildPath));

// Catch-all route to serve the frontend SPA
app.get('*path', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

export default app; 
