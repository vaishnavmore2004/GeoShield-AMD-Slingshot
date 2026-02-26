from typing import Any, Dict, List

import numpy as np

# Import the original prediction function from Predict_dat.py,
# which lives in the same backend package directory.
from Predict_dat import predict_country


CODE_MAP: Dict[str, str] = {
    "US": "USA",
    "CN": "CHN",
    "RU": "RUS",
    "UA": "UKR",
    "IR": "IRN",
    "KP": "PRK",
    "IL": "ISR",
    "IN": "IND",
    "BR": "BRA",
    "DE": "DEU",
}


def _normalize_country_code(code: str) -> str:
    code = code.upper()
    return CODE_MAP.get(code, code)


def predict_for_country(country_code: str) -> Dict[str, Any]:
    """
    Call the original Predict_dat.predict_country logic and adapt
    its output to the shape expected by the frontend.
    """
    code3 = _normalize_country_code(country_code)
    base = predict_country(code3)

    risk_score = float(base["Risk Score"])
    stability = float(np.clip(100.0 - risk_score, 0.0, 100.0))

    if risk_score >= 85:
        risk_level = "critical"
    elif risk_score > 70:
        risk_level = "high"
    elif risk_score > 40:
        risk_level = "medium"
    else:
        risk_level = "low"

    threats: List[str] = []

    surge = str(base["Predicted Surge"])
    anomaly_flag = str(base["Anomaly Flag"])

    if surge == "Surge Likely":
        threats.append("Attack surge likely")
    elif surge == "Declining":
        threats.append("Attack volume declining")
    else:
        threats.append("Attack activity stable")

    if anomaly_flag == "Anomaly":
        threats.append("Anomalous pattern detected")
    else:
        threats.append("No anomaly detected")

    if risk_level in ("high", "critical"):
        threats.append("Elevated cyber risk")

    return {
        "country": code3,
        "riskScore": int(round(risk_score)),
        "stability": int(round(stability)),
        "riskLevel": risk_level,
        "threats": threats,
    }

