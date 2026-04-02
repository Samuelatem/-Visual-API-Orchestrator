import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router: Router = express.Router();

/**
 * POST /api/users
 * Creates a new users
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

    const users = await prisma.users.create({
      data,
    });
    
    res.status(201).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create users',
    });
  }
});

/**
 * GET /api/users
 * Retrieves all users records
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userss = await prisma.users.findMany();
    
    res.json({
      success: true,
      data: userss,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve userss',
    });
  }
});

/**
 * GET /api/users/:id
 * Retrieves a single users by ID
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

    const users = await prisma.users.findUnique({
      where: { id },
    });
    
    if (!users) {
      res.status(404).json({
        success: false,
        error: 'Users not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve users',
    });
  }
});

/**
 * PUT /api/users/:id
 * Updates an existing users
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

    const users = await prisma.users.update({
      where: { id },
      data,
    });
    
    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update users',
    });
  }
});

/**
 * DELETE /api/users/:id
 * Deletes a users
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

    const users = await prisma.users.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete users',
    });
  }
});

export default router;
