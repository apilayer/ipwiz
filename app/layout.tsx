import type { Metadata, Viewport } from "next";
import { SITE, SITE_URL } from "./lib/site";
import { Open_Sans, Source_Code_Pro } from "next/font/google";
import "./globals.css";

/**
 * The same pair ipstack.com uses, so this page reads as part of that site
 * rather than a detour from it: Open Sans for everything, Source Code Pro for
 * the raw JSON, request URLs and headers. Weight 600 is ipstack's heading
 * weight; 700 is kept for inline <strong>.
 *
 * The CSS variables are deliberately not named --font-sans / --font-mono:
 * those are Tailwind's own theme tokens, and pointing one at itself silently
 * breaks the family.
 */
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} · ${SITE.tagline} IP lookup & geolocation`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "what is my IP",
    "what is my IP address",
    "my IP address",
    "IPv4 address",
    "IPv6 address",
    "IP lookup",
    "IP geolocation",
    "check my IP",
    "VPN detection",
    "proxy detection",
    "ASN lookup",
    "ipstack API",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE.name,
    locale: SITE.locale,
    title: `${SITE.tagline} Check your IPv4 and IPv6 instantly`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.tagline} · ${SITE.name}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "technology",
  authors: [{ name: "APILayer", url: "https://apilayer.com/" }],
  creator: "APILayer",
  publisher: "APILayer",
  referrer: "origin-when-cross-origin",
  // An IPv4 address is four dot-separated numbers, which iOS Safari will
  // happily turn into a phone link if you let it.
  formatDetection: { telephone: false, address: false, email: false },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "black-translucent",
  },
};

/**
 * Split from `metadata` because `themeColor` belongs in the viewport export in
 * the App Router; leaving it in metadata logs a deprecation warning and is
 * dropped from the head.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} ${sourceCodePro.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://v4.ident.me" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://v6.ident.me" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
