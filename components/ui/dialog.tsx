"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";

type Ctx = { open: boolean; onOpenChange: (v: boolean) => void };
const DialogCtx = React.createContext<Ctx | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
}>) {
  return (
    <DialogCtx.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogCtx.Provider>
  );
}

function useDialogCtx() {
  const ctx = React.useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}

export function DialogContent({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { open, onOpenChange } = useDialogCtx();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onOpenChange(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ children }: React.PropsWithChildren) {
  return <div className="mb-4">{children}</div>;
}
export function DialogTitle({ children }: React.PropsWithChildren) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}
export function DialogDescription({ children }: React.PropsWithChildren) {
  return <p className="mt-1 text-sm opacity-80">{children}</p>;
}
export function DialogFooter({ children }: React.PropsWithChildren) {
  return (
    <div className="mt-5 flex items-center justify-end gap-2">{children}</div>
  );
}
