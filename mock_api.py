from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import time
import random

app = FastAPI(title="RAG Pipeline API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "RAG Pipeline API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "RAG Pipeline System",
        "version": "1.0.0"
    }

@app.post("/query")
async def process_query(request: QueryRequest):
    """
    Process a query through the complete RAG pipeline (mocked to match actual frontend expectations)
    """
    start_time = time.time()
    time.sleep(random.uniform(0.5, 1.2))
    user_input = request.text
    # Use the user's provided sample as the mock response
    response = {
        "user_input": user_input,
        "detected_labels": {
            "threat": 0.4934554994106293,
            "toxic": 0.7
        },
        "search_results": [
            {
                "rank": 1,
                "similarity_score": 0.6099041,
                "text": "I hope you die \n\nI hope you die",
                "labels": {
                    "toxic": 1,
                    "severe_toxic": 0,
                    "obscene": 0,
                    "threat": 1,
                    "insult": 1,
                    "identity_hate": 0
                },
                "primary_emotion": "fear",
                "toxicity_score": 0.5
            },
            {
                "rank": 2,
                "similarity_score": 0.59951216,
                "text": "I'm going to kill you all. \n\nI'm serious. You are all Retarder losers who deserve to die and I'm going to make sure that every single one of you suffers a horrible death.",
                "labels": {
                    "toxic": 1,
                    "severe_toxic": 0,
                    "obscene": 0,
                    "threat": 1,
                    "insult": 0,
                    "identity_hate": 0
                },
                "primary_emotion": "fear",
                "toxicity_score": 0.3333333333333333
            },
            {
                "rank": 3,
                "similarity_score": 0.5851651,
                "text": "you stupid cunt. (Oh, and I fucked your mother last night. I hope you die.",
                "labels": {
                    "toxic": 1,
                    "severe_toxic": 1,
                    "obscene": 1,
                    "threat": 1,
                    "insult": 1,
                    "identity_hate": 0
                },
                "primary_emotion": "fear",
                "toxicity_score": 0.8333333333333334
            }
        ],
        "llm_response": {
            "analysis_type": "rule_based",
            "classification": "offensive",
            "toxicity_ratio": 1.0,
            "user_offensive_words": 3,
            "confidence": "high"
        },
        "processing_info": {
            "confidence_threshold": 0.3,
            "search_limit": 3,
            "use_local_llm": True,
            "similar_examples_found": 3
        }
    }
    return response

if __name__ == "__main__":
    print("Starting RAG Pipeline API...")
    print("API will be available at: http://localhost:8000")
    print("Frontend should be running at: http://localhost:3000")
    uvicorn.run(app, host="0.0.0.0", port=8000)