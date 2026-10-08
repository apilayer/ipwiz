"use client";

import { useMemo } from "react";
import type { IPstackResponse } from "@/app/lib/ipstack";
import { GeoMap } from "./GeoMap";
import { ApiBannerCompact } from "./ApiBanner";

export function GeoLocation({ data }: { data: IPstackResponse | null }) {
  const lat = data?.latitude;
  const lon = data?.longitude;

  const marker = useMemo(
    () =>
      lat !== undefined && lon !== undefined
        ? { lat, lon, label: "IP", color: "#ed661d" }
        : null,
    [lat, lon]
  );

  const place = data
    ? [data.city, data.region_name, data.country_name].filter(Boolean).join(", ")
    : "";

  return (
    <section className="rounded-xl border border-border bg-bg-elev">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="label text-[10px] uppercase tracking-wider text-fg-dim">
          location
        </span>
        <span className="label text-xs text-fg-muted">
          where this address is registered
        </span>
      </div>

      <div className="p-5 pb-0">
        <GeoMap ipGeo={marker} />
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Place" value={place || null} />
        <Field
          label="Coordinates"
          value={
            lat !== undefined && lon !== undefined
              ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
              : null
          }
        />
      </div>

      <div className="px-5 pb-5">
        <ApiBannerCompact />
      </div>

      <p className="border-t border-border px-5 py-3 text-xs leading-relaxed text-fg-muted">
        This is where the address is registered, not where your device is. It
        usually gets the country right and often the city, but mobile networks
        and VPNs can put it hundreds of miles off.
      </p>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="label text-[10px] uppercase tracking-wider text-fg-dim">
        {label}
      </span>
      <span className={`text-sm ${value ? "text-fg" : "text-fg-dim"}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}
