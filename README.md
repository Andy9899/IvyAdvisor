# AI Academic Advisor

AI Academic Advisor is a hackathon starter app focused on student accessibility. A student enters their major, year, completed courses, grades, and academic goals, then the app returns a recommended next-semester schedule with plain-language reasoning.

## Stack

- Frontend: React + Vite
- Backend: FastAPI
- AI provider: Grok API

## Current Scope

- Accessible student profile form
- FastAPI `POST /advise` endpoint
- Grok-powered semester recommendation flow
- Hardcoded Iowa State CS degree requirement data for now
- RateMyProfessors-backed professor/rating enrichment for the hardcoded course list
- Placeholder `scraper.py` for later catalog and professor scraping

## Project Structure

```text
frontend/
  src/
    components/
      ChatBox.jsx
      ProfileForm.jsx
      ScheduleOutput.jsx
    App.jsx
    main.jsx
backend/
  advisor.py
  main.py
  models.py
  scraper.py
```

## Environment Setup

Create a `.env` file in the project root:

```env
GROK_API_KEY=your_real_grok_api_key
# Optional:
# Grok currently uses the x.ai chat completions endpoint under the hood.
# GROK_API_URL=https://api.x.ai/v1/chat/completions
# GROK_MODEL=grok-4.20-reasoning
```

If `GROK_API_KEY` is missing or the API call fails, the backend returns a fallback recommendation built from hardcoded course data so the app still works for demos.

## Run The Backend

From the project root:

```powershell
py -m pip install -r backend\requirements.txt
py -m uvicorn backend.main:app --reload
```

The backend will start on `http://localhost:8000`.

Useful endpoint:

```text
GET http://localhost:8000/health
POST http://localhost:8000/advise
```

## Run The Frontend

In a second terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

By default, the frontend sends requests to `http://localhost:8000`.

## How The Flow Works

1. The student fills out the profile form.
2. The React frontend sends the form JSON to `POST /advise`.
3. The FastAPI backend combines the student profile with hardcoded ISU CS requirements.
4. The backend sends that context to Grok.
5. The backend enriches course recommendations with RateMyProfessors data for mapped ISU instructors.
6. The backend returns a structured semester recommendation for the UI to render.

## Example Request

```json
{
  "major": "Computer Science",
  "year": "Sophomore",
  "completed_courses": [
    {
      "course_code": "COM S 127",
      "grade": "A"
    },
    {
      "course_code": "MATH 165",
      "grade": "B+"
    }
  ],
  "goals": "I want a balanced schedule that keeps me on track for graduation and helps me prepare for internships."
}
```

## Notes

- The current requirement map is CS-focused, even if a student enters another major.
- The professor lookup is a starter mapping from hardcoded course codes to likely ISU instructors on RateMyProfessors. It is not section-specific yet.
- `ChatBox.jsx` is local-only right now and does not call the backend yet.
- `scraper.py` is a placeholder for future ISU catalog and professor rating integration.

## Follow-Up Question Guidelines

Students can use the follow-up question area to ask for clarification, tradeoffs, or small changes to the recommended schedule.

### Good follow-up questions

- Why is this course a good fit for my goals?
- Which class should I swap if I want a lighter workload?
- Which course in this plan helps most with internships?
- Can you explain this schedule in simpler language?
- Which course looks hardest, and how should I prepare for it?
- Can you compare two recommended courses for workload or usefulness?
- If I struggle with math-heavy classes, which part of this schedule should I watch closely?
- How should I balance this schedule with a part-time job or other responsibilities?

### What the follow-up area can do

- Explain why a course was recommended
- Clarify workload, sequencing, and degree progress
- Discuss professor fit using the current available rating data
- Suggest lighter or more balanced variations to the current plan
- Rephrase advice in plain language
- Help students think through tradeoffs before talking with an academic advisor

### What the follow-up area should not do

- Invent courses that are not in the current data unless clearly labeled as placeholders
- Promise that a course will be offered in a specific semester
- Guarantee professor assignments, professor quality, or seat availability
- Replace official academic advising
- Give legal, medical, or mental health advice
- Make final decisions about graduation eligibility
- Assume transfer credits, waivers, or exceptions are approved unless the student says so
- Encourage unsafe academic behavior such as overloading beyond what the student can reasonably manage

### Recommended tone for follow-up answers

- Use plain language
- Be encouraging and specific
- Mention uncertainty when the data is incomplete
- Prefer practical next steps over vague advice
- Remind the student to verify important registration decisions with an academic advisor
