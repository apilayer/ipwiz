"use client";

import { useState } from "react";
import type { IFaqSectionProps } from "@/interfaces/faq.interface";
import { FAQ_DATA } from "@/app/lib/faq";


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

  return (
    <section
      id="faq-section"
      className={`rounded-xl border border-border bg-bg-elev p-5 md:p-7 ${className}`}
      aria-labelledby="faq-heading"
    >
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

              {/* Rendered whether open or closed, and hidden with an
                  attribute rather than unmounted. Conditional rendering kept
                  all seven answers out of the HTML entirely, so the page had
                  no indexable text answering the question it is about. */}
              <div
                id={`faq-answer-${item.id}`}
                role="region"
                aria-labelledby={`faq-btn-${item.id}`}
                hidden={!isOpen}
                className="mt-3 pr-4 pl-8 text-sm leading-relaxed text-fg-muted"
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
