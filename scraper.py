import re
from urllib.parse import quote_plus
from functools import lru_cache
from typing import Any

import requests
from bs4 import BeautifulSoup

RATE_MY_PROFESSORS_BASE_URL = "https://www.ratemyprofessors.com"
ISU_RMP_SCHOOL_ID = "452"

# These are starter mappings for likely Iowa State instructors tied to the
# hardcoded course list in advisor.py. Once catalog scraping is added, this can
# be replaced with section-specific instructor discovery.
ISU_COURSE_PROFESSOR_DIRECTORY: dict[str, list[str]] = {
    "COM S 227": [
        "Adisak Sukul",
        "Simanta Mitra",
    ],
    "COM S 228": [
        "Simanta Mitra",
        "Adisak Sukul",
    ],
    "COM S 230": [
        "Soma Chaudhuri",
        "Tichakorn Wongpiromsarn",
    ],
    "COM S 311": [
        "Trent Muhr",
        "Tichakorn Wongpiromsarn",
    ],
    "COM S 319": [
        "Simanta Mitra",
        "Wallapak Tavanapong",
    ],
    "COM S 327": [
        "Ying Cai",
        "Liyi Li",
    ],
    "COM S 331": [
        "Tichakorn Wongpiromsarn",
        "Trent Muhr",
    ],
    "COM S 363": [
        "Qi Li",
        "Ying Cai",
    ],
    "SE 185": [
        "Adisak Sukul",
        "Simanta Mitra",
    ],
    "CPRE 281": [
        "Alexander Stoytchev",
        "Koray Celik",
        "Maruf Ahamed",
    ],
}


def get_isu_catalog_data() -> list[dict[str, Any]]:
    """Placeholder for future Iowa State catalog scraping."""
    return []


def _extract_first_match(pattern: str, text: str) -> str | None:
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else None


@lru_cache(maxsize=128)
def fetch_professor_rating(professor_name: str) -> dict[str, Any] | None:
    query = quote_plus(professor_name)
    url = f"{RATE_MY_PROFESSORS_BASE_URL}/search/professors/{ISU_RMP_SCHOOL_ID}?q={query}"
    response = requests.get(
        url,
        timeout=20,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        },
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    page_text = soup.get_text(" ", strip=True)
    result_link = next(
        (
            link.get("href")
            for link in soup.find_all("a", href=True)
            if "/professor/" in link.get("href", "")
        ),
        None,
    )

    if "0 professors with" in page_text or not result_link:
        return None

    overall_quality = _extract_first_match(
        r"QUALITY\s+([0-5](?:\.\d)?)",
        page_text,
    )
    would_take_again = _extract_first_match(
        r"([0-9]{1,3}%|N/A)\s+would take again",
        page_text,
    )
    difficulty = _extract_first_match(
        r"([0-5](?:\.\d)?|N/A)\s+level of difficulty",
        page_text,
    )
    ratings_count = _extract_first_match(
        r"QUALITY\s+[0-5](?:\.\d)?\s+([0-9]+)\s+ratings",
        page_text,
    )
    department = _extract_first_match(
        rf"{re.escape(professor_name)}\s+(.+?)\s+Iowa State University",
        page_text,
    )

    return {
        "name": professor_name,
        "url": f"{RATE_MY_PROFESSORS_BASE_URL}{result_link}",
        "overall_quality": overall_quality or "N/A",
        "would_take_again": would_take_again or "N/A",
        "difficulty": difficulty or "N/A",
        "ratings_count": ratings_count or "0",
        "department": department or "Unknown",
    }


def get_professor_ratings(course_code: str) -> list[dict[str, Any]]:
    """Fetch RateMyProfessors-backed options for a hardcoded course code."""
    candidates = ISU_COURSE_PROFESSOR_DIRECTORY.get(course_code.upper(), [])
    results: list[dict[str, Any]] = []

    for candidate_name in candidates:
        try:
            rating = fetch_professor_rating(candidate_name)
            if rating:
                results.append(rating)
        except requests.RequestException:
            continue

    return sorted(
        results,
        key=lambda professor: (
            professor["overall_quality"] != "N/A",
            float(professor["overall_quality"])
            if professor["overall_quality"] != "N/A"
            else 0.0,
            int(professor["ratings_count"]),
        ),
        reverse=True,
    )
