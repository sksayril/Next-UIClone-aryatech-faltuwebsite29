"use client";

import { useEffect, useRef } from "react";

type Props = {
  uniqueId: string;
};

const AD_KEY = "b20ef2ef6f0541688d5eda910b8f2d5f";

export default function Adbannersecond({ uniqueId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";

    const isMobile = window.innerWidth < 640;

    (window as any).atOptions = {
      key: AD_KEY,
      format: "iframe",
      width: isMobile ? 320 : 300,
      height: isMobile ? 100 : 250,
      params: {},
    };

    const script = document.createElement("script");
    script.src = `https://exasperatebubblyorthodox.com/${AD_KEY}/invoke.js`;
    script.async = true;

    el.appendChild(script);
  }, [uniqueId]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 100,
        margin: "0 auto",
        overflow: "hidden",
      }}
    />
  );
  
}
