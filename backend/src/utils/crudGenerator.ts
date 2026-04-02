import { TableField } from '../types';

export function generateCrudRoutes(tableName: string, fields: TableField[]): string {
  const camelCaseName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
  const PascalCaseName = tableName.charAt(0).toUpperCase() + tableName.slice(1);

  const code = `// CRUD Routes for ${PascalCaseName}
import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

// POST /api/${camelCaseName} - Create new ${camelCaseName}
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const ${camelCaseName} = await prisma.${camelCaseName}.create({
      data,
    });
    res.status(201).json({
      success: true,
      data: ${camelCaseName},
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/${camelCaseName} - Get all ${camelCaseName}
router.get('/', async (req: Request, res: Response) => {
  try {
    const ${camelCaseName}s = await prisma.${camelCaseName}.findMany();
    res.json({
      success: true,
      data: ${camelCaseName}s,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/${camelCaseName}/:id - Get single ${camelCaseName}
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ${camelCaseName} = await prisma.${camelCaseName}.findUnique({
      where: { id },
    });
    if (!${camelCaseName}) {
      res.status(404).json({
        success: false,
        error: '${PascalCaseName} not found',
      });
      return;
    }
    res.json({
      success: true,
      data: ${camelCaseName},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/${camelCaseName}/:id - Update ${camelCaseName}
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const ${camelCaseName} = await prisma.${camelCaseName}.update({
      where: { id },
      data,
    });
    res.json({
      success: true,
      data: ${camelCaseName},
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/${camelCaseName}/:id - Delete ${camelCaseName}
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ${camelCaseName} = await prisma.${camelCaseName}.delete({
      where: { id },
    });
    res.json({
      success: true,
      data: ${camelCaseName},
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;`;

  return code;
}
