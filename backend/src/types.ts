export interface TableField {
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
}

export interface TableSchema {
  name: string;
  fields: TableField[];
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string; // deprecated, use message
}

// Project persistence types
export interface ProjectField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
}

export interface ProjectTableData {
  id: string;
  name: string;
  fields: ProjectField[];
}

export interface ProjectData {
  id: string;
  name: string;
  tables: ProjectTableData[];
  createdAt: string;
  updatedAt: string;
}
