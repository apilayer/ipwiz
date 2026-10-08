import type { Metadata, Viewport } from "next";
import { SITE, SITE_URL } from "./lib/site";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

/**
 * IBM Plex, not the framework default.
 *
 * This page is mostly monospace: a hundred-odd elements render IP addresses,
 * ASNs, timezones and hex. Plex Mono was drawn for exactly that, and keeps 0/O
 * and 1/l/I distinct, which matters when the whole point of the page is that
 * someone reads an address off it correctly.
 */
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — ${SITE.tagline} IP lookup & geolocation`,
    template: `%s — ${SITE.name}`,
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
    title: `${SITE.tagline} — ${SITE.name}`,
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://v4.ident.me" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://v6.ident.me" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('ipwiz-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
