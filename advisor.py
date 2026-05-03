import json
import logging
import math
import os
from pathlib import Path
import re
from typing import Any

import requests
from dotenv import load_dotenv

from .models import (
    AcademicPlan,
    AcademicPlanRequest,
    FollowUpRequest,
    FollowUpResponse,
    SemesterRecommendation,
    StudentProfile,
)
from .scraper import get_professor_ratings

load_dotenv()
load_dotenv(Path(__file__).with_name(".env"), override=True)

logger = logging.getLogger(__name__)

GROK_API_URL = os.getenv("GROK_API_URL", "https://api.x.ai/v1/chat/completions")
MODEL_NAME = os.getenv("GROK_MODEL", "grok-4.20-reasoning")

ISU_CS_REQUIREMENTS = {
    "major": "Computer Science",
    "required_courses": [
        {
            "course_code": "COM S 227",
            "title": "Object-Oriented Programming",
            "credits": 4,
            "category": "Core Programming",
        },
        {
            "course_code": "COM S 228",
            "title": "Introduction to Data Structures",
            "credits": 4,
            "category": "Core Programming",
        },
        {
            "course_code": "COM S 230",
            "title": "Discrete Computational Structures",
            "credits": 3,
            "category": "Math Foundations",
        },
        {
            "course_code": "COM S 311",
            "title": "Design and Analysis of Algorithms",
            "credits": 3,
            "category": "Theory",
        },
        {
            "course_code": "COM S 319",
            "title": "Construction of User Interfaces",
            "credits": 3,
            "category": "Applications",
        },
        {
            "course_code": "COM S 327",
            "title": "Object-Oriented Analysis and Design",
            "credits": 3,
            "category": "Software Design",
        },
        {
            "course_code": "COM S 331",
            "title": "Theory of Computing",
            "credits": 3,
            "category": "Theory",
        },
        {
            "course_code": "COM S 363",
            "title": "Introduction to Database Management Systems",
            "credits": 3,
            "category": "Applications",
        },
        {
            "course_code": "SE 185",
            "title": "Problem Solving in Software Engineering",
            "credits": 3,
            "category": "Project Skills",
        },
        {
            "course_code": "CPRE 281",
            "title": "Digital Logic",
            "credits": 4,
            "category": "Hardware Foundations",
        },
    ],
    "recommended_load_guidance": {
        "Freshman": "Aim for 12 to 14 credits with one challenging technical course.",
        "Sophomore": "Aim for 13 to 15 credits with a balance of programming and math.",
        "Junior": "Aim for 12 to 15 credits while balancing upper-level theory and applied work.",
        "Senior": "Aim for 12 to 14 credits and prioritize graduation-critical requirements.",
        "Graduate": "Aim for 9 to 12 credits with focus on depth and research alignment.",
    },
}

ACADEMIC_PLAN_COURSE_POOL = [
    {"course_code": "COM S 228", "title": "Introduction to Data Structures", "credits": 4, "category": "Core Programming"},
    {"course_code": "COM S 230", "title": "Discrete Computational Structures", "credits": 3, "category": "Math Foundations"},
    {"course_code": "COM S 3090", "title": "Software Development Practices", "credits": 3, "category": "Software Design"},
    {"course_code": "COM S 311", "title": "Design and Analysis of Algorithms", "credits": 3, "category": "Theory"},
    {"course_code": "COM S 319", "title": "Construction of User Interfaces", "credits": 3, "category": "Applications"},
    {"course_code": "COM S 3210", "title": "Computer Architecture and Machine-Level Programming", "credits": 3, "category": "Systems"},
    {"course_code": "COM S 327", "title": "Object-Oriented Analysis and Design", "credits": 3, "category": "Software Design"},
    {"course_code": "COM S 331", "title": "Theory of Computing", "credits": 3, "category": "Theory"},
    {"course_code": "COM S 3420", "title": "Principles of Programming Languages", "credits": 3, "category": "Theory"},
    {"course_code": "COM S 3520", "title": "Operating Systems", "credits": 3, "category": "Systems"},
    {"course_code": "COM S 3630", "title": "Introduction to Database Systems", "credits": 3, "category": "Applications"},
    {"course_code": "COM S 4020", "title": "Senior Project", "credits": 3, "category": "Capstone"},
    {"course_code": "COM S 4170", "title": "Software Testing", "credits": 3, "category": "Advanced Elective"},
    {"course_code": "COM S 4210", "title": "Software Analysis and Verification", "credits": 3, "category": "Advanced Elective"},
    {"course_code": "COM S 4540", "title": "Distributed Systems", "credits": 3, "category": "Advanced Elective"},
    {"course_code": "COM S 4720", "title": "Artificial Intelligence", "credits": 3, "category": "Advanced Elective"},
    {"course_code": "COM S 4740", "title": "Computational Intelligence", "credits": 3, "category": "Advanced Elective"},
    {"course_code": "COM S 4760", "title": "Numerical Analysis for Scientific Computing", "credits": 3, "category": "Advanced Elective"},
    {"course_code": "CPRE 281", "title": "Digital Logic", "credits": 4, "category": "Hardware Foundations"},
    {"course_code": "MATH 2070", "title": "Matrices and Linear Algebra", "credits": 3, "category": "Math Support"},
    {"course_code": "STAT 3005", "title": "Introduction to Probability and Statistics", "credits": 3, "category": "Statistics"},
    {"course_code": "SPCM 2120", "title": "Fundamentals of Public Speaking", "credits": 3, "category": "Communication"},
    {"course_code": "PHYS 2310", "title": "General Physics I", "credits": 4, "category": "Science Sequence"},
    {"course_code": "PHYS 2310L", "title": "General Physics I Laboratory", "credits": 1, "category": "Science Sequence"},
    {"course_code": "PHYS 2320", "title": "General Physics II", "credits": 4, "category": "Science Sequence"},
    {"course_code": "PHYS 2320L", "title": "General Physics II Laboratory", "credits": 1, "category": "Science Sequence"},
    {"course_code": "PHIL 3430", "title": "Philosophy of Technology", "credits": 3, "category": "Arts and Humanities"},
    {"course_code": "HIST 2020", "title": "Introduction to World History Since 1500", "credits": 3, "category": "International Perspectives"},
    {"course_code": "ECON 1010", "title": "Principles of Microeconomics", "credits": 3, "category": "Social Science"},
    {"course_code": "SOC 1340", "title": "Introduction to Sociology", "credits": 3, "category": "U.S. Cultures and Communities"},
    {"course_code": "SPAN 1010", "title": "Elementary Spanish I", "credits": 4, "category": "World Language"},
    {"course_code": "SPAN 1020", "title": "Elementary Spanish II", "credits": 4, "category": "World Language"},
    {"course_code": "PSYCH 1010", "title": "Introduction to Psychology", "credits": 3, "category": "Social Science"},
    {"course_code": "THTRE 1060", "title": "Introduction to the Theatre", "credits": 3, "category": "Arts and Humanities"},
    {"course_code": "GEOG 1200", "title": "Maps, Culture, and Society", "credits": 3, "category": "International Perspectives"},
    {"course_code": "MUSIC 1020", "title": "Introduction to Music Listening", "credits": 3, "category": "Arts and Humanities"},
]

