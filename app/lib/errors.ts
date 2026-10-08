/**
 * ipstack reports failures as a numeric code plus a terse developer message
 * ("The current subscription plan does not support the security endpoint").
 * Neither belongs in front of a visitor, so every code we can actually hit
 * maps to plain language and, where there is something to be done, a next
 * step. The raw payload is still there in the JSON tab for anyone who wants
 * it, so nothing is hidden, it just is not the first thing you read.
 */
export type FriendlyError = {
  title: string;
  detail: string;
  /** True when it is our side, so the UI can avoid blaming the visitor. */
  ours?: boolean;
};

const BY_CODE: Record<number, FriendlyError> = {
  101: {
    title: "This lookup could not be authorised",
    detail:
      "The API key behind this page was rejected. Nothing is wrong on your end. If you are running your own copy, check that IPSTACK_ACCESS_KEY is set correctly.",
    ours: true,
  },
  102: {
    title: "The lookup service is not active",
    detail:
      "The ipstack account behind this page is inactive, so lookups cannot run right now.",
    ours: true,
  },
  103: {
    title: "That lookup is not available",
    detail: "The page asked for something ipstack does not offer.",
    ours: true,
  },
  104: {
    title: "This page is out of lookups for the month",
    detail:
      "The free ipstack quota behind this page has run out. It resets at the start of next month. You can get your own free key and run a copy in the meantime.",
    ours: true,
  },
  105: {
    title: "Some details are not available on this plan",
    detail:
      "Your address, location and network data are all shown above. VPN, proxy and Tor detection needs a paid ipstack plan, so that part falls back to an educated guess.",
    ours: true,
  },
  106: {
    title: "No data for that address",
    detail:
      "ipstack has no record for it. Private and reserved ranges such as 192.168.x.x or 10.x.x.x are not routable on the public internet, so there is nothing to look up.",
  },
  301: {
    title: "That does not look like an IP address",
    detail:
      "Check the address and try again. It should look like 8.8.8.8 or 2001:4860:4860::8888.",
  },
  302: {
    title: "Too many addresses at once",
    detail: "Look them up one at a time.",
  },
  303: {
    title: "Bulk lookups are not available here",
    detail: "Look addresses up one at a time.",
  },
};

const UNREACHABLE: FriendlyError = {
  title: "Could not reach the lookup service",
  detail:
    "The request did not get through. Check your connection and try again in a moment.",
  ours: true,
};

/** Maps an ipstack `error` object onto something worth reading. */
export function describeIPstackError(
  code: number,
  info?: string
): FriendlyError {
  return (
    BY_CODE[code] ?? {
      title: "That lookup did not work",
      detail:
        info?.trim() ||
        "Something went wrong on the lookup service. Try again in a moment.",
      ours: true,
    }
  );
}

/** Maps a transport or HTTP failure onto the same shape. */
export function describeTransportError(status?: number): FriendlyError {
  if (status === 429)
    return {
      title: "Too many lookups, too quickly",
      detail: "Give it a few seconds and try again.",
    };
  if (status && status >= 500)
    return {
      title: "The lookup service is having trouble",
      detail: "This is not something you did. Try again in a moment.",
      ours: true,
    };
  return UNREACHABLE;
}
