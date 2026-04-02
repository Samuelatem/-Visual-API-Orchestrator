import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router: Router = express.Router();

/**
 * POST /api/fddd
 * Creates a new fddd
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

    const fddd = await prisma.fddd.create({
      data,
    });
    
    res.status(201).json({
      success: true,
      data: fddd,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create fddd',
    });
  }
});

/**
 * GET /api/fddd
 * Retrieves all fddd records
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const fddds = await prisma.fddd.findMany();
    
    res.json({
      success: true,
      data: fddds,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve fddds',
    });
  }
});

/**
 * GET /api/fddd/:id
 * Retrieves a single fddd by ID
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

    const fddd = await prisma.fddd.findUnique({
      where: { id },
    });
    
    if (!fddd) {
      res.status(404).json({
        success: false,
        error: 'Fddd not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: fddd,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve fddd',
    });
  }
});

/**
 * PUT /api/fddd/:id
 * Updates an existing fddd
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

    const fddd = await prisma.fddd.update({
      where: { id },
      data,
    });
    
    res.json({
      success: true,
      data: fddd,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update fddd',
    });
  }
});

/**
 * DELETE /api/fddd/:id
 * Deletes a fddd
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

    const fddd = await prisma.fddd.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      data: fddd,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete fddd',
    });
  }
});

export default router;
