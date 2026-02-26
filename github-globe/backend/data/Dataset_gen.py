import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

np.random.seed(42)

countries = [
    "USA",
    "CHN",
    "RUS",
    "UKR",
    "IRN",
    "PRK",   
    "ISR",
    "IND",
    "BRA",
    "DEU"
]

attack_types = ["DDoS", "Malware", "Intrusion"]

start_date = datetime(2024, 1, 1)
days = 365

data = []

for country in countries:
    base = random.randint(40, 100)

    for i in range(days):
        date = start_date + timedelta(days=i)

        trend_factor = 1 + (i / 365) * random.uniform(0.1, 0.4)
        spike = np.random.choice([0, 1], p=[0.9, 0.1]) * random.randint(50, 150)

        for attack in attack_types:
            count = int(base * trend_factor + spike)
            severity = np.random.uniform(1, 5)

            data.append([
                country,
                date.strftime("%Y-%m-%d"),
                attack,
                count,
                severity
            ])

df = pd.DataFrame(data, columns=[
    "Country", "Date", "Attack_Type", "Attack_Count", "Avg_Severity"
])

os.makedirs("data", exist_ok=True)
df.to_csv("data/cyber_data.csv", index=False)

print("Dataset generated.")