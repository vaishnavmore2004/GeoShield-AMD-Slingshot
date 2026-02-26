export type RiskLevel = "low" | "medium" | "high" | "critical";

export type Country = {
  name: string;
  lat: number;
  lng: number;
  code: string;
  riskLevel: RiskLevel;
  riskScore: number;
  threats: string[];
  stability: number;
  population: string;
  region: string;
};

export const countries: Country[] = [
  {
    name: "United States",
    lat: 39.8,
    lng: -98.5,
    code: "US",
    riskLevel: "low",
    riskScore: 18,
    threats: ["Cyber attacks", "Political polarization"],
    stability: 82,
    population: "331M",
    region: "North America",
  },
  {
    name: "China",
    lat: 35.8,
    lng: 104.1,
    code: "CN",
    riskLevel: "medium",
    riskScore: 52,
    threats: ["Territorial disputes", "Trade tensions", "Cyber warfare"],
    stability: 65,
    population: "1.4B",
    region: "East Asia",
  },
  {
    name: "Russia",
    lat: 61.5,
    lng: 105.3,
    code: "RU",
    riskLevel: "critical",
    riskScore: 89,
    threats: ["Military aggression", "Nuclear threats", "Sanctions evasion"],
    stability: 28,
    population: "144M",
    region: "Eastern Europe",
  },
  {
    name: "Ukraine",
    lat: 48.3,
    lng: 31.1,
    code: "UA",
    riskLevel: "critical",
    riskScore: 95,
    threats: ["Active conflict", "Infrastructure attacks", "Refugee crisis"],
    stability: 15,
    population: "44M",
    region: "Eastern Europe",
  },
  {
    name: "Iran",
    lat: 32.4,
    lng: 53.6,
    code: "IR",
    riskLevel: "high",
    riskScore: 76,
    threats: ["Nuclear program", "Proxy warfare", "Sanctions"],
    stability: 35,
    population: "84M",
    region: "Middle East",
  },
  {
    name: "North Korea",
    lat: 40.3,
    lng: 127.5,
    code: "KP",
    riskLevel: "critical",
    riskScore: 92,
    threats: ["Nuclear weapons", "Missile tests", "Human rights"],
    stability: 20,
    population: "26M",
    region: "East Asia",
  },
  {
    name: "Israel",
    lat: 31.0,
    lng: 34.8,
    code: "IL",
    riskLevel: "high",
    riskScore: 71,
    threats: ["Regional conflict", "Territorial disputes", "Terrorism"],
    stability: 45,
    population: "9.2M",
    region: "Middle East",
  },
  {
    name: "India",
    lat: 20.5,
    lng: 78.9,
    code: "IN",
    riskLevel: "medium",
    riskScore: 41,
    threats: ["Border tensions", "Religious conflict", "Cyber threats"],
    stability: 62,
    population: "1.4B",
    region: "South Asia",
  },
  {
    name: "Brazil",
    lat: -14.2,
    lng: -51.9,
    code: "BR",
    riskLevel: "medium",
    riskScore: 38,
    threats: ["Deforestation crisis", "Political instability", "Crime"],
    stability: 58,
    population: "214M",
    region: "South America",
  },
  {
    name: "Germany",
    lat: 51.1,
    lng: 10.4,
    code: "DE",
    riskLevel: "low",
    riskScore: 15,
    threats: ["Cyber attacks", "Economic uncertainty"],
    stability: 85,
    population: "83M",
    region: "Western Europe",
  },
];

