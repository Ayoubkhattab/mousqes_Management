"use client";

import { useMemo, useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import type { Mosque } from "@/features/mosques/types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils/cn";

import MosqueForm from "@/components/mosques/MosqueForm";
import {
  useMosqueCurrentStatus,
  useMosqueEnums,
} from "@/features/mosques/queries";
import {
  useMosques,
  useCreateMosque,
  useUpdateMosque,
} from "@/features/mosques/queries";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { useBranchesList } from "@/features/branches/hooks";
import TypesMultiFilter from "@/components/mosques/TypesMultiFilter";
import CurrentStatusSelect from "@/components/mosques/CurrentStatusSelect";
import { useDistrictsByBranch } from "@/features/districts/queries";

const colsBase: ColumnDef<Mosque>[] = [
  {
    accessorKey: "id",
    header: "ID" as const,
    enableSorting: true,
    cell: ({ row }) => String(row.original.id),
  },
  { accessorKey: "name", header: "الاسم" as const, enableSorting: false },
  {
    accessorKey: "branch.name",
    header: "الفرع" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.branch?.name ?? "-",
  },
  {
    accessorKey: "district.name",
    header: "المنطقة" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.district?.name ?? "-",
  },
  { accessorKey: "category", header: "الفئة" as const, enableSorting: false },
  {
    accessorKey: "current_status",
    header: "الحالة" as const,
    enableSorting: false,
  },
  {
    accessorKey: "technical_status",
    header: "الفنيّة" as const,
    enableSorting: false,
  },
  {
    id: "types",
    header: "الأنواع" as const,
    enableSorting: false,
    cell: ({ row }) =>
      (row.original.types ?? []).map((t) => t.type).join(" ، "),
  },
  {
    accessorKey: "created_at",
    header: "أضيف في" as const,
    enableSorting: true,
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at).toLocaleDateString()
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

export default function MosquesPage() {
  // فلاتر
  const [name, setName] = useState("");
  const nameDeb = useDebounce(name, 300);
  const [currentStatus, setCurrentStatus] = useState("");

  const { data: branches } = useBranchesList();
  const [branchId, setBranchId] = useState<number | "">("");
  const [districtId, setDistrictId] = useState<number | "">("");
  const [districtName, setDistrictName] = useState<string>("");

  const { data: enums } = useMosqueEnums();

  const [category, setCategory] = useState("");
  const [typesFilter, setTypesFilter] = useState<string[]>([]);
  const branchName =
    typeof branchId === "number"
      ? branches?.find((b) => b.id === branchId)?.name
      : undefined;
  const { data: districts } = useDistrictsByBranch(branchName);
  // جدول
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortParam = useMemo(() => mapSortingToBackend(sorting), [sorting]);

  const { data, isLoading, isError } = useMosques({
    page,
    pageSize,
    sort: sortParam,
    filters: {
      name: nameDeb || undefined,
      branch_name: branchName || undefined,
      district_name: districtName || undefined,
      category: category || undefined,
      current_status: currentStatus || undefined,
      types: typesFilter.length ? typesFilter : undefined,
    },
  });

  const rows = (data?.data ?? []) as Mosque[];
  const total = data?.total ?? rows.length;

  // Mutations + Dialogs
  const createMut = useCreateMosque();
  const updateMut = useUpdateMosque();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Mosque | null>(null);

  // اجلب قيم enum الحالية بناءً على الفرع/المنطقة المختارين
  const { data: currentStatusOpts = [] } = useMosqueCurrentStatus({
    branch_id: branchId || undefined,
    district_id: districtId || undefined,
  });

  const columns: ColumnDef<Mosque>[] = [
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

        <select
          className="h-10 rounded-2xl border px-3 text-sm"
          value={branchId}
          onChange={(e) => {
            const v = e.target.value;
            setBranchId(v ? Number(v) : "");
            setDistrictId("");
            setDistrictName("");
            setPage(1);
          }}
        >
          <option value=""> الفروع</option>
          {(branches ?? []).map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-2xl border px-3 text-sm"
          value={districtName}
          onChange={(e) => {
            const v = e.target.value ? Number(e.target.value) : "";
            setDistrictId(v);
            const dn = (districts ?? []).find((d) => d.id === v)?.name ?? "";
            setDistrictName(dn);
            setPage(1);
          }}
        >
          <option value=""> المناطق</option>
          {(districts ?? []).map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-2xl border px-3 text-sm"
          value={currentStatus}
          onChange={(e) => {
            setCurrentStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">الفئة</option>
          {(enums?.category ?? []).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <CurrentStatusSelect
          value={currentStatus}
          onChange={(v) => {
            setCurrentStatus(v);
            setPage(1);
          }}
          params={{
            branch_id: branchId,
            district_id: districtId,
          }}
          className="w-44"
        />

        {/* types multi-filter */}
        <TypesMultiFilter
          options={enums?.types ?? []}
          value={typesFilter}
          onChange={(next) => {
            setTypesFilter(next);
            setPage(1);
          }}
          placeholder="أنواع المساجد"
        />

        <div className="ms-auto">
          <Button onClick={() => setOpenCreate(true)}>إضافة مسجد</Button>
        </div>
      </div>

      {/* Table */}
      {isError ? (
        <div className="text-red-600">حدث خطأ أثناء الجلب.</div>
      ) : (
        <DataTable<Mosque>
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
            <DialogTitle>إنشاء مسجد جديد</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <MosqueForm
              mode="create"
              formId="create-mosque-form"
              hideSubmit
              submitLabel={createMut.isPending ? "Creating..." : "Create"}
              onSubmitCreate={async (v) => {
                try {
                  await createMut.mutateAsync({
                    ...v,
                    // bool -> 0/1 بالـ API
                    is_active: v.is_active ? 1 : 0,
                    support_friday: v.support_friday ? 1 : 0,
                  });
                  toast.success("Mosque created");
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
              form="create-mosque-form"
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
            <DialogTitle>تعديل بيانات مسجد</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <MosqueForm
              mode="edit"
              defaultValues={selected ?? undefined}
              formId="edit-mosque-form"
              hideSubmit
              submitLabel={updateMut.isPending ? "Saving..." : "Save"}
              onSubmitUpdate={async (v) => {
                if (!selected) return;
                try {
                  const cleaned = {
                    ...v,
                    is_active:
                      v.is_active === undefined
                        ? undefined
                        : Number(!!v.is_active),
                    support_friday:
                      v.support_friday === undefined
                        ? undefined
                        : Number(!!v.support_friday),
                  };
                  await updateMut.mutateAsync({
                    id: selected.id,
                    dto: cleaned,
                  });
                  toast.success("Mosque updated");
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
              form="edit-mosque-form"
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
