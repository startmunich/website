import Script from 'next/script';

/** Posts the document height to a parent frame, for sites that embed the home page. */
export function EmbedHeightReporter() {
  return (
    <Script id="iframe-height-sender" strategy="afterInteractive">
      {`
        function sendHeight() {
          const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
          parent.postMessage({ type: "EMBED_HEIGHT", height: h }, "*");
        }
        window.addEventListener("load", sendHeight);
        const ro = new ResizeObserver(sendHeight);
        ro.observe(document.documentElement);
        document.addEventListener("DOMContentLoaded", sendHeight);
      `}
    </Script>
  );
}
