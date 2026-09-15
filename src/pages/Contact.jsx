import { useState } from "react";
import { MessageCircle, Mail, Clock, MapPin, Send, Check, ArrowUpRight, Headset, Truck, PackageCheck } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { STORE } from "@/lib/store";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const channelCards = [
  { icon: MessageCircle, label: "WhatsApp", value: "Réponse rapide", detail: STORE.whatsappNumber, href: `https://wa.me/${STORE.whatsappNumber}` },
  { icon: Mail, label: "Email", value: "Suivi de commande", detail: STORE.email, href: `mailto:${STORE.email}` },
  { icon: Clock, label: "Horaires", value: "Lundi–Vendredi, 9h–18h", detail: "On vous répond en moins de 2h", href: null },
  { icon: MapPin, label: "Livraison", value: "Partout au Maroc", detail: "Paiement à la livraison · 24–48h", href: null },
];

const helpPoints = [
  { icon: PackageCheck, title: "Suivi & livraison", text: "Où en est mon colis ? Délais, quartiers desservis, suivi de commande." },
  { icon: Headset, title: "Conseil taille & pack", text: "Quelle taille ou quel pack choisir ? On vous oriente en quelques messages." },
  { icon: Truck, title: "Retours & échanges", text: "Un échange ou un retour à prévoir ? On s'occupe de tout, sans stress." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };

export default function Contact() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  usePageMeta({ title: "Contact — The Aviator", description: "Contactez The Aviator : WhatsApp, email et service client du lundi au vendredi de 9h à 18h. Livraison partout au Maroc, paiement à la livraison." });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }, { name: "Contact", url: `${SITE_URL}/contact` }]));
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [website, setWebsite] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (website.trim()) return;
    const message = `Bonjour The Aviator,\n\nNom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(whatsappContactUrl(message), "_blank", "noopener,noreferrer");
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setWebsite("");
    setTimeout(() => setSent(false), 5000);
  };

  const field = (label, htmlFor) => (
    <label htmlFor={htmlFor} className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
  );

  return (
    <>
      {/* Luxury hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.04] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-accent-lime/10 blur-3xl" />
        <div className="container-edge relative py-20 text-center lg:py-28">
          <motion.div variants={stagger} initial={reduce ? undefined : "hidden"} animate="show">
            <motion.span variants={fadeUp} className="label-eyebrow text-white/50">{t("Contact")}</motion.span>
            <motion.h1 variants={fadeUp} className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("Une question ?")}{" "}
              <span className="relative inline-block text-accent-lime">
                {t("Parlons-en.")}
                <span className="absolute -bottom-2 left-0 h-px w-full bg-accent-lime/50" />
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              {t("Notre équipe vous répond en moins de 2 heures, du lundi au vendredi. Une question, une demande, un conseil : on est là.")}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href={`https://wa.me/${STORE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-store btn-store--lime btn-sheen">
                <MessageCircle className="h-4 w-4" /> {t("Commander via WhatsApp")}
              </a>
              <a href={`mailto:${STORE.email}`} className="flex items-center gap-2 border border-white/25 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/60 hover:bg-white/5">
                <Mail className="h-4 w-4" /> {STORE.email}
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-6 text-[11px] uppercase tracking-[0.2em] text-white/40">
              {t("Réponse < 2h · Lundi–Vendredi 9h–18h")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="container-edge py-14 lg:py-20">
        {/* Channels */}
        <motion.div variants={stagger} initial={reduce ? undefined : "hidden"} whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channelCards.map(({ icon: Icon, label, value, detail, href }, index) => (
            <motion.a
              variants={fadeUp}
              key={label}
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener,noreferrer" : undefined}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden border border-border bg-background p-6 transition-all duration-300",
                href ? "hover:-translate-y-1 hover:border-navy/25 hover:shadow-[0_20px_50px_-30px_rgba(0,40,94,0.6)]" : "cursor-default",
              )}
            >
              <span className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-accent-lime to-transparent" />
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center border border-navy/10 bg-navy/[0.03] text-navy transition-colors group-hover:bg-navy group-hover:text-accent-lime">
                  <Icon className="h-5 w-5" />
                </span>
                {href && <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy" />}
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-base font-bold text-navy">{t(value)}</p>
              <p className={cn("mt-1 truncate text-xs", href ? "text-muted-foreground group-hover:text-navy" : "text-muted-foreground")}>{t(detail)}</p>
            </motion.a>
          ))}
        </motion.div>

        {/* Help + form */}
        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-20">
          <div>
            <motion.div variants={stagger} initial={reduce ? undefined : "hidden"} whileInView="show" viewport={{ once: true, margin: "-80px" }}>
              <motion.span variants={fadeUp} className="label-eyebrow">{t("L'équipe Aviator")}</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {t("Comment pouvons-nous vous aider ?")}
              </motion.h2>
              <div className="mt-8 space-y-5">
                {helpPoints.map(({ icon: Icon, title, text }) => (
                  <motion.div variants={fadeUp} key={title} className="flex gap-4 border-l-2 border-accent-lime pl-5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-navy/10 bg-navy/[0.03] text-navy">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{t(title)}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(text)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial={reduce ? undefined : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-10 flex items-center gap-4 bg-navy p-6 text-white"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-lime text-navy">
                <Headset className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-base font-bold">{t("Un conseiller dédié pour vos commandes")}</p>
                <p className="mt-0.5 text-sm text-white/70">{t("Un problème avec votre pack ? Écrivez-nous directement.")}</p>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            variants={fadeUp}
            initial={reduce ? undefined : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            onSubmit={submit}
            className="relative h-fit overflow-hidden rounded-lg border border-border bg-background p-6 shadow-[0_50px_100px_-60px_rgba(0,40,94,0.45)] sm:p-9"
          >
            <span className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-navy via-accent-lime to-navy" />
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-accent-lime">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-navy">{t("Écrivez-nous")}</h2>
                <p className="text-xs text-muted-foreground">{t("Réponse via WhatsApp en quelques minutes.")}</p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <div className="grid gap-1.5">
                {field(t("Nom"), "contact-name")}
                <input id="contact-name" type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border-b border-border bg-transparent px-1 py-2.5 text-sm outline-none transition-colors focus:border-navy" required />
              </div>
              <div className="grid gap-1.5">
                {field(t("Email"), "contact-email")}
                <input id="contact-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full border-b border-border bg-transparent px-1 py-2.5 text-sm outline-none transition-colors focus:border-navy" required />
              </div>
              <div className="grid gap-1.5">
                {field(t("Message"), "contact-message")}
                <textarea id="contact-message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="w-full resize-none border-b border-border bg-transparent px-1 py-2.5 text-sm outline-none transition-colors focus:border-navy" rows={4} required />
              </div>
              <input type="text" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="off" />

              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 bg-accent-lime/15 px-4 py-4 text-sm font-bold text-navy">
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }} className="flex h-6 w-6 items-center justify-center rounded-full bg-navy">
                      <Check className="h-4 w-4 text-accent-lime" />
                    </motion.span>
                    {t("Envoyé")} — {t("on vous répond très vite !")}
                  </motion.div>
                ) : (
                  <motion.button key="send" type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="btn-store btn-store--navy btn-sheen w-full">
                    <Send className="h-4 w-4" /> {t("Envoyer")}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-navy py-14 text-white lg:py-16">
        <div className="container-edge flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold lg:text-3xl">{t("Besoin d'une réponse tout de suite ?")}</h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">{t("Discutez avec notre équipe sur WhatsApp : commande, taille ou livraison, on vous dit tout.")}</p>
          </div>
          <a href={`https://wa.me/${STORE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-store btn-store--lime btn-sheen shrink-0">
            <MessageCircle className="h-4 w-4" /> {t("Commander via WhatsApp")}
          </a>
        </div>
      </section>
    </>
  );
}