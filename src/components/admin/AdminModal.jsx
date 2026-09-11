import { X } from "lucide-react";

export default function AdminModal({ open, title, description, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-border bg-background p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-6 border-b border-border pb-5">
          <div><h2 id="admin-modal-title" className="font-display text-2xl font-bold text-navy">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>
          <button type="button" onClick={onClose} className="p-2 text-muted-foreground hover:text-navy" aria-label="Fermer"><X className="h-5 w-5" /></button>
        </div>
        <div className="pt-6">{children}</div>
      </section>
    </div>
  );
}