COURSE_PREREQUISITES: dict[str, dict[str, Any]] = {
    "COM S 227": {
        "all_of_any": [
            ["COM S 127", "CPRE 185", "SE 185", "COM S 207", "MIS 207", "EE 285", "MTEOR 227", "ME 160"],
            ["MATH 143", "MATH 165", "MATH 166", "MATH 207"],
        ]
    },
    "COM S 228": {
        "all_of": ["COM S 227", "MATH 165"],
    },
    "COM S 230": {
        "all_of": ["COM S 227", "MATH 165", "ENGL 150"],
    },
    "COM S 311": {
        "all_of": ["COM S 228", "MATH 166"],
        "all_of_any": [["COM S 230", "CPRE 310"]],
    },
    "COM S 319": {
        "all_of": ["COM S 228"],
    },
    "COM S 327": {
        "all_of": ["COM S 228", "MATH 165"],
    },
    "COM S 331": {
        "all_of": ["COM S 228", "MATH 166", "ENGL 250"],
        "all_of_any": [["COM S 230", "CPRE 310"]],
    },
    "COM S 363": {
        "all_of": ["COM S 228", "MATH 165", "ENGL 250"],
    },
    "COM S 3090": {
        "all_of": ["COM S 228", "MATH 165"],
    },
    "COM S 3210": {
        "all_of": ["COM S 228", "MATH 165", "ENGL 250"],
    },
    "COM S 3420": {
        "all_of": ["COM S 228", "MATH 165"],
    },
    "COM S 3520": {
        "all_of": ["COM S 321", "COM S 309"],
    },
    "COM S 4020": {
        "all_of": ["COM S 309", "COM S 327", "ENGL 250"],
    },
    "COM S 4170": {
        "all_of": ["COM S 309", "COM S 327"],
    },
    "COM S 4210": {
        "all_of": ["COM S 311", "COM S 331"],
    },
    "COM S 4540": {
        "all_of": ["COM S 321", "COM S 352"],
    },
    "COM S 4720": {
        "all_of": ["COM S 311"],
    },
    "COM S 4740": {
        "all_of": ["COM S 311"],
    },
    "COM S 4760": {
        "all_of": ["COM S 311"],
    },
    "CPRE 281": {
        "sophomore_or_higher": True,
    },
    "PHYS 2310L": {
        "all_of": ["PHYS 231"],
    },
    "PHYS 2320": {
        "all_of": ["PHYS 231"],
    },
    "PHYS 2320L": {
        "all_of": ["PHYS 232"],
    },
    "SPAN 1020": {
        "all_of": ["SPAN 101"],
    },
}

YEAR_ORDER = {
    "Freshman": 1,
    "Sophomore": 2,
    "Junior": 3,
    "Senior": 4,
    "Graduate": 5,
}

DEFAULT_YEAR_TARGET_CREDITS = {
    "Freshman": 13,
    "Sophomore": 14,
    "Junior": 14,
    "Senior": 13,
    "Graduate": 10,
}

ARTS_HUMANITIES_PREFIXES = ("ART", "ARCH", "CLST", "ENGL", "HIST", "MUS", "PHIL", "RELIG", "THTRE", "LDST", "LING")
SOCIAL_SCIENCE_PREFIXES = ("ANTHR", "CJST", "ECON", "GEOG", "HDFS", "POLS", "PSYCH", "SOC", "WGSS")
WORLD_LANGUAGE_PREFIXES = ("ARAB", "CHIN", "CLST", "FREN", "GER", "GREEK", "ITAL", "JAPAN", "LATIN", "PORT", "RUSS", "SPAN")
USCC_PREFIXES = ("AFAM", "AMIN", "HIST", "SOC", "WGSS", "CJST")
INTERNATIONAL_PREFIXES = ("HIST", "GEOG", "POLS", "ARAB", "CHIN", "FREN", "GER", "JAPAN", "RUSS", "SPAN")

REQUIRED_PLAN_SEQUENCE = [
    "COM S 228",
    "COM S 230",
    "CPRE 281",
    "COM S 3090",
    "COM S 311",
    "COM S 319",
    "COM S 3210",
    "COM S 327",
    "COM S 331",
    "COM S 3420",
    "COM S 3520",
    "COM S 3630",
    "COM S 4020",
    "MATH 2070",
    "STAT 3005",
    "SPCM 2120",
    "PHYS 2310",
    "PHYS 2310L",
    "PHYS 2320",
    "PHYS 2320L",
]

ADVANCED_ELECTIVE_SEQUENCE = [
    "COM S 4170",
    "COM S 4210",
    "COM S 4540",
    "COM S 4720",
    "COM S 4740",
    "COM S 4760",
]

ARTS_HUMANITIES_SEQUENCE = ["PHIL 3430", "THTRE 1060", "MUSIC 1020"]
SOCIAL_SCIENCE_SEQUENCE = ["ECON 1010", "SOC 1340", "PSYCH 1010"]
WORLD_LANGUAGE_SEQUENCE = ["SPAN 1010", "SPAN 1020"]
INTERNATIONAL_SEQUENCE = ["HIST 2020", "GEOG 1200"]


def _extract_credit_cap(profile: StudentProfile) -> int | None:
    goals_text = profile.goals.lower()
    explicit_max = re.search(r"maximum\s+credits:\s*(\d{1,2})", goals_text)
    if explicit_max:
        return max(6, min(21, int(explicit_max.group(1))))

    under_match = re.search(r"under\s+(\d{1,2})\s*credits?", goals_text)
    if under_match:
        return max(6, min(21, int(under_match.group(1))))

    at_most_match = re.search(r"(?:at\s+most|no\s+more\s+than|max(?:imum)?\s+of)\s+(\d{1,2})\s*credits?", goals_text)
    if at_most_match:
        return max(6, min(21, int(at_most_match.group(1))))

    return None


def _build_system_prompt() -> str:
    return (
        "You are an AI academic advisor for Iowa State University students. "
        "Return helpful, encouraging, accessibility-aware semester recommendations. "
        "Always prioritize realistic workload, clear explanations, and prerequisites. "
        "Respond with valid JSON only."
    )


def _build_follow_up_system_prompt() -> str:
    return (
        "You are an AI academic advisor for Iowa State University students. "
        "Answer follow-up questions about a previously recommended schedule. "
        "Be supportive, concrete, and accessibility-aware. "
        "Use plain language. Keep answers concise but helpful."
    )


def _build_user_prompt(profile: StudentProfile) -> str:
    completed = [course.model_dump() for course in profile.completed_courses]
    degree_requirements = _requirements_with_professor_options()
    payload = {
        "student_profile": profile.model_dump(),
        "degree_requirements": degree_requirements,
        "response_schema": {
            "semester_theme": "short string",
            "recommended_courses": [
                {
                    "course_code": "string",
                    "title": "string",
                    "credits": 0,
                    "professor": "string",
                    "professor_rating": "string",
                    "why_this_course": "string",
                }
            ],
            "reasoning": ["string"],
            "accessibility_notes": ["string"],
            "daily_life_outlook": ["string"],
        },
        "advisor_instructions": [
            "Recommend 4 to 5 courses for next semester.",
            "Do not recommend courses already completed.",
            "Use only courses from the provided hardcoded requirement data unless you clearly label something as an elective placeholder.",
            "When professor_options are provided for a course, treat them as likely or recent RateMyProfessors options, not guaranteed current section assignments.",
            "Make the reasoning plain-language and student-friendly.",
            "Include accessibility-aware notes such as workload pacing, study planning, or how to talk with instructors and advisors.",
            "Include 2 to 4 plain-language bullets describing what the student's weekly life may feel like with this schedule.",
            "If the student major is not Computer Science, still give your best effort using the provided course list and mention that the requirement map is currently CS-only.",
        ],
        "completed_courses_snapshot": completed,
    }
    return json.dumps(payload, indent=2)


def _build_follow_up_prompt(request: FollowUpRequest) -> str:
    payload = {
        "student_profile": request.student_profile.model_dump(),
        "current_recommendation": request.recommendation.model_dump(),
        "question": request.question,
        "chat_history": [message.model_dump() for message in request.chat_history[-8:]],
        "advisor_instructions": [
            "Answer the student's specific question about the recommended schedule.",
            "Stay consistent with the previously recommended courses unless the question explicitly asks for alternatives or changes.",
            "If the student asks for a lighter workload, recommend swapping or postponing the hardest or heaviest course first, not the easiest one.",
            "If the student asks about internships, workload, prerequisites, or sequencing, answer directly and clearly.",
            "Use plain-language accessibility-first explanations.",
            "Do not return JSON. Return plain text only.",
        ],
    }
    return json.dumps(payload, indent=2)


