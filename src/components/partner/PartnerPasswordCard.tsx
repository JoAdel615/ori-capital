import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";

export type PartnerPasswordCardProps = {
  needsPasswordSetup: boolean;
  onCommit: (password: string) => Promise<void>;
};

export function PartnerPasswordCard({ needsPasswordSetup, onCommit }: PartnerPasswordCardProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSavedNotice(false);
    if (newPassword.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await onCommit(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setSavedNotice(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full rounded-xl border border-ori-border bg-ori-surface-panel/90 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.04] sm:p-5">
      <h3 className="ori-type-subtitle text-ori-foreground">{needsPasswordSetup ? "Set password" : "Password & sign-in"}</h3>
      <p className="mt-1.5 text-sm leading-snug text-ori-text-secondary">
        {needsPasswordSetup
          ? "Create a password so you can sign in with your portal email. Keep your access key somewhere safe."
          : "Update the password you use with your portal email."}
      </p>
      <form className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4" onSubmit={handleSubmit}>
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setSavedNotice(false);
          }}
          autoComplete="new-password"
        />
        <Input
          label={needsPasswordSetup ? "Confirm password" : "Confirm new password"}
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setSavedNotice(false);
          }}
          autoComplete="new-password"
        />
        <div className="sm:col-span-2">
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {savedNotice ? (
            <p className="text-sm text-ori-accent" role="status">
              {needsPasswordSetup ? "Password saved. You can sign in with your email next time." : "Password updated."}
            </p>
          ) : null}
          <Button type="submit" className="mt-2" variant={needsPasswordSetup ? "primary" : "outline"} disabled={saving}>
            {saving ? "Saving…" : needsPasswordSetup ? "Save password" : "Update password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
