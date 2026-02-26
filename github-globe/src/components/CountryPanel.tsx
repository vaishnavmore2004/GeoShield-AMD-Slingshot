// import { useState, useMemo } from "react";
// import { Country } from "../data/countries";

// type Props = {
//   countries: Country[];
//   selectedCountry: Country | null;
//   onCountrySelect: (country: Country) => void;
// };

// const riskBadgeClass: Record<string, string> = {
//   critical: "badge badge-critical",
//   high: "badge badge-high",
//   medium: "badge badge-medium",
//   low: "badge badge-low",
// };

// const CountryPanel = ({ countries, selectedCountry, onCountrySelect }: Props) => {
//   const [search, setSearch] = useState("");

//   const filtered = useMemo(
//     () =>
//       countries.filter((c) =>
//         c.name.toLowerCase().includes(search.toLowerCase())
//       ),
//     [countries, search]
//   );

//   return (
//     <div className="glass-panel w-80 max-h-[90vh] p-4 text-xs text-foreground flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide">
//             <span className="shield-icon" />
//             <span>GEOSHIELD</span>
//           </div>
//           <div className="text-[10px] text-muted-foreground mt-1">
//             Global threat telemetry · v1.0
//           </div>
//         </div>
//         <div className="flex items-center gap-1 text-[10px]">
//           <span className="live-dot" />
//           <span className="text-primary font-mono">LIVE</span>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="mb-3">
//         <div className="search-input">
//           <span className="search-icon">⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search country..."
//           />
//         </div>
//       </div>

//       {/* Country List */}
//       <div className="flex-1 overflow-y-auto pr-1 space-y-1 country-list">
//         {filtered.map((country) => (
//           <button
//             key={country.code}
//             onClick={() => onCountrySelect(country)}
//             className={`country-row ${
//               selectedCountry?.code === country.code ? "country-row-active" : ""
//             }`}
//           >
//             <div className="flex flex-col items-start">
//               <span className="text-[11px] truncate">{country.name}</span>
//               <span className="text-[10px] text-muted-foreground">
//                 {country.region}
//               </span>
//             </div>
//             <div className="flex flex-col items-end gap-1">
//               <span className={riskBadgeClass[country.riskLevel]}>
//                 {country.riskLevel.toUpperCase()}
//               </span>
//               <span className="text-[9px] text-muted-foreground font-mono">
//                 Risk {country.riskScore}/100 · Stable {country.stability}%
//               </span>
//             </div>
//           </button>
//         ))}

//         {filtered.length === 0 && (
//           <div className="text-[11px] text-muted-foreground py-4 text-center">
//             No countries match your search.
//           </div>
//         )}
//       </div>

//       {/* Risk Detail */}
//       <div className="pt-3 mt-3 border-t border-border text-[11px]">
//         {selectedCountry ? (
//           <div className="analysis-card">
//             <div className="flex items-center justify-between mb-1">
//               <span className="font-semibold text-[11px]">
//                 Threat analysis · {selectedCountry.name}
//               </span>
//               <span className={riskBadgeClass[selectedCountry.riskLevel]}>
//                 {selectedCountry.riskLevel.toUpperCase()}
//               </span>
//             </div>
//             <div className="text-[10px] text-muted-foreground mb-2">
//               Region {selectedCountry.region} · Population{" "}
//               {selectedCountry.population}
//             </div>
//             <div className="analysis-bars">
//               <div className="analysis-bar">
//                 <span>Risk score</span>
//                 <div className="bar-track">
//                   <div
//                     className="bar-fill bar-fill-primary"
//                     style={{ width: `${selectedCountry.riskScore}%` }}
//                   />
//                 </div>
//               </div>
//               <div className="analysis-bar">
//                 <span>Stability</span>
//                 <div className="bar-track">
//                   <div
//                     className="bar-fill bar-fill-emerald"
//                     style={{ width: `${selectedCountry.stability}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="mt-2 flex flex-wrap gap-1">
//               {selectedCountry.threats.map((t) => (
//                 <span
//                   key={t}
//                   className="text-[10px] font-mono bg-card px-2 py-0.5 rounded border border-border text-secondary-foreground"
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="empty-card">
//             <div className="empty-icon">⚠</div>
//             <div className="text-[11px] text-muted-foreground text-center">
//               Select a country to view threat analysis.
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CountryPanel;
import { useState, useMemo } from "react";
import { Country, RiskLevel } from "../data/countries";

