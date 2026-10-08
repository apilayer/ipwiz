"use client";

import { useEffect, useRef, useState } from "react";

type MarkerPoint = {
  lat: number;
  lon: number;
  label: string;
  color: string;
};

interface GeoMapProps {
  ipGeo: MarkerPoint | null;
}

import {
  TILE_ATTRIBUTION,
  TILE_FILTER,
  TILE_MAX_ZOOM,
  TILE_URL,
} from "@/app/lib/tiles";

export function GeoMap({ ipGeo }: GeoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const [ready, setReady] = useState(false);

  // The pane carries the tile styling rather than the layer, so it is one
  // assignment at setup. Takes the map explicitly because setup runs before
  // `mapRef.current` is assigned.
  const applyTileFilter = (map?: L.Map | null) => {
    const pane = (map ?? mapRef.current)?.getPane("tilePane");
    if (pane) pane.style.filter = TILE_FILTER;
  };

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

      tileRef.current = L.tileLayer(TILE_URL, {
        maxZoom: TILE_MAX_ZOOM,
      }).addTo(map);
      applyTileFilter(map);

      // Minimal attribution in bottom-right
      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(TILE_ATTRIBUTION)
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

      if (!ipGeo) return;

      // Pulsing circle marker
      const circle = L.circleMarker([ipGeo.lat, ipGeo.lon], {
        radius: 8,
        fillColor: ipGeo.color,
        fillOpacity: 0.9,
        color: ipGeo.color,
        weight: 2,
        opacity: 0.5,
      }).addTo(map);

      // Outer glow ring
      const glow = L.circleMarker([ipGeo.lat, ipGeo.lon], {
        radius: 16,
        fillColor: ipGeo.color,
        fillOpacity: 0.15,
        color: ipGeo.color,
        weight: 1,
        opacity: 0.25,
      }).addTo(map);

      circle.bindTooltip(ipGeo.label, {
        permanent: true,
        direction: "top",
        offset: [0, -14],
        className: "geo-map-tooltip",
      });

      layersRef.current.push(circle, glow);
      map.setView([ipGeo.lat, ipGeo.lon], 10);
    }

    updateMarkers();

    return () => {
      isCurrent = false;
    };
  }, [ready, ipGeo]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div
        ref={containerRef}
        className="h-[260px] w-full"
        style={{ background: "var(--bg-elev-2)" }}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="label text-xs text-fg-dim">
            loading map…
          </span>
        </div>
      )}
    </div>
  );
}
