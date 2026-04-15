import { useEffect } from "react";
import { config } from "../config";

const SITE_NAME = "Ori Holdings";

function setMetaName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeCanonical() {
  document.querySelector('link[rel="canonical"]')?.remove();
}

function setRobotsMeta(content: string | null) {
  const el = document.querySelector('meta[name="robots"]');
  if (content === null) {
    el?.remove();
    return;
  }
  let target = el;
  if (!target) {
    target = document.createElement("meta");
    target.setAttribute("name", "robots");
    document.head.appendChild(target);
  }
  target.setAttribute("content", content);
}

export type DocumentHeadOptions = {
  /**
   * Title segment before ` | Ori Holdings`. Empty string or undefined = site name only.
   */
  titleSegment?: string;
  description: string;
  /**
   * Path starting with `/` for canonical and og:url. `null` = remove canonical (e.g. 404).
   * `undefined` = use `window.location.pathname` (and search is ignored; SPA paths only).
   */
  canonicalPath?: string | null;
  /** Absolute URL for og:image / twitter:image */
  ogImage?: string;
  /** When true, sets robots to noindex,nofollow and removes on cleanup */
  noIndex?: boolean;
};

/**
 * Updates document title, description, Open Graph / Twitter tags, and canonical link.
 * Intended for client-side SPA SEO; crawlers that execute JS will see updates.
 */
export function useDocumentHead({
  titleSegment,
  description,
  canonicalPath,
  ogImage,
  noIndex,
}: DocumentHeadOptions) {
  const siteUrl = config.siteUrl.replace(/\/$/, "");

  useEffect(() => {
    const fullTitle = titleSegment ? `${titleSegment} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    setMetaName("description", description);
    setMetaProperty("og:title", fullTitle);
    setMetaProperty("og:description", description);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:site_name", SITE_NAME);

    const pathForUrl =
      canonicalPath === undefined
        ? typeof window !== "undefined"
          ? window.location.pathname
          : "/"
        : canonicalPath === null
          ? null
          : canonicalPath.startsWith("/")
            ? canonicalPath
            : `/${canonicalPath}`;

    if (pathForUrl === null) {
      removeCanonical();
      setMetaProperty("og:url", typeof window !== "undefined" ? window.location.href.split("#")[0] : siteUrl);
    } else {
      const absoluteUrl = `${siteUrl}${pathForUrl}`;
      setMetaProperty("og:url", absoluteUrl);
      setCanonical(absoluteUrl);
    }

    const image = ogImage ?? `${siteUrl}/ori-crown-logo.png`;
    setMetaProperty("og:image", image);
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", fullTitle);
    setMetaName("twitter:description", description);
    setMetaName("twitter:image", image);

    if (noIndex) {
      setRobotsMeta("noindex, nofollow");
    } else {
      setRobotsMeta(null);
    }

    return () => {
      if (noIndex) {
        setRobotsMeta(null);
      }
    };
  }, [titleSegment, description, canonicalPath, ogImage, noIndex, siteUrl]);
}
