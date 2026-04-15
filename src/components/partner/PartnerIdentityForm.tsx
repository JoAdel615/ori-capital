import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import type { PartnerBootstrap, PartnerProfileUpdatePayload } from "../../lib/partner/api";

export type PartnerIdentityPartner = PartnerBootstrap["partner"];

type Draft = {
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
};

const LIMITS = {
  organizationName: 160,
  contactName: 120,
  email: 200,
  city: 80,
  state: 48,
  phone: 40,
} as const;

function draftFromPartner(p: PartnerIdentityPartner): Draft {
  return {
    organizationName: p.organizationName?.trim() ?? "",
    contactName: p.contactName?.trim() ?? "",
    email: p.email?.trim() ?? "",
    phone: p.phone?.trim() ?? "",
    city: p.city?.trim() ?? "",
    state: p.state?.trim() ?? "",
  };
}

type FieldErrors = Partial<Record<keyof Draft, string>>;

function validateClient(d: Draft): FieldErrors {
  const out: FieldErrors = {};
  if (!d.organizationName.trim()) out.organizationName = "Organization name is required.";
  else if (d.organizationName.length > LIMITS.organizationName) {
    out.organizationName = `Use at most ${LIMITS.organizationName} characters.`;
  }
  if (!d.contactName.trim()) out.contactName = "Primary contact name is required.";
  else if (d.contactName.length > LIMITS.contactName) {
    out.contactName = `Use at most ${LIMITS.contactName} characters.`;
  }
  if (!d.email.trim()) out.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) out.email = "Enter a valid email address.";
  else if (d.email.length > LIMITS.email) out.email = `Use at most ${LIMITS.email} characters.`;
  if (d.phone.length > LIMITS.phone) out.phone = `Use at most ${LIMITS.phone} characters.`;
  if (d.city.length > LIMITS.city) out.city = `Use at most ${LIMITS.city} characters.`;
  if (d.state.length > LIMITS.state) out.state = `Use at most ${LIMITS.state} characters.`;
  return out;
}

export type PartnerIdentityFormProps = {
  partner: PartnerIdentityPartner;
  onSave: (payload: PartnerProfileUpdatePayload) => Promise<void>;
  /** When true, omit nested card chrome (used inside PartnerAccountPanel). */
  embedded?: boolean;
};

export function PartnerIdentityForm({ partner, onSave, embedded = false }: PartnerIdentityFormProps) {
  const [draft, setDraft] = useState<Draft>(() => draftFromPartner(partner));
  const [dirty, setDirty] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);

  const baseline = useMemo(() => draftFromPartner(partner), [partner]);

  useEffect(() => {
    if (!dirty) setDraft(baseline);
  }, [baseline, dirty]);

  const updateField = useCallback((key: keyof Draft, value: string) => {
    setDirty(true);
    setSavedNotice(false);
    setFormError("");
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const discard = useCallback(() => {
    setDraft(baseline);
    setDirty(false);
    setFieldErrors({});
    setFormError("");
    setSavedNotice(false);
  }, [baseline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSavedNotice(false);
    const clientErrs = validateClient(draft);
    if (Object.keys(clientErrs).length) {
      setFieldErrors(clientErrs);
      return;
    }
    setFieldErrors({});
    setSaving(true);
    try {
      await onSave({
        organizationName: draft.organizationName.trim(),
        contactName: draft.contactName.trim(),
        email: draft.email.trim().toLowerCase(),
        city: draft.city.trim() || undefined,
        state: draft.state.trim() || undefined,
        phone: draft.phone.trim() || undefined,
      });
      setDirty(false);
      setSavedNotice(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const outerClass = embedded
    ? "space-y-4"
    : "rounded-2xl border border-ori-border bg-ori-surface-panel p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.04] md:p-7";

  return (
    <div className={outerClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="partner-identity-heading" className="ori-type-subtitle text-ori-foreground">
            Organization &amp; contact
          </h3>
          <p className="mt-1 text-sm leading-snug text-ori-text-secondary">
            Shown on referrals and internal records. Keep this email current for sign-in.
          </p>
        </div>
        {dirty ? (
          <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-100">
            Unsaved changes
          </span>
        ) : null}
      </div>

      <form className="mt-4 space-y-3.5" onSubmit={handleSubmit} aria-labelledby="partner-identity-heading" noValidate>
        <Input
          label="Organization name"
          value={draft.organizationName}
          onChange={(e) => updateField("organizationName", e.target.value)}
          error={fieldErrors.organizationName}
          autoComplete="organization"
          maxLength={LIMITS.organizationName}
        />
        <Input
          label="Primary contact name"
          value={draft.contactName}
          onChange={(e) => updateField("contactName", e.target.value)}
          error={fieldErrors.contactName}
          autoComplete="name"
          maxLength={LIMITS.contactName}
        />
        <Input
          label="Portal email"
          value={draft.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={fieldErrors.email}
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email}
        />
        <Input
          label="Phone"
          value={draft.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          error={fieldErrors.phone}
          type="tel"
          autoComplete="tel"
          maxLength={LIMITS.phone}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="City"
            value={draft.city}
            onChange={(e) => updateField("city", e.target.value)}
            error={fieldErrors.city}
            autoComplete="address-level2"
            maxLength={LIMITS.city}
          />
          <Input
            label="State / region"
            value={draft.state}
            onChange={(e) => updateField("state", e.target.value)}
            error={fieldErrors.state}
            autoComplete="address-level1"
            maxLength={LIMITS.state}
          />
        </div>

        {formError ? (
          <p className="text-sm text-red-400" role="alert">
            {formError}
          </p>
        ) : null}
        {savedNotice ? (
          <p className="text-sm text-ori-accent" role="status">
            Profile saved.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button type="submit" disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" disabled={saving || !dirty} onClick={discard}>
            Discard
          </Button>
        </div>
      </form>
    </div>
  );
}
