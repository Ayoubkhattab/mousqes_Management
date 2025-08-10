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

type Size = "sm" | "md" | "lg" | "xl" | "full";
type Align = "center" | "top";

export function DialogContent({
  className,
  children,
  size = "lg",
  align = "top",
  closeOnEsc = true,
  closeOnOutside = false,
}: React.PropsWithChildren<{
  className?: string;
  size?: Size;
  align?: Align;
  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
}>) {
  const { open, onOpenChange } = useDialogCtx();
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(id);
      setVisible(false);
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onOpenChange]);

  if (!mounted || !open) return null;

  const sizeCls: Record<Size, string> = {
    sm: "max-w-sm",
    md: "max-w-[640px]",
    lg: "max-w-[720px]", // أعرض قليلًا من 2xl القياسي
    xl: "max-w-[860px]",
    full: "max-w-[min(100%,92rem)]",
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000]" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity",
          visible ? "opacity-100" : "opacity-0"
        )}
        onMouseDown={closeOnOutside ? () => onOpenChange(false) : undefined}
      />

      {/* Positioner */}
      <div
        className={cn(
          "relative z-10 grid h-dvh w-full pointer-events-none",
          align === "center"
            ? "place-items-center"
            : "items-start justify-center pt-8"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto relative w-full mx-4 sm:mx-0",
            sizeCls[size],
            // جلد ناعم + حواف أكبر + ظل أنيق مائل للأخضر
            "rounded-3xl border border-border/80 bg-card text-card-foreground",
            "shadow-[0_30px_70px_-30px_rgba(6,95,70,0.35)]",
            // شريط علوي رقيق (accent)
            "before:absolute before:inset-x-0 before:top-0 before:h-1 before:rounded-t-3xl",
            "before:bg-gradient-to-l before:from-primary before:to-emerald-600/80",
            "overflow-hidden max-h-[min(90dvh,900px)] flex flex-col",
            "transition-all duration-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ children }: React.PropsWithChildren) {
  return (
    <header className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border/70">
      <div className="px-6 py-5 bg-primary text-white text-center ">
        {children}
      </div>
    </header>
  );
}
export function DialogTitle({ children }: React.PropsWithChildren) {
  return <h3 className="text-xl font-semibold tracking-tight">{children}</h3>;
}
export function DialogDescription({ children }: React.PropsWithChildren) {
  return <p className="mt-1 text-sm text-muted-foreground">{children}</p>;
}

export function DialogBody({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn("px-6 py-6 overflow-y-auto flex-1 min-h-0", className)}
    >
      {children}
    </section>
  );
}

export function DialogFooter({ children }: React.PropsWithChildren) {
  return (
    <footer className="sticky bottom-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border/70">
      <div className="px-6 py-4">
        <div className="flex items-center justify-center  gap-x-8 ">
          {children}
        </div>
      </div>
    </footer>
  );
}
