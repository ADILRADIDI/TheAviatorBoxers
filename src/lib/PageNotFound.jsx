const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useLocation } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { whatsappContactUrl } from '@/lib/whatsapp';

export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);
    const { t } = useLanguage();

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await db.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });

    return (
        <div className="storefront-app flex min-h-screen items-center justify-center bg-ink p-6 text-white">
            <div className="max-w-lg w-full text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[hsl(72_74%_52%)]">Error 404</p>
                <h1 className="mt-6 font-display text-[clamp(5rem,20vw,9rem)] leading-none text-white/15 select-none">404</h1>
                <span className="mx-auto block h-1 w-14 bg-[hsl(72_74%_52%)]" />
                <h2 className="mt-8 font-display text-2xl sm:text-3xl">{t("Cette page n'existe pas.")}</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                    {t("La page que vous cherchez est introuvable. Retournez à l'accueil ou contactez-nous, on vous remet sur la bonne piste.")}
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/" className="btn-store btn-store--lime btn-sheen">
                        <ArrowLeft className="h-4 w-4" /> {t("Retour à l'accueil")}
                    </Link>
                    <a href={whatsappContactUrl(t("Bonjour The Aviator, la page de mon lien est introuvable. Pouvez-vous m'aider ?"))} target="_blank" rel="noopener noreferrer" className="btn-store btn-store--ghost">
                        <MessageCircle className="h-4 w-4" /> {t("Nous contacter")}
                    </a>
                </div>
            </div>
        </div>
    );
}