import Script from 'next/script';

/**
 * Posts this document's height to the frame that embeds it, so a host page can
 * size its iframe to the content instead of scrolling inside a fixed box.
 *
 * Each host listens for its own `postMessage` type, so pass the one that host
 * expects. Two are in use:
 *
 * - `EMBED_HEIGHT` (default) — the members-platform shell that wraps the site.
 * - `iframe-height` — the START Labs host.
 *
 * Reports once on DOM ready, again on `load` (images change the height), and on
 * every resize of the document element. Only posts when actually embedded, so
 * a standalone visit doesn't message its own window.
 */
export function EmbedHeightReporter({ messageType = 'EMBED_HEIGHT' }: { messageType?: string }) {
  return (
    <Script id={`iframe-height-sender-${messageType}`} strategy="afterInteractive">
      {`
        (function () {
          function sendHeight() {
            if (window.parent === window) return;
            var h = Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight
            );
            window.parent.postMessage({ type: ${JSON.stringify(messageType)}, height: h }, "*");
          }
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", sendHeight);
          } else {
            sendHeight();
          }
          window.addEventListener("load", sendHeight);
          if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(sendHeight).observe(document.documentElement);
          }
        })();
      `}
    </Script>
  );
}
