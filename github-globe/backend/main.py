from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.predictor import predict_for_country


app = FastAPI(title="GeoShield Cyber Risk API")

# Frontend dev servers (adjust if you use a different port)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    country: str


class PredictResponse(BaseModel):
    country: str
    riskScore: int
    stability: int
    riskLevel: str
    threats: list[str]


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not req.country:
        raise HTTPException(status_code=400, detail="country is required")

    try:
        result = predict_for_country(req.country)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return result