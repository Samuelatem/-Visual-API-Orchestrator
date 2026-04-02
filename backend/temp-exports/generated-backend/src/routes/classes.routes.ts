import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router: Router = express.Router();

/**
 * POST /api/classes
 * Creates a new classes
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

    const classes = await prisma.classes.create({
      data,
    });
    
    res.status(201).json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create classes',
    });
  }
});

/**
 * GET /api/classes
 * Retrieves all classes records
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const classess = await prisma.classes.findMany();
    
    res.json({
      success: true,
      data: classess,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve classess',
    });
  }
});

/**
 * GET /api/classes/:id
 * Retrieves a single classes by ID
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

    const classes = await prisma.classes.findUnique({
      where: { id },
    });
    
    if (!classes) {
      res.status(404).json({
        success: false,
        error: 'Classes not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve classes',
    });
  }
});

/**
 * PUT /api/classes/:id
 * Updates an existing classes
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

    const classes = await prisma.classes.update({
      where: { id },
      data,
    });
    
    res.json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update classes',
    });
  }
});

/**
 * DELETE /api/classes/:id
 * Deletes a classes
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

    const classes = await prisma.classes.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete classes',
    });
  }
});

export default router;
