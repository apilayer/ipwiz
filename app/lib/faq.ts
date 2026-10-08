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
];
