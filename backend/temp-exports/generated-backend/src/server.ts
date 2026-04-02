import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import usersRoutes from './routes/users.routes';
import articleRoutes from './routes/article.routes';
import reviewsRoutes from './routes/reviews.routes';
import classesRoutes from './routes/classes.routes';
import reportcardsRoutes from './routes/reportcards.routes';
import usersRoutes from './routes/users.routes';
import fdddRoutes from './routes/fddd.routes';

const app: Express = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/reportcards', reportcardsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/fddd', fdddRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
