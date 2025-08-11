"use client";

import { useState } from "react";
import type { ColumnDef, SortingState, Updater } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils/cn";

import type { Worker } from "@/features/workers/types";
import WorkerForm from "@/components/workers/WorkerForm";
// import { useBranchesList } from "@/features/branches/hooks";
import {
  useWorkers,
  useCreateWorker,
  useUpdateWorker,
  // useDeleteWorker, // إن احتجناه
} from "@/features/workers/queries";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
// import { useBranchesIndex } from "@/features/workers/hooks";

// const { map: branchesMap } = useBranchesIndex();

const columnsBase: ColumnDef<Worker>[] = [
  {
    accessorKey: "id",
    header: "ID" as const,
    cell: ({ row }) => String(row.original.id),
  },
  { accessorKey: "name", header: "الاسم" as const },
  {
    id: "branch_name",
    header: "الفرع" as const,
    accessorFn: (row) => {
      const bid = row.mosque?.branch_id ?? row.branch_id;
      //   return (bid ? branchesMap.get(bid) : undefined) ?? "-";
    },
    enableSorting: false,
  },
  { accessorKey: "job_title", header: "المسمى الوظيفي" as const },
  { accessorKey: "job_status", header: "الحالة الوظيفية" as const },
  { accessorKey: "quran_level", header: "المستوى القرآني" as const },
];

export default function WorkersPage() {
  const [q, setQ] = useState("");
  const qDebounced = useDebounce(q, 300);

  //   const { data: branches } = useBranchesList();
  const [branchName, setBranchName] = useState<string>("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Worker | null>(null);
  const [mosqueName, setMosqueName] = useState("");

  const { data, isLoading, isError } = useWorkers({
    page,
    pageSize,
    filters: {
      name: qDebounced || undefined,
      mosqueName: mosqueName || undefined,
    },
  });

  const rows = (data?.data ?? []) as Worker[];
  const total = data?.total ?? rows.length;

  const createMut = useCreateWorker();
  const updateMut = useUpdateWorker();

  const columns: ColumnDef<Worker>[] = [
    ...columnsBase,
    {
      id: "actions",
      header: "إجراءات" as const,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          title="تعديل"
          aria-label="تعديل"
          className={cn(
            "h-8 w-8 p-0 rounded-full",
            "text-foreground/70 hover:text-primary hover:bg-primary/10"
          )}
          onClick={() => {
            setSelected(row.original);
            setOpenEdit(true);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">العاملون</h2>
        <div className="flex items-center gap-2">
          <input
            placeholder="بحث باسم المسجد..."
            value={mosqueName}
            onChange={(e) => {
              setMosqueName(e.target.value);
              setPage(1);
            }}
            className="h-10 w-56 rounded-2xl border border-input bg-card px-3 text-sm"
          />
          <Input
            placeholder="بحث بالاسم..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-48"
          />
          <select
            className="h-10 rounded-2xl border border-input bg-card text-foreground px-3 text-sm"
            value={branchName}
            onChange={(e) => {
              setBranchName(e.target.value);
              setPage(1);
            }}
          >
            <option value="">كل الفروع</option>
            {/* {(branches ?? []).map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))} */}
          </select>
          <Button onClick={() => setOpenCreate(true)}>Create Worker</Button>
        </div>
      </div>

      {/* Table */}
      {isError ? (
        <div className="text-red-600">حدث خطأ أثناء الجلب.</div>
      ) : (
        <DataTable<Worker>
          data={rows}
          columns={columns}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          loading={isLoading}
          emptyText="لا توجد بيانات."
          sorting={[]}
          onSortingChange={function (
            updaterOrValue: Updater<SortingState>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

      {/* Create */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent size="xl" align="top">
          <DialogHeader>
            <DialogTitle>إضافة عامل</DialogTitle>
            <DialogDescription>املأ الحقول ثم اضغط حفظ</DialogDescription>
          </DialogHeader>

          <DialogBody>
            <WorkerForm
              mode="create"
              formId="create-worker-form"
              hideSubmit
              submitLabel={createMut.isPending ? "Creating..." : "Create"}
              onSubmitCreate={async (v) => {
                try {
                  await createMut.mutateAsync({
                    branch_id: v.branch_id,
                    mosque_id: v.mosque_id!, // إلزامي
                    name: v.name,
                    job_title: v.job_title,
                    job_status: v.job_status,
                    quran_levels: v.quran_levels || undefined,
                    sponsorship_types: v.sponsorship_types || undefined,
                    educational_level: v.educational_level || undefined,
                    phone: v.phone || undefined,
                    salary: v.salary ?? undefined,
                    image: v.image,
                  });
                  toast.success("Worker created");
                  setOpenCreate(false);
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || "Create failed");
                }
              }}
            />
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>
              إلغاء
            </Button>
            <Button
              type="submit"
              form="create-worker-form"
              disabled={createMut.isPending}
            >
              {createMut.isPending ? "جارٍ الإنشاء..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog
        open={openEdit}
        onOpenChange={(v) => {
          setOpenEdit(v);
          if (!v) setSelected(null);
        }}
      >
        <DialogContent size="xl" align="top">
          <DialogHeader>
            <DialogTitle>تعديل عامل</DialogTitle>
            <DialogDescription>حدّث ما يلزم فقط</DialogDescription>
          </DialogHeader>

          <DialogBody>
            <WorkerForm
              mode="edit"
              formId="edit-worker-form"
              hideSubmit
              defaultValues={selected ?? undefined}
              submitLabel={updateMut.isPending ? "Saving..." : "Save"}
              onSubmitUpdate={async (v) => {
                if (!selected) return;
                try {
                  const dto = {
                    name: v.name,
                    branch_id: v.branch_id,
                    mosque_id: v.mosque_id,
                    job_title: v.job_title,
                    job_status: v.job_status,
                    quran_levels: v.quran_levels,
                    sponsorship_types: v.sponsorship_types,
                    educational_level: v.educational_level,
                    phone: v.phone,
                    salary: v.salary,
                    image: v.image,
                  };
                  await updateMut.mutateAsync({ id: selected.id, dto });

                  await updateMut.mutateAsync({ id: selected.id, dto });
                  toast.success("Worker updated");
                  setOpenEdit(false);
                  setSelected(null);
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || "Update failed");
                }
              }}
            />
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              إلغاء
            </Button>
            <Button
              type="submit"
              form="edit-worker-form"
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? "جارٍ الحفظ..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
