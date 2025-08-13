// /app/dashboard/workers/page.tsx (أو المسار عندك)
"use client";
import { useMemo, useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import type { Worker } from "@/features/workers/types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import WorkerForm from "@/components/workers/WorkerForm";
import {
  useWorkers,
  useCreateWorker,
  useUpdateWorker,
} from "@/features/workers/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";

const colsBase: ColumnDef<Worker>[] = [
  {
    accessorKey: "id",
    header: "ID" as const,
    enableSorting: true,
    cell: ({ row }) => String(row.original.id),
  },
  { accessorKey: "name", header: "الاسم" as const, enableSorting: false },
  {
    id: "mosque",
    header: "المسجد" as const,
    cell: ({ row }) => row.original.mosque?.name ?? "-",
    enableSorting: false,
  },
  {
    accessorKey: "quran_level",
    header: "درجة الحفظ" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.quran_level ?? "-",
  },
  {
    accessorKey: "educational_level",
    header: "المستوى التعليمي" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.educational_level ?? "-",
  },
  {
    accessorKey: "sponsorship_type",
    header: "طبيعة الكفالة" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.sponsorship_type ?? "-",
  },
  { accessorKey: "job_title", header: "المسمى" as const, enableSorting: false },
  {
    accessorKey: "job_status",
    header: "الحالة" as const,
    enableSorting: false,
  },
  { accessorKey: "phone", header: "الهاتف" as const, enableSorting: false },
  {
    accessorKey: "created_at",
    header: "أضيف في" as const,
    enableSorting: true,
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at as any).toLocaleDateString()
        : "-",
  },
];

function mapSortingToBackend(s: SortingState): string | undefined {
  const first = s[0];
  if (!first) return undefined;
  const allowed: Record<string, string> = {
    id: "id",
    created_at: "created_at",
  };
  const key = allowed[first.id];
  if (!key) return undefined;
  return `${first.desc ? "-" : ""}${key}`;
}

export default function WorkersPage() {
  // Filters
  const [name, setName] = useState("");
  const [mosqueName, setMosqueName] = useState("");
  const nameDeb = useDebounce(name, 300);
  const mosqueNameDeb = useDebounce(mosqueName, 300);

  // Table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortParam = useMemo(() => mapSortingToBackend(sorting), [sorting]);

  const { data, isLoading, isError } = useWorkers({
    page,
    pageSize,
    filters: {
      name: nameDeb || undefined,
      mosque_name: mosqueNameDeb || undefined,
    },
  });

  const rows = (data?.data ?? []) as Worker[];
  const total = data?.meta?.total ?? rows.length;

  // Mutations + Dialogs
  const createMut = useCreateWorker();
  const updateMut = useUpdateWorker();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Worker | null>(null);

  const columns: ColumnDef<Worker>[] = [
    ...colsBase,
    {
      id: "actions",
      header: "Actions" as const,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          title="تعديل"
          aria-label="تعديل"
          className={cn(
            "h-8 w-8 p-0 rounded-full",
            "text-foreground/70 hover:text-primary",
            "hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          )}
          onClick={() => {
            setSelected(row.original);
            setOpenEdit(true);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="بحث بالاسم..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setPage(1);
          }}
          className="w-56"
        />
        <Input
          placeholder="بحث باسم المسجد..."
          value={mosqueName}
          onChange={(e) => {
            setMosqueName(e.target.value);
            setPage(1);
          }}
          className="w-56"
        />
        <div className="ms-auto">
          <Button onClick={() => setOpenCreate(true)}>إضافة موظف</Button>
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
          sorting={sorting}
          onSortingChange={setSorting}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          loading={isLoading}
          emptyText="لا توجد بيانات."
        />
      )}

      {/* Create */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent size="xl" align="top">
          <DialogHeader>
            <DialogTitle>إضافة موظف</DialogTitle>
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
                    ...v,
                    branch_id: Number(v.branch_id),
                    mosque_id: Number(v.mosque_id),
                    salary:
                      v.salary === undefined ? undefined : Number(v.salary),
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
            <Button
              type="submit"
              form="create-worker-form"
              disabled={createMut.isPending}
            >
              {createMut.isPending ? "جارٍ الإنشاء..." : "حفظ"}
            </Button>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>
              إلغاء
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
            <DialogTitle>تعديل موظف</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <WorkerForm
              mode="edit"
              defaultValues={selected ?? undefined}
              formId="edit-worker-form"
              hideSubmit
              submitLabel={updateMut.isPending ? "Saving..." : "Save"}
              onSubmitUpdate={async (v) => {
                if (!selected) return;
                try {
                  await updateMut.mutateAsync({
                    id: selected.id,
                    dto: {
                      ...v,
                      branch_id:
                        v.branch_id === undefined
                          ? undefined
                          : Number(v.branch_id),
                      mosque_id:
                        v.mosque_id === undefined
                          ? undefined
                          : Number(v.mosque_id),
                      salary:
                        v.salary === undefined
                          ? undefined
                          : Number(v.salary as any),
                    },
                  });
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
            <Button
              type="submit"
              form="edit-worker-form"
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
