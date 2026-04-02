import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import projectRoutes from './routes/projects';
import tableRoutes from './routes/tables';
import tableOperations from './routes/tableOperations';
import exportRoutes from './routes/export';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/projects', tableOperations);
app.use('/api/tables', tableRoutes);
app.use('/api/export-backend', exportRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
