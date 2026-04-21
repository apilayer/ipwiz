"use client";

import { useState, useMemo } from "react";
import type { IPstackResponse } from "@/app/lib/ipstack";
import { GeoMap } from "./GeoMap";

type BrowserGeo = {
  latitude: number;
  longitude: number;
  accuracy: number;
} | null;

export function GeoCompare({ data }: { data: IPstackResponse | null }) {
  const [geo, setGeo] = useState<BrowserGeo>(null);
  const [state, setState] = useState<"idle" | "asking" | "denied" | "ok">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function request() {
    if (!navigator.geolocation) {
      setState("denied");
      setError("Geolocation API not available in this browser.");
      return;
    }
    setState("asking");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setState("ok");
      },
      (err) => {
        setState("denied");
        setError(err.message);
      },
      { timeout: 8000 }
    );
  }

  const ipLat = data?.latitude;
  const ipLon = data?.longitude;
  const distance =
    geo && ipLat !== undefined && ipLon !== undefined
      ? haversineKm(geo.latitude, geo.longitude, ipLat, ipLon)
      : null;

  const disagree = distance !== null && distance > 50;

  const ipMarker = useMemo(
    () =>
      ipLat !== undefined && ipLon !== undefined
        ? { lat: ipLat, lon: ipLon, label: "IP", color: "#3b82f6" }
        : null,
    [ipLat, ipLon]
  );

  const browserMarker = useMemo(
    () =>
      geo
        ? {
            lat: geo.latitude,
            lon: geo.longitude,
            label: "Browser",
            color: "#22c55e",
          }
        : null,
    [geo]
  );

  return (
    <section className="rounded-xl border border-border bg-bg-elev">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            compare
          </span>
          <span className="mono text-xs text-fg-muted">
            IP geo vs browser geo
          </span>
        </div>
        <button
          onClick={request}
          disabled={state === "asking"}
          className="mono h-8 rounded-md border border-border bg-bg-elev-2 px-3 text-xs text-fg-muted transition hover:text-fg disabled:opacity-50"
        >
          {state === "asking"
            ? "asking…"
            : state === "ok"
              ? "refresh"
              : "request browser location"}
        </button>
      </div>

      {/* Map */}
      <div className="p-5 pb-0">
        <GeoMap ipGeo={ipMarker} browserGeo={browserMarker} />
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Pane
          title="IPstack says"
          lat={ipLat}
          lon={ipLon}
          extra={
            data
              ? [data.city, data.region_name, data.country_name]
                  .filter(Boolean)
                  .join(", ")
              : undefined
          }
          dotColor="#3b82f6"
        />
        <Pane
          title="Your browser says"
          lat={geo?.latitude}
          lon={geo?.longitude}
          extra={
            geo
              ? `±${Math.round(geo.accuracy)} m accuracy`
              : state === "denied"
                ? (error ?? "permission denied")
                : "not requested"
          }
          muted={!geo}
          dotColor="#22c55e"
        />
      </div>
      {distance !== null ? (
        <div
          className={`border-t border-border px-5 py-3 text-xs ${
            disagree ? "text-warn" : "text-accent"
          }`}
        >
          <span className="mono uppercase tracking-wider">
            Δ {distance.toFixed(distance < 10 ? 1 : 0)} km —{" "}
          </span>
          <span className="text-fg-muted">
            {disagree
              ? "significant mismatch. Possible VPN, proxy, or inaccurate IP-geo DB entry."
              : "locations roughly agree."}
          </span>
        </div>
      ) : null}
    </section>
  );
}

function Pane({
  title,
  lat,
  lon,
  extra,
  muted,
  dotColor,
}: {
  title: string;
  lat?: number;
  lon?: number;
  extra?: string;
  muted?: boolean;
  dotColor?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {dotColor && (
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
          />
        )}
        <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
          {title}
        </span>
      </div>
      <span className={`mono text-sm ${muted ? "text-fg-dim" : "text-fg"}`}>
        {lat !== undefined && lon !== undefined
          ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
          : "—"}
      </span>
      {extra ? (
        <span className="truncate text-xs text-fg-muted">{extra}</span>
      ) : null}
    </div>
  );
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
