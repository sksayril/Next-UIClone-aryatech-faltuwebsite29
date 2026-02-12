"use client";

import { useEffect, useRef } from "react";

const AD_ID = "b3a4498413dba25bcd98e67937ca5a54";
let scriptLoaded = false;

export default function AdBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Ensure unique ID
    container.id = AD_ID;

    // Remove any duplicate containers
    document.querySelectorAll(`#${AD_ID}`).forEach(el => {
      if (el !== container) el.remove();
    });

    // Ad options
    (window as any).atOptions = {
      key: AD_ID,
      format: "iframe",
      height: 50,
      width: 320,
      params: {}
    };

    if (scriptLoaded) return;

    const script = document.createElement("script");
    script.src = `https://exasperatebubblyorthodox.com/${AD_ID}/invoke.js`;
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
    };

    container.appendChild(script);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: 320,
        height: 50,
        margin: "0 auto",
        display: "block"
      }}
    />
  );
}
