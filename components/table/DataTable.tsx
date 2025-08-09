// components/table/DataTable.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type OnChangeFn,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils/cn";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  page: number;
  pageSize: number;
  total?: number;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading?: boolean;
  emptyText?: string;
};

export function DataTable<T>({
  data,
  columns,
  page,
  pageSize,
  total = 0,
  sorting,
  onSortingChange,
  onPageChange,
  onPageSizeChange,
  loading,
  emptyText = "لا توجد بيانات.",
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  const pageCount =
    total && pageSize ? Math.max(1, Math.ceil(total / pageSize)) : undefined;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const dir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "p-3 text-right whitespace-nowrap",
                        canSort && "cursor-pointer select-none"
                      )}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="inline-flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {dir === "asc" && <span aria-hidden>▲</span>}
                        {dir === "desc" && <span aria-hidden>▼</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="p-6 text-center"
                >
                  جارِ التحميل…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="p-6 text-center opacity-70"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm opacity-75">
          {total ? (
            <>
              الصفحة {page} من {pageCount} • إجمالي {total}
            </>
          ) : (
            <>الصفحة {page}</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-10 rounded-2xl border px-3 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s} / صفحة
              </option>
            ))}
          </select>
          <button
            className="h-10 rounded-2xl border px-3 text-sm disabled:opacity-50"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            السابق
          </button>
          <button
            className="h-10 rounded-2xl border px-3 text-sm disabled:opacity-50"
            onClick={() => onPageChange(page + 1)}
            disabled={pageCount ? page >= pageCount : false}
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
