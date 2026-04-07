import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { config } from "../config";
import { initGoogleAnalytics, initMetaPixel } from "../lib/analytics/bootstrap";

/**
 * Loads GA4 / Meta Pixel when `VITE_GA_MEASUREMENT_ID` / `VITE_META_PIXEL_ID` are set,
 * and sends virtual page views on React Router navigations.
 */
export function Analytics() {
  const { pathname, search } = useLocation();
  const [gaReady, setGaReady] = useState(false);
  const [pixelReady, setPixelReady] = useState(false);
  const gaStarted = useRef(false);
  const pixelStarted = useRef(false);

  useEffect(() => {
    const id = config.gaMeasurementId;
    if (!id || gaStarted.current) return;
    gaStarted.current = true;
    initGoogleAnalytics(id, () => setGaReady(true));
  }, []);

  useEffect(() => {
    const id = config.metaPixelId;
    if (!id || pixelStarted.current) return;
    pixelStarted.current = true;
    initMetaPixel(id, () => setPixelReady(true));
  }, []);

  useEffect(() => {
    if (!gaReady || !config.gaMeasurementId) return;
    window.gtag?.("config", config.gaMeasurementId, {
      page_path: pathname + search,
      page_title: document.title,
    });
  }, [pathname, search, gaReady]);

  useEffect(() => {
    if (!pixelReady || !config.metaPixelId) return;
    window.fbq?.("track", "PageView");
  }, [pathname, search, pixelReady]);

  return null;
}
