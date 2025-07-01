import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();
import { clerkMiddleware } from '@clerk/express';

import usersRoutes from './routes/users.route.js';
import adminRoutes from './routes/admin.route.js';
import albumsRoutes from './routes/albums.route.js';
import authRoutes from './routes/auth.route.js';
import songsRoutes from './routes/songs.route.js';
import statsRoutes from './routes/stats.route.js';
import { connectDB } from './lib/db.js';

// #region general const
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// #endregion

// #region general middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json()); // this adds auth to the req obj => req.auth.userId
app.use(clerkMiddleware());
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

// #region Import routes
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/albums', albumsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

// todo: socket.io
