from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import auth, profile, resume, jobs
from app.routes import learning, progress

from app.models import user, skill, job
from app.models import learning as learning_model

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Job Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(learning.router, prefix="/api/learning", tags=["Learning"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])


@app.get("/")
def root():
    return {"message": "AI Job Platform API is running!"}