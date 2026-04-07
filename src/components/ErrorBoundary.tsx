import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "./Button";
import { PageHero } from "./system";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { reportClientError } from "../lib/reportClientError";
import { ROUTES } from "../utils/navigation";

type ErrorBoundaryProps = {
  children: ReactNode;
  /** When any key changes after an error, the boundary resets so navigation can recover. */
  resetKeys?: ReadonlyArray<string | number | boolean>;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    void reportClientError({
      error,
      componentStack: info.componentStack ?? "",
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    if (!this.state.hasError || !resetKeys?.length) return;
    const prev = prevProps.resetKeys ?? [];
    if (
      resetKeys.length !== prev.length ||
      resetKeys.some((key, i) => key !== prev[i])
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReload={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

function ErrorFallback({
  error,
  onReload,
}: {
  error: Error;
  onReload: () => void;
}) {
  useDocumentHead({
    titleSegment: "Something went wrong",
    description:
      "An unexpected error occurred while loading this page. You can reload or return to the Ori Capital home page.",
    canonicalPath: null,
    noIndex: true,
  });

  return (
    <PageHero
      eyebrow="Error"
      title="Something went wrong"
      subtitle="This page hit an unexpected error. Your work may not have been saved. Try reloading, or go home and reach out if it keeps happening."
      align="center"
      size="inner"
      actions={
        <>
          <Button type="button" variant="primary" onClick={onReload}>
            Reload page
          </Button>
          <Button variant="secondary" to={ROUTES.HOME}>
            Back to home
          </Button>
          <Button variant="ghost" to={ROUTES.CONTACT}>
            Contact
          </Button>
        </>
      }
      helper={
        import.meta.env.DEV ? (
          <p className="mt-6 max-w-xl text-left text-xs text-ori-muted">
            <code className="break-all">{error.message}</code>
          </p>
        ) : null
      }
    />
  );
}

/** Resets the boundary when the route changes so users can recover by navigating away. */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation();
  return (
    <ErrorBoundary resetKeys={[pathname, search]}>{children}</ErrorBoundary>
  );
}
