from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .advisor import (
    answer_follow_up_question,
    get_academic_plan,
    get_semester_recommendation,
)
from .models import (
    AcademicPlan,
    AcademicPlanRequest,
    FollowUpRequest,
    FollowUpResponse,
    SemesterRecommendation,
    StudentProfile,
)

app = FastAPI(title="AI Academic Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/advise", response_model=SemesterRecommendation)
def advise(profile: StudentProfile) -> SemesterRecommendation:
    return get_semester_recommendation(profile)


@app.post("/academic-plan", response_model=AcademicPlan)
def academic_plan(request: AcademicPlanRequest) -> AcademicPlan:
    return get_academic_plan(request)


@app.post("/follow-up", response_model=FollowUpResponse)
def follow_up(request: FollowUpRequest) -> FollowUpResponse:
    return answer_follow_up_question(request)
