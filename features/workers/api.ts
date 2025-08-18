// /features/workers/api.ts
import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  ID,
  Worker,
  WorkerCreateDTO,
  WorkerUpdateDTO,
  ApiList,
} from "./types";

function toFormData(dto: Partial<WorkerCreateDTO>) {
  const fd = new FormData();
  const push = (k: string, v: any) => {
    if (v === undefined || v === null || v === "") return;
    fd.append(k, v as any);
  };

  const branch_id = dto.branch_id != null ? Number(dto.branch_id) : undefined;
  const mosque_id = dto.mosque_id != null ? Number(dto.mosque_id) : undefined;
  const salary =
    dto.salary != null && (dto.salary as any) !== ""
      ? Number(dto.salary)
      : undefined;

  push("branch_id", branch_id);
  push("mosque_id", mosque_id);
  push("name", dto.name);
  push("job_title", dto.job_title);
  push("job_status", dto.job_status);
  push("sponsorship_types", dto.sponsorship_types);
  push("educational_level", dto.educational_level);
  push("quran_levels", dto.quran_levels);
  push("phone", dto.phone);
  push("salary", salary);

  if (dto.image instanceof File) push("image", dto.image);

  return fd;
}

export async function getWorkers(params?: {
  page?: number;
  pageSize?: number;
  filters?: { mosque_name?: string; name?: string };
}) {
  const { page, pageSize, filters } = params ?? {};
  const q: Record<string, any> = {};
  if (page) q.page = page;
  if (pageSize) q.pageSize = pageSize;
  if (filters?.mosque_name) q["filter[mosque.name]"] = filters.mosque_name;
  if (filters?.name) q["filter[name]"] = filters.name;

  const { data } = await api.get<ApiList<Worker>>(endpoints.workers, {
    params: q,
  });
  return data;
}

export async function getWorker(id: ID) {
  const { data } = await api.get<{ success: boolean; data: Worker }>(
    endpoints.worker(id)
  );
  return data.data;
}

export async function createWorker(dto: WorkerCreateDTO) {
  const { data } = await api.post<{ success: boolean; data: Worker }>(
    endpoints.workers,
    toFormData(dto),
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.data;
}

export async function updateWorker(id: ID, dto: WorkerUpdateDTO) {
  const { data } = await api.post<{ success: boolean; data: Worker }>(
    endpoints.worker(id),
    toFormData(dto),
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.data;
}

export async function deleteWorker(id: ID) {
  await api.delete(endpoints.worker(id));
}

export async function getWorkersEnums() {
  const [jt, js, ql, st, el] = await Promise.all([
    api.get<{ success: true; data: string[] }>(endpoints.workerEnums.jobTitles),
    api.get<{ success: true; data: string[] }>(endpoints.workerEnums.jobStatus),
    api.get<{ success: true; data: string[] }>(
      endpoints.workerEnums.quranLevels
    ),
    api.get<{ success: true; data: string[] }>(
      endpoints.workerEnums.sponsorshipTypes
    ),
    api.get<{ success: true; data: string[] }>(
      endpoints.workerEnums.educationalLevel
    ),
  ]);
  return {
    jobTitles: jt.data.data,
    jobStatuses: js.data.data,
    quranLevels: ql.data.data,
    sponsorshipTypes: st.data.data,
    educationalLevels: el.data.data,
  };
}

// مساعد: جلب مساجد فرع بالاسم
export async function getMosquesByBranchName(branchName: string, limit = 200) {
  const { data } = await api.get<ApiList<{ id: number; name: string }>>(
    endpoints.mosques,
    { params: { "filter[branch.name]": branchName, pageSize: limit } }
  );
  return data.data;
}
