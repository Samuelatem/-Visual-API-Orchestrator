export interface Project {
  id: string;
  name: string;
  tables?: Array<{
    id: string;
    name: string;
    fields?: Array<{
      id: string;
      name: string;
      type: string;
      required: boolean;
      unique: boolean;
    }>;
  }>;
}
