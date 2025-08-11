"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

type Props = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  allLabel?: string;
  doneLabel?: string;
  clearLabel?: string;
};

export default function TypesMultiFilter({
  options,
  value,
  onChange,
  placeholder = "أنواع المساجد",
  allLabel = "الكل",
  doneLabel = "تم",
  clearLabel = "مسح",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const allSelected = value.length > 0 && value.length === options.length;

  const toggleOne = (opt: string) => {
    const exists = value.includes(opt);
    const next = exists ? value.filter((v) => v !== opt) : [...value, opt];
    onChange(next);
  };

  const toggleAll = () => {
    onChange(allSelected ? [] : [...options]);
  };

  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange([]);
  };

  const labelPreview =
    value.length === 0
      ? placeholder
      : value.length <= 3
      ? value.join("، ")
      : `${value.slice(0, 2).join("، ")} +${value.length - 2}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 max-w-[10rem] justify-between gap-2 rounded-2xl",
            value.length ? "border-primary/40 bg-primary/5" : ""
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {value.length === 0 ? (
              <span className="text-foreground/60">{placeholder}</span>
            ) : (
              <>
                <div className="flex items-center gap-1 overflow-hidden">
                  {value.slice(0, 3).map((v) => (
                    <Badge key={v} variant="secondary" className="shrink-0">
                      {v}
                    </Badge>
                  ))}
                </div>
                {value.length > 3 && (
                  <Badge variant="secondary" className="shrink-0">
                    +{value.length - 3}
                  </Badge>
                )}
              </>
            )}
          </div>
          <div className="ms-2 flex items-center gap-1">
            {value.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="rounded-md p-1 hover:bg-muted"
                aria-label={clearLabel}
                title={clearLabel}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-60" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[min(80vw,14rem)] p-0 rounded-2xl"
        sideOffset={8}
      >
        <Command shouldFilter={true}>
          <CommandList className="max-h-[280px]">
            <CommandEmpty>لا توجد نتائج.</CommandEmpty>

            <CommandSeparator />

            <CommandGroup heading="الأنواع المتاحة">
              {options.map((opt) => {
                const checked = value.includes(opt);
                return (
                  <CommandItem
                    key={opt}
                    onSelect={() => toggleOne(opt)}
                    className="flex items-center gap-2"
                  >
                    <Checkbox checked={checked} className="rtl:ml-0 rtl:mr-2" />
                    <span className="flex-1">{opt}</span>
                    {checked && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>

          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t bg-background/95 px-3 py-2">
            <Button variant="ghost" size="sm" onClick={clear}>
              {clearLabel}
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              {doneLabel}
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
