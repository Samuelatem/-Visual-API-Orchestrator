import { prisma } from '../server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Convert table name to PascalCase for Prisma model name
 */
function tableNameToModelName(tableName: string): string {
  return tableName
    .split(/[_\-]/) // Split by underscore or hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Generate Prisma model string from table and fields
 */
function generateModelSchema(tableName: string, fields: any[]): string {
  const modelName = tableNameToModelName(tableName);
  let schema = `model ${modelName} {\n`;
  schema += `  id      String  @id @default(cuid())\n`;

  for (const field of fields) {
    const fieldType = field.type || 'String';
    const required = field.required !== false ? '' : '?';
    schema += `  ${field.name}  ${fieldType}${required}\n`;
  }

  schema += `  createdAt DateTime @default(now())\n`;
  schema += `  updatedAt DateTime @updatedAt\n`;
  schema += `}\n\n`;

  return schema;
}

/**
 * Regenerate the complete Prisma schema from database state
 * Called after ANY update/delete operation to ensure schema stays in sync
 */
export async function regenerateProjectSchema(projectId: string): Promise<void> {
  try {
    // Fetch the project with all tables and fields
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
      console.error(`Project ${projectId} not found`);
      return;
    }

    // Read the base schema template
    const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
    let baseSchema = fs.readFileSync(schemaPath, 'utf-8');

    // Find the position to insert dynamic models (after the base models but before any existing dynamic models)
    const baseModelsEndMarker = '// AUTO-GENERATED MODELS START';
    const baseModelsEnd = baseSchema.indexOf(baseModelsEndMarker);

    let schema: string;

    if (baseModelsEnd === -1) {
      // No marker found, insert before the end of file
      schema = baseSchema;
    } else {
      // Remove everything from the marker onwards
      schema = baseSchema.substring(0, baseModelsEnd);
    }

    // Add marker
    schema += '// AUTO-GENERATED MODELS START\n\n';

    // Generate models for each table
    for (const table of project.tables) {
      schema += generateModelSchema(table.name, table.fields);
    }

    schema += '// AUTO-GENERATED MODELS END\n';

    // Write the updated schema
    fs.writeFileSync(schemaPath, schema);

    // Run prisma db push to sync the schema with the database
    // Use background execution to avoid blocking the API
    setImmediate(() => {
      try {
        execSync('npx prisma db push --skip-generate', {
          cwd: path.join(__dirname, '../../'),
          stdio: 'pipe',
          timeout: 30000,
        });
        console.log(`Schema regenerated for project ${project.name}`);
      } catch (pushError: any) {
        console.error(`Failed to push schema: ${pushError.message}`);
        // Don't throw - the DB might already be in sync
      }
    });
  } catch (error: any) {
    console.error(`Error regenerating schema: ${error.message}`);
    // Don't throw - allow the API to continue even if schema generation fails
  }
}
