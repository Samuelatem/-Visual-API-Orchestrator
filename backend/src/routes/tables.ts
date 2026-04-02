import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { TableSchema, APIResponse } from '../types';
import { generatePrismaSchema } from '../utils/prismaGenerator';
import { generateCrudRoutes } from '../utils/crudGenerator';
import { syncSchemaToDatabase } from '../utils/schemaSyncManager';

const router = Router();

// POST /api/tables - Create new table schema
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, fields }: TableSchema = req.body;

    if (!name || !fields || fields.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Table name and fields are required',
      } as APIResponse<null>);
      return;
    }

    // Store in database
    const tableSchema = await prisma.dynamicSchema.create({
      data: {
        name,
        schema: JSON.stringify(fields),
      },
    });

    // Generate Prisma schema
    const prismaCode = generatePrismaSchema(name, fields);

    // Generate CRUD routes
    const crudCode = generateCrudRoutes(name, fields);

    // Sync schema to database
    const syncResult = await syncSchemaToDatabase(name, fields);

    res.json({
      success: true,
      message: 'Table created successfully',
      data: {
        id: tableSchema.id,
        name: tableSchema.name,
        fields: JSON.parse(tableSchema.schema),
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

// GET /api/tables - List all table schemas
router.get('/', async (req: Request, res: Response) => {
  try {
    const tables = await prisma.dynamicSchema.findMany();
    const parsedTables = tables.map(t => ({
      ...t,
      schema: JSON.parse(t.schema),
    }));
    res.json({
      success: true,
      data: parsedTables,
    } as APIResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as APIResponse<null>);
  }
});

export default router;
