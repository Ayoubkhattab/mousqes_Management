export type Worker = {
  id: number;
  name: string;

  branch_id?: number;
  mosque_id?: number;
  mosque?: {
    id: number;
    name: string;
    branch_id: number;
    district_id: number;
  } | null;

  job_title?: string | null;
  job_status?: string | null;
  quran_levels?: string | null; //
  sponsorship_types?: string | null; //
  educational_level?: string | null;

  phone?: string | null;
  salary?: number | string | null;

  image?: string | null;

  created_at?: string | number;
  updated_at?: string | number;
};
export type Mosque = {
  id: number;
  name: string;

  branch_id?: number;
  district_id?: number;

  category?: string | null;
  current_status?: string | null;
  technical_status?: string | null;
  latitude?: string | null;
  longitude?: string | null;

  created_at?: string;
  updated_at?: string;
};
