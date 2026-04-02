import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { APIResponse } from '../types';
import { regenerateProjectSchema } from '../utils/schemaRegenerator';

const router = Router();

// ========== TABLE OPERATIONS ==========

// PUT /api/projects/:projectId/tables/:tableId - Update table name
router.put('/:projectId/tables/:tableId', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId : '';
    const tableId = typeof req.params.tableId === 'string' ? req.params.tableId : '';
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Table name is required',
      } as APIResponse<null>);
      return;
    }

    // Verify table exists and belongs to project
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table || table.projectId !== projectId) {
      res.status(404).json({
        success: false,
        message: 'Table not found',
      } as APIResponse<null>);
      return;
    }

    // Update table
    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { name: name.trim() },
      include: {
        fields: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Regenerate schema
    await regenerateProjectSchema(projectId);

    // Fetch updated project
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

    res.json({
      success: true,
      message: 'Table updated successfully',
      data: {
        table: updatedTable,
        project: project,
      },
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    } as APIResponse<null>);
  }
});

// DELETE /api/projects/:projectId/tables/:tableId - Delete table
router.delete('/:projectId/tables/:tableId', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId : '';
    const tableId = typeof req.params.tableId === 'string' ? req.params.tableId : '';

    // Verify table exists and belongs to project
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table || table.projectId !== projectId) {
      res.status(404).json({
        success: false,
        message: 'Table not found',
      } as APIResponse<null>);
      return;
    }

    // Delete table (cascade deletes fields)
    await prisma.table.delete({
      where: { id: tableId },
    });

    // Regenerate schema
    await regenerateProjectSchema(projectId);

    // Fetch updated project
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

    res.json({
      success: true,
      message: `Table deleted successfully`,
      data: {
        project: project,
      },
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    } as APIResponse<null>);
  }
});

// ========== FIELD OPERATIONS ==========

// PUT /api/projects/:projectId/tables/:tableId/fields/:fieldId - Update field
router.put('/:projectId/tables/:tableId/fields/:fieldId', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId : '';
    const tableId = typeof req.params.tableId === 'string' ? req.params.tableId : '';
    const fieldId = typeof req.params.fieldId === 'string' ? req.params.fieldId : '';
    const { name, type, required } = req.body;

    if (!name || !name.trim() || !type) {
      res.status(400).json({
        success: false,
        message: 'Field name and type are required',
      } as APIResponse<null>);
      return;
    }

    // Verify field exists and belongs to table
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
      include: { table: true },
    });

    if (!field || field.table.projectId !== projectId || field.tableId !== tableId) {
      res.status(404).json({
        success: false,
        message: 'Field not found',
      } as APIResponse<null>);
      return;
    }

    // Update field
    const updatedField = await prisma.field.update({
      where: { id: fieldId },
      data: {
        name: name.trim(),
        type,
        required: required ?? true,
      },
    });

    // Regenerate schema
    await regenerateProjectSchema(projectId);

    // Fetch updated project
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

    res.json({
      success: true,
      message: 'Field updated successfully',
      data: {
        field: updatedField,
        project: project,
      },
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    } as APIResponse<null>);
  }
});

// DELETE /api/projects/:projectId/tables/:tableId/fields/:fieldId - Delete field
router.delete('/:projectId/tables/:tableId/fields/:fieldId', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = typeof req.params.projectId === 'string' ? req.params.projectId : '';
    const tableId = typeof req.params.tableId === 'string' ? req.params.tableId : '';
    const fieldId = typeof req.params.fieldId === 'string' ? req.params.fieldId : '';

    // Verify field exists and belongs to table
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
      include: { table: true },
    });

    if (!field || field.table.projectId !== projectId || field.tableId !== tableId) {
      res.status(404).json({
        message: 'Field not found',
      } as APIResponse<null>);
      return;
    }

    // Delete field
    await prisma.field.delete({
      where: { id: fieldId },
    });

    // Regenerate schema
    await regenerateProjectSchema(projectId);

    // Fetch updated project
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

    res.json({
      success: true,
      message: `Field deleted successfully`,
      data: {
        project: project,
      },
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      messagess: false,
      error: error.message,
    } as APIResponse<null>);
  }
});

export default router;
