import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { config } from "../config";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { getPostBySlug, getRelatedPosts, getPostThumbnailStyle, getPostCoverSrc } from "../data/blog";

export function InsightPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = slug ? getPostBySlug(slug) : undefined;
  useDocumentHead({
    titleSegment: post ? post.title : "Article not found",
    description: post
      ? post.excerpt
      : "This insight could not be found. Browse all articles on the Insights page.",
    canonicalPath: post ? `/insights/${post.slug}` : null,
    ogImage: post ? getPostCoverSrc(post) : undefined,
    noIndex: !post,
  });
  const related = post ? getRelatedPosts(post) : [];

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ori-foreground">Article not found</h1>
        <Link to="/insights" className="mt-4 inline-block text-ori-accent hover:underline">
          Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <header>
          <div className="flex flex-wrap gap-2 text-sm text-ori-muted">
            <span>{post.category}</span>
            <span>·</span>
            <span>{post.readingTimeMinutes} min read</span>
            {post.tags.map((t) => (
              <span key={t} className="rounded bg-ori-surface px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-ori-muted">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.author}
          </p>
        </header>

        <div className="prose prose-invert mt-10 max-w-none">
          <p className="text-lg text-ori-foreground leading-relaxed">{post.excerpt}</p>
          <p className="mt-6 text-ori-foreground leading-relaxed">{post.body}</p>
        </div>

        {/* Email capture */}
        <div className="mt-16 rounded-xl border border-ori-border bg-ori-surface p-6">
          <h3 className="font-display text-lg font-semibold text-ori-foreground">
            Get more insights in your inbox
          </h3>
          <p className="mt-2 text-sm text-ori-muted">
            Subscribe for practical thinking on funding, structure, and ownership.
          </p>
          {subscribed ? (
            <p className="mt-4 text-ori-accent">Thanks for subscribing.</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSubmitting(true);
                try {
                  const res = await fetch(config.newsletterApiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.trim() }),
                  });
                  const data = (await res.json().catch(() => ({}))) as { error?: string };
                  if (!res.ok) {
                    throw new Error(data.error || "Could not subscribe right now.");
                  }
                  setSubscribed(true);
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "We could not subscribe you. Please try again shortly."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
              className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={submitting}
                />
                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          )}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display text-lg font-semibold text-ori-foreground">
              Related
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const thumb = getPostCoverSrc(p);
                return (
                <Link
                  key={p.slug}
                  to={`/insights/${p.slug}`}
                  className="group flex gap-4 rounded-xl border border-ori-border bg-ori-surface p-4 transition-all hover:border-ori-accent/40 hover:shadow-[0_0_24px_rgba(201,243,29,0.06)]"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className="h-20 w-20 shrink-0 rounded-lg bg-ori-charcoal"
                      style={getPostThumbnailStyle(p.slug)}
                    />
                  )}
                  <div className="min-w-0">
                    <span className="font-semibold text-ori-foreground group-hover:text-ori-accent">
                      {p.title}
                    </span>
                    <p className="mt-0.5 text-sm text-ori-muted line-clamp-2">
                      {p.excerpt}
                    </p>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-12">
          <Link to="/insights" className="text-ori-muted hover:text-ori-accent">
            ← Back to Insights
          </Link>
        </p>
      </article>
    </>
  );
}
