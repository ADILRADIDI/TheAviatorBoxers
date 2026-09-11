import { useState } from "react";
import { MessageCircle, Mail, Clock, Check } from "lucide-react";
import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { STORE } from "@/lib/store";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [website, setWebsite] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (website.trim()) return;
    const message = `Bonjour The Aviator,\n\nNom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(`https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setWebsite("");
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow="Contact" title="Parlons-en" subtitle="Une question ? Une demande ? Nous sommes là pour vous." />

      <div className="container-edge py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl font-bold">Plusieurs moyens de nous joindre</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Que ce soit pour une commande, une question produit ou un retour,
              choisissez le canal qui vous convient.
            </p>

            <div className="mt-8 space-y-4">
              <a href={`https://wa.me/${STORE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 border border-border p-5 transition-colors hover:border-[#25D366]">
                <div className="flex h-12 w-12 items-center justify-center bg-[#25D366]/10 text-[#1da851]">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Le moyen le plus rapide</p>
                </div>
              </a>

              <a href={`mailto:${STORE.email}`} className="flex items-center gap-4 border border-border p-5 transition-colors hover:border-navy">
                <div className="flex h-12 w-12 items-center justify-center bg-navy/5 text-navy">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">Email</p>
                  <p className="text-xs text-muted-foreground">{STORE.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 border border-border p-5">
                <div className="flex h-12 w-12 items-center justify-center bg-navy/5 text-navy">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">Horaires</p>
                  <p className="text-xs text-muted-foreground">Lun - Sam · 9h00 - 19h00</p>
                </div>
              </div>
            </div>

            <a href={`https://wa.me/${STORE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-shine mt-6 flex w-full items-center justify-center gap-2 bg-[#25D366] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white">
              <MessageCircle className="h-4 w-4" /> Commander via WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="border border-border bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold">Envoyez-nous un message</h2>
            {sent ? (
              <div className="mt-6 flex flex-col items-center justify-center border border-accent-lime bg-accent-lime/10 py-12 text-center">
                <Check className="h-10 w-10 text-accent-lime" />
                <p className="mt-3 font-display text-lg">Message envoyé !</p>
                <p className="mt-1 text-xs text-muted-foreground">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <label className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  Site web
                  <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom complet</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="Votre nom" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="exemple@email.com" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</span>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-border px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="Votre message..." />
                </label>
                <button type="submit" className="w-full bg-navy py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-primary">Envoyer le message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}