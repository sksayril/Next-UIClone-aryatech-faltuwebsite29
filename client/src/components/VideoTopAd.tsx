import { useEffect, useRef } from "react";

export default function VideoTopAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous contents
    containerRef.current.innerHTML = "";

    // Set the global atOptions configuration
    (window as any).atOptions = {
      'key' : '9cd5c86fbf732ac0d9eba5ed751c269c',
      'format' : 'iframe',
      'height' : 60,
      'width' : 468,
      'params' : {}
    };

    // Create the script element
    const script = document.createElement("script");
    script.src = "https://unsettledradiator.com/9cd5c86fbf732ac0d9eba5ed751c269c/invoke.js";
    script.async = true;

    // Append to container
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center my-4 w-full min-h-[60px] overflow-hidden bg-transparent">
      <div ref={containerRef} id="ad-container-9cd5c86fbf732ac0d9eba5ed751c269c" />
    </div>
  );
}
