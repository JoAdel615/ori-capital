import { useMemo } from "react";
import { config } from "../config";

/**
 * Organization + WebSite JSON-LD for crawlers that execute JS (PLATFORM_LIFECYCLE_SPEC §9.1).
 */
export function JsonLd() {
  const json = useMemo(() => {
    const base = config.siteUrl.replace(/\/$/, "");
    const graph = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Ori Holdings",
        url: base,
        logo: `${base}/ori-crown-logo.png`,
        description:
          "Ori Holdings helps founders and operators build, run, and grow businesses with integrated Consulting, Management, and Funding pathways.",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Ori Holdings",
        url: base,
        publisher: { "@type": "Organization", name: "Ori Holdings" },
      },
    ];
    return JSON.stringify(graph);
  }, []);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
