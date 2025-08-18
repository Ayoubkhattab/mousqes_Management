// /features/workers/types.ts
export type ID = number | string;

export type Worker = {
  id: number;
  name: string;
  mosque_id: number;
  job_title: string;
  job_status?: string | null;
  sponsorship_types?: string | null;
  educational_level?: string | null;
  quran_levels?: string;
  phone?: string | null;
  salary?: number | null;
  salary_sy?: number | null;
  sham_cash?: number | null;
  image?: string | null; // URL
  created_at?: string | number | null;
  updated_at?: string | number | null;
  mosque?: {
    id: number;
    name: string;
    branch_id: number;
    district_id?: number | null;
  };
};

export type ApiList<T> = {
  success: boolean;
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type WorkerCreateDTO = {
  branch_id: number;
  mosque_id: number;
  name: string;
  job_title: string;
  job_status?: string;
  sponsorship_types?: string;
  educational_level?: string;
  quran_levels: string;
  phone?: string;
  salary?: number;
  salary_sy?: number;
  sham_cash?: number;
  image?: File;
};

export type WorkerUpdateDTO = Partial<WorkerCreateDTO>;
