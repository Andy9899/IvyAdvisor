from pydantic import BaseModel, Field


class CompletedCourse(BaseModel):
    course_code: str = Field(..., min_length=3)
    grade: str = Field(..., min_length=1)


class StudentProfile(BaseModel):
    major: str = Field(..., min_length=2)
    year: str = Field(..., min_length=2)
    completed_courses: list[CompletedCourse] = Field(default_factory=list)
    goals: str = Field(..., min_length=5)


class RecommendedCourse(BaseModel):
    class ProfessorOption(BaseModel):
        name: str
        overall_quality: str
        would_take_again: str
        difficulty: str
        ratings_count: str
        department: str
        url: str

    course_code: str
    title: str
    credits: int
    professor: str
    professor_rating: str
    why_this_course: str
    professor_options: list[ProfessorOption] = Field(default_factory=list)


class SemesterRecommendation(BaseModel):
    semester_theme: str
    recommended_courses: list[RecommendedCourse]
    reasoning: list[str]
    accessibility_notes: list[str]
    daily_life_outlook: list[str] = Field(default_factory=list)
    response_mode: str = "grok"


class PlannedCourse(BaseModel):
    course_code: str
    title: str
    credits: int
    notes: str = ""


class PlannedSemester(BaseModel):
    term_label: str
    focus: str
    recommended_courses: list[PlannedCourse]
    total_credits: int


class AcademicPlan(BaseModel):
    plan_title: str
    planning_prompt: str
    semesters: list[PlannedSemester]
    reasoning: list[str]
    accessibility_notes: list[str]
    response_mode: str = "grok"


class AcademicPlanRequest(BaseModel):
    student_profile: StudentProfile
    planning_prompt: str = Field(..., min_length=5)
    existing_semesters: list[PlannedSemester] = Field(default_factory=list)
    max_semesters: int = Field(default=8, ge=1, le=10)


class ChatMessage(BaseModel):
    role: str = Field(..., min_length=4)
    content: str = Field(..., min_length=1)


class FollowUpRequest(BaseModel):
    student_profile: StudentProfile
    recommendation: SemesterRecommendation
    question: str = Field(..., min_length=2)
    chat_history: list[ChatMessage] = Field(default_factory=list)


class FollowUpResponse(BaseModel):
    answer: str
