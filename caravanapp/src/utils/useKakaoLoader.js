import { useState, useEffect } from "react";

const KAKAO_APP_KEY = "304d2c1ebe998f786231879fb312524b"; // Replace this with your key

const useKakaoLoader = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the script is already loaded
    if (window.kakao && window.kakao.maps) {
      setLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setLoading(false);
      });
    };

    script.onerror = () => {
      setError(new Error("Failed to load Kakao Maps script."));
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up the script tag if the component unmounts
      // This might not be strictly necessary but is good practice
      const scripts = document.head.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes("dapi.kakao.com")) {
          document.head.removeChild(scripts[i]);
        }
      }
    };
  }, []);

  return { loading, error };
};

export default useKakaoLoader;
