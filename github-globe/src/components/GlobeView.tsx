import { useRef, useEffect, useMemo, useCallback } from "react";
import Globe from "react-globe.gl";
import { Country } from "@/data/countries";

type Props = {
  countries: Country[];
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
};

const riskColorMap: Record<Country["riskLevel"], string> = {
  critical: "rgba(200, 60, 60, 0.9)",
  high: "rgba(220, 140, 40, 0.9)",
  medium: "rgba(210, 190, 50, 0.85)",
  low: "rgba(60, 170, 100, 0.8)",
};

const riskRingColor: Record<Country["riskLevel"], string> = {
  critical: "rgba(200, 60, 60, 0.4)",
  high: "rgba(220, 140, 40, 0.3)",
  medium: "rgba(210, 190, 50, 0.25)",
  low: "rgba(60, 170, 100, 0.2)",
};

const GlobeView = ({ countries, selectedCountry, onCountrySelect }: Props) => {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
      controls.minDistance = 180;
      controls.maxDistance = 500;
    }
  }, []);

  useEffect(() => {
    if (selectedCountry && globeRef.current) {
      globeRef.current.pointOfView(
        { lat: selectedCountry.lat, lng: selectedCountry.lng, altitude: 2 },
        1000
      );
      const controls = globeRef.current.controls();
      controls.autoRotate = false;
    }
  }, [selectedCountry]);

  const pointsData = useMemo(
    () =>
      countries.map((c) => ({
        lat: c.lat,
        lng: c.lng,
        size:
          c.riskLevel === "critical"
            ? 0.6
            : c.riskLevel === "high"
            ? 0.45
            : c.riskLevel === "medium"
            ? 0.3
            : 0.2,
        color: riskColorMap[c.riskLevel],
        country: c,
      })),
    [countries]
  );

  const ringsData = useMemo(
    () =>
      countries
        .filter(
          (c) => c.riskLevel === "critical" || c.riskLevel === "high"
        )
        .map((c) => ({
          lat: c.lat,
          lng: c.lng,
          maxR: c.riskLevel === "critical" ? 5 : 3,
          propagationSpeed: 2,
          repeatPeriod: c.riskLevel === "critical" ? 800 : 1200,
          color: riskRingColor[c.riskLevel],
        })),
    [countries]
  );

  const handlePointClick = useCallback(
    (point: any) => {
      onCountrySelect(point.country);
    },
    [onCountrySelect]
  );

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointAltitude={0.01}
      pointRadius="size"
      pointColor="color"
      pointsMerge={false}
      onPointClick={handlePointClick}
      ringsData={ringsData}
      ringLat="lat"
      ringLng="lng"
      ringMaxRadius="maxR"
      ringPropagationSpeed="propagationSpeed"
      ringRepeatPeriod="repeatPeriod"
      ringColor="color"
      atmosphereColor="hsl(185, 80%, 50%)"
      atmosphereAltitude={0.2}
      animateIn={true}
      width={typeof window !== "undefined" ? window.innerWidth : 1200}
      height={typeof window !== "undefined" ? window.innerHeight : 800}
    />
  );
};

export default GlobeView;

