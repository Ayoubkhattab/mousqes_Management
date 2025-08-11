import { api } from "@/lib/api/client";
import type { Mosque, Worker } from "./types";

export type WorkerListParams = {
  page?: number;
  pageSize?: number;
  filters?: {
    name?: string;
    mosqueName?: string; // filter[mosque.name]
  };
};

function mapFilters(f?: WorkerListParams["filters"]) {
  if (!f) return {};
  const p: Record<string, string> = {};
  if (f.name) p["filter[name]"] = f.name;
  if (f.mosqueName) p["filter[mosque.name]"] = f.mosqueName;
  return p;
}

export async function listWorkers(params: WorkerListParams) {
  const res = await api.get("/dashboard/workers", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      ...mapFilters(params.filters),
    },
  });
  const payload = res.data;
  return {
    data: (payload?.data ?? []) as Worker[],
    total: payload?.meta?.total ?? payload?.data?.length ?? 0,
  };
}

export async function getWorker(id: number) {
  const res = await api.get(`/dashboard/workers/${id}`);
  return res.data?.data as Worker;
}

export async function createWorker(dto: {
  branch_id: number | string;
  mosque_id: number | string;
  name: string;
  job_title: string;
  job_status: string;
  quran_levels?: string;
  sponsorship_types?: string;
  educational_level?: string;
  phone?: string;
  salary?: number | string;
  image?: File;
}) {
  const fd = new FormData();
  fd.append("branch_id", String(dto.branch_id));
  fd.append("mosque_id", String(dto.mosque_id));
  fd.append("name", dto.name);
  fd.append("job_title", dto.job_title);
  fd.append("job_status", dto.job_status);
  if (dto.quran_levels) fd.append("quran_levels", dto.quran_levels);
  if (dto.sponsorship_types)
    fd.append("sponsorship_types", dto.sponsorship_types);
  if (dto.educational_level)
    fd.append("educational_level", dto.educational_level);
  if (dto.phone) fd.append("phone", dto.phone);
  if (dto.salary != null) fd.append("salary", String(dto.salary));
  if (dto.image) fd.append("image", dto.image);

  const res = await api.post("/dashboard/workers", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data as Worker;
}

/** POST /dashboard/workers/:id (form-data) */
export async function updateWorker(
  id: number,
  dto: {
    branch_id?: number | string;
    mosque_id?: number | string;
    name?: string;
    job_title?: string;
    job_status?: string;
    quran_levels?: string;
    sponsorship_types?: string;
    educational_level?: string;
    phone?: string;
    salary?: number | string;
    image?: File;
  }
) {
  const fd = new FormData();
  if (dto.branch_id != null) fd.append("branch_id", String(dto.branch_id));
  if (dto.mosque_id != null) fd.append("mosque_id", String(dto.mosque_id));
  if (dto.name != null) fd.append("name", dto.name);
  if (dto.job_title != null) fd.append("job_title", dto.job_title);
  if (dto.job_status != null) fd.append("job_status", dto.job_status);
  if (dto.quran_levels != null) fd.append("quran_levels", dto.quran_levels);
  if (dto.sponsorship_types != null)
    fd.append("sponsorship_types", dto.sponsorship_types);
  if (dto.educational_level != null)
    fd.append("educational_level", dto.educational_level);
  if (dto.phone != null) fd.append("phone", dto.phone);
  if (dto.salary != null) fd.append("salary", String(dto.salary));
  if (dto.image) fd.append("image", dto.image);

  const res = await api.post(`/dashboard/workers/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data as Worker;
}

export async function deleteWorker(id: number) {
  const res = await api.delete(`/dashboard/workers/${id}`);
  return res.data;
}

/* -------- Enums   -------- */
export async function getJobTitles() {
  const r = await api.get("/dashboard/workers/enums/job-titles");
  return (r.data?.data ?? []) as string[];
}
export async function getJobStatus() {
  const r = await api.get("/dashboard/workers/enums/job-status");
  return (r.data?.data ?? []) as string[];
}
export async function getQuranLevels() {
  const r = await api.get("/dashboard/workers/enums/quran-levels");
  return (r.data?.data ?? []) as string[];
}
export async function getSponsorshipTypes() {
  const r = await api.get("/workers/enums/sponsorship-types");
  return (r.data?.data ?? []) as string[];
}
export async function getEducationalLevel() {
  const r = await api.get("/workers/enums/educational-level");
  return (r.data?.data ?? []) as string[];
}

export async function listMosques(params: {
  branch_id?: number | string;
  branch_name?: string;
  name?: string;
  page?: number;
  pageSize?: number;
}) {
  const q: Record<string, any> = {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 200,
  };

  if (params.name) q["filter[name]"] = params.name;

  if (params.branch_id != null) q["filter[branch_id]"] = params.branch_id;

  const res = await api.get("/dashboard/mosques", { params: q });
  const payload = res.data;

  return {
    data: (payload?.data ?? []) as Mosque[],
    total: payload?.meta?.total ?? payload?.data?.length ?? 0,
  };
}
