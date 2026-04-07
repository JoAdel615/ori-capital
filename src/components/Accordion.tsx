import { useState, useRef } from "react";

interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionPanel({ id, title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-ori-border last:border-b-0">
      <button
        type="button"
        id={`accordion-${id}-trigger`}
        aria-expanded={open}
        aria-controls={`accordion-${id}-panel`}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-ori-foreground hover:text-ori-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black rounded-lg"
      >
        <span className="font-semibold">{title}</span>
        <span
          className={`shrink-0 text-ori-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        id={`accordion-${id}-panel`}
        role="region"
        aria-labelledby={`accordion-${id}-trigger`}
        ref={contentRef}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pr-10 text-ori-muted leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { id: string; title: string; content: React.ReactNode }[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className = "" }: AccordionProps) {
  return (
    <div className={`rounded-xl border border-ori-border bg-ori-surface p-4 md:p-6 ${className}`.trim()}>
      {items.map((item) => (
        <AccordionPanel
          key={item.id}
          id={item.id}
          title={item.title}
          defaultOpen={item.id === defaultOpenId}
        >
          {item.content}
        </AccordionPanel>
      ))}
    </div>
  );
}
