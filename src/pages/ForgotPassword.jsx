const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Reset password"
      subtitle="We'll send you a link to reset it"
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-foreground underline underline-offset-4 hover:text-[hsl(72_74%_52%)]">
          <ArrowLeft className="h-3 w-3" />Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="border border-[hsl(72_74%_52%)]/30 bg-[hsl(72_74%_52%)]/10 px-4 py-4 text-center text-sm text-ink">
          <span className="mx-auto mb-2 block h-1.5 w-8 bg-[hsl(72_74%_52%)]" />
          If an account exists with that email, you'll receive a password reset link shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="label-eyebrow mb-1.5 block">Email address</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border-b border-border bg-transparent py-3 pl-6 text-sm text-ink placeholder:text-muted-foreground/60 focus:border-b-foreground focus:outline-none focus:ring-0"
                required
              />
            </span>
          </label>
          <button type="submit" className="btn-store btn-store--navy btn-sheen w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
