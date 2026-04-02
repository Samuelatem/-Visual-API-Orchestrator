import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router: Router = express.Router();

/**
 * POST /api/reviews
 * Creates a new reviews
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    if (!data || typeof data !== 'object') {
      res.status(400).json({
        success: false,
        error: 'Request body must be a valid JSON object',
      });
      return;
    }

    const reviews = await prisma.reviews.create({
      data,
    });
    
    res.status(201).json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create reviews',
    });
  }
});

/**
 * GET /api/reviews
 * Retrieves all reviews records
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const reviewss = await prisma.reviews.findMany();
    
    res.json({
      success: true,
      data: reviewss,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve reviewss',
    });
  }
});

/**
 * GET /api/reviews/:id
 * Retrieves a single reviews by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
      return;
    }

    const reviews = await prisma.reviews.findUnique({
      where: { id },
    });
    
    if (!reviews) {
      res.status(404).json({
        success: false,
        error: 'Reviews not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve reviews',
    });
  }
});

/**
 * PUT /api/reviews/:id
 * Updates an existing reviews
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
      return;
    }

    if (!data || typeof data !== 'object') {
      res.status(400).json({
        success: false,
        error: 'Request body must be a valid JSON object',
      });
      return;
    }

    const reviews = await prisma.reviews.update({
      where: { id },
      data,
    });
    
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update reviews',
    });
  }
});

/**
 * DELETE /api/reviews/:id
 * Deletes a reviews
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
      return;
    }

    const reviews = await prisma.reviews.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete reviews',
    });
  }
});

export default router;
