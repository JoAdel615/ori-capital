import { Link } from "react-router-dom";
import { PageHero, PageSection } from "../components/system";
import { TrustSectionIntro } from "../components/trust/TrustElements";
import { blogPosts, getPostCoverSrc } from "../data/blog";

export function InsightsPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="Insights and resources"
        subtitle="Clear funding education for founders and business owners who want to understand lender expectations before applying."
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black">
        <TrustSectionIntro
          title="Learn how funding actually works"
          subtitle="These resources are designed to help you improve readiness, avoid common mistakes, and choose funding paths with more confidence."
          align="left"
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => {
            const cover = getPostCoverSrc(post);
            return (
            <article
              key={post.slug}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-surface transition-all duration-200 hover:border-ori-accent/40 hover:shadow-[0_0_24px_rgba(201,243,29,0.06)] hover:-translate-y-0.5"
            >
              {cover ? (
                <div className="relative h-44 shrink-0 overflow-hidden bg-ori-charcoal ring-1 ring-inset ring-white/[0.06]">
                  <img
                    src={cover}
                    alt={post.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-surface/90 via-ori-black/10 to-transparent" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2 text-sm text-ori-muted">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold text-ori-foreground group-hover:text-ori-accent">
                  <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 text-ori-muted line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  to={`/insights/${post.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-ori-accent hover:underline"
                >
                  Read more -&gt;
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </PageSection>
    </>
  );
}
