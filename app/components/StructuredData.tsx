import { FAQ_DATA } from "@/app/lib/faq";
import { SITE, SITE_URL, absolute } from "@/app/lib/site";

/**
 * Structured data for search and answer engines.
 *
 * Rendered server-side and always present in the HTML, so it is indexed whether
 * or not a visitor expands anything. The FAQ entities come from the same array
 * the page renders, which means the answers a model quotes and the answers a
 * reader sees cannot drift apart.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "WebApplication",
      "@id": absolute("/#app"),
      name: SITE.name,
      url: SITE_URL,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      description: SITE.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Show your public IPv4 address",
        "Show your public IPv6 address",
        "IP geolocation: city, region, country",
        "ISP and ASN lookup",
        "VPN and proxy detection",
        "Look up any IPv4 or IPv6 address",
      ],
      isAccessibleForFree: true,
    },
    {
      "@type": "WebSite",
      "@id": absolute("/#website"),
      url: SITE_URL,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": absolute("/#org") },
    },
    {
      "@type": "Organization",
      "@id": absolute("/#org"),
      name: "APILayer",
      url: "https://apilayer.com/",
    },
    {
      "@type": "FAQPage",
      "@id": absolute("/#faq"),
      mainEntity: FAQ_DATA.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      // The one question the page exists to answer, stated plainly enough for
      // an answer engine to lift verbatim.
      "@type": "HowTo",
      "@id": absolute("/#howto"),
      name: "How to find your IP address",
      description:
        "Find your public IPv4 and IPv6 address, and the location and network attached to them.",
      totalTime: "PT10S",
      step: [
        {
          "@type": "HowToStep",
          name: "Open the page",
          text: `Open ${SITE.name}. Your public IP address is detected automatically from the connection, with no software to install.`,
        },
        {
          "@type": "HowToStep",
          name: "Read both addresses",
          text: "Your IPv4 address is shown first, with your IPv6 address beneath it when your network has one. The address your browser actually connected over is marked.",
        },
        {
          "@type": "HowToStep",
          name: "Check the details",
          text: "The card shows the city, region, country, ISP, ASN and timezone registered to the address, plus whether it looks like a VPN or proxy.",
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
