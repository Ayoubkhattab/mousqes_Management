"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { MosqueEnumParams } from "@/features/mosques/types";
import { useMosqueCurrentStatus } from "@/features/mosques/queries";

type Props = {
  value: string;
  onChange: (v: string) => void;
  params?: MosqueEnumParams; // { branch_id?, district_id?, name? }
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export default function CurrentStatusSelect({
  value,
  onChange,
  params,
  placeholder = "الكل",
  className,
  disabled,
}: Props) {
  const { data = [], isLoading } = useMosqueCurrentStatus(params);

  return (
    <select
      disabled={disabled}
      className={cn(
        "h-10 rounded-2xl border border-input bg-card text-foreground px-3 text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {isLoading ? (
        <option disabled>…Loading</option>
      ) : (
        data.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))
      )}
    </select>
  );
}
