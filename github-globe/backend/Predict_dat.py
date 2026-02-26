import pandas as pd
import joblib

risk_model = joblib.load("models/risk_model.pkl")
anomaly_model = joblib.load("models/anomaly_model.pkl")
scaler = joblib.load("models/scaler.pkl")

df = pd.read_csv("data/cyber_data.csv")
df["Date"] = pd.to_datetime(df["Date"])

def predict_country(country):

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
    latest = c_df.iloc[-1]

    # Use the same feature names as training ("severity" not "Avg_Severity")
    X = pd.DataFrame({
        "last_7d": c_df["last_7d"],
        "growth": c_df["growth"],
        "spike_ratio": c_df["spike_ratio"],
        "severity": c_df["Avg_Severity"],
    })

    scaled = scaler.transform(X)
    probs = risk_model.predict_proba(scaled)[:, 1]

    # A single-day probability is often 0; use recent average to get a stable risk score.
    recent_days = 30
    recent_probs = probs[-recent_days:] if len(probs) >= recent_days else probs

    risk_prob = float(recent_probs.mean())
    risk_score = round(risk_prob * 100, 2)

    risk_level = (
        "High" if risk_score > 70
        else "Medium" if risk_score > 40
        else "Low"
    )

    surge = (
        "Surge Likely" if latest["growth"] > 0.2
        else "Declining" if latest["growth"] < -0.1
        else "Stable"
    )

    anomaly_flag = (
        "Anomaly" if anomaly_model.predict(scaled)[-1] == -1
        else "Normal"
    )

    return {
        "Country": country,
        "Risk Score": risk_score,
        "Risk Level": risk_level,
        "Predicted Surge": surge,
        "Anomaly Flag": anomaly_flag
    }


if __name__ == "__main__":
    a=input("Enter Country :")
    print(predict_country(a))