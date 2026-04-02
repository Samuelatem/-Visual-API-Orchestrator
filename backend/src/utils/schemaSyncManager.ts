import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { TableField } from '../types';
import { generatePrismaSchema } from './prismaGenerator';

export interface SyncResult {
  success: boolean;
  message: string;
  tableStatus: 'created' | 'already_exists';
}

/**
 * Extracts the model name from generated schema
 * Example: "model Products {" -> "Products"
 */
function extractModelName(schema: string): string | null {
  const match = schema.match(/model\s+(\w+)\s*\{/);
  return match ? match[1] : null;
}

/**
 * Checks if a model already exists in the schema
 */
function modelExists(schemaContent: string, modelName: string): boolean {
  const modelPattern = new RegExp(`model\\s+${modelName}\\s*\\{`, 's');
  return modelPattern.test(schemaContent);
}

/**
 * Writes the generated Prisma schema to the schema.prisma file
 * and syncs the database using `prisma db push`
 * 
 * Supports multiple tables by appending new models instead of overwriting
 */
export async function syncSchemaToDatabase(
  tableName: string,
  fields: TableField[]
): Promise<SyncResult> {
  try {
    // Step 1: Generate the new model schema
    const newModelSchema = generatePrismaSchema(tableName, fields);
    const modelName = extractModelName(newModelSchema);

    if (!modelName) {
      throw new Error('Failed to extract model name from generated schema');
    }

    // Step 2: Get the path to schema.prisma
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

    // Step 3: Read the existing schema
    let existingSchema = '';
    if (fs.existsSync(schemaPath)) {
      existingSchema = fs.readFileSync(schemaPath, 'utf-8');
    }

    // Step 4: Check if model already exists
    if (modelExists(existingSchema, modelName)) {
      console.log(`[Warning] Table '${modelName}' already exists in schema`);
      return {
        success: true,
        message: `Table '${modelName}' already exists in the database schema. No changes were made.`,
        tableStatus: 'already_exists',
      };
    }

    // Step 5: Append the new model to the existing schema
    let updatedSchema = existingSchema;
    if (!updatedSchema.endsWith('\n')) {
      updatedSchema += '\n';
    }
    updatedSchema += '\n' + newModelSchema;

    // Step 6: Write the updated schema to file
    fs.writeFileSync(schemaPath, updatedSchema, 'utf-8');
    console.log(`[OK] Schema written to ${schemaPath}`);

    // Step 7: Execute prisma db push to sync database (non-blocking with timeout)
    // For production, this would update the actual application schema
    // For now, we'll handle this asynchronously to avoid blocking the API response
    
    // Start the schema sync in a background process without waiting
    setImmediate(() => {
      try {
        execSync('npx prisma db push --skip-generate --force', {
          cwd: process.cwd(),
          encoding: 'utf-8',
          stdio: 'pipe',
          timeout: 30000, // 30 second timeout
        });
        console.log(`[OK] Database synced successfully`);
      } catch (execError: any) {
        // Log but don't block the API response
        console.warn(`[Warning] Background schema sync warning: ${execError.message}`);
      }
    });

    return {
      success: true,
      message: `Table '${modelName}' has been saved. Schema sync is processing in the background.`,
      tableStatus: 'created',
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error occurred';
    console.error(`[Error] Schema sync failed: ${errorMessage}`);

    return {
      success: false,
      message: `Database sync failed: ${errorMessage}`,
      tableStatus: 'error' as any,
    };
  }
}

/**
 * Validates that the schema.prisma file can be read
 */
export function validatePrismaSchema(): boolean {
  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    return fs.existsSync(schemaPath);
  } catch (error) {
    console.error('Failed to validate Prisma schema file:', error);
    return false;
  }
}
