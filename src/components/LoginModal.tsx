import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { Input } from "./Input";
import { adminLogin } from "../lib/backoffice/api";
import { ROUTES } from "../utils/navigation";

const OVERLAY_Z = 10000;
const PANEL_Z = 10001;

type Step = "choose" | "admin";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("choose");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("choose");
      setPassword("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const goPartner = () => {
    onClose();
    navigate(ROUTES.PARTNER_PORTAL);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      setError("Enter the admin password.");
      return;
    }
    setSubmitting(true);
    let ok = false;
    try {
      ok = await adminLogin(password);
    } finally {
      setSubmitting(false);
    }
    if (ok) {
      setPassword("");
      onClose();
      navigate(ROUTES.ADMIN);
    } else {
      setError("Invalid password.");
    }
  };

  const modal = (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: OVERLAY_Z }}
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="fixed left-1/2 top-1/2 w-[min(100%-2rem,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ori-border bg-ori-surface p-6 shadow-xl"
        style={{ zIndex: PANEL_Z }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="login-modal-title" className="font-display text-lg font-semibold text-ori-foreground">
          {step === "choose" ? "Sign in" : "Admin sign in"}
        </h2>
        <p className="mt-1 text-sm text-ori-muted">
          {step === "choose"
            ? "Choose partner portal or admin."
            : "Enter the back office password."}
        </p>

        {step === "choose" ? (
          <div className="mt-6 flex flex-col gap-3">
            <Button type="button" className="w-full" onClick={goPartner}>
              Partner portal
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep("admin")}>
              Admin
            </Button>
            <button
              type="button"
              className="mt-1 text-center text-sm text-ori-muted hover:text-ori-accent"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} className="mt-6 space-y-4">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              className="py-2 px-3 text-sm"
            />
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={() => setStep("choose")}>
                Back
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Signing in…" : "Continue"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
