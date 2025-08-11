export type MosqueTypeTag = {
  id: number;
  mosque_id: number;
  type: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Mosque = {
  id: number;
  name: string;
  branch_id: number;
  district_id: number;
  category?: string | null;
  current_status?: string | null;
  technical_status?: string | null;
  mosque_attachments?: string | null;
  demolition_percentage?: string | null;
  destruction_status?: string | null;
  description?: string | null;
  is_active?: boolean | number;
  latitude?: string | number | null;
  longitude?: string | number | null;
  created_at?: string | null;
  updated_at?: string | null;
  branch?: { id: number; name: string };
  district?: { id: number; branch_id: number; name: string };
  types?: MosqueTypeTag[];
};

export type MosqueEnums = {
  currentStatus: string[];
  category: string[];
  technicalStatus: string[];
  types: string[];
  demolitionPercentage: string[];
  destructionStatus: string[];
  attachments: string[];
};

export type MosqueListResponse = {
  success: boolean;
  data: Mosque[];
  meta?: { total?: number };
};

export type MosqueOneResponse = {
  success: boolean;
  data: Mosque;
};

export type ID = number | string;
export type MosqueEnumParams = {
  branch_id?: ID;
  district_id?: ID;
  name?: string;
};

export type MosqueEnumResponse = {
  success: boolean;
  data: string[];
};
