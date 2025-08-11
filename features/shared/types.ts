export type ID = number;

export interface Branch {
  id: ID;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoleLite {
  id: ID;
  name: string;
}

export interface User {
  id: ID;
  name: string;
  username: string;
  is_active: boolean | number | null;
  created_at?: string;
  updated_at?: string;
  branch: Branch | null;
  roles?: RoleLite | null;
}
