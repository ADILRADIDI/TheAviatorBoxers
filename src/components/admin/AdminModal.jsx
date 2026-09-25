import { X } from "lucide-react";

const SIZES = {
  md: "max-w-md",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-3xl",
};

// Fixed centering: the overlay itself scrolls (overflow-y-auto) and the panel is
// centered with m-auto, so a tall modal is fully reachable and never clipped
// below the viewport bottom.
export default function AdminModal({ open, title, description, onClose, children, size = "lg" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex overflow-y-auto bg-black/55 p-4 backdrop-blur-sm sm:py-8"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={`admin-pop relative m-auto w-full ${SIZES[size] || SIZES.lg} overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10`}
      >
        <div className="flex items-start justify-between gap-6 border-b border-black/10 px-6 py-5 sm:px-8">
          <div><h2 id="admin-modal-title" className="admin-h2">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-muted-foreground hover:bg-black/5 hover:text-foreground" aria-label="Fermer"><X className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto overscroll-contain px-6 pb-6 pt-6 sm:px-8 sm:pb-8">{children}</div>
      </section>
    </div>
  );
}