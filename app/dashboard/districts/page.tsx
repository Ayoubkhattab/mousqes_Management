"use client";

import { useMemo, useState } from "react";
import type { ColumnDef, SortingState, Updater } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { toast } from "sonner";
import { Delete, Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils/cn";

import type { District } from "@/features/districts/types";
import DistrictForm from "@/components/districts/DistrictForm";
import { useBranchesList } from "@/features/branches/hooks";
import {
  useDistricts,
  useCreateDistrict,
  useUpdateDistrict,
  useDeleteDistrict,
} from "@/features/districts/queries";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";

const columnsBase: ColumnDef<District>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-gray-600 dark:text-gray-400">
        {String(row.original.id)}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "المنطقة",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 dark:text-white">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "branch.name",
    header: "الفرع",
    cell: ({ row }) => (
      <span className="text-gray-700 dark:text-gray-300">
        {row.original.branch?.name ?? "-"}
      </span>
    ),
  },
];

export default function DistrictsPage() {
  const [q, setQ] = useState("");
  const qDebounced = useDebounce(q, 300);

  const { data: branches } = useBranchesList();
  const [branchName, setBranchName] = useState<string>("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<District | null>(null);

  const { data, isLoading, isError } = useDistricts({
    page,
    pageSize,
    filters: {
      name: qDebounced || undefined,
      branchName: branchName || undefined,
    },
  });

  const rows = (data?.data ?? []) as District[];
  const total = data?.total ?? rows.length;

  const createMut = useCreateDistrict();
  const updateMut = useUpdateDistrict();
  const delMut = useDeleteDistrict();

  const columns: ColumnDef<District>[] = useMemo(
    () => [
      ...columnsBase,
      {
        id: "actions",
        header: "الإجراءات",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              title="تعديل"
              aria-label="تعديل"
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                "text-gray-600 hover:text-blue-600 dark:hover:text-blue-400",
                "hover:bg-blue-50 dark:hover:bg-blue-900/30",
                "transition-colors duration-200"
              )}
              onClick={() => {
                setSelected(row.original);
                setOpenEdit(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              title="حذف"
              aria-label="حذف"
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                "text-gray-600 hover:text-red-600 dark:hover:text-red-400",
                "hover:bg-red-50 dark:hover:bg-red-900/30",
                "transition-colors duration-200"
              )}
              onClick={async () => {
                if (confirm("هل أنت متأكد من حذف هذه المنطقة؟")) {
                  try {
                    await delMut.mutateAsync(row.original.id);
                    toast.success("تم الحذف بنجاح");
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || "فشل الحذف");
                  }
                }
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [delMut]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          إدارة المناطق
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex gap-2">
            <Input
              placeholder="بحث باسم المنطقة..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-48"
            />

            <select
              className={cn(
                "h-10 rounded-md border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "px-3 py-2 text-sm focus:outline-none focus:ring-2",
                "focus:ring-blue-500 focus:border-blue-500",
                "transition-colors duration-200"
              )}
              value={branchName}
              onChange={(e) => {
                setBranchName(e.target.value);
                setPage(1);
              }}
            >
              <option value="">كل الفروع</option>
              {(branches ?? []).map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setOpenCreate(true)}
            className="whitespace-nowrap"
          >
            إضافة منطقة جديدة
          </Button>
        </div>
      </div>

      {/* Table */}
      {isError ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400">
          حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.
        </div>
      ) : (
        <DataTable
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
          emptyText="لا توجد مناطق متاحة"
          sorting={[]}
          onSortingChange={function (
            updaterOrValue: Updater<SortingState>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent size="md" align="top">
          <DialogHeader>
            <DialogTitle>إنشاء منطقة جديدة</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <DistrictForm
              mode="create"
              formId="create-district-form"
              hideSubmit
              submitLabel={createMut.isPending ? "جارٍ الإنشاء..." : "إنشاء"}
              onSubmitCreate={async (v) => {
                try {
                  await createMut.mutateAsync({
                    name: v.name,
                    branch_id: Number(v.branch_id),
                    code: v.code || undefined,
                  });
                  toast.success("تم إنشاء المنطقة بنجاح");
                  setOpenCreate(false);
                } catch (e: any) {
                  const msg =
                    e?.response?.data?.details?.name?.[0] ||
                    e?.response?.data?.message ||
                    "فشل إنشاء المنطقة";
                  toast.error(msg);
                }
              }}
            />
          </DialogBody>

          <DialogFooter>
            <Button
              type="submit"
              form="create-district-form"
              disabled={createMut.isPending}
            >
              {createMut.isPending ? "جارٍ الإنشاء..." : "حفظ"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenCreate(false)}
              disabled={createMut.isPending}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onOpenChange={(v) => {
          setOpenEdit(v);
          if (!v) setSelected(null);
        }}
      >
        <DialogContent size="md" align="top">
          <DialogHeader>
            <DialogTitle>تعديل المنطقة</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <DistrictForm
              mode="edit"
              formId="edit-district-form"
              hideSubmit
              defaultValues={selected ?? undefined}
              submitLabel={updateMut.isPending ? "جارٍ الحفظ..." : "حفظ"}
              onSubmitUpdate={async (v) => {
                if (!selected) return;
                try {
                  const dto = {
                    name: v.name,
                    branch_id: v.branch_id ? Number(v.branch_id) : undefined,
                    code: v.code || undefined,
                  };
                  await updateMut.mutateAsync({ id: selected.id, dto });
                  toast.success("تم تحديث المنطقة بنجاح");
                  setOpenEdit(false);
                  setSelected(null);
                } catch (e: any) {
                  const msg =
                    e?.response?.data?.details?.name?.[0] ||
                    e?.response?.data?.message ||
                    "فشل تحديث المنطقة";
                  toast.error(msg);
                }
              }}
            />
          </DialogBody>

          <DialogFooter>
            <Button
              type="submit"
              form="edit-district-form"
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? "جارٍ الحفظ..." : "حفظ  "}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              disabled={updateMut.isPending}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
