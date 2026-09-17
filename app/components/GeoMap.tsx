"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, TileLayer, Layer } from "leaflet";
import type { TileLayer } from "leaflet";

type MarkerPoint = {
  lat: number;
  lon: number;
  label: string;
  color: string;
};

interface GeoMapProps {
  ipGeo: MarkerPoint | null;
  browserGeo: MarkerPoint | null;
}

const TILE_URL = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
} as const;

function currentTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function GeoMap({ ipGeo, browserGeo }: GeoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileRef = useRef<TileLayer | null>(null);
  const layersRef = useRef<Layer[]>([]);
  const [ready, setReady] = useState(false);

  // Keep map tiles in sync with the app theme toggle (data-theme).
  useEffect(() => {
    const target = document.documentElement;
    const observer = new MutationObserver(() => {
      tileRef.current?.setUrl(TILE_URL[currentTheme()]);
    });
    observer.observe(target, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Dynamically import Leaflet (avoid SSR)
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (mapRef.current || !containerRef.current) return;

      const L = (await import("leaflet")).default;

      // Inject Leaflet CSS once
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (cancelled) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
      }).setView([5.5, -0.2], 3);

      // Tile layer from CartoDB, matched to the current theme
      tileRef.current = L.tileLayer(TILE_URL[currentTheme()], {
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Minimal attribution in bottom-right
      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" style="color:#71717a">OSM</a> &middot; <a href="https://carto.com/" target="_blank" rel="noopener" style="color:#71717a">CARTO</a>'
        )
        .addTo(map);

      // Zoom control bottom-right
      L.control.zoom({ position: "bottomleft" }).addTo(map);

      mapRef.current = map;
      setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update markers when coords change
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    let isCurrent = true;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      const map = mapRef.current!;

      if (!isCurrent) return;

      // Clear old layers
      layersRef.current.forEach((layer) => map.removeLayer(layer));
      layersRef.current = [];

      const points: MarkerPoint[] = [];
      if (ipGeo) points.push(ipGeo);
      if (browserGeo) points.push(browserGeo);

      if (points.length === 0) return;

      points.forEach((pt) => {
        // Pulsing circle marker
        const circle = L.circleMarker([pt.lat, pt.lon], {
          radius: 8,
          fillColor: pt.color,
          fillOpacity: 0.9,
          color: pt.color,
          weight: 2,
          opacity: 0.5,
        }).addTo(map);

        // Outer glow ring
        const glow = L.circleMarker([pt.lat, pt.lon], {
          radius: 16,
          fillColor: pt.color,
          fillOpacity: 0.15,
          color: pt.color,
          weight: 1,
          opacity: 0.25,
        }).addTo(map);

        // Label tooltip
        circle.bindTooltip(pt.label, {
          permanent: true,
          direction: "top",
          offset: [0, -14],
          className: "geo-map-tooltip",
        });

        layersRef.current.push(circle, glow);
      });

      // Draw connecting line if both markers exist
      if (ipGeo && browserGeo) {
        const line = L.polyline(
          [
            [ipGeo.lat, ipGeo.lon],
            [browserGeo.lat, browserGeo.lon],
          ],
          {
            color: "#f59e0b",
            weight: 2,
            opacity: 0.5,
            dashArray: "6 8",
          }
        ).addTo(map);
        layersRef.current.push(line);
      }

      // Fit bounds
      if (points.length === 2) {
        const bounds = L.latLngBounds(
          points.map((p) => [p.lat, p.lon] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } else {
        map.setView([points[0].lat, points[0].lon], 10);
      }
    }

    updateMarkers();

    return () => {
      isCurrent = false;
    };
  }, [ready, ipGeo, browserGeo]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div
        ref={containerRef}
        className="h-[260px] w-full"
        style={{ background: "var(--bg-elev-2)" }}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mono text-xs text-fg-dim animate-pulse">
            loading map…
          </span>
        </div>
      )}
    </div>
  );
}
