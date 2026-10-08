import Image from "next/image";

const BROWSE_APIS_URL =
  "https://apilayer.com/products/?utm_source=IPstackHomePage&utm_medium=Referral";

/**
 * The "Endless Opportunities with Our Full API Suite" block from ipstack.com,
 * rebuilt here with the same copy, artwork and CTA so this devtool reads as
 * part of the marketing site rather than a detour from it.
 *
 * Two background layers, as on ipstack: a flat blue base with `blue-bg`, then
 * `orange-bg` over it — that one carries alpha, so the blue shows through.
 */
export function ApiSuiteSection() {
  return (
    <section
      aria-labelledby="api-suite-heading"
      className="relative isolate overflow-hidden rounded-lg bg-[#2480FC]"
    >
      <Image
        src="/brand/blue-bg.webp"
        alt=""
        fill
        aria-hidden
        sizes="(max-width: 1152px) 100vw, 1152px"
        className="-z-10 object-cover object-bottom"
      />
      <Image
        src="/brand/orange-bg.webp"
        alt=""
        fill
        aria-hidden
        sizes="(max-width: 1152px) 100vw, 1152px"
        className="-z-10 object-cover object-bottom"
      />

      {/* The artwork is a tall 532×692 column of API cards; it is meant to run
          past the top and bottom edges and be clipped, which is what sells the
          "endless" idea. `unoptimized` because the image optimizer refuses SVG
          unless dangerouslyAllowSVG is on — and it is already only 103 KB
          gzipped, so there is nothing to optimize. */}
      <Image
        src="/brand/portals.svg"
        alt=""
        aria-hidden
        width={532}
        height={692}
        unoptimized
        className="pointer-events-none absolute top-1/2 right-0 hidden w-[17rem] max-w-none -translate-y-1/2 select-none lg:block xl:w-[21rem]"
      />

      {/* Contrast floor for the copy. Measured against the composited artwork,
          dark text sits between 1.6:1 and 4.7:1 on the bare gradient, so it
          needs a light backing to be readable at all. This veil fades out
          before the artwork, which keeps the blue-to-orange run visible on the
          right where it actually reads; at the text's far edge it still leaves
          better than 7:1. */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-white/92 via-white/85 to-transparent md:w-[90%]"
      />

      <div className="relative max-w-2xl px-6 py-10 md:px-12 md:py-14">
        <h2
          id="api-suite-heading"
          className="text-[1.75rem] leading-[1.24] font-semibold text-[#0f172a] md:text-[2.8125rem] md:leading-[3.5rem]"
        >
          Endless Opportunities with Our Full API Suite
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#243049] md:text-[1.1875rem] md:leading-[1.7]">
          From currencies to weather, PDFs to more, our API marketplace has it
          all. Start exploring today and find the perfect building blocks for
          your next project.
        </p>
        <a
          href={BROWSE_APIS_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-[linear-gradient(128deg,#FD9950_1%,#ED661D_64%)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ED661D] focus-visible:ring-offset-2"
        >
          Browse APIs
          <svg
            viewBox="0 0 256 512"
            aria-hidden
            className="h-3 w-3 fill-current"
          >
            <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
          </svg>
        </a>
      </div>
    </section>
  );
}
