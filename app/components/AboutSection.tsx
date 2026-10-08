import Link from "next/link";

/**
 * Real prose about what the page actually does.
 *
 * This exists for two reasons. A visitor who wants to understand what they are
 * looking at should not have to open the FAQ to get it, and a search or answer
 * engine needs more than a number on a page before it will treat this as the
 * authoritative result for "what is my IP".
 */
export function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="rounded-xl border border-border bg-bg-elev p-6 md:p-8"
    >
      <span className="label text-[10px] font-semibold uppercase text-accent">
        About this tool
      </span>
      <h2
        id="about-heading"
        className="mt-2 text-[1.75rem] font-semibold leading-[1.2] text-fg md:text-[2.25rem] md:leading-[2.75rem]"
      >
        What your IP address gives away, and what it doesn&rsquo;t
      </h2>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4 text-base leading-relaxed text-fg-muted">
          <p>
            Every device on the internet needs a public IP address to be
            reachable. It belongs to your connection, not to you, and your
            provider hands it out. Every site you visit has to see it in order
            to send anything back, which is why this page can tell you yours
            without asking you for anything.
          </p>
          <p>
            The address above is what your browser is presenting right now.
            Your network might have an{" "}
            <strong className="font-semibold text-fg">IPv4</strong> address,
            the familiar four-number kind like{" "}
            <span className="code">192.0.2.1</span>, and an{" "}
            <strong className="font-semibold text-fg">IPv6</strong> address,
            the longer hexadecimal kind like{" "}
            <span className="code">2001:db8::1</span>. One connection can only
            ever show you one of them, so this page checks for each separately.
          </p>
          <p>
            Hanging off that address is a pile of registry and routing data:
            who owns it, its{" "}
            <abbr title="Autonomous System Number" className="no-underline">
              ASN
            </abbr>
            , the city and country its traffic runs through, the local
            timezone, and whether it belongs to a known VPN, proxy, Tor exit or
            hosting provider.
          </p>
          <p className="text-fg-dim">
            It will not tell anyone who you are, where you live, or what is on
            your device. The location you see is your provider&rsquo;s routing
            point. That is usually the right country, often the right city, and
            routinely nowhere near you on mobile networks and corporate VPNs.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-bg-elev-2 p-5">
            <h3 className="text-[1.25rem] font-semibold leading-[1.4] text-fg md:text-[1.5rem] md:leading-[1.75rem]">
              The data behind this page
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Every lookup on this page is a live call to the{" "}
              <a
                href="https://ipstack.com"
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-accent hover:underline"
              >
                ipstack API
              </a>
              , an APILayer product covering millions of IPv4 and IPv6
              addresses with location, connection, currency, timezone and threat
              data. You can call the same endpoint on a free tier. The exact
              request and response are printed in full next to the map.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-bg-elev-2 p-5">
            <h3 className="text-[1.25rem] font-semibold leading-[1.4] text-fg md:text-[1.5rem] md:leading-[1.75rem]">
              Use it from an AI assistant
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              The{" "}
              <a
                href="https://ipstack.com/mcp/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-accent hover:underline"
              >
                ipstack MCP server
              </a>{" "}
              lets a coding assistant call this data itself, as a tool, with no
              SDK and no API requests to write. It covers the same ground as
              this page: geolocation, ASN and connection details, timezone,
              currency and threat intelligence. It handles up to 50 addresses
              per call, and works with Claude Desktop, Cursor, VS Code Copilot,
              Windsurf and Cline out of the box.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              Add this to your tool&rsquo;s MCP config and restart it:
            </p>
            <pre className="code mt-2 overflow-x-auto rounded-md border border-border bg-bg p-3 text-[11px] leading-relaxed text-fg">
{`{
  "mcpServers": {
    "apilayer": {
      "url": "https://mcp.apilayer.com/mcp",
      "headers": {
        "Authorization": "Bearer \${env:APILAYER_MCP_TOKEN}"
      }
    }
  }
}`}
            </pre>
          </div>

          <div className="rounded-lg border border-border bg-bg-elev-2 p-5">
            <h3 className="text-[1.25rem] font-semibold leading-[1.4] text-fg md:text-[1.5rem] md:leading-[1.75rem]">
              See the IP behind a click
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              The{" "}
              <Link
                href="/link-grabber"
                className="font-semibold text-accent hover:underline"
              >
                Link Grabber
              </Link>{" "}
              creates a trackable link you can share. When someone opens it,
              you see the IP, approximate location, ISP and device behind the
              click. They see exactly what was captured before they continue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
