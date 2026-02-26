import { useState, useCallback } from "react";
import GlobeView from "../components/GlobeView";
import CountryPanel from "../components/CountryPanel";
import { countries, Country } from "../data/countries";

type Prediction = {
  riskScore: number;
  stability: number;
  riskLevel: string;
  threats: string[];
};

const API_URL = "http://localhost:8000/predict";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCountrySelect = useCallback(async (country: Country) => {
    setSelectedCountry(country);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: country.code }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = (await res.json()) as Prediction & { country: string };

      setPrediction({
        riskScore: data.riskScore,
        stability: data.stability,
        riskLevel: data.riskLevel,
        threats: data.threats,
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch prediction";
      setError(message);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Globe */}
      <div className="absolute inset-0">
        <GlobeView
          countries={countries}
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
        />
      </div>

      {/* Panel */}
      <div className="absolute top-5 right-5 z-10">
        <CountryPanel
          countries={countries}
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
          prediction={prediction}
          loading={loading}
          error={error}
        />
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel px-4 py-2 flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
        <span>
          THREATS MONITORED:{" "}
          <span className="text-foreground font-bold">{countries.length}</span>
        </span>
        <span className="text-border">|</span>
        <span>
          CRITICAL:{" "}
          <span className="text-risk-critical font-bold">
            {countries.filter((c) => c.riskLevel === "critical").length}
          </span>
        </span>
        <span className="text-border">|</span>
        <span>
          HIGH:{" "}
          <span className="text-risk-high font-bold">
            {countries.filter((c) => c.riskLevel === "high").length}
          </span>
        </span>
        <span className="text-border">|</span>
        <span className="text-primary">SYS OPERATIONAL</span>
      </div>
    </div>
  );
};

export default Index;

