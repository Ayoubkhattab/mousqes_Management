// ضع/عدّل الأنواع حسب مخطط الـ API لديك
export type ID = string | number;

export interface Pagination {
  page?: number;
  pageSize?: number;
}

export interface ListResponse<T> {
  data: T[];
  total?: number;
}

export interface User {
  id: ID;
  username: string;
  name?: string;
  role?: string;
}

export interface District {
  id: ID;
  name: string;
}

export interface Branch {
  id: ID;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Mosque {
  id: ID;
  name: string;
  districtId?: ID;
}

export interface Attachment {
  id: ID;
  mosqueId: ID;
  name: string;
  url: string;
}

export interface Worker {
  id: ID;
  name: string;
  jobTitle?: string;
}
