import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router: Router = express.Router();

/**
 * POST /api/article
 * Creates a new article
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

    const article = await prisma.article.create({
      data,
    });
    
    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create article',
    });
  }
});

/**
 * GET /api/article
 * Retrieves all article records
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany();
    
    res.json({
      success: true,
      data: articles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve articles',
    });
  }
});

/**
 * GET /api/article/:id
 * Retrieves a single article by ID
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

    const article = await prisma.article.findUnique({
      where: { id },
    });
    
    if (!article) {
      res.status(404).json({
        success: false,
        error: 'Article not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve article',
    });
  }
});

/**
 * PUT /api/article/:id
 * Updates an existing article
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

    const article = await prisma.article.update({
      where: { id },
      data,
    });
    
    res.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update article',
    });
  }
});

/**
 * DELETE /api/article/:id
 * Deletes a article
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

    const article = await prisma.article.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete article',
    });
  }
});

export default router;