def _build_academic_plan_prompt(request: AcademicPlanRequest) -> str:
    degree_requirements = _requirements_with_professor_options()
    payload = {
        "student_profile": request.student_profile.model_dump(),
        "planning_prompt": request.planning_prompt,
        "existing_semesters": [semester.model_dump() for semester in request.existing_semesters],
        "max_semesters": request.max_semesters,
        "degree_requirements": degree_requirements,
        "response_schema": {
            "plan_title": "string",
            "planning_prompt": "string",
            "semesters": [
                {
                    "term_label": "string",
                    "focus": "string",
                    "recommended_courses": [
                        {
                            "course_code": "string",
                            "title": "string",
                            "credits": 0,
                            "notes": "string",
                        }
                    ],
                    "total_credits": 0,
                }
            ],
            "reasoning": ["string"],
            "accessibility_notes": ["string"],
        },
        "advisor_instructions": [
            "Build a multi-semester academic plan based on the student's goals.",
            "Preserve any existing semesters exactly as already completed or manually entered history.",
            "Respect completed courses and prerequisites.",
            "Use the hardcoded Computer Science requirements as the current degree map.",
            "Keep the plan realistic and easy to understand.",
            "By default, produce a full 8-semester roadmap unless the request explicitly asks for a different count.",
            "Fill the remaining semesters up to the requested maximum semester count, but never exceed 10 total semesters.",
            "Use only valid JSON.",
        ],
    }
    return json.dumps(payload, indent=2)


def _requirements_with_professor_options() -> dict[str, Any]:
    enriched_courses: list[dict[str, Any]] = []

    for course in ISU_CS_REQUIREMENTS["required_courses"]:
        professor_options = get_professor_ratings(course["course_code"])
        enriched_courses.append({**course, "professor_options": professor_options})

    return {
        **ISU_CS_REQUIREMENTS,
        "required_courses": enriched_courses,
    }


def _normalize_course_code(value: str) -> str:
    return re.sub(r"[^A-Z0-9]", "", value.upper())


def _student_completed_code_set(profile: StudentProfile) -> set[str]:
    codes: set[str] = set()

    for course in profile.completed_courses:
        raw = course.course_code.strip()
        if not raw:
            continue

        normalized = _normalize_course_code(raw)
        codes.add(normalized)

        digits = re.search(r"(\d{3,4})", normalized)
        subject = re.sub(r"\d+", "", normalized)
        if digits and subject:
            number = digits.group(1)
            codes.add(f"{subject}{number}")
            if len(number) == 4 and number.endswith("0"):
                codes.add(f"{subject}{number[:-1]}")
            elif len(number) == 3:
                codes.add(f"{subject}{number}0")

    return codes


def _completed_requirement(completed_codes: set[str], requirement: str) -> bool:
    target = _normalize_course_code(requirement)
    if target in completed_codes:
        return True

    digits = re.search(r"(\d{3,4})", target)
    subject = re.sub(r"\d+", "", target)
    if digits and subject:
        number = digits.group(1)
        variants = {f"{subject}{number}"}
        if len(number) == 4 and number.endswith("0"):
            variants.add(f"{subject}{number[:-1]}")
        elif len(number) == 3:
            variants.add(f"{subject}{number}0")
        return any(variant in completed_codes for variant in variants)

    return False


def _course_is_eligible_for_student(profile: StudentProfile, course_code: str) -> bool:
    rules = COURSE_PREREQUISITES.get(course_code.upper())
    if not rules:
        return True

    completed_codes = _student_completed_code_set(profile)

    if rules.get("sophomore_or_higher"):
        if YEAR_ORDER.get(profile.year, 0) < YEAR_ORDER["Sophomore"]:
            return False

    if any(
        not _completed_requirement(completed_codes, required_code)
        for required_code in rules.get("all_of", [])
    ):
        return False

    for requirement_group in rules.get("all_of_any", []):
        if not any(_completed_requirement(completed_codes, option) for option in requirement_group):
            return False

    return True


def _eligible_required_courses(profile: StudentProfile) -> list[dict[str, Any]]:
    completed_codes = _student_completed_code_set(profile)
    eligible: list[dict[str, Any]] = []

    for course in ISU_CS_REQUIREMENTS["required_courses"]:
        if _completed_requirement(completed_codes, course["course_code"]):
            continue
        if _course_is_eligible_for_student(profile, course["course_code"]):
            eligible.append(course)

    return eligible


def _academic_plan_pool() -> list[dict[str, Any]]:
    combined: list[dict[str, Any]] = []
    seen_codes: set[str] = set()

    for course in [*ISU_CS_REQUIREMENTS["required_courses"], *ACADEMIC_PLAN_COURSE_POOL]:
        code = course["course_code"].upper()
        if code in seen_codes:
            continue
        combined.append(course)
        seen_codes.add(code)

    return combined


def _planned_course_code_set(planned_courses: list[dict[str, Any]]) -> set[str]:
    return {_normalize_course_code(course["course_code"]) for course in planned_courses if course.get("course_code")}


def _combined_course_codes(profile: StudentProfile, planned_courses: list[dict[str, Any]]) -> set[str]:
    return _student_completed_code_set(profile) | _planned_course_code_set(planned_courses)


def _course_starts_with_prefix(course_code: str, prefixes: tuple[str, ...]) -> bool:
    normalized = _normalize_course_code(course_code)
    return any(normalized.startswith(prefix) for prefix in prefixes)


def _count_courses_by_prefix(courses: list[dict[str, Any]], prefixes: tuple[str, ...]) -> int:
    return sum(1 for course in courses if _course_starts_with_prefix(course["course_code"], prefixes))


def _find_course_payload(course_code: str) -> dict[str, Any] | None:
    target = _normalize_course_code(course_code)
    for course in _academic_plan_pool():
        if _normalize_course_code(course["course_code"]) == target:
            return course
    return None


def _add_missing_sequence_targets(
    targets: list[dict[str, Any]],
    combined_codes: set[str],
    sequence: list[str],
    minimum_count: int | None = None,
    current_count: int = 0,
) -> None:
    remaining_needed = None if minimum_count is None else max(0, minimum_count - current_count)

    for course_code in sequence:
        if remaining_needed == 0:
            break
        if _normalize_course_code(course_code) in combined_codes:
            continue
        payload = _find_course_payload(course_code)
        if not payload:
            continue
        targets.append(payload)
        combined_codes.add(_normalize_course_code(course_code))
        if remaining_needed is not None:
            remaining_needed -= 1


