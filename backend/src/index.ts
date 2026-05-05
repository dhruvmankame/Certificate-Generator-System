import express from 'express';
import corsMiddleware from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import certificateRoutes from './routes/certificateRoutes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Database connection
connectDB();

// Serve static certificates (if saving to disk, otherwise not needed)
app.use('/certificates', express.static(path.join(__dirname, '../public/certificates')));

// Routes
app.use('/api/certificates', certificateRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});