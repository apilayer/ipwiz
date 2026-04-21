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
            <StatusDot color={flagged ? "warn" : "accent"} />
            <span className="mono text-sm font-medium">
              {flagged ? "Anonymizer detected" : "No anonymizer detected"}
            </span>
          </div>
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            threat: <span className={threatColor(threat)}>{threat}</span>
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
          <div className="mono text-xs text-fg-muted">
            anonymizer_status = {sec.anonymizer_status}
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
          <StatusDot color={verdict.likelyVpn ? "warn" : "accent"} />
          <span className="mono text-sm font-medium">
            {verdict.likelyVpn
              ? "Likely VPN / datacenter (heuristic)"
              : "Looks residential (heuristic)"}
          </span>
        </div>
        <span className="mono text-[10px] uppercase tracking-wider text-warn">
          security module off
        </span>
      </div>
      <p className="text-xs leading-relaxed text-fg-muted">{verdict.reason}</p>
      <p className="text-[11px] leading-relaxed text-fg-dim">
        Real VPN/Tor/proxy detection requires the IPstack{" "}
        <span className="mono">security</span> module (Professional plan+).
        Append <span className="mono">&amp;security=1</span> to your request
        once enabled for your key.
      </p>
    </div>
  );
}

function StatusDot({ color }: { color: "accent" | "warn" | "danger" }) {
  const cls =
    color === "accent"
      ? "bg-accent"
      : color === "warn"
        ? "bg-warn"
        : "bg-danger";
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${cls} pulse-dot`} />
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
      className={`mono rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
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
      return "text-accent";
  }
}
