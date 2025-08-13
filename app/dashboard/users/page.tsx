"use client";

import { useMemo, useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import type { User } from "@/features/shared/types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import UserForm from "@/components/users/UserForm";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
} from "@/features/users/queries";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const columnsBase: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID" as const,
    enableSorting: true,
    cell: ({ row }) => String(row.original.id),
  },

  {
    accessorKey: "username",
    header: "اسم المستخدم" as const,
    enableSorting: false,
  },

  {
    accessorKey: "name",
    header: "الاسم" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.name ?? "-",
  },

  {
    accessorKey: "roles.name",
    header: "الدور" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.roles?.name ?? "-",
  },

  {
    accessorKey: "branch.name",
    header: "الفرع" as const,
    enableSorting: false,
    cell: ({ row }) => row.original.branch?.name ?? "-",
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإنشاء" as const,
    enableSorting: true,
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "is_active",
    header: "الحالة" as const,
    enableSorting: true,
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-2xl text-xs ${
          row.original.is_active
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.original.is_active ? "نشط" : "موقوف"}
      </span>
    ),
  },
];

function mapSortingToBackend(s: SortingState): string | undefined {
  const first = s[0];
  if (!first) return undefined;

  const allowed: Record<string, string> = {
    id: "id",
    created_at: "created_at",
    is_active: "is_active",
  };

  const key = allowed[first.id];
  if (!key) return undefined;

  return `${first.desc ? "-" : ""}${key}`;
}

export default function UsersPage() {
  const [q, setQ] = useState("");
  const qDebounced = useDebounce(q);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const sortParam = useMemo(() => mapSortingToBackend(sorting), [sorting]);

  const { data, isLoading, isError } = useUsers({
    page,
    pageSize,
    sort: sortParam,
    filters: qDebounced ? { name: qDebounced } : undefined, // سيحوّلها mapper إلى filter[name]
  });

  const rows = (data?.data ?? []) as User[];
  const total = data?.total ?? rows.length;

  const createMut = useCreateUser();
  const updateMut = useUpdateUser();

  const columns: ColumnDef<User>[] = [
    ...columnsBase,
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold ">المستخدمون</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="بحث بالاسم..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-56"
          />
          <Button onClick={() => setOpenCreate(true)}>إنشاء مستخدم</Button>
        </div>
      </div>

      {/* Table */}
      {isError ? (
        <div className="text-red-600">حدث خطأ أثناء الجلب.</div>
      ) : (
        <DataTable<User>
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

      {/* Create Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent size="md" align="top">
          <DialogHeader>
            <DialogTitle>إنشاء مستخدم جديد</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <UserForm
              mode="create"
              formId="create-user-form"
              hideSubmit
              submitLabel={createMut.isPending ? "Creating..." : "Create"}
              onSubmitCreate={async (v) => {
                try {
                  await createMut.mutateAsync({
                    username: v.username,
                    password: v.password!,
                    name: v.name!,
                    role: v.role!,
                    branch_id: v.branch_id,
                  });
                  toast.success("User created");
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
              form="create-user-form"
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
            <DialogTitle>تعديل المستخدم</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <UserForm
              mode="edit"
              formId="edit-user-form"
              hideSubmit
              defaultValues={selected ?? undefined}
              submitLabel={updateMut.isPending ? "Saving..." : "Save"}
              onSubmitUpdate={async (v) => {
                if (!selected) return;
                try {
                  await updateMut.mutateAsync({
                    id: selected.id,
                    dto: {
                      name: v.name,
                      password: v.password,
                      role: v.role,
                      branch_id: v.branch_id,
                      is_active: (v as any).is_active,
                    },
                  });
                  toast.success("User updated");
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
              form="edit-user-form"
              className={cn("rounded-lg px-6")}
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              className={cn("rounded-lg px-6 border border-primary")}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
