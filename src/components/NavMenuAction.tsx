interface NavMenuActionProps {
  label: string;
  description: string;
  onClick: () => void;
}

export function NavMenuAction({ label, description, onClick }: NavMenuActionProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="block w-full rounded-lg border-l-2 border-transparent px-4 py-3 text-left transition-colors hover:bg-ori-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-charcoal"
      >
        <span className="font-semibold text-ori-foreground">{label}</span>
        <p className="mt-0.5 text-sm text-ori-muted">{description}</p>
      </button>
    </li>
  );
}
