const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await db.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        db.auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await db.auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    db.auth.loginWithProvider("google", safeReturnTo());
  };

  const setOtpDigit = (index, value) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = otpCode.split("");
    next[index] = clean;
    setOtpCode(next.join("").slice(0, 6));
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email"
        subtitle={`We sent a code to ${email}`}
      >
        {error && (
          <div role="alert" className="mb-5 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex justify-center gap-2" role="group" aria-label="Verification code">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              value={otpCode[index] || ""}
              onChange={(e) => setOtpDigit(index, e.target.value)}
              onClick={(e) => e.target.select()}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="h-14 w-11 border-b-2 border-border bg-transparent text-center font-display text-xl text-ink focus:border-b-[hsl(72_74%_52%)] focus:outline-none"
            />
          ))}
        </div>
        <button type="button" className="btn-store btn-store--navy btn-sheen mt-6 w-full" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Didn't receive the code?{" "}
          <button type="button" onClick={handleResend} className="font-semibold text-foreground underline underline-offset-4 hover:text-[hsl(72_74%_52%)]">
            Resend
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="font-semibold text-foreground underline underline-offset-4 hover:text-[hsl(72_74%_52%)]"
          >
            Log in
          </Link>
        </>
      }
    >
      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-2.5 border border-border bg-background px-6 py-3.5 text-sm text-ink transition-colors hover:border-foreground"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {error && (
        <div role="alert" className="mb-5 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="label-eyebrow mb-1.5 block">Email</span>
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
        <label className="block">
          <span className="label-eyebrow mb-1.5 block">Password</span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full border-b border-border bg-transparent py-3 pl-6 text-sm text-ink placeholder:text-muted-foreground/60 focus:border-b-foreground focus:outline-none focus:ring-0"
              required
            />
          </span>
        </label>
        <label className="block">
          <span className="label-eyebrow mb-1.5 block">Confirm Password</span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full border-b border-border bg-transparent py-3 pl-6 text-sm text-ink placeholder:text-muted-foreground/60 focus:border-b-foreground focus:outline-none focus:ring-0"
              required
            />
          </span>
        </label>
        <button type="submit" className="btn-store btn-store--navy btn-sheen w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}