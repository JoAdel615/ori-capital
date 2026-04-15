/**
 * CtaBand — closing or mid-page CTA with title, optional body, and action slot.
 */
import type { ReactNode } from "react";
import { PageSection } from "../system";

interface CtaBandProps {
  title: ReactNode;
  body?: ReactNode;
  actions: ReactNode;
  className?: string;
}

export function CtaBand({ title, body, actions, className = "" }: CtaBandProps) {
  return (
    <PageSection className={className}>
      <div className="rounded-2xl border border-ori-border bg-ori-surface-panel p-6 md:p-10">
        <h2 className="ori-type-title text-center">{title}</h2>
        {body && <p className="mx-auto mt-4 max-w-2xl text-center ori-type-body-muted">{body}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>
      </div>
    </PageSection>
  );
}
