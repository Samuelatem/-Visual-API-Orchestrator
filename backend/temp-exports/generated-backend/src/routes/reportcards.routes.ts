import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router: Router = express.Router();

/**
 * POST /api/reportcards
 * Creates a new reportcards
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

    const reportcards = await prisma.reportcards.create({
      data,
    });
    
    res.status(201).json({
      success: true,
      data: reportcards,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create reportcards',
    });
  }
});

/**
 * GET /api/reportcards
 * Retrieves all reportcards records
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const reportcardss = await prisma.reportcards.findMany();
    
    res.json({
      success: true,
      data: reportcardss,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve reportcardss',
    });
  }
});

/**
 * GET /api/reportcards/:id
 * Retrieves a single reportcards by ID
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

    const reportcards = await prisma.reportcards.findUnique({
      where: { id },
    });
    
    if (!reportcards) {
      res.status(404).json({
        success: false,
        error: 'Reportcards not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: reportcards,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve reportcards',
    });
  }
});

/**
 * PUT /api/reportcards/:id
 * Updates an existing reportcards
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

    const reportcards = await prisma.reportcards.update({
      where: { id },
      data,
    });
    
    res.json({
      success: true,
      data: reportcards,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update reportcards',
    });
  }
});

/**
 * DELETE /api/reportcards/:id
 * Deletes a reportcards
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

    const reportcards = await prisma.reportcards.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      data: reportcards,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete reportcards',
    });
  }
});

export default router;
