interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * FAQPage JSON-LD helper for pages with authentic FAQ content.
 */
export function FaqJsonLd({ faqs }: { faqs: FaqEntry[] }) {
  if (!faqs.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
