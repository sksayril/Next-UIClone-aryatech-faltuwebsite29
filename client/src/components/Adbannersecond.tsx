import { useEffect, useRef } from "react";

export default function Adbannersecond() {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    const container = document.getElementById("container-a5dd734ae583c1b374318d1c328279af");
    if (!container) return;

    // Clear previous contents
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://unsettledradiator.com/a5dd734ae583c1b374318d1c328279af/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center my-4 w-full min-h-[50px] overflow-hidden bg-transparent">
      <div id="container-a5dd734ae583c1b374318d1c328279af" className="w-full flex justify-center" />
    </div>
  );
}
