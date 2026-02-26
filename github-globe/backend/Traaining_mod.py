import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os

df = pd.read_csv("data/cyber_data.csv")
df["Date"] = pd.to_datetime(df["Date"])

countries = df["Country"].unique()

feature_rows = []

for country in countries:
    c_df = df[df["Country"] == country].copy()
    c_df = c_df.groupby("Date").agg({
        "Attack_Count": "sum",
        "Avg_Severity": "mean"
    }).reset_index()

    c_df["last_7d"] = c_df["Attack_Count"].rolling(7).sum()
    c_df["prev_7d"] = c_df["Attack_Count"].shift(7).rolling(7).sum()
    c_df["growth"] = (c_df["last_7d"] - c_df["prev_7d"]) / (c_df["prev_7d"] + 1)
    c_df["baseline"] = c_df["Attack_Count"].rolling(30).mean()
    c_df["spike_ratio"] = c_df["last_7d"] / (c_df["baseline"] * 7 + 1)

    c_df = c_df.dropna()

    for _, row in c_df.iterrows():
        risk_label = 1 if (row["growth"] > 0.2 and row["spike_ratio"] > 1.2) else 0

        feature_rows.append([
            country,
            row["last_7d"],
            row["growth"],
            row["spike_ratio"],
            row["Avg_Severity"],
            risk_label
        ])

features = pd.DataFrame(feature_rows, columns=[
    "Country",
    "last_7d",
    "growth",
    "spike_ratio",
    "severity",
    "risk_label"
])

X = features[["last_7d", "growth", "spike_ratio", "severity"]]
y = features["risk_label"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

risk_model = RandomForestClassifier(n_estimators=100)
risk_model.fit(X_scaled, y)

anomaly_model = IsolationForest(contamination=0.1)
anomaly_model.fit(X_scaled)

os.makedirs("models", exist_ok=True)
joblib.dump(risk_model, "models/risk_model.pkl")
joblib.dump(anomaly_model, "models/anomaly_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")

print("Dynamic model trained.")