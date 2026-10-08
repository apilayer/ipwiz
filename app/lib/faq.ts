import type { IFaqItem } from "@/interfaces/faq.interface";

/**
 * Shared by the FAQ section and the structured data, so the answers a reader
 * sees and the ones an answer engine quotes can never drift apart.
 */
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
  {
    id: "faq-8",
    question: "What is the difference between IPv4 and IPv6?",
    answer:
      "IPv4 addresses are 32-bit and written as four numbers separated by dots, such as 192.0.2.1. The internet has run out of unallocated IPv4 space, so IPv6 was introduced: 128-bit addresses written as eight groups of hexadecimal digits, such as 2001:db8::1. Many connections now have both, which is called dual-stack. This page shows your IPv4 address first because that is the one most people mean when they ask for their IP, and shows your IPv6 address beneath it when your network has one. If the IPv6 row is empty, your network is IPv4-only. That is the right answer, not a failure.",
  },
  {
    id: "faq-9",
    question: "Why does my IP address change?",
    answer:
      "Most home and mobile connections get a dynamic IP address, which the provider reassigns from a pool whenever your router reconnects, your lease expires, or you move between networks. Mobile networks change it especially often because traffic is routed through carrier-grade NAT. A static IP, which stays the same, is normally a paid business option. Connecting through a VPN or proxy also changes the address this page sees, because the page sees the exit server rather than your connection.",
  },
  {
    id: "faq-10",
    question: "How accurate is IP geolocation?",
    answer:
      "It is approximate, and it is never a street address. What you get is the point where your provider routes traffic. That is usually right about the country and often right about the city or region, but on mobile networks, corporate VPNs and datacenter connections it can land in a different city altogether. Use it for things like picking a currency or language, or scoring fraud risk. Do not use it to work out where someone physically is.",
  },
  {
    id: "faq-11",
    question: "Can I hide my IP address?",
    answer:
      "You cannot remove it. Every site you connect to has to see some address in order to send a reply. You can replace what they see by routing through a VPN, a proxy or Tor, in which case sites see the exit server's address and location instead of yours. This page reports whether the address it sees carries proxy, Tor or hosting signals, so you can confirm a VPN is actually taking effect.",
  },
  {
    id: "faq-12",
    question: "Can I use ipstack with an AI assistant or MCP client?",
    answer:
      "Yes. The ipstack MCP (Model Context Protocol) server lets a coding assistant call ipstack directly as a tool, with no SDK and no hand-written API requests. It serves the same data this page uses: city-level geolocation for IPv4 and IPv6, ASN and connection details, timezone, currency, and threat intelligence covering proxies, VPNs and Tor. It handles up to 50 addresses in a single call. Point your MCP client at https://mcp.apilayer.com/mcp and authenticate with an Authorization: Bearer header carrying your APILayer token. It works with Claude Desktop, Cursor, VS Code Copilot, Windsurf and Cline out of the box; setup details are at https://ipstack.com/mcp/.",
  },
];
