"use client";

import { useEffect, useRef } from "react";

// Global script loader - ensures script loads only once
let globalScriptLoaded = false;
let globalScriptLoading = false;

export default function AdBanner() {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const uniqueIdRef = useRef(`ad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

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

    const loadAdScript = () => {
      if (globalScriptLoaded || globalScriptLoading) return;
      
      globalScriptLoading = true;
      const existingScript = document.querySelector('script[src*="b3a4498413dba25bcd98e67937ca5a54"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://exasperatebubblyorthodox.com/b3a4498413dba25bcd98e67937ca5a54/invoke.js';
        script.async = true;
        script.id = 'adsterra-banner-script';
        
        script.onload = () => {
          globalScriptLoaded = true;
          globalScriptLoading = false;
        };
        
        script.onerror = () => {
          globalScriptLoading = false;
        };
        
        document.body.appendChild(script);
      } else {
        globalScriptLoaded = true;
        globalScriptLoading = false;
      }
    };

    const initAd = () => {
      if (!container) return;

      // Check if ad is already loaded in this container
      if (container.querySelector('iframe')) {
        return;
      }

      // Load script if needed
      loadAdScript();

      // Wait for script to load, then create ad
      const tryLoadAd = () => {
        if (!container || container.querySelector('iframe')) return;

        // Temporarily set the expected ID on our actual container (in the correct position)
        // This ensures the script finds it in the right place, not at the end of body
        const originalId = container.id;
        container.id = 'b3a4498413dba25bcd98e67937ca5a54';
        
        // Force the script to re-scan for the ID
        // Some ad scripts need a trigger to re-check
        if ((window as any).atOptions) {
          // Trigger a custom event that might help
          const event = new Event('adContainerReady');
          container.dispatchEvent(event);
        }
        
        // Check if script populates it
        const checkInterval = setInterval(() => {
          if (container.querySelector('iframe')) {
            // Ad loaded successfully in the correct location!
            // Keep the ID or restore original - the ad is already in the right place
            clearInterval(checkInterval);
          }
        }, 200);

        // If not populated after 2 seconds, try creating a hidden temp div
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!container.querySelector('iframe')) {
            // Create a hidden temp div with the ID at the beginning of body
            // This is a fallback - the script might populate this first
            const tempDiv = document.createElement('div');
            tempDiv.id = 'b3a4498413dba25bcd98e67937ca5a54';
            tempDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;width:320px;height:50px;';
            document.body.insertBefore(tempDiv, document.body.firstChild);

            const checkTemp = setInterval(() => {
              const iframe = tempDiv.querySelector('iframe');
              if (iframe && container && !container.querySelector('iframe')) {
                // Move iframe to our actual container (in the correct position)
                container.appendChild(iframe);
                tempDiv.remove();
                clearInterval(checkTemp);
              }
            }, 200);

            setTimeout(() => {
              clearInterval(checkTemp);
              if (tempDiv.parentNode) {
                tempDiv.remove();
              }
              // Restore original ID if ad didn't load
              if (!container.querySelector('iframe') && originalId) {
                container.id = originalId;
              }
            }, 3000);
          }
        }, 2000);
      };

      if (globalScriptLoaded || document.querySelector('script[src*="b3a4498413dba25bcd98e67937ca5a54"]')) {
        // Script is loaded, try immediately
        setTimeout(tryLoadAd, 100);
      } else {
        // Wait for script to load
        const checkScript = setInterval(() => {
          if (globalScriptLoaded || document.querySelector('script[src*="b3a4498413dba25bcd98e67937ca5a54"]')) {
            clearInterval(checkScript);
            setTimeout(tryLoadAd, 200);
          }
        }, 100);

        setTimeout(() => clearInterval(checkScript), 10000);
      }
    };

    // Try after container is mounted with delays
    const timeout1 = setTimeout(initAd, 300);
    const timeout2 = setTimeout(initAd, 1000);
    const timeout3 = setTimeout(initAd, 2000);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    <div 
      ref={adContainerRef}
      id={uniqueIdRef.current}
      data-ad-banner="true"
      style={{ 
        width: '320px', 
        height: '50px', 
        margin: '0 auto',
        minHeight: '50px',
        display: 'block',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
}
