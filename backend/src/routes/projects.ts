import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { APIResponse } from '../types';
import { generatePrismaSchema } from '../utils/prismaGenerator';
import { generateCrudRoutes } from '../utils/crudGenerator';
import { syncSchemaToDatabase } from '../utils/schemaSyncManager';

const router = Router();

// POST /api/projects - Create new project
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Project name is required',
      } as APIResponse<null>);
      return;
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
      },
      include: {
        tables: {
          include: {
            fields: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    const tables = project.tables.map((t: any) => ({
      id: t.id,
      name: t.name,
      fields: t.fields,
    }));

    res.json({
      success: true,
      message: 'Project created successfully',
      data: {
        id: project.id,
        name: project.name,
        tables,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    } as APIResponse<null>);
  }
});

// GET /api/projects - List all projects
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tables: {
          include: {
            fields: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      tables: p.tables.map((t: any) => ({
        id: t.id,
        name: t.name,
        fields: t.fields,
      })),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    res.json({
      success: true,
      message: 'Projects retrieved successfully',
      data: formatted,
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    } as APIResponse<null>);
  }
});

// GET /api/projects/:projectId - Get project by ID with tables and fields
router.get('/:projectId', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId : '';

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tables: {
          include: {
            fields: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      } as APIResponse<null>);
      return;
    }

    const tables = project.tables.map((t: any) => ({
      id: t.id,
      name: t.name,
      fields: t.fields,
    }));

    res.json({
      success: true,
      message: 'Project retrieved successfully',
      data: {
        id: project.id,
        name: project.name,
        tables,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    } as APIResponse<null>);
  }
});

// POST /api/projects/:projectId/tables - Add table to project
router.post('/:projectId/tables', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId : '';
    const { name, fields } = req.body;

    if (!name || !fields || fields.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Table name and fields are required',
      } as APIResponse<null>);
      return;
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      } as APIResponse<null>);
      return;
    }

    // Create table with fields
    const table = await prisma.table.create({
      data: {
        name,
        projectId: projectId,
        fields: {
          create: fields.map((f: any) => ({
            name: f.name,
            type: f.type,
            required: f.required ?? true,
            unique: f.unique ?? false,
          })),
        },
      },
      include: {
        fields: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Generate Prisma schema
    const prismaCode = generatePrismaSchema(name, fields);

    // Generate CRUD routes
    const crudCode = generateCrudRoutes(name, fields);

    // Sync schema to database
    const syncResult = await syncSchemaToDatabase(name, fields);

    const tableFields = table.fields.map((f: any) => f);

    res.json({
      success: true,
      message: 'Table created successfully',
      data: {
        id: table.id,
        name: table.name,
        fields: tableFields,
        prismaCode,
        crudCode,
        dbSyncStatus: syncResult.success ? 'success' : 'error',
        dbSyncMessage: syncResult.message,
        tableStatus: syncResult.tableStatus,
      },
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    } as APIResponse<null>);
  }
});

// DELETE /api/projects/:projectId - Delete project and all its tables
router.delete('/:projectId', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId : '';

    const project = await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: { id: project.id, name: project.name },
    } as APIResponse<any>);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      } as APIResponse<null>);
    } else {
      res.status(500).json({
        success: false,
        message: error.message,
      } as APIResponse<null>);
    }
  }
});

export default router;