type Prediction = {
  riskScore: number;
  stability: number;
  riskLevel: string;
  threats: string[];
};

type Props = {
  countries: Country[];
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
  prediction: Prediction | null;
  loading: boolean;
  error: string | null;
};

const badgeClass: Record<RiskLevel, string> = {
  critical: "badge badge-critical",
  high: "badge badge-high",
  medium: "badge badge-medium",
  low: "badge badge-low",
};

const pinColor: Record<RiskLevel, string> = {
  critical: "pin pin-critical",
  high: "pin pin-high",
  medium: "pin pin-medium",
  low: "pin pin-low",
};

export default function CountryPanel({
  countries,
  selectedCountry,
  onCountrySelect,
  prediction,
  loading,
  error,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [countries, search]
  );

  return (
    <div className="panel">
      {/* HEADER */}
      <div className="panel-header">
        <div className="logo">
          <div className="shield" />
          <span>GEOSHIELD</span>
        </div>
        <div className="live">
          <span className="live-dot" />
          LIVE
        </div>
      </div>

      {/* SEARCH */}
      <div className="search">
        <input
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* COUNTRY LIST */}
      <div className="country-scroll">
        {filtered.map((country) => (
          <button
            key={country.code}
            onClick={() => onCountrySelect(country)}
            className={`country-item ${
              selectedCountry?.code === country.code
                ? "country-active"
                : ""
            }`}
          >
            <div className="country-left">
              <div className={pinColor[country.riskLevel]} />
              <span>{country.name}</span>
            </div>

            <span className={badgeClass[country.riskLevel]}>
              {country.riskLevel.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* ANALYSIS */}
      <div className="analysis">
        {selectedCountry ? (
          <>
            <div className="analysis-header">
              <span>{selectedCountry.name}</span>
              <span
                className={
                  badgeClass[
                    (prediction?.riskLevel ??
                      selectedCountry.riskLevel) as RiskLevel
                  ]
                }
              >
                {(prediction?.riskLevel ?? selectedCountry.riskLevel).toUpperCase()}
              </span>
            </div>

            {loading && (
              <div className="status-text">Running model...</div>
            )}
            {error && <div className="status-text error">{error}</div>}

            <div className="analysis-grid">
              <div>
                <div className="label">Region</div>
                <div>{selectedCountry.region}</div>
              </div>
              <div>
                <div className="label">Population</div>
                <div>{selectedCountry.population}</div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-row">
                <span>Risk Score</span>
                <span>
                  {(prediction?.riskScore ?? selectedCountry.riskScore)}/100
                </span>
              </div>
              <div className="bar">
                <div
                  className="bar-fill red"
                  style={{
                    width: `${
                      prediction?.riskScore ?? selectedCountry.riskScore
                    }%`,
                  }}
                />
              </div>
            </div>

            { <div className="metric">
              <div className="metric-row">
                <span>Stability</span>
                <span>{selectedCountry.stability}%</span>
              </div>
              <div className="bar">
                <div
                  className="bar-fill cyan"
                  style={{ width: `${selectedCountry.stability}%` }}
                />
              </div>
            </div> }

            <div className="threats">
              {(prediction?.threats ?? selectedCountry.threats).map((t) => (
                <span key={t} className="threat-tag">
                  {t}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="empty">
            ⚠ Select a country to view threat analysis
          </div>
        )}
      </div>
    </div>
  );
}