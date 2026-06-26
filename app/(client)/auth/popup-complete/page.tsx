"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GOOGLE_POPUP_MESSAGE_TYPE } from "@/lib/auth/googlePopup";

const getSafeNextPath = (value: string | null) => {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
};

const OAuthPopupCompleteContent = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const nextPath = getSafeNextPath(searchParams.get("next"));

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        {
          type: GOOGLE_POPUP_MESSAGE_TYPE,
          success: true,
          nextPath,
        },
        window.location.origin,
      );
    }

    const timer = window.setTimeout(() => {
      window.close();
      window.location.replace(nextPath);
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-sm text-lightColor">
        Authentication successful. Closing popup...
      </p>
    </main>
  );
};

const OAuthPopupCompletePage = () => {
  return (
    <Suspense fallback={null}>
      <OAuthPopupCompleteContent />
    </Suspense>
  );
};

export default OAuthPopupCompletePage;
