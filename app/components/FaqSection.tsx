"use client";

import { useState } from "react";
import type { IFaqItem, IFaqSectionProps } from "@/interfaces/faq.interface";

export const FAQ_DATA: IFaqItem[] = [
  {
    id: "faq-1",
    question: "What is my IP address?",
    answer:
      "Your IP address is a unique address assigned to your device or network that allows it to communicate over the internet. This tool automatically detects your public IP address and provides additional information such as your approximate location, ISP, ASN, timezone, and whether the IP is associated with a VPN or proxy.",
  },
  {
    id: "faq-2",
    question: "What is the data source for the What Is My IP tool?",
    answer:
      "The What Is My IP tool uses IPstack to provide IP address and geolocation data. IPstack processes IPv4 and IPv6 addresses to provide information such as approximate location, ISP, ASN, timezone, and other network details.",
  },
  {
    id: "faq-3",
    question: "What information can you get from an IP address?",
    answer:
      "An IP address can provide information such as country, region, city, postal code, latitude and longitude, timezone, ISP, ASN, and network information. The amount of information available depends on the IP address and the geolocation data source. IPstack provides developers with access to this information through an easy-to-integrate IP geolocation API.",
  },
  {
    id: "faq-4",
    question: "What is IPstack?",
    answer:
      "IPstack is an IP geolocation API that allows developers to retrieve location and network information from IPv4 and IPv6 addresses. It can provide data such as country, region, city, ZIP or postal code, latitude and longitude, timezone, currency, ISP, ASN, and security information, making it useful for applications that need to understand where their users or visitors are connecting from.",
  },
  {
    id: "faq-5",
    question: "How can I use IPstack to look up an IP address?",
    answer:
      "Developers can send an IPv4 or IPv6 address to the IPstack API and receive structured geolocation and network information in response. IPstack can be integrated into websites, applications, analytics platforms, security systems, and other services that need IP-based location or network data.",
  },
  {
    id: "faq-6",
    question: "Can IPstack detect the location of an IP address?",
    answer:
      "Yes. IPstack can determine the approximate geographic location associated with an IPv4 or IPv6 address. Depending on the available data, the API can return information such as country, region, city, postal code, latitude, longitude, and timezone. IP-based geolocation is approximate and should not be considered an exact GPS location.",
  },
  {
    id: "faq-7",
    question: "What can I use an IP geolocation API for?",
    answer:
      "An IP geolocation API such as IPstack can be used for a wide range of applications, including content localization, location-based personalization, analytics, fraud prevention, security, traffic analysis, currency selection, and identifying the approximate location of website visitors. Developers can use IPstack to integrate these capabilities directly into their applications through an API.",
  },
];

export function FaqSection({
  title = "What is my IP",
  sourceUrl = "https://apilayer.com/devtools/what-is-my-ip",
  items = FAQ_DATA,
  className = "",
}: IFaqSectionProps) {
  // Keep track of open state for accordion; default first item open for UX
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-1": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      id="faq-section"
      className={`rounded-xl border border-border bg-bg-elev p-5 md:p-7 ${className}`}
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="mono text-[10px] uppercase tracking-wider text-accent font-medium">
              FAQ
            </span>
            <span className="text-fg-dim">·</span>
            <span className="mono text-xs text-fg-dim">Frequently Asked Questions</span>
          </div>
          <h2
            id="faq-heading"
            className="mt-1 text-xl font-bold tracking-tight text-fg md:text-2xl"
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Accordion List */}
      <div className="mt-4 divide-y divide-border">
        {items.map((item, index) => {
          const isOpen = Boolean(openItems[item.id]);
          return (
            <div key={item.id} className="py-4 first:pt-2 last:pb-0">
              <button
                type="button"
                id={`faq-btn-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-start justify-between gap-4 text-left font-medium text-fg transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="mono text-xs font-semibold text-fg-dim select-none">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-semibold text-fg md:text-base">
                    {item.question}
                  </span>
                </div>
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-bg-elev-2 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-accent border-accent/40" : "text-fg-dim"
                  }`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                  className="mt-3 pl-8 pr-4 text-sm leading-relaxed text-fg-muted"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
