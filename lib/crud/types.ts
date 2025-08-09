export type ID = string | number;

export type ListParams = {
  page?: number;
  pageSize?: number;
  sort?: string; // e.g. "-id" | "name"
  filters?: Record<string, any>; // free-form ->  convert to mapper
};

export type ListResult<T> = {
  data: T[];
  total?: number;
  meta?: Record<string, any>;
};

export type BackendList<T> = {
  success: boolean;
  data: T[];
  links?: any;
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    [k: string]: any;
  };
};
