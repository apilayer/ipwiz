"use client";

import { heuristicVpnVerdict, type IPstackResponse } from "@/app/lib/ipstack";

export function VpnVerdict({ data }: { data: IPstackResponse }) {
  const sec = data.security;
  const hasSecurityModule = sec && Object.keys(sec).length > 0;

  if (hasSecurityModule) {
    const flags: { label: string; active: boolean }[] = [
      { label: "Proxy", active: !!sec.is_proxy },
      { label: "Tor", active: !!sec.is_tor },
      { label: "Crawler", active: !!sec.is_crawler },
      { label: "Hosting", active: !!sec.hosting_facility },
    ];
    const flagged = flags.some((f) => f.active);
    const threat = sec.threat_level ?? "low";

    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg-elev p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="label text-sm font-medium">
              {flagged ? "VPN, proxy or Tor detected" : "No VPN or proxy detected"}
            </span>
          </div>
          <span className="label text-[10px] uppercase tracking-wider text-fg-dim">
            risk: <span className={threatColor(threat)}>{threat}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {flags.map((f) => (
            <Pill key={f.label} active={f.active}>
              {f.label}
            </Pill>
          ))}
          {sec.proxy_type ? <Pill active>{sec.proxy_type}</Pill> : null}
          {sec.vpn_service ? <Pill active>VPN: {sec.vpn_service}</Pill> : null}
        </div>
        {sec.anonymizer_status ? (
          <div className="text-xs text-fg-muted">
            Status: {sec.anonymizer_status}
            {sec.proxy_last_detected ? (
              <span className="text-fg-dim">
                {" "}
                · last seen {sec.proxy_last_detected}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  const verdict = heuristicVpnVerdict(data);
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-bg-elev p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="label text-sm font-medium">
            {verdict.likelyVpn
              ? "Probably a VPN or datacenter"
              : "Looks like a home connection"}
          </span>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-fg-muted">{verdict.reason}</p>
      <p className="text-[11px] leading-relaxed text-fg-dim">
        This is an educated guess based on who owns the address. Confirmed VPN,
        proxy and Tor detection needs a paid ipstack plan.
      </p>
    </div>
  );
}

function Pill({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <span
      className={`label rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
        active
          ? "border-warn/40 bg-warn/10 text-warn"
          : "border-border bg-bg-elev-2 text-fg-dim"
      }`}
    >
      {children}
    </span>
  );
}

function threatColor(level: string) {
  switch (level.toLowerCase()) {
    case "high":
      return "text-danger";
    case "medium":
      return "text-warn";
    default:
      return "text-ok";
  }
}
