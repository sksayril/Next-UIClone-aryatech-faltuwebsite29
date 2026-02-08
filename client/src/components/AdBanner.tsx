"use client";

import { useEffect, useRef } from "react";

// Global script loader - ensures script loads only once
let globalScriptLoaded = false;
let globalScriptLoading = false;
const adContainers: Set<HTMLDivElement> = new Set();

export default function AdBanner() {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Add container to global set
    adContainers.add(container);

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
          
          // After script loads, populate all containers
          setTimeout(() => {
            adContainers.forEach((cont) => {
              if (cont && !cont.querySelector('iframe')) {
                // Create temporary div with expected ID
                const tempDiv = document.createElement('div');
                tempDiv.id = 'b3a4498413dba25bcd98e67937ca5a54';
                tempDiv.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;';
                document.body.appendChild(tempDiv);

                // Check for iframe and move it to our container
                const checkInterval = setInterval(() => {
                  const iframe = tempDiv.querySelector('iframe');
                  if (iframe && cont && !cont.querySelector('iframe')) {
                    cont.appendChild(iframe);
                    tempDiv.remove();
                    clearInterval(checkInterval);
                  }
                }, 100);

                // Cleanup after 3 seconds
                setTimeout(() => {
                  clearInterval(checkInterval);
                  if (tempDiv.parentNode) {
                    tempDiv.remove();
                  }
                }, 3000);
              }
            });
          }, 500);
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

      // Check if ad is already loaded
      if (container.querySelector('iframe')) {
        return;
      }

      // Load script if needed
      loadAdScript();

      // If script is already loaded, try to get ad immediately
      if (globalScriptLoaded) {
        const tempDiv = document.createElement('div');
        tempDiv.id = 'b3a4498413dba25bcd98e67937ca5a54';
        tempDiv.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;';
        document.body.appendChild(tempDiv);

        const checkInterval = setInterval(() => {
          const iframe = tempDiv.querySelector('iframe');
          if (iframe && container && !container.querySelector('iframe')) {
            container.appendChild(iframe);
            tempDiv.remove();
            clearInterval(checkInterval);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          if (tempDiv.parentNode) {
            tempDiv.remove();
          }
        }, 3000);
      }
    };

    // Try after container is mounted
    const timeout1 = setTimeout(initAd, 200);
    const timeout2 = setTimeout(initAd, 800);
    const timeout3 = setTimeout(initAd, 1500);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      if (container) {
        adContainers.delete(container);
      }
    };
  }, []);

  return (
    <div 
      ref={adContainerRef}
      style={{ 
        width: '320px', 
        height: '50px', 
        margin: '0 auto',
        minHeight: '50px',
        display: 'block',
        position: 'relative'
      }}
    />
  );
}
