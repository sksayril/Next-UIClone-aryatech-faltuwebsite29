"use client";

import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    // Set atOptions before loading the script
    if (typeof (window as any).atOptions === 'undefined') {
      (window as any).atOptions = {
        'key': 'b3a4498413dba25bcd98e67937ca5a54',
        'format': 'iframe',
        'height': 50,
        'width': 320,
        'params': {}
      };
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="b3a4498413dba25bcd98e67937ca5a54"]');
    if (existingScript) {
      return; // Script already loaded
    }

    // Load the ad script
    const script = document.createElement('script');
    script.src = 'https://exasperatebubblyorthodox.com/b3a4498413dba25bcd98e67937ca5a54/invoke.js';
    script.async = true;
    script.id = 'adsterra-banner-script';
    
    // Append to body
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove script on unmount as it may be used by other components
      // The script will handle multiple ad containers automatically
    };
  }, []);

  return (
    <div 
      id="b3a4498413dba25bcd98e67937ca5a54" 
      style={{ width: '320px', height: '50px', margin: '0 auto' }}
    />
  );
}
