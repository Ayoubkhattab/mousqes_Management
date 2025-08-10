export type District = {
  id: number;
  name: string;
  branch_id: number;
  branch?: { id: number; name: string };
  code?: string | null;
  created_at?: string;
  updated_at?: string;
};
