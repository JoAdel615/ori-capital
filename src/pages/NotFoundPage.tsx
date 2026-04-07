import { Button } from "../components/Button";
import { PageHero } from "../components/system";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { ROUTES } from "../utils/navigation";

export function NotFoundPage() {
  useDocumentHead({
    titleSegment: "Page not found",
    description: "The page you requested is not available. Return home or contact Ori Capital for help.",
    canonicalPath: null,
    noIndex: true,
  });

  return (
    <PageHero
      eyebrow="404"
      title="Page not found"
      subtitle="That URL doesn’t match anything on our site. Check the address or start from the home page."
      align="center"
      size="inner"
      actions={
        <>
          <Button variant="primary" to={ROUTES.HOME}>
            Back to home
          </Button>
          <Button variant="secondary" to={ROUTES.CONTACT}>
            Contact
          </Button>
        </>
      }
    />
  );
}