def _eligible_academic_plan_courses(
    profile: StudentProfile,
    planned_courses: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    completed_codes = _student_completed_code_set(profile)
    planned_codes = _planned_course_code_set(planned_courses)
    eligible: list[dict[str, Any]] = []

    for course in _academic_plan_pool():
        normalized_code = _normalize_course_code(course["course_code"])
        if normalized_code in completed_codes or normalized_code in planned_codes:
            continue
        if _course_is_eligible_for_student(profile, course["course_code"]):
            eligible.append(course)

    return eligible


def _remaining_degree_completion_targets(
    profile: StudentProfile,
    planned_courses: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    combined_codes = _combined_course_codes(profile, planned_courses)
    combined_courses = [*profile.completed_courses, *planned_courses]
    normalized_combined = [
        {"course_code": course.course_code, "grade": getattr(course, "grade", "IP")}
        if hasattr(course, "course_code")
        else {"course_code": course["course_code"], "grade": course.get("grade", "IP")}
        for course in combined_courses
    ]
    targets: list[dict[str, Any]] = []

    _add_missing_sequence_targets(targets, combined_codes, REQUIRED_PLAN_SEQUENCE)

    advanced_completed = sum(
        1
        for course in normalized_combined
        if _completed_requirement(
            combined_codes,
            course["course_code"],
        )
        and any(
            _normalize_course_code(course["course_code"]) == _normalize_course_code(candidate)
            for candidate in ADVANCED_ELECTIVE_SEQUENCE
        )
    )
    _add_missing_sequence_targets(
        targets,
        combined_codes,
        ADVANCED_ELECTIVE_SEQUENCE,
        minimum_count=5,
        current_count=advanced_completed,
    )

    arts_count = _count_courses_by_prefix(normalized_combined, ARTS_HUMANITIES_PREFIXES)
    _add_missing_sequence_targets(
        targets,
        combined_codes,
        ARTS_HUMANITIES_SEQUENCE,
        minimum_count=4,
        current_count=arts_count,
    )

    social_count = _count_courses_by_prefix(normalized_combined, SOCIAL_SCIENCE_PREFIXES)
    _add_missing_sequence_targets(
        targets,
        combined_codes,
        SOCIAL_SCIENCE_SEQUENCE,
        minimum_count=3,
        current_count=social_count,
    )

    language_count = _count_courses_by_prefix(normalized_combined, WORLD_LANGUAGE_PREFIXES)
    _add_missing_sequence_targets(
        targets,
        combined_codes,
        WORLD_LANGUAGE_SEQUENCE,
        minimum_count=2,
        current_count=language_count,
    )

    uscc_count = _count_courses_by_prefix(normalized_combined, USCC_PREFIXES)
    if uscc_count < 1:
        _add_missing_sequence_targets(
            targets,
            combined_codes,
            ["SOC 1340"],
            minimum_count=1,
            current_count=uscc_count,
        )

    international_count = _count_courses_by_prefix(normalized_combined, INTERNATIONAL_PREFIXES)
    _add_missing_sequence_targets(
        targets,
        combined_codes,
        INTERNATIONAL_SEQUENCE,
        minimum_count=1,
        current_count=international_count,
    )

    return targets


def _target_credit_load(profile: StudentProfile) -> int:
    goals_text = profile.goals.lower()
    explicit_max = _extract_credit_cap(profile)
    explicit_target = re.search(r"(?:around|about|target|aim\s+for|want)\s+(\d{1,2})\s*credits?", goals_text)
    if explicit_target:
        requested = int(explicit_target.group(1))
        target = max(9, min(21, requested))
        return min(target, explicit_max) if explicit_max is not None else target

    direct_match = re.search(r"(\d{1,2})\s*credits?", goals_text)
    if direct_match:
        requested = int(direct_match.group(1))
        target = max(9, min(21, requested))
        return min(target, explicit_max) if explicit_max is not None else target

    if "heavy" in goals_text:
        target = 16
        return min(target, explicit_max) if explicit_max is not None else target
    if "light" in goals_text or "manageable" in goals_text:
        target = 12
        return min(target, explicit_max) if explicit_max is not None else target

    target = DEFAULT_YEAR_TARGET_CREDITS.get(profile.year, 14)
    return min(target, explicit_max) if explicit_max is not None else target


def _build_elective_placeholders(profile: StudentProfile) -> list[dict[str, Any]]:
    goals_text = profile.goals.lower()
    placeholders: list[dict[str, Any]] = []

    if "internship" in goals_text or "career" in goals_text or "job" in goals_text:
        placeholders.append(
            {
                "course_code": "TECH ELECTIVE",
                "title": "Career-Aligned Technical Elective Placeholder",
                "credits": 3,
                "category": "Elective Planning",
                "professor": "Advisor review needed",
                "professor_rating": "Varies by section",
                "why_this_course": (
                    "This placeholder gives you room for an eligible technical elective that supports internship or career preparation once section data is confirmed."
                ),
            }
        )

    placeholders.extend(
        [
            {
                "course_code": "GEN ED ELECTIVE",
                "title": "General Education Elective Placeholder",
                "credits": 3,
                "category": "General Education",
                "professor": "Advisor review needed",
                "professor_rating": "Varies by section",
                "why_this_course": (
                    "This placeholder helps you reach your requested credit load while keeping the semester flexible and manageable."
                ),
            },
            {
                "course_code": "COMM / WRITING ELECTIVE",
                "title": "Communication or Writing Elective Placeholder",
                "credits": 3,
                "category": "Communication Support",
                "professor": "Advisor review needed",
                "professor_rating": "Varies by section",
                "why_this_course": (
                    "This placeholder can be swapped for an approved communication or writing-support course that fits your timeline and remaining requirements."
                ),
            },
            {
                "course_code": "OPEN ELECTIVE",
                "title": "Open Elective Placeholder",
                "credits": 3,
                "category": "Flexible Credits",
                "professor": "Advisor review needed",
                "professor_rating": "Varies by section",
                "why_this_course": (
                    "This placeholder adds flexible credits when your target semester load is higher than the currently eligible hardcoded CS requirement list can support."
                ),
            },
        ]
    )
    return placeholders


def _build_credit_aligned_schedule(
    profile: StudentProfile,
    candidate_courses: list[dict[str, Any]],
    target_count: int | None = None,
    target_credits_override: int | None = None,
    min_target_override: int | None = None,
) -> list[dict[str, Any]]:
    target_credits = target_credits_override or _target_credit_load(profile)
    credit_cap = _extract_credit_cap(profile) or target_credits
    min_target = min_target_override or max(9, target_credits - 1)
    max_count = target_count or (6 if target_credits >= 16 else 5)
    schedule: list[dict[str, Any]] = []
    seen_codes: set[str] = set()
    current_credits = 0

    for course in candidate_courses:
        code = course["course_code"].upper()
        if code in seen_codes:
            continue
        proposed_credits = current_credits + int(course["credits"])
        if schedule and proposed_credits > credit_cap:
            continue
        schedule.append(course)
        seen_codes.add(code)
        current_credits = proposed_credits
        if current_credits >= min(min_target, credit_cap) or len(schedule) >= max_count:
            break

    if current_credits < min(min_target, credit_cap) and len(schedule) < max_count:
        for placeholder in _build_elective_placeholders(profile):
            code = placeholder["course_code"].upper()
            if code in seen_codes:
                continue
            proposed_credits = current_credits + int(placeholder["credits"])
            if schedule and proposed_credits > credit_cap:
                continue
            schedule.append(placeholder)
            seen_codes.add(code)
            current_credits = proposed_credits
            if current_credits >= min(min_target, credit_cap) or len(schedule) >= max_count:
                break

    return schedule


def _fill_valid_recommended_courses(
    profile: StudentProfile,
    courses: list[dict[str, Any]],
    target_count: int,
) -> list[dict[str, Any]]:
    valid_courses: list[dict[str, Any]] = []
    seen_codes: set[str] = set()

    for course in courses:
        code = course["course_code"].upper()
        if code in seen_codes:
            continue
        if not _course_is_eligible_for_student(profile, code):
            continue
        valid_courses.append(course)
        seen_codes.add(code)

    for course in _eligible_required_courses(profile):
        code = course["course_code"].upper()
        if code in seen_codes:
            continue
        valid_courses.append(course)
        seen_codes.add(code)

    aligned_courses = _build_credit_aligned_schedule(profile, valid_courses, target_count=target_count)
    return [_attach_professor_options_to_course(course) for course in aligned_courses]


def _format_professor_rating(professor: dict[str, Any]) -> str:
    quality = professor.get("overall_quality", "N/A")
    count = professor.get("ratings_count", "0")
    difficulty = professor.get("difficulty", "N/A")
    would_take_again = professor.get("would_take_again", "N/A")
    return (
        f"{quality}/5 on RateMyProfessors "
        f"({count} ratings, difficulty {difficulty}, would take again {would_take_again})"
    )


def _difficulty_score_from_rating(rating: str) -> float:
    match = re.search(r"difficulty ([0-9.]+)", rating or "", re.IGNORECASE)
    if match:
        return float(match.group(1))
    return 0.0


def _build_daily_life_outlook(profile: StudentProfile, courses: list[dict[str, Any]]) -> list[str]:
    total_credits = sum(int(course.get("credits", 0)) for course in courses)
    technical_courses = [
        course for course in courses
        if course["course_code"].upper().startswith(("COM S", "COMS", "CPRE", "SE", "MATH", "STAT", "PHYS"))
    ]
    heaviest_course = max(
        courses,
        key=lambda course: _difficulty_score_from_rating(course.get("professor_rating", "")) or int(course.get("credits", 0)),
        default=None,
    )
    outlook: list[str] = []

    if total_credits >= 16:
        outlook.append(
            "This will likely feel like a full semester: expect most weekdays to include some class prep, homework, or project work even if your calendar is not packed every hour."
        )
    elif total_credits >= 13:
        outlook.append(
            "This should feel steady but manageable for most weeks, with regular coursework pressure rather than an all-out survival semester."
        )
    else:
        outlook.append(
            "This looks like a lighter semester overall, which should leave more room for rest, work, or extracurricular commitments if you use your time consistently."
        )

    if len(technical_courses) >= 4:
        outlook.append(
            "Because several of these classes are technical, the week-to-week experience will probably depend on starting assignments early and not letting multiple deadlines bunch up at once."
        )
    elif len(technical_courses) >= 2:
        outlook.append(
            "You will probably have a mix of technical problem-solving and lighter reading or writing work, which can make the semester feel more balanced if you spread tasks across the week."
        )
    else:
        outlook.append(
            "The mix here looks fairly flexible, so the semester may feel more about staying organized than constantly reacting to heavy technical deadlines."
        )

    if heaviest_course:
        outlook.append(
            f"The course most likely to shape your daily routine is {heaviest_course['course_code']}, so plan for that class to set the tone for office hours, study blocks, and when you need to start work early."
        )

    if "avoid 8am classes: yes" in profile.goals.lower():
        outlook.append(
            "Since you prefer avoiding early mornings, a good version of this semester probably means protecting your sleep schedule and using late-morning or afternoon time blocks for your hardest work."
        )
    else:
        outlook.append(
            "A good rhythm for this semester will probably come from setting aside a few consistent weekly work blocks instead of trying to catch up all at once before deadlines."
        )

    return outlook[:4]


def _top_professor_for_course(course_code: str) -> dict[str, Any] | None:
    options = get_professor_ratings(course_code)
    return options[0] if options else None


def _attach_professor_options_to_course(course_payload: dict[str, Any]) -> dict[str, Any]:
    options = get_professor_ratings(course_payload["course_code"])
    updated_payload = {**course_payload, "professor_options": options}

    if not options:
        return updated_payload

    top_professor = options[0]
    if not updated_payload.get("professor") or updated_payload["professor"] == "Professor data coming soon":
        updated_payload["professor"] = top_professor["name"]
    if not updated_payload.get("professor_rating") or updated_payload["professor_rating"] in {
        "TBD",
        "N/A",
        "RateMyProfessors data unavailable",
    }:
        updated_payload["professor_rating"] = _format_professor_rating(top_professor)

    return updated_payload


def _apply_professor_data(recommendation: SemesterRecommendation) -> SemesterRecommendation:
    updated_courses: list[dict[str, Any]] = []

    for course in recommendation.recommended_courses:
        updated_courses.append(_attach_professor_options_to_course(course.model_dump()))

    updated_payload = recommendation.model_dump()
    updated_payload["recommended_courses"] = updated_courses
    return SemesterRecommendation.model_validate(updated_payload)


def _fallback_recommendation(profile: StudentProfile) -> SemesterRecommendation:
    selected_courses = _build_credit_aligned_schedule(
        profile,
        _eligible_required_courses(profile),
    )
    total_credits = sum(int(course["credits"]) for course in selected_courses)

    return SemesterRecommendation.model_validate(
        {
            "semester_theme": "Balanced progress toward core CS requirements",
            "recommended_courses": [
                _attach_professor_options_to_course(
                    {
                        **course,
                        "professor": (
                            _top_professor_for_course(course["course_code"])["name"]
                            if _top_professor_for_course(course["course_code"])
                            else "Professor data unavailable"
                        ),
                        "professor_rating": (
                            _format_professor_rating(_top_professor_for_course(course["course_code"]))
                            if _top_professor_for_course(course["course_code"])
                            else "RateMyProfessors data unavailable"
                        ),
                        "why_this_course": (
                            f"{course['course_code']} helps move you forward in the "
                            f"{course['category'].lower()} area while keeping your next semester focused."
                        ),
                    }
                )
                for course in selected_courses
            ],
            "reasoning": [
                "The schedule focuses on unfinished core requirements that you are currently eligible to take.",
                f"Your stated goal was considered: {profile.goals}",
                f"The plan was adjusted toward a target load of about {_target_credit_load(profile)} credits and currently totals {total_credits} credits.",
                ISU_CS_REQUIREMENTS["recommended_load_guidance"].get(
                    profile.year,
                    "Aim for a manageable semester with steady progress.",
                ),
            ],
            "accessibility_notes": [
                "Try pairing reading-heavy classes with at most one highly technical project course.",
                "Ask instructors early about office hours, assignment pacing, and accessible learning supports.",
                "Review the plan with an academic advisor before registration opens.",
            ],
            "daily_life_outlook": _build_daily_life_outlook(
                profile,
                [
                    _attach_professor_options_to_course(
                        {
                            **course,
                            "professor": (
                                _top_professor_for_course(course["course_code"])["name"]
                                if _top_professor_for_course(course["course_code"])
                                else "Professor data unavailable"
                            ),
                            "professor_rating": (
                                _format_professor_rating(_top_professor_for_course(course["course_code"]))
                                if _top_professor_for_course(course["course_code"])
                                else "RateMyProfessors data unavailable"
                            ),
                        }
                    )
                    for course in selected_courses
                ],
            ),
            "response_mode": "demo",
        }
    )


def _course_note_for_plan(course: dict[str, Any]) -> str:
    return (
        f"{course['course_code']} supports your progress in "
        f"{course.get('category', 'degree planning').lower()} and fits the current planning sequence."
    )


def _build_named_plan_fillers(profile: StudentProfile, planned_courses: list[dict[str, Any]]) -> list[dict[str, Any]]:
    targets = [
        {"course_code": "PHYS 2310", "title": "General Physics I", "credits": 4, "category": "Science Sequence"},
        {"course_code": "PHYS 2310L", "title": "General Physics I Laboratory", "credits": 1, "category": "Science Sequence"},
        {"course_code": "PHYS 2320", "title": "General Physics II", "credits": 4, "category": "Science Sequence"},
        {"course_code": "PHYS 2320L", "title": "General Physics II Laboratory", "credits": 1, "category": "Science Sequence"},
        {"course_code": "STAT 3005", "title": "Introduction to Probability and Statistics", "credits": 3, "category": "Statistics"},
        {"course_code": "MATH 2070", "title": "Matrices and Linear Algebra", "credits": 3, "category": "Math Support"},
        {"course_code": "SPCM 2120", "title": "Fundamentals of Public Speaking", "credits": 3, "category": "Communication"},
        {"course_code": "PHIL 3430", "title": "Philosophy of Technology", "credits": 3, "category": "Arts and Humanities"},
        {"course_code": "ECON 1010", "title": "Principles of Microeconomics", "credits": 3, "category": "Social Science"},
        {"course_code": "HIST 2020", "title": "Introduction to World History Since 1500", "credits": 3, "category": "International Perspectives"},
        {"course_code": "SOC 1340", "title": "Introduction to Sociology", "credits": 3, "category": "U.S. Cultures and Communities"},
        {"course_code": "SPAN 1010", "title": "Elementary Spanish I", "credits": 4, "category": "World Language"},
        {"course_code": "SPAN 1020", "title": "Elementary Spanish II", "credits": 4, "category": "World Language"},
        {"course_code": "COM S 4170", "title": "Software Testing", "credits": 3, "category": "Advanced Elective"},
        {"course_code": "COM S 4210", "title": "Software Analysis and Verification", "credits": 3, "category": "Advanced Elective"},
        {"course_code": "COM S 4540", "title": "Distributed Systems", "credits": 3, "category": "Advanced Elective"},
        {"course_code": "COM S 4720", "title": "Artificial Intelligence", "credits": 3, "category": "Advanced Elective"},
        {"course_code": "COM S 4740", "title": "Computational Intelligence", "credits": 3, "category": "Advanced Elective"},
        {"course_code": "COM S 4760", "title": "Numerical Analysis for Scientific Computing", "credits": 3, "category": "Advanced Elective"},
        {"course_code": "PSYCH 1010", "title": "Introduction to Psychology", "credits": 3, "category": "Social Science"},
        {"course_code": "THTRE 1060", "title": "Introduction to the Theatre", "credits": 3, "category": "Arts and Humanities"},
        {"course_code": "GEOG 1200", "title": "Maps, Culture, and Society", "credits": 3, "category": "International Perspectives"},
        {"course_code": "MUSIC 1020", "title": "Introduction to Music Listening", "credits": 3, "category": "Arts and Humanities"},
    ]
    taken_or_planned = _student_completed_code_set(profile) | _planned_course_code_set(planned_courses)
    return [
        course
        for course in targets
        if _normalize_course_code(course["course_code"]) not in taken_or_planned
        and _course_is_eligible_for_student(profile, course["course_code"])
    ]


def _remaining_target_credit_load(targets: list[dict[str, Any]]) -> int:
    return sum(int(course["credits"]) for course in targets)


def _per_semester_completion_targets(
    profile: StudentProfile,
    targets: list[dict[str, Any]],
    remaining_slots: int,
) -> tuple[int, int]:
    if remaining_slots <= 0:
        return _target_credit_load(profile), 5

    credit_cap = _extract_credit_cap(profile) or _target_credit_load(profile)
    remaining_credits = _remaining_target_credit_load(targets)
    remaining_courses = len(targets)

    target_credits = max(9, min(credit_cap, math.ceil(remaining_credits / remaining_slots))) if remaining_credits else max(9, min(credit_cap, _target_credit_load(profile)))
    target_count = max(4, min(6, math.ceil(remaining_courses / remaining_slots))) if remaining_courses else (6 if target_credits >= 16 else 5)
    return target_credits, target_count


def _backfill_remaining_targets_into_semesters(
    profile: StudentProfile,
    semesters: list[dict[str, Any]],
    all_planned_courses: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    credit_cap = _extract_credit_cap(profile) or _target_credit_load(profile)
    remaining_targets = _remaining_degree_completion_targets(profile, all_planned_courses)

    for target in remaining_targets:
        target_code = _normalize_course_code(target["course_code"])
        for semester in reversed(semesters):
            semester_codes = {
                _normalize_course_code(course["course_code"])
                for course in semester["recommended_courses"]
            }
            if target_code in semester_codes:
                break
            proposed_total = semester["total_credits"] + int(target["credits"])
            if proposed_total > credit_cap:
                continue
            semester["recommended_courses"].append(
                {
                    "course_code": target["course_code"],
                    "title": target["title"],
                    "credits": int(target["credits"]),
                    "notes": _course_note_for_plan(target),
                }
            )
            semester["total_credits"] = proposed_total
            all_planned_courses.append(
                {
                    "course_code": target["course_code"],
                    "title": target["title"],
                    "credits": int(target["credits"]),
                }
            )
            break

    return semesters, all_planned_courses


def _projected_profile_with_courses(profile: StudentProfile, planned_courses: list[dict[str, Any]]) -> StudentProfile:
    completed = [course.model_dump() for course in profile.completed_courses]
    completed.extend(
        {"course_code": course["course_code"], "grade": "IP"}
        for course in planned_courses
        if "ELECTIVE" not in course["course_code"].upper()
    )
    return StudentProfile.model_validate(
        {
            "major": profile.major,
            "year": profile.year,
            "completed_courses": completed,
            "goals": profile.goals,
        }
    )


def _build_fallback_academic_plan(request: AcademicPlanRequest) -> AcademicPlan:
    profile = request.student_profile
    target_credits = _target_credit_load(profile)
    all_planned_courses: list[dict[str, Any]] = []
    semesters: list[dict[str, Any]] = [semester.model_dump() for semester in request.existing_semesters]
    working_profile = profile

    future_slots = max(0, request.max_semesters - len(semesters))

    for semester_index in range(future_slots):
        remaining_slots = future_slots - semester_index
        required_targets = _remaining_degree_completion_targets(working_profile, all_planned_courses)
        target_credits_for_slot, target_count_for_slot = _per_semester_completion_targets(
            working_profile,
            required_targets,
            remaining_slots,
        )
        eligible_courses = _eligible_academic_plan_courses(working_profile, all_planned_courses)
        prioritized_courses = [*required_targets]
        prioritized_codes = {_normalize_course_code(course["course_code"]) for course in prioritized_courses}
        prioritized_courses.extend(
            course
            for course in eligible_courses
            if _normalize_course_code(course["course_code"]) not in prioritized_codes
        )
        semester_courses = _build_credit_aligned_schedule(
            working_profile,
            prioritized_courses,
            target_count=target_count_for_slot,
            target_credits_override=target_credits_for_slot,
            min_target_override=max(6, target_credits_for_slot - 1),
        )

        if len(semester_courses) < 4:
            semester_courses = _build_credit_aligned_schedule(
                working_profile,
                [
                    *prioritized_courses,
                    *_build_named_plan_fillers(working_profile, all_planned_courses),
                ],
                target_count=max(target_count_for_slot, 4),
                target_credits_override=target_credits_for_slot,
                min_target_override=max(6, target_credits_for_slot - 1),
            )

        if not semester_courses:
            break

        manual_courses = []
        for course in semester_courses:
            code = course["course_code"].upper()
            if code in {planned["course_code"].upper() for planned in all_planned_courses}:
                continue
            manual_courses.append(
                {
                    "course_code": course["course_code"],
                    "title": course["title"],
                    "credits": int(course["credits"]),
                    "notes": _course_note_for_plan(course),
                }
            )

        if not manual_courses:
            break

        total_credits = sum(course["credits"] for course in manual_courses)
        semesters.append(
            {
                "term_label": "Next Semester" if semester_index == 0 else f"Planned Semester {len(semesters) + 1}",
                "focus": (
                    "Balance core progress with workload support"
                    if semester_index == 0
                    else f"Build on the previous semester while staying near {target_credits_for_slot} credits"
                ),
                "recommended_courses": manual_courses,
                "total_credits": total_credits,
            }
        )

        all_planned_courses.extend(manual_courses)
        working_profile = _projected_profile_with_courses(profile, all_planned_courses)

        unfinished_required = [
            course for course in _remaining_degree_completion_targets(working_profile, all_planned_courses)
            if _course_is_eligible_for_student(working_profile, course["course_code"]) or True
        ]
        if not unfinished_required:
            break

    if not semesters:
        semesters.append(
            {
                "term_label": "Next Semester",
                "focus": "Review remaining requirements with an advisor",
                "recommended_courses": [
                    {
                        "course_code": "OPEN ELECTIVE",
                        "title": "Advisor-Guided Course Planning Placeholder",
                        "credits": min(target_credits, 12),
                        "notes": "The current hardcoded rule set could not confidently project the next sequence, so this plan should be reviewed manually.",
                    }
                ],
                "total_credits": min(target_credits, 12),
            }
        )

    while len(semesters) < request.max_semesters:
        filler_pool = _build_credit_aligned_schedule(
            working_profile,
            _build_named_plan_fillers(working_profile, all_planned_courses),
            target_count=5,
        )
        if not filler_pool:
            filler_pool = _build_credit_aligned_schedule(
                working_profile,
                _build_elective_placeholders(working_profile),
                target_count=5,
            )
        semesters.append(
            {
                "term_label": f"Planned Semester {len(semesters) + 1}",
                "focus": f"Round out remaining graduation requirements near {target_credits} credits",
                "recommended_courses": [
                    {
                        "course_code": course["course_code"],
                        "title": course["title"],
                        "credits": int(course["credits"]),
                        "notes": _course_note_for_plan(course),
                    }
                    for course in filler_pool
                ],
                "total_credits": sum(int(course["credits"]) for course in filler_pool),
            }
        )
        all_planned_courses.extend(
            {
                "course_code": course["course_code"],
                "title": course["title"],
                "credits": int(course["credits"]),
            }
            for course in filler_pool
        )
        working_profile = _projected_profile_with_courses(profile, all_planned_courses)

    semesters, all_planned_courses = _backfill_remaining_targets_into_semesters(
        profile,
        semesters,
        all_planned_courses,
    )

    return AcademicPlan.model_validate(
        {
            "plan_title": f"{profile.major} academic plan",
            "planning_prompt": request.planning_prompt,
            "semesters": semesters,
            "reasoning": [
                f"The planner keeps {len(request.existing_semesters)} existing semester(s) as your already completed or manually entered history.",
                "The academic plan starts from the courses you have already completed and projects forward using the current prerequisite rules.",
                f"It aims for about {_target_credit_load(profile)} credits per term while following your goals: {request.planning_prompt}",
                "You can manually adjust the plan afterward if you want to swap courses or rebalance specific semesters.",
            ],
            "accessibility_notes": [
                "Use this plan as a roadmap, then adjust one semester at a time if your energy, workload, or support needs change.",
                "Keep at most one clearly high-pressure technical course in the same term when possible.",
                "Review graduation-critical sequencing with an advisor before registration each term.",
            ],
            "response_mode": "demo",
        }
    )


def _normalize_academic_plan_length(plan: AcademicPlan, request: AcademicPlanRequest) -> AcademicPlan:
    target_count = request.max_semesters or 8
    semesters = [semester.model_dump() for semester in plan.semesters[:target_count]]

    while len(semesters) < target_count:
        semesters.append(
            {
                "term_label": f"Planned Semester {len(semesters) + 1}",
                "focus": "Round out remaining graduation requirements",
                "recommended_courses": [
                    {
                        "course_code": "PHIL 343",
                        "title": "Philosophy of Technology",
                        "credits": 3,
                        "notes": "Useful humanities requirement placeholder for the long-range roadmap.",
                    },
                    {
                        "course_code": "ECON 101",
                        "title": "Principles of Microeconomics",
                        "credits": 3,
                        "notes": "A concrete social science option for the long-range roadmap.",
                    },
                    {
                        "course_code": "HIST 202",
                        "title": "Introduction to World History Since 1500",
                        "credits": 3,
                        "notes": "Can help cover broader LAS and international-perspective planning.",
                    },
                    {
                        "course_code": "COM S 417",
                        "title": "Software Testing",
                        "credits": 3,
                        "notes": "Example upper-level CS elective to keep later semesters looking realistic.",
                    },
                ],
                "total_credits": 12,
            }
        )

    payload = plan.model_dump()
    payload["semesters"] = semesters
    return AcademicPlan.model_validate(payload)


def _extract_json_object(raw_text: str) -> dict[str, Any]:
    stripped = raw_text.strip()

    if stripped.startswith("```"):
        stripped = stripped.split("\n", 1)[1] if "\n" in stripped else stripped
        if stripped.endswith("```"):
            stripped = stripped.rsplit("```", 1)[0].strip()

    start = stripped.find("{")
    end = stripped.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise json.JSONDecodeError("No JSON object found", stripped, 0)

    return json.loads(stripped[start : end + 1])


def _get_grok_api_key() -> str:
    api_key = (os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("Missing GROK_API_KEY")
    return api_key


def _call_grok(messages: list[dict[str, str]], max_tokens: int = 1400, temperature: float = 0.2) -> str:
    api_key = _get_grok_api_key()

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload: dict[str, Any] = {
        "model": MODEL_NAME,
        "max_tokens": max_tokens,
        "messages": messages,
        "temperature": temperature,
    }

    response = requests.post(
        GROK_API_URL,
        headers=headers,
        json=payload,
        timeout=45,
    )
    if not response.ok:
        error_text = response.text[:1000]
        if "Incorrect API key provided" in error_text:
            raise RuntimeError(
                "The configured GROK_API_KEY was rejected by xAI. "
                "Double-check that backend/.env contains a real xAI Grok API key from console.x.ai, not a different provider key."
            )
        raise RuntimeError(f"Grok API request failed with status {response.status_code}: {error_text}")
    response_data = response.json()
    return response_data["choices"][0]["message"]["content"]


def get_semester_recommendation(profile: StudentProfile) -> SemesterRecommendation:
    if not (os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY")):
        return _fallback_recommendation(profile)

    try:
        raw_text = _call_grok(
            [
                {
                    "role": "system",
                    "content": _build_system_prompt(),
                },
                {
                    "role": "user",
                    "content": _build_user_prompt(profile),
                },
            ]
        )
        parsed = _extract_json_object(raw_text)
        recommendation = SemesterRecommendation.model_validate(parsed)
        recommendation = _apply_professor_data(recommendation)

        corrected_courses = _fill_valid_recommended_courses(
            profile,
            [course.model_dump() for course in recommendation.recommended_courses],
            target_count=len(recommendation.recommended_courses),
        )
        updated_payload = recommendation.model_dump()
        updated_payload["recommended_courses"] = corrected_courses
        updated_payload["reasoning"] = [
            *updated_payload["reasoning"],
            f"Target credit goal interpreted from your academic goals: about {_target_credit_load(profile)} credits.",
        ]
        updated_payload["daily_life_outlook"] = (
            updated_payload.get("daily_life_outlook")
            or _build_daily_life_outlook(profile, corrected_courses)
        )

        if corrected_courses != [course.model_dump() for course in recommendation.recommended_courses]:
            updated_payload["reasoning"] = [
                "The schedule was adjusted to remove courses whose prerequisites were not yet satisfied and to better align with your requested credit load.",
                *updated_payload["reasoning"],
            ]

        return SemesterRecommendation.model_validate(updated_payload)
    except (requests.RequestException, KeyError, IndexError, json.JSONDecodeError, ValueError, RuntimeError) as exc:
        logger.exception("Falling back to hardcoded semester recommendation: %s", exc)
        return _fallback_recommendation(profile)


def get_academic_plan(request: AcademicPlanRequest) -> AcademicPlan:
    if not (os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY")):
        return _normalize_academic_plan_length(_build_fallback_academic_plan(request), request)

    try:
        raw_text = _call_grok(
            [
                {
                    "role": "system",
                    "content": _build_system_prompt(),
                },
                {
                    "role": "user",
                    "content": _build_academic_plan_prompt(request),
                },
            ],
            max_tokens=1800,
            temperature=0.3,
        )
        parsed = _extract_json_object(raw_text)
        return _normalize_academic_plan_length(
            AcademicPlan.model_validate(parsed),
            request,
        )
    except (requests.RequestException, KeyError, IndexError, json.JSONDecodeError, ValueError, RuntimeError) as exc:
        logger.exception("Falling back to hardcoded academic plan: %s", exc)
        return _normalize_academic_plan_length(_build_fallback_academic_plan(request), request)


def _fallback_follow_up_answer(request: FollowUpRequest) -> str:
    courses = ", ".join(
        f"{course.course_code} ({course.professor})"
        for course in request.recommendation.recommended_courses[:4]
    )
    return (
        "Here’s a quick follow-up based on your current plan. "
        f"Your recommended schedule is centered on {courses}. "
        "If you want, I can help explain workload balance, why a course was chosen, "
        "or which class I would swap first to make the semester lighter."
    )


def _question_aware_follow_up_answer(request: FollowUpRequest) -> str:
    question = request.question.lower()
    courses = request.recommendation.recommended_courses
    first_course = courses[0] if courses else None
    course_list = ", ".join(
        f"{course.course_code} ({course.professor})"
        for course in courses[:4]
    )

    def find_course_from_question() -> Any:
        for course in courses:
            code = course.course_code.lower()
            compact = re.sub(r"[^a-z0-9]", "", code)
            title = course.title.lower()
            if code in question or compact in re.sub(r"[^a-z0-9]", "", question):
                return course
            if any(word in question for word in title.split()[:2]) and title in question:
                return course
        return None

    def course_details(course: Any) -> str:
        return (
            f"{course.course_code} ({course.title}) is {course.credits} credits with "
            f"{course.professor}, rated {course.professor_rating}. {course.why_this_course}"
        )

    def sorted_by_credits(desc: bool = True) -> list[Any]:
        return sorted(courses, key=lambda course: course.credits, reverse=desc)

    target_course = find_course_from_question()
    hardest_course = None
    easiest_course = None
    if courses:
        hardest_course = max(
            courses,
            key=lambda course: float(re.search(r"difficulty ([0-9.]+)", course.professor_rating).group(1))
            if re.search(r"difficulty ([0-9.]+)", course.professor_rating)
            else course.credits,
        )
        easiest_course = min(
            courses,
            key=lambda course: float(re.search(r"difficulty ([0-9.]+)", course.professor_rating).group(1))
            if re.search(r"difficulty ([0-9.]+)", course.professor_rating)
            else course.credits,
        )

    if ("compare" in question or "difference" in question) and len(courses) >= 2:
        first, second = courses[0], courses[1]
        mentioned = [course for course in courses if course.course_code.lower() in question]
        if len(mentioned) >= 2:
            first, second = mentioned[0], mentioned[1]
        return (
            f"If I compare {first.course_code} and {second.course_code}, {first.course_code} looks like the better choice when you want {first.why_this_course.lower()} "
            f"while {second.course_code} gives you a different kind of progress. "
            f"{first.course_code} is {first.credits} credits and {second.course_code} is {second.credits} credits, so the tradeoff is mostly about fit, workload, and which requirement feels more urgent right now."
        )

    if "hardest" in question or "most difficult" in question or "hard" in question:
        if hardest_course:
            return (
                f"The course I would watch most closely for difficulty is {hardest_course.course_code}. "
                f"It is paired with {hardest_course.professor_rating}, so it may need earlier planning for study time, office hours, and assignment pacing. "
                "If you are trying to protect your energy this semester, that is the first course I would monitor when balancing the rest of your schedule."
            )

    if "easiest" in question or "lightest" in question:
        if easiest_course:
            return (
                f"The lightest-looking option in this plan is probably {easiest_course.course_code}. "
                f"It stands out because {easiest_course.professor_rating} and it fits the schedule as a more manageable piece of the overall semester. "
                "That can make it useful if you need one course that still moves you forward without carrying the same strain as the heavier classes."
            )

    if "drop" in question or "remove" in question:
        if hardest_course:
            return (
                f"If you had to drop one course, I would first review {hardest_course.course_code}. "
                "That does not automatically mean it should be removed, but it is the most likely pressure point if the semester starts feeling too heavy. "
                "Before dropping it, I would check whether it is prerequisite-critical for a later class."
            )

    if "prereq" in question or "prerequisite" in question or "sequence" in question:
        if target_course:
            return (
                f"{target_course.course_code} matters in the sequence because it helps unlock later work in its area. "
                f"Right now it was chosen because {target_course.why_this_course.lower()} "
                "If you delay it, the main risk is that a later semester may become more compressed."
            )
        return (
            "In general, the sequencing logic here is to clear core and foundational requirements first so later semesters do not get bottlenecked by missing prerequisites."
        )

    if "prepare" in question or "study" in question or "succeed" in question:
        if target_course:
            return (
                f"To prepare for {target_course.course_code}, I would start by blocking regular weekly time for reading, problem solving, and office hours. "
                f"Because {target_course.professor_rating}, it would be smart to begin assignments early and ask questions before deadlines pile up. "
                "A simple routine like previewing material before class and reviewing notes the same day will make the course feel much more manageable."
            )
        return (
            "To do well in this schedule, the most helpful pattern is starting technical assignments early, using office hours early in the term, and avoiding stacking all studying into the weekend."
        )

    if "all of these" in question or "entire schedule" in question or "whole schedule" in question or "summary" in question:
        return (
            f"Your full plan is centered on {course_list}. "
            f"The main theme is {request.recommendation.semester_theme.lower()}, and the schedule was built to keep you moving while staying reasonably manageable. "
            f"The core logic is: {' '.join(request.recommendation.reasoning[:2])}"
        )

    if "why not" in question or "instead of" in question:
        if target_course:
            return (
                f"If you are asking why {target_course.course_code} was chosen instead of another option, the short answer is that it fits the current plan's priorities better. "
                f"It was included because {target_course.why_this_course.lower()} "
                "A different option might still work, but I would compare it based on workload, sequencing, and whether it delays an important requirement."
            )

    if "lighter" in question or "workload" in question or "too much" in question:
        if hardest_course:
            return (
                f"If you want a lighter semester, I would first look at postponing {hardest_course.course_code}. "
                f"It looks like the hardest pressure point in your current plan, so moving it later would usually do more to reduce stress than removing one of the easier classes. "
                "I would keep the most urgent core course and replace one demanding class with a lighter option if flexibility matters most."
            )
        return (
            "If you want a lighter semester, I would reduce the number of technical courses taken at the same time and keep only the most urgent requirement first."
        )

    if "internship" in question or "career" in question or "job" in question:
        if target_course:
            return (
                f"{target_course.course_code} supports internship preparation because it builds skills you can point to in interviews, projects, or technical conversations. "
                f"It was included because {target_course.why_this_course.lower()} "
                "To get even more value from it, pair the course with one concrete project, GitHub repo, or resume bullet during the semester."
            )
        if first_course:
            return (
                f"{first_course.course_code} supports internship preparation because it strengthens core technical skills you can talk about in interviews and projects. "
                f"In your current plan, courses like {course_list} help show steady progress in foundational CS work. "
                "To get more career value from the semester, pair one of these courses with a small project, GitHub repo, or resume bullet."
            )
        return (
            "For internship prep, I would focus on courses that build core programming and problem-solving skills, then pair them with a small portfolio project."
        )

    if "professor" in question or "teacher" in question or "instructor" in question:
        if target_course:
            return (
                f"For {target_course.course_code}, the current professor context is {target_course.professor} with {target_course.professor_rating}. "
                "That is best treated as a likely or recent professor option rather than a guaranteed section assignment, because teaching assignments can change."
            )
        if first_course:
            return (
                f"The current recommendation already includes professor context. For example, {first_course.course_code} is shown with {first_course.professor}, rated {first_course.professor_rating}. "
                "That can help you judge difficulty and fit, but it should be read as a likely or recent option rather than a guaranteed section assignment."
            )
        return "I can compare professor fit by looking at rating, difficulty, and how each instructor matches the kind of semester you want."

    if "why" in question or "fit" in question or "good" in question:
        if target_course:
            return (
                f"{target_course.course_code} is in the plan because {target_course.why_this_course.lower()} "
                "It fits the current recommendation by moving you forward without losing sight of your stated goals and overall workload."
            )
        if first_course:
            return (
                f"{first_course.course_code} is a strong fit because it moves you forward in your degree while keeping your semester focused on core progress. "
                f"Right now the plan centers on {course_list}, which helps balance momentum and clarity. "
                "If you want, I can also explain each course one by one."
            )
        return "This recommendation is meant to balance degree progress, manageable workload, and your stated goals."

    if "swap" in question or "replace" in question or "change" in question:
        if target_course:
            return (
                f"If you want to swap out {target_course.course_code}, I would first check whether it is the most urgent requirement in the current sequence. "
                "If it is not urgent, it is a reasonable candidate to move later and replace with a lighter or more goal-aligned option."
            )
        if courses:
            return (
                f"If you want to change the plan, I would first review whether {courses[-1].course_code} is essential this semester or whether it could be swapped for a lighter option. "
                "That usually keeps you moving forward while making the schedule more flexible."
            )
        return "If you want to change the plan, I would start by identifying which course is least urgent for this semester and swap that one first."

    if target_course:
        return (
            f"Here is a more focused answer about {target_course.course_code}. {course_details(target_course)} "
            "If you want, I can also explain how it affects workload, sequencing, internships, or whether it is the first course I would move."
        )

    return (
        f"Here is a quick follow-up based on your current plan. Your recommended schedule is centered on {course_list}. "
        f"The strongest guidance I can give from this plan is: {' '.join(request.recommendation.reasoning[:2])} "
        "If you ask about a specific course, workload, sequencing, internships, professor fit, or what to change, I can give a more targeted answer."
    )


def answer_follow_up_question(request: FollowUpRequest) -> FollowUpResponse:
    if not (os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY")):
        return FollowUpResponse(answer=_question_aware_follow_up_answer(request))

    try:
        answer = _call_grok(
            [
                {
                    "role": "system",
                    "content": _build_follow_up_system_prompt(),
                },
                {
                    "role": "user",
                    "content": _build_follow_up_prompt(request),
                },
            ],
            max_tokens=500,
            temperature=0.3,
        ).strip()
        return FollowUpResponse(answer=answer)
    except (requests.RequestException, KeyError, IndexError, RuntimeError) as exc:
        logger.exception("Falling back to canned follow-up answer: %s", exc)
        return FollowUpResponse(answer=_question_aware_follow_up_answer(request))
