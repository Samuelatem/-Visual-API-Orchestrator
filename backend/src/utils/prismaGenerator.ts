import { TableField } from '../types';

function tableNameToModelName(tableName: string): string {
  return tableName
    .split(/[_\-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function generatePrismaSchema(tableName: string, fields: TableField[]): string {
  const modelName = tableNameToModelName(tableName);

  let schema = `model ${modelName} {\n`;
  let hasId = false;

  // Add fields
  fields.forEach((field, index) => {
    let fieldDef = `  ${field.name} ${mapTypeToPrema(field.type)}`;

    // First string field becomes id
    if (field.type === 'String' && !hasId) {
      fieldDef += ' @id @default(cuid())';
      hasId = true;
    }

    // Add unique constraint
    if (field.unique) {
      fieldDef += ' @unique';
    }

    // Add required indicator
    if (!field.required && field.type !== 'String') {
      fieldDef += '?';
    }

    schema += fieldDef + '\n';
  });

  // Add timestamps
  schema += `  createdAt DateTime @default(now())\n`;
  schema += `  updatedAt DateTime @updatedAt\n`;
  schema += `}\n`;

  return schema;
}

function mapTypeToPrema(type: string): string {
  const typeMap: { [key: string]: string } = {
    String: 'String',
    Int: 'Int',
    Boolean: 'Boolean',
    DateTime: 'DateTime',
    Float: 'Float',
  };

  return typeMap[type] || 'String';
}
