export const GOOGLE_POPUP_MESSAGE_TYPE = "aemeathshop:google-oauth-success";

type PopupResult = {
  success: boolean;
  nextPath: string;
};

const getSafeNextPath = (value: string | null | undefined) => {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
};

const getGoogleAuthorizationUrl = async (callbackPath: string) => {
  const csrfResponse = await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "same-origin",
  });

  if (!csrfResponse.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const csrfPayload = (await csrfResponse.json()) as { csrfToken?: string };
  const csrfToken = csrfPayload?.csrfToken;

  if (!csrfToken) {
    throw new Error("Missing CSRF token");
  }

  const body = new URLSearchParams({
    csrfToken,
    callbackUrl: callbackPath,
    json: "true",
  });

  const signInResponse = await fetch("/api/auth/signin/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    credentials: "same-origin",
    body,
  });

  if (!signInResponse.ok) {
    throw new Error("Failed to initiate Google sign-in");
  }

  const signInPayload = (await signInResponse.json()) as { url?: string };

  if (!signInPayload?.url) {
    throw new Error("Missing Google authorization URL");
  }

  return signInPayload.url;
};

export const openGoogleSignInPopup = async (
  requestedNextPath: string,
): Promise<PopupResult> => {
  const safeNextPath = getSafeNextPath(requestedNextPath);
  const callbackPath = `/auth/popup-complete?next=${encodeURIComponent(safeNextPath)}`;

  const width = 520;
  const height = 680;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
  const features = `popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)}`;

  const popup = window.open("about:blank", "google_oauth_popup", features);

  if (!popup) {
    const { signIn } = await import("next-auth/react");
    await signIn("google", { callbackUrl: callbackPath });
    return { success: false, nextPath: safeNextPath };
  }

  popup.focus();

  try {
    const providerUrl = await getGoogleAuthorizationUrl(callbackPath);
    popup.location.replace(providerUrl);
  } catch {
    popup.close();
    const { signIn } = await import("next-auth/react");
    await signIn("google", { callbackUrl: callbackPath });
    return { success: false, nextPath: safeNextPath };
  }

  return new Promise<PopupResult>((resolve) => {
    let settled = false;

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(closeWatcher);
    };

    const finish = (result: PopupResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const payload = event.data as
        | { type?: string; success?: boolean; nextPath?: string }
        | undefined;

      if (payload?.type !== GOOGLE_POPUP_MESSAGE_TYPE || !payload.success) {
        return;
      }

      finish({
        success: true,
        nextPath: getSafeNextPath(payload.nextPath || safeNextPath),
      });
    };

    window.addEventListener("message", onMessage);

    const closeWatcher = window.setInterval(() => {
      if (!popup || popup.closed) {
        finish({ success: false, nextPath: safeNextPath });
      }
    }, 400);
  });
};
