"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const POPUP_AD_KEY = "7861111bc12e3b9ce55bb7d65fc81f75";

export default function PopupAd() {
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("popupAdShown");
    
    // Show popup after a delay (e.g., 3 seconds after page load)
    const timer = setTimeout(() => {
      if (!popupShown) {
        setShowPopup(true);
        sessionStorage.setItem("popupAdShown", "true");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 300); // Animation duration
  };

  useEffect(() => {
    if (showPopup && !isClosing) {
      const container = document.getElementById("popup-ad-container");
      if (!container) return;

      // Clear any existing content
      container.innerHTML = "";

      // Set up ad options
      (window as any).atOptions = {
        key: POPUP_AD_KEY,
        format: "iframe",
        height: 600,
        width: 300,
        params: {}
      };

      // Create and append script
      const script = document.createElement("script");
      script.src = `https://exasperatebubblyorthodox.com/${POPUP_AD_KEY}/invoke.js`;
      script.async = true;
      
      container.appendChild(script);
    }
  }, [showPopup, isClosing]);

  if (!showPopup) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white rounded-lg shadow-2xl transition-transform duration-300 ${
          isClosing ? "scale-95" : "scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Ad Container */}
        <div
          id="popup-ad-container"
          style={{
            width: 300,
            height: 600,
            margin: "0 auto",
            display: "block",
            overflow: "hidden"
          }}
        />
      </div>
    </div>
  );
}
