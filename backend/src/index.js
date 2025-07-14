import express from 'express';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import { clerkMiddleware } from '@clerk/express';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

import usersRoutes from './routes/users.route.js';
import adminRoutes from './routes/admin.route.js';
import albumsRoutes from './routes/albums.route.js';
import authRoutes from './routes/auth.route.js';
import songsRoutes from './routes/songs.route.js';
import statsRoutes from './routes/stats.route.js';
import { connectDB } from './lib/db.js';
import { initializeSocket } from './lib/socket.js';

// #region general const
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
// #endregion

const httpServer = createServer(app);
initializeSocket(httpServer);

// #region general middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware()); // this adds auth to the req obj => req.auth().userId
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  })
);
// #endregion

const tempDir = path.join(process.cwd(), 'tmp');
// #region cron jobs
// delete those files in every 1 hour
cron.schedule('0 * * * *', () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log('error in cron job:', err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});
// #endregion

// #region Import routes
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/albums', albumsRoutes);
app.use('/api/stats', statsRoutes);

if (process.env.NODE_ENV === 'production') {
  console.log('Running in Production Mode!');
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}
console.log('__dirname', __dirname);

// #endregion

// #region error middleware
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});
// #endregion

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
