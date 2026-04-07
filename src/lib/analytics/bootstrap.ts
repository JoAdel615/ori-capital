import { isValidGaMeasurementId, isValidMetaPixelId } from "./validateIds";

export function initGoogleAnalytics(measurementId: string, onReady: () => void): void {
  if (!isValidGaMeasurementId(measurementId)) {
    if (import.meta.env.DEV) {
      console.warn("[Analytics] Ignoring invalid VITE_GA_MEASUREMENT_ID");
    }
    return;
  }
  const id = measurementId.trim();
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  s.onload = () => {
    window.gtag?.("js", new Date());
    window.gtag?.("config", id, { send_page_view: false });
    onReady();
  };
  s.onerror = () => {
    if (import.meta.env.DEV) {
      console.warn("[Analytics] Failed to load gtag.js");
    }
  };
  document.head.appendChild(s);
}

export function initMetaPixel(pixelId: string, onReady: () => void): void {
  if (!isValidMetaPixelId(pixelId)) {
    if (import.meta.env.DEV) {
      console.warn("[Analytics] Ignoring invalid VITE_META_PIXEL_ID");
    }
    return;
  }
  const id = pixelId.trim();
  if (typeof window === "undefined") return;
  if (window.fbq) {
    onReady();
    return;
  }

  const script = document.createElement("script");
  script.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`;
  document.head.appendChild(script);

  // Inline snippet runs synchronously and attaches `fbq`; control flow typing does not infer that.
  const fbq = window.fbq as ((...args: unknown[]) => void) | undefined;
  fbq?.("init", id);
  onReady();
}
