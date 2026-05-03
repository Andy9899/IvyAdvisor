import { useEffect, useMemo, useState } from "react";
import ProfileForm from "./components/ProfileForm";
import ScheduleOutput from "./components/ScheduleOutput";
import ChatBox from "./components/ChatBox";
import DegreeAuditView from "./components/DegreeAuditView";
import MyCoursesView from "./components/MyCoursesView";
import SettingsPanel from "./components/SettingsPanel";
import AcademicPlanView from "./components/AcademicPlanView";
import ivyLogo from "./assets/ivy_logo.png";
import ivyWelcomeLogo from "./assets/ivy_welcome_logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const ISU_CS_CATALOG_URL = "https://catalog.iastate.edu/collegeofliberalartsandsciences/computerscience/";

const initialRecommendation = null;
const initialProfile = {
  major: "Computer Science",
  year: "Sophomore",
  creditCount: 7,
  creditMode: "auto",
};
const initialGoals = {
  summary:
    "I want a balanced schedule that keeps me on track for graduation and includes one course that helps with internships.",
  timeline: "Graduate on time",
  path: "Industry job",
  courseLoadPreference: "Balanced",
};
const initialPreferences = {
  avoidEarly: true,
  dayPattern: "MWF",
  maxCredits: 18,
};
const initialNotifications = {
  registrationOpen: true,
  fallingBehind: true,
};
const initialDataSource = {
  schoolName: "Iowa State University Catalog",
  catalogUrl: ISU_CS_CATALOG_URL,
};
const initialCompletedCourses = [
  { course_code: "COM S 127", grade: "A" },
  { course_code: "MATH 165", grade: "B+" },
];

const demoProfile = {
  profile: {
    major: "Computer Engineering",
    year: "Sophomore",
    creditCount: 29,
    creditMode: "auto",
  },
  goals: {
    summary:
      "I want a balanced semester around 15 credits that keeps me on track for graduation and includes at least one course that helps with internships or software engineering roles.",
    timeline: "Graduate on time",
    path: "Industry job",
    courseLoadPreference: "Balanced",
  },
  preferences: {
    avoidEarly: true,
    dayPattern: "MWF",
    maxCredits: 18,
  },
  completedCourses: [
    { course_code: "COM S 127", grade: "A" },
    { course_code: "MATH 165", grade: "A-" },
    { course_code: "COM S 101", grade: "A" },
    { course_code: "ENGL 150", grade: "A" },
    { course_code: "LIB 160", grade: "A" },
    { course_code: "LAS 203", grade: "A" },
    { course_code: "COM S 227", grade: "B+" },
    { course_code: "MATH 166", grade: "B" },
    { course_code: "ENGL 250", grade: "A-" },
    { course_code: "SE 185", grade: "A" },
  ],
  academicPlan: {
    plan_title: "Computer Engineering academic plan",
    planning_prompt:
      "Build me a balanced academic plan around 15 credits per semester that keeps me on track for graduation and includes internship-friendly courses.",
    response_mode: "demo",
    semesters: [
      {
        term_label: "Freshman Fall",
        focus: "Foundation semester already completed",
        recommended_courses: [
          { course_code: "COM S 101", title: "Orientation", credits: 0, notes: "Completed" },
          { course_code: "COM S 127", title: "Introduction to Computer Programming", credits: 3, notes: "Completed" },
          { course_code: "MATH 165", title: "Calculus I", credits: 4, notes: "Completed" },
          { course_code: "ENGL 150", title: "Critical Thinking and Communication", credits: 3, notes: "Completed" },
          { course_code: "LIB 160", title: "College Level Research", credits: 1, notes: "Completed" },
        ],
        total_credits: 11,
      },
      {
        term_label: "Freshman Spring",
        focus: "Second semester already completed",
        recommended_courses: [
          { course_code: "COM S 227", title: "Object-Oriented Programming", credits: 4, notes: "Completed" },
          { course_code: "MATH 166", title: "Calculus II", credits: 4, notes: "Completed" },
          { course_code: "ENGL 250", title: "Written, Oral, Visual, and Electronic Composition", credits: 3, notes: "Completed" },
          { course_code: "SE 185", title: "Problem Solving in Software Engineering", credits: 3, notes: "Completed" },
          { course_code: "LAS 203", title: "Career Preparation", credits: 1, notes: "Completed" },
        ],
        total_credits: 15,
      },
    ],
    reasoning: [
      "The first two semesters are already completed in this demo profile.",
      "Generate the remaining semesters to finish the roadmap.",
    ],
    accessibility_notes: [
      "Use the existing semesters as history, then generate the rest of the plan from there.",
    ],
  },
};

const navItems = [
  { id: "next-semester", label: "Next semester" },
  { id: "academic-plan", label: "Academic plan" },
  { id: "degree-audit", label: "Degree audit" },
  { id: "my-courses", label: "My courses" },
  { id: "settings", label: "Settings" },
];

const styles = {
  welcomePage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "32px",
    background:
      "radial-gradient(circle at top, rgba(96, 81, 205, 0.2) 0%, #1f1934 24%, #171327 100%)",
    color: "#f5f1ff",
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  },
  welcomeShell: {
    width: "min(760px, 100%)",
    display: "grid",
    justifyItems: "center",
    gap: "18px",
    textAlign: "center",
  },
  welcomeAccent: {
    width: "220px",
    height: "6px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #6d61ff 0%, #7e73ff 100%)",
    boxShadow: "0 0 32px rgba(117, 104, 255, 0.4)",
  },
  welcomeLogoWrap: {
    width: "240px",
    height: "132px",
    marginTop: "6px",
    overflow: "visible",
    background: "transparent",
    border: "none",
    boxShadow: "none",
  },
  welcomeLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    transform: "none",
    display: "block",
    filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.26))",
  },
  welcomeTitle: {
    margin: 0,
    maxWidth: "680px",
    fontSize: "clamp(2.2rem, 4.5vw, 3.7rem)",
    lineHeight: 1.08,
    letterSpacing: "-0.03em",
    fontWeight: 700,
    textShadow: "none",
  },
  welcomeSubtitle: {
    margin: 0,
    maxWidth: "540px",
    color: "#c4baf3",
    fontSize: "clamp(1.02rem, 2vw, 1.38rem)",
    lineHeight: 1.6,
    textShadow: "none",
  },
  welcomeButton: {
    marginTop: "8px",
    border: "1px solid rgba(144, 127, 255, 0.34)",
    background: "linear-gradient(135deg, #6356da 0%, #7165ef 100%)",
    color: "#ffffff",
    borderRadius: "18px",
    padding: "18px 34px",
    fontWeight: 800,
    fontSize: "1.08rem",
    cursor: "pointer",
    display: "inline-flex",
    gap: "12px",
    alignItems: "center",
    boxShadow: "0 18px 36px rgba(60, 44, 157, 0.4)",
    transition: "transform 180ms ease, box-shadow 180ms ease",
  },
  welcomeMeta: {
    margin: "14px 0 0",
    color: "#8e86b6",
    fontSize: "0.92rem",
    letterSpacing: "0.01em",
  },
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #3a3652 0%, #242321 30%, #1d1c1b 100%)",
    color: "#f5f2ed",
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    padding: "24px",
  },
  shell: {
    maxWidth: "1320px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "320px minmax(0, 1fr)",
    gap: "0",
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    background: "#262523",
    boxShadow: "0 22px 70px rgba(0, 0, 0, 0.35)",
  },
  sidebar: {
    background: "#272624",
    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "26px 22px 22px",
    display: "grid",
    gap: "22px",
    alignContent: "start",
  },
  brandRow: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  brandIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(241,237,255,0.96) 100%)",
    border: "1px solid rgba(146, 131, 255, 0.28)",
    boxShadow: "0 14px 30px rgba(14, 10, 36, 0.28)",
    flexShrink: 0,
  },
  brandImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "33% center",
    transform: "scale(1.95)",
    transformOrigin: "center",
    display: "block",
  },
  brandTextWrap: {
    display: "grid",
    gap: "4px",
  },
  brandTitle: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  brandSub: {
    margin: 0,
    color: "#cec8bf",
    fontSize: "0.92rem",
  },
  profileCard: {
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#534AB7",  //"#31302d"
    padding: "18px",
    display: "grid",
    gap: "14px",
    cursor: "pointer",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#b7b0ff",
    color: "#3b326f",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontSize: "1.15rem",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.35rem",
    fontWeight: 700,
  },
  cardSub: {
    margin: "4px 0 0",
    color: "#dfd7cc",
    lineHeight: 1.45,
  },
  muted: {
    color: "#bcb4a8",
  },
  sectionLabel: {
    margin: 0,
    color: "#9d968b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontSize: "0.86rem",
    fontWeight: 700,
  },
  progressTrack: {
    height: "10px",
    borderRadius: "999px",
    background: "#3a3835",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #6450ff 0%, #8278ff 100%)",
  },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    color: "#ded6cb",
    fontWeight: 600,
  },
  progressButton: {
    display: "grid",
    gap: "10px",
    background: "transparent",
    border: "none",
    padding: 0,
    textAlign: "left",
    cursor: "pointer",
  },
  menu: {
    display: "grid",
    gap: "10px",
  },
  menuButton: (active) => ({
    display: "flex",
    gap: "12px",
    alignItems: "center",
    borderRadius: "14px",
    padding: "12px 14px",
    background: active ? "#ddd8f6" : "transparent",
    color: active ? "#47409d" : "#d0c7bb",
    fontWeight: active ? 700 : 600,
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  }),
  menuDot: (active) => ({
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    background: active ? "#bab3e6" : "#5a564f",
    flexShrink: 0,
  }),
  formCard: {
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#2d2c29",
    padding: "16px",
  },
  main: {
    display: "grid",
    gridTemplateRows: "1fr auto",
    minHeight: "820px",
  },
  content: {
    display: "grid",
    gridTemplateRows: "auto 1fr",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "start",
    padding: "22px 26px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  },
  topTitle: {
    margin: 0,
    fontSize: "2.05rem",
    lineHeight: 1.08,
    letterSpacing: "-0.03em",
  },
  topText: {
    margin: "4px 0 0",
    color: "#bdb5a9",
    fontSize: "1.05rem",
  },
  summaryBadge: {
    alignSelf: "center",
    borderRadius: "999px",
    background: "#e5e1ff",
    color: "#5750ad",
    padding: "9px 14px",
    fontWeight: 700,
    fontSize: "0.98rem",
    whiteSpace: "nowrap",
  },
  headerActions: {
    display: "grid",
    gap: "10px",
    justifyItems: "end",
  },
  headerActionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  exportButton: {
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#34322e",
    color: "#ece4d9",
    padding: "10px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  exportHint: {
    margin: 0,
    color: "#bcb4a8",
    fontSize: "0.84rem",
  },
  subtleButton: {
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#2d2b28",
    color: "#d8d0c5",
    padding: "10px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  mainPanel: {
    padding: "26px",
    display: "grid",
    gap: "20px",
    alignContent: "start",
  },
  status: {
    color: "#ffd5cd",
    background: "#4e2d28",
    border: "1px solid rgba(255, 177, 161, 0.25)",
    borderRadius: "14px",
    padding: "12px 14px",
    fontSize: "0.95rem",
  },
};

const gradePoints = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0.0,
};

const courseCreditMap = {
  "COMS101": 0,
  "COMS1010": 0,
  "COMS127": 3,
  "COMS1270": 3,
  "COMS227": 4,
  "COMS2270": 4,
  "COMS228": 4,
  "COMS2280": 4,
  "COMS230": 3,
  "COMS2300": 3,
  "COMS309": 3,
  "COMS3090": 3,
  "COMS311": 3,
  "COMS3110": 3,
  "COMS319": 3,
  "COMS3190": 3,
  "COMS321": 3,
  "COMS3210": 3,
  "COMS327": 3,
  "COMS3270": 3,
  "COMS331": 3,
  "COMS3310": 3,
  "COMS342": 3,
  "COMS3420": 3,
  "COMS352": 3,
  "COMS3520": 3,
  "COMS363": 3,
  "COMS3630": 3,
  "COMS402": 3,
  "COMS4020": 3,
  "CPRE281": 4,
  "CPRE2810": 4,
  "ENGL150": 3,
  "ENGL1500": 3,
  "ENGL250": 3,
  "ENGL2500": 3,
  "LAS203": 1,
  "LAS2030": 1,
  "LIB160": 1,
  "LIB1600": 1,
  "MATH143": 3,
  "MATH1430": 3,
  "MATH165": 4,
  "MATH1650": 4,
  "MATH166": 4,
  "MATH1660": 4,
  "SE185": 3,
  "STAT3005": 3,
  "STAT3030": 3,
  "STAT3441": 3,
  "STAT3447": 3,
  "SPCM212": 3,
  "SPCM2120": 3,
};

function formatNameFromProfile(profile) {
  if (!profile) {
    return "Student Profile";
  }

  const major = profile.major?.trim() || "Student";
  const year = profile.year?.trim() || "";
  return `${major} Student${year ? ` - ${year}` : ""}`;
}

function getInitials(profile) {
  const source = profile?.major?.trim() || "AA";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AA";
}

function normalizeCompletedCourses(courses) {
  return courses
    .map((course) => ({
      course_code: course.course_code.trim().toUpperCase(),
      grade: course.grade,
    }))
    .filter((course) => course.course_code);
}

function normalizeCourseCodeForCredits(courseCode) {
  return courseCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function estimateCourseCredits(courseCode) {
  const normalized = normalizeCourseCodeForCredits(courseCode);
  if (!normalized) {
    return 0;
  }

  if (normalized in courseCreditMap) {
    return courseCreditMap[normalized];
  }

  if (normalized.endsWith("L")) {
    return 1;
  }

  const numberMatch = normalized.match(/(\d{3,4})/);
  const number = numberMatch ? Number(numberMatch[1]) : null;
  if (number === null) {
    return 3;
  }
  if (String(number).endsWith("5")) {
    return 4;
  }
  if (String(number).endsWith("8")) {
    return 1;
  }
  return 3;
}

function estimateTotalCredits(courses) {
  return normalizeCompletedCourses(courses).reduce(
    (sum, course) => sum + estimateCourseCredits(course.course_code),
    0,
  );
}

function recalculateSemesterTotal(semester) {
  return {
    ...semester,
    total_credits: semester.recommended_courses.reduce(
      (sum, course) => sum + Number(course.credits || 0),
      0,
    ),
  };
}

function estimateCompletedSemesterCount(year) {
  switch (year) {
    case "Sophomore":
      return 2;
    case "Junior":
      return 4;
    case "Senior":
      return 6;
    case "Graduate":
      return 8;
    default:
      return 0;
  }
}

function buildPastSemesterTemplate(profile, completedCourses) {
  const normalizedCourses = normalizeCompletedCourses(completedCourses);
  const semesterCount = Math.min(estimateCompletedSemesterCount(profile.year), 10);
  if (!semesterCount || !normalizedCourses.length) {
    return [];
  }

  const buckets = Array.from({ length: semesterCount }, () => []);
  normalizedCourses.forEach((course, index) => {
    buckets[index % semesterCount].push(course);
  });

  const yearLabels = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
  return buckets
    .map((bucket, index) => {
      if (!bucket.length) {
        return null;
      }
      const academicYear = yearLabels[Math.min(Math.floor(index / 2), yearLabels.length - 1)];
      const term = index % 2 === 0 ? "Fall" : "Spring";
      const recommended_courses = bucket.map((course) => ({
        course_code: course.course_code,
        title: "Completed course",
        credits: estimateCourseCredits(course.course_code),
        notes: `Completed with grade ${course.grade}`,
      }));
      return {
        term_label: `${academicYear} ${term}`,
        focus: "Completed semester",
        recommended_courses,
        total_credits: recommended_courses.reduce((sum, course) => sum + course.credits, 0),
      };
    })
    .filter(Boolean);
}

function buildApiGoals(goals, preferences) {
  return [
    goals.summary,
    `Graduation timeline: ${goals.timeline}`,
    `Primary path: ${goals.path}`,
    `Preferred course load: ${goals.courseLoadPreference}`,
    `Avoid 8am classes: ${preferences.avoidEarly ? "Yes" : "No"}`,
    `Preferred meeting pattern: ${preferences.dayPattern}`,
    `Maximum credits: ${preferences.maxCredits}`,
  ].join(". ");
}

function viewMeta(activeTab) {
  switch (activeTab) {
    case "degree-audit":
      return {
        title: "Degree Audit",
        subtitle: "Check your progress against Iowa State Computer Science graduation requirements.",
      };
    case "academic-plan":
      return {
        title: "Academic Plan",
        subtitle: "Generate and refine a multi-semester roadmap based on your long-term academic goals.",
      };
    case "my-courses":
      return {
        title: "My Courses",
        subtitle: "Review the classes already completed and the grades currently on file in the planner.",
      };
    case "settings":
      return {
        title: "Settings",
        subtitle: "Adjust profile info, goals, schedule preferences, notifications, and catalog sources.",
      };
    default:
      return {
        title: "Recommended - Next Semester",
        subtitle: "Based on your history, degree requirements, and accessibility-focused planning.",
      };
  }
}

function buildExportFilename(activeTab) {
  switch (activeTab) {
    case "academic-plan":
      return "advisorai-academic-plan";
    case "degree-audit":
      return "advisorai-degree-audit";
    case "my-courses":
      return "advisorai-completed-courses";
    default:
      return "advisorai-next-semester-plan";
  }
}

function buildExportPayload({
  activeTab,
  profile,
  goals,
  preferences,
  completedCourses,
  recommendation,
  academicPlan,
}) {
  const base = {
    exported_at: new Date().toISOString(),
    view: activeTab,
    student: {
      major: profile.major,
      year: profile.year,
      credits_completed: profile.creditCount,
      credit_mode: profile.creditMode,
      goals,
      preferences,
    },
    completed_courses: normalizeCompletedCourses(completedCourses),
  };

  if (activeTab === "academic-plan") {
    return {
      ...base,
      academic_plan: academicPlan,
    };
  }

  if (activeTab === "degree-audit") {
    return {
      ...base,
      degree_audit: {
        credit_progress: `${profile.creditCount}/120`,
        has_academic_plan: Boolean(academicPlan?.semesters?.length),
        planned_semesters: academicPlan?.semesters?.length ?? 0,
      },
      academic_plan: academicPlan,
    };
  }

  if (activeTab === "my-courses") {
    return base;
  }

  return {
    ...base,
    next_semester_recommendation: recommendation,
    academic_plan: academicPlan,
  };
}

function buildExportText(payload) {
  const profile = payload.student;
  const completedCourses = payload.completed_courses ?? [];
  const recommendation = payload.next_semester_recommendation;
  const academicPlan = payload.academic_plan;
  const degreeAudit = payload.degree_audit;
  const exportedLabel = new Date(payload.exported_at).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const lines = [
    "AdvisorAI Export",
    "Iowa State University",
    "",
    `Exported: ${exportedLabel}`,
    `View: ${payload.view.replace("-", " ")}`,
    "",
    "Student Profile",
    `- Major: ${profile.major}`,
    `- Year: ${profile.year}`,
    `- Credits completed: ${profile.credits_completed}`,
    `- Credit mode: ${profile.credit_mode}`,
    "",
    "Goals and Preferences",
    `- Goal summary: ${profile.goals.summary}`,
    `- Graduation timeline: ${profile.goals.timeline}`,
    `- Primary path: ${profile.goals.path}`,
    `- Course load preference: ${profile.goals.courseLoadPreference}`,
    `- Avoid 8am classes: ${profile.preferences.avoidEarly ? "Yes" : "No"}`,
    `- Preferred class days: ${profile.preferences.dayPattern}`,
    `- Maximum credits: ${profile.preferences.maxCredits}`,
    "",
    "Completed Courses",
  ];

  if (completedCourses.length) {
    completedCourses.forEach((course) => {
      lines.push(`- ${course.course_code}: ${course.grade}`);
    });
  } else {
    lines.push("- None entered yet");
  }

  if (recommendation) {
    lines.push("", "Next Semester Recommendation");
    lines.push(`Theme: ${recommendation.semester_theme}`);
    lines.push("");
    recommendation.recommended_courses.forEach((course) => {
      lines.push(
        `- ${course.course_code}: ${course.title} (${course.credits} credits)`,
      );
      lines.push(`  Professor context: ${course.professor} - ${course.professor_rating}`);
      lines.push(`  Why this course: ${course.why_this_course}`);
    });
    lines.push("", "Reasoning");
    recommendation.reasoning.forEach((item) => lines.push(`- ${item}`));
    lines.push("", "Accessibility Notes");
    recommendation.accessibility_notes.forEach((item) => lines.push(`- ${item}`));
    if (recommendation.daily_life_outlook?.length) {
      lines.push("", "What Daily Life May Feel Like");
      recommendation.daily_life_outlook.forEach((item) => lines.push(`- ${item}`));
    }
  }

  if (degreeAudit) {
    lines.push("", "Degree Audit Summary");
    lines.push(`- Credit progress: ${degreeAudit.credit_progress}`);
    lines.push(`- Academic plan attached: ${degreeAudit.has_academic_plan ? "Yes" : "No"}`);
    lines.push(`- Planned semesters: ${degreeAudit.planned_semesters}`);
  }

  if (academicPlan?.semesters?.length) {
    lines.push("", "Academic Plan");
    lines.push(`Title: ${academicPlan.plan_title}`);
    lines.push(`Planning prompt: ${academicPlan.planning_prompt}`);
    academicPlan.semesters.forEach((semester) => {
      lines.push("", `${semester.term_label} - ${semester.total_credits} credits`);
      lines.push(`Focus: ${semester.focus}`);
      semester.recommended_courses.forEach((course) => {
        lines.push(`- ${course.course_code}: ${course.title} (${course.credits} credits)`);
        if (course.notes) {
          lines.push(`  Notes: ${course.notes}`);
        }
      });
    });
    if (academicPlan.reasoning?.length) {
      lines.push("", "Academic Plan Reasoning");
      academicPlan.reasoning.forEach((item) => lines.push(`- ${item}`));
    }
    if (academicPlan.accessibility_notes?.length) {
      lines.push("", "Academic Plan Accessibility Notes");
      academicPlan.accessibility_notes.forEach((item) => lines.push(`- ${item}`));
    }
  }

  return lines.join("\n");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildExportHtml(payload) {
  const sectionTitles = new Set([
    "Student Profile",
    "Goals and Preferences",
    "Completed Courses",
    "Next Semester Recommendation",
    "Reasoning",
    "Accessibility Notes",
    "What Daily Life May Feel Like",
    "Degree Audit Summary",
    "Academic Plan",
    "Academic Plan Reasoning",
    "Academic Plan Accessibility Notes",
  ]);

  const lines = buildExportText(payload).split("\n");
  const htmlLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return '<div style="height: 10px;"></div>';
    }
    if (trimmed === "AdvisorAI Export") {
      return `<div style="font-size: 24px; font-weight: 800; text-decoration: underline; margin: 0 0 4px 0;">${escapeHtml(trimmed)}</div>`;
    }
    if (trimmed === "Iowa State University") {
      return `<div style="font-size: 16px; font-weight: 700; margin: 0 0 12px 0;">${escapeHtml(trimmed)}</div>`;
    }
    if (sectionTitles.has(trimmed)) {
      return `<div style="font-size: 16px; font-weight: 800; text-decoration: underline; margin: 10px 0 6px 0;">${escapeHtml(trimmed)}</div>`;
    }
    return `<div style="margin: 0 0 4px 0; line-height: 1.5; text-decoration: none;">${escapeHtml(line)}</div>`;
  });

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #222; text-decoration: none;">
      ${htmlLines.join("")}
    </div>
  `.trim();
}

function buildDisplayAcademicPlan(profile, planningPrompt, completedCourses) {
  return {
    plan_title: `${profile.major} academic plan`,
    planning_prompt: planningPrompt,
    semesters: buildPastSemesterTemplate(profile, completedCourses),
    reasoning: [],
    accessibility_notes: [],
    response_mode: "demo",
  };
}

function formatGeneratedTimestamp(timestamp) {
  if (!timestamp) {
    return "";
  }

  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function App() {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [activeTab, setActiveTab] = useState("next-semester");
  const [recommendation, setRecommendation] = useState(initialRecommendation);
  const [profile, setProfile] = useState(initialProfile);
  const [goals, setGoals] = useState(initialGoals);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [dataSource, setDataSource] = useState(initialDataSource);
  const [completedCourses, setCompletedCourses] = useState(initialCompletedCourses);
  const [submittedProfile, setSubmittedProfile] = useState(null);
  const [academicPlan, setAcademicPlan] = useState(null);
  const [planningPrompt, setPlanningPrompt] = useState(
    "Build me a balanced academic plan around 15 credits per semester that keeps me on track for graduation, respects my credit preferences, and includes internship-friendly courses.",
  );
  const [followUpMessages, setFollowUpMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [error, setError] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [lastScheduleGeneratedAt, setLastScheduleGeneratedAt] = useState("");
  const [lastPlanGeneratedAt, setLastPlanGeneratedAt] = useState("");

  useEffect(() => {
    if (profile.creditMode !== "auto") {
      return;
    }

    const estimatedCredits = estimateTotalCredits(completedCourses);
    if (profile.creditCount !== estimatedCredits) {
      setProfile((current) => ({
        ...current,
        creditCount: estimatedCredits,
      }));
    }
  }, [completedCourses, profile.creditCount, profile.creditMode]);

  useEffect(() => {
    if (!exportStatus) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setExportStatus("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [exportStatus]);

  const activeProfile = submittedProfile ?? {
    major: profile.major,
    year: profile.year,
    completed_courses: normalizeCompletedCourses(completedCourses),
    goals: buildApiGoals(goals, preferences),
  };

  const displayAcademicPlan = useMemo(
    () => academicPlan ?? buildDisplayAcademicPlan(profile, planningPrompt, completedCourses),
    [academicPlan, completedCourses, planningPrompt, profile],
  );

  const profileStats = useMemo(() => {
    const normalizedCourses = normalizeCompletedCourses(completedCourses);
    const points = normalizedCourses.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] ?? 0);
    }, 0);
    const gpa = normalizedCourses.length
      ? (points / normalizedCourses.length).toFixed(1)
      : "0.0";

    return {
      gpa,
      progressPercent: Math.min(100, Math.round((profile.creditCount / 120) * 100)),
    };
  }, [completedCourses, profile.creditCount]);

  const summaryText = useMemo(() => {
    if (activeTab === "degree-audit") {
      return `${profile.creditCount} credits - on track view`;
    }
    if (activeTab === "academic-plan") {
      return displayAcademicPlan?.semesters?.length
        ? `${displayAcademicPlan.semesters.length} semesters planned`
        : "Plan your next semesters";
    }
    if (activeTab === "my-courses") {
      return `${normalizeCompletedCourses(completedCourses).length} completed courses`;
    }
    if (activeTab === "settings") {
      return "Everything here is editable";
    }

    const courseCount = recommendation?.recommended_courses?.length ?? 0;
    const credits =
      recommendation?.recommended_courses?.reduce(
        (sum, course) => sum + course.credits,
        0,
      ) ?? 0;
    return `${courseCount} courses - ${credits} credits`;
  }, [academicPlan, activeTab, completedCourses, profile.creditCount, recommendation]);

  const handleLoadDemoProfile = () => {
    setProfile(demoProfile.profile);
    setGoals(demoProfile.goals);
    setPreferences(demoProfile.preferences);
    setCompletedCourses(demoProfile.completedCourses);
    setRecommendation(initialRecommendation);
    setAcademicPlan(demoProfile.academicPlan);
    setPlanningPrompt(demoProfile.academicPlan.planning_prompt);
    setSubmittedProfile(null);
    setFollowUpMessages([]);
    setError("");
    setExportStatus("");
    setLastScheduleGeneratedAt("");
    setLastPlanGeneratedAt("");
    setActiveTab("next-semester");
  };

  const handleResetWorkspace = () => {
    setActiveTab("next-semester");
    setRecommendation(initialRecommendation);
    setProfile(initialProfile);
    setGoals(initialGoals);
    setPreferences(initialPreferences);
    setNotifications(initialNotifications);
    setDataSource(initialDataSource);
    setCompletedCourses(initialCompletedCourses);
    setSubmittedProfile(null);
    setAcademicPlan(null);
    setPlanningPrompt(
      "Build me a balanced academic plan around 15 credits per semester that keeps me on track for graduation, respects my credit preferences, and includes internship-friendly courses.",
    );
    setFollowUpMessages([]);
    setIsLoading(false);
    setIsFollowUpLoading(false);
    setIsPlanLoading(false);
    setError("");
    setExportStatus("");
    setLastScheduleGeneratedAt("");
    setLastPlanGeneratedAt("");
  };

  if (showWelcomeScreen) {
    return (
      <main style={styles.welcomePage}>
        <section style={styles.welcomeShell}>
          <div style={styles.welcomeAccent} />
          <div style={styles.welcomeLogoWrap}>
            <img src={ivyWelcomeLogo} alt="Ivy Advisor AI logo" style={styles.welcomeLogo} />
          </div>
          <h1 style={styles.welcomeTitle}>Every student deserves a clear path forward.</h1>
          <p style={styles.welcomeSubtitle}>
            Not just the ones who know the right questions to ask.
          </p>
          <button
            type="button"
            style={styles.welcomeButton}
            onClick={() => setShowWelcomeScreen(false)}
          >
            Meet Ivy
            <span aria-hidden="true">→</span>
          </button>
          <p style={styles.welcomeMeta}>
            Iowa State University · Hackathon 2026 · Accessibility-first advising
          </p>
        </section>
      </main>
    );
  }

  const handleSubmit = async () => {
    const normalizedCourses = normalizeCompletedCourses(completedCourses);
    const apiProfile = {
      major: profile.major.trim(),
      year: profile.year,
      completed_courses: normalizedCourses,
      goals: buildApiGoals(goals, preferences),
    };

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/advise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiProfile),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to generate a recommendation right now.");
      }

      const data = await response.json();
      setSubmittedProfile(apiProfile);
      setRecommendation(data);
      setLastScheduleGeneratedAt(new Date().toISOString());
      setActiveTab("next-semester");
      setFollowUpMessages([
        {
          role: "assistant",
          content:
            "Your semester recommendation is ready. You can ask follow-up questions about workload, sequencing, internships, or professor fit.",
        },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAcademicPlan = async () => {
    const normalizedCourses = normalizeCompletedCourses(completedCourses);
    const existingSemesters =
      academicPlan?.semesters?.length
        ? academicPlan.semesters
        : buildPastSemesterTemplate(profile, completedCourses);
    const apiProfile = {
      major: profile.major.trim(),
      year: profile.year,
      completed_courses: normalizedCourses,
      goals: buildApiGoals(goals, preferences),
    };

    setIsPlanLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/academic-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_profile: apiProfile,
          planning_prompt: planningPrompt.trim() || goals.summary,
          existing_semesters: existingSemesters,
          max_semesters: Math.min(10, Math.max(8, existingSemesters.length || 0)),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to generate an academic plan right now.");
      }

      const data = await response.json();
      setSubmittedProfile(apiProfile);
      setAcademicPlan(data);
      setLastPlanGeneratedAt(new Date().toISOString());
      setActiveTab("academic-plan");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsPlanLoading(false);
    }
  };

  const updateAcademicPlanCourse = (semesterIndex, courseIndex, field, value) => {
    setAcademicPlan((current) => {
      const basePlan =
        current ??
        {
          plan_title: `${profile.major} academic plan`,
          planning_prompt,
          semesters: buildPastSemesterTemplate(profile, completedCourses),
          reasoning: [],
          accessibility_notes: [],
        };

      const semesters = basePlan.semesters.map((semester, index) => {
        if (index !== semesterIndex) {
          return semester;
        }

        const recommended_courses = semester.recommended_courses.map((course, innerIndex) =>
          innerIndex === courseIndex ? { ...course, [field]: value } : course,
        );
        return recalculateSemesterTotal({ ...semester, recommended_courses });
      });

      return { ...basePlan, semesters };
    });
  };

  const removeAcademicPlanCourse = (semesterIndex, courseIndex) => {
    setAcademicPlan((current) => {
      const basePlan =
        current ??
        {
          plan_title: `${profile.major} academic plan`,
          planning_prompt,
          semesters: buildPastSemesterTemplate(profile, completedCourses),
          reasoning: [],
          accessibility_notes: [],
        };

      const semesters = basePlan.semesters.map((semester, index) => {
        if (index !== semesterIndex) {
          return semester;
        }

        const recommended_courses = semester.recommended_courses.filter((_, innerIndex) => innerIndex !== courseIndex);
        return recalculateSemesterTotal({ ...semester, recommended_courses });
      });

      return { ...basePlan, semesters };
    });
  };

  const addAcademicPlanCourse = (semesterIndex, course) => {
    setAcademicPlan((current) => {
      const basePlan =
        current ??
        {
          plan_title: `${profile.major} academic plan`,
          planning_prompt,
          semesters: buildPastSemesterTemplate(profile, completedCourses),
          reasoning: [],
          accessibility_notes: [],
        };

      const semesters = basePlan.semesters.map((semester, index) => {
        if (index !== semesterIndex) {
          return semester;
        }

        return recalculateSemesterTotal({
          ...semester,
          recommended_courses: [...semester.recommended_courses, course],
        });
      });

      return { ...basePlan, semesters };
    });
  };

  const updateAcademicPlanSemester = (semesterIndex, field, value) => {
    setAcademicPlan((current) => {
      const basePlan =
        current ??
        {
          plan_title: `${profile.major} academic plan`,
          planning_prompt,
          semesters: buildPastSemesterTemplate(profile, completedCourses),
          reasoning: [],
          accessibility_notes: [],
        };

      const semesters = basePlan.semesters.map((semester, index) =>
        index === semesterIndex ? { ...semester, [field]: value } : semester,
      );
      return { ...basePlan, semesters };
    });
  };

  const addAcademicPlanSemester = () => {
    setAcademicPlan((current) => {
      const basePlan =
        current ??
        {
          plan_title: `${profile.major} academic plan`,
          planning_prompt,
          semesters: buildPastSemesterTemplate(profile, completedCourses),
          reasoning: [],
          accessibility_notes: [],
        };

      if (basePlan.semesters.length >= 10) {
        return basePlan;
      }

      const semesterNumber = basePlan.semesters.length + 1;
      return {
        ...basePlan,
        semesters: [
          ...basePlan.semesters,
          {
            term_label: `Semester ${semesterNumber}`,
            focus: "Manual semester",
            recommended_courses: [],
            total_credits: 0,
          },
        ],
      };
    });
  };

  const handleFollowUp = async (question) => {
    if (!recommendation || !submittedProfile) {
      return;
    }

    const nextHistory = [...followUpMessages, { role: "user", content: question }];
    setFollowUpMessages(nextHistory);
    setIsFollowUpLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/follow-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_profile: submittedProfile,
          recommendation,
          question,
          chat_history: nextHistory,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to answer that follow-up question right now.");
      }

      const data = await response.json();
      setFollowUpMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer },
      ]);
    } catch (requestError) {
      setError(requestError.message);
      setFollowUpMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I couldn't answer that follow-up just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  const canExportCurrentView =
    (activeTab === "next-semester" && Boolean(recommendation)) ||
    (activeTab === "academic-plan" && Boolean(displayAcademicPlan?.semesters?.length)) ||
    activeTab === "degree-audit" ||
    activeTab === "my-courses";

  const getCurrentExportPayload = () =>
    buildExportPayload({
      activeTab,
      profile,
      goals,
      preferences,
      completedCourses,
      recommendation,
      academicPlan: displayAcademicPlan,
    });

  const handleCopyExport = async () => {
    if (!canExportCurrentView) {
      return;
    }

    try {
      const payload = getCurrentExportPayload();
      const exportText = buildExportText(payload);
      const exportHtml = buildExportHtml(payload);
      if (window.isSecureContext && navigator.clipboard?.write) {
        const clipboardItem = new ClipboardItem({
          "text/plain": new Blob([exportText], { type: "text/plain" }),
          "text/html": new Blob([exportHtml], { type: "text/html" }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } else if (window.isSecureContext && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(exportText);
      } else {
        const helper = document.createElement("textarea");
        helper.value = exportText;
        helper.setAttribute("readonly", "");
        helper.setAttribute("spellcheck", "false");
        helper.setAttribute("autocorrect", "off");
        helper.setAttribute("autocapitalize", "off");
        helper.setAttribute("autocomplete", "off");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
      }
      setExportStatus("Copied current plan to clipboard.");
    } catch (copyError) {
      setExportStatus("Copy failed. Try the download buttons instead.");
    }
  };

  const handleDownloadExport = (format) => {
    if (!canExportCurrentView) {
      return;
    }

    const payload = getCurrentExportPayload();
    const content =
      format === "json"
        ? JSON.stringify(payload, null, 2)
        : buildExportText(payload);
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${buildExportFilename(activeTab)}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setExportStatus(
      format === "json" ? "Downloaded JSON export." : "Downloaded text export.",
    );
  };

  const currentView = (() => {
    switch (activeTab) {
      case "degree-audit":
        return (
          <DegreeAuditView
            completedCourses={normalizeCompletedCourses(completedCourses)}
            creditCount={profile.creditCount}
            major={profile.major}
            sourceUrl={dataSource.catalogUrl}
            academicPlan={displayAcademicPlan}
          />
        );
      case "academic-plan":
        return (
          <AcademicPlanView
            academicPlan={displayAcademicPlan}
            planningPrompt={planningPrompt}
            lastGeneratedAt={lastPlanGeneratedAt}
            onPlanningPromptChange={setPlanningPrompt}
            onGenerate={handleGenerateAcademicPlan}
            onUpdateCourse={updateAcademicPlanCourse}
            onRemoveCourse={removeAcademicPlanCourse}
            onAddCourse={addAcademicPlanCourse}
            onUpdateSemester={updateAcademicPlanSemester}
            onAddSemester={addAcademicPlanSemester}
            isLoading={isPlanLoading}
          />
        );
      case "my-courses":
        return (
          <MyCoursesView
            completedCourses={normalizeCompletedCourses(completedCourses)}
            creditCount={profile.creditCount}
          />
        );
      case "settings":
        return (
          <SettingsPanel
            profile={profile}
            goals={goals}
            preferences={preferences}
            notifications={notifications}
            dataSource={dataSource}
            onProfileChange={setProfile}
            onGoalsChange={setGoals}
            onPreferencesChange={setPreferences}
            onNotificationsChange={setNotifications}
            onDataSourceChange={setDataSource}
          />
        );
      default:
        return (
          <ScheduleOutput
            recommendation={recommendation}
            submittedProfile={submittedProfile}
            isLoading={isLoading}
            lastGeneratedAt={lastScheduleGeneratedAt}
          />
        );
    }
  })();

  const meta = viewMeta(activeTab);

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <aside style={styles.sidebar}>
          <div style={styles.brandRow}>
            <div style={styles.brandIcon}>
              <img src={ivyLogo} alt="Ivy Advisor AI logo" style={styles.brandImage} />
            </div>
            <div style={styles.brandTextWrap}>
              <p style={styles.brandTitle}>Ivy - Advisor AI</p>
              <p style={styles.brandSub}>Iowa State University</p>
            </div>
          </div>

          <button
            type="button"
            style={styles.profileCard}
            onClick={() => setActiveTab("settings")}
          >
            <div style={styles.avatar}>{getInitials(profile)}</div>
            <div>
              <h2 style={styles.cardTitle}>{formatNameFromProfile(profile)}</h2>
              <p style={styles.cardSub}>
                {profile.major} - {profile.year}
              </p>
              <p style={{ ...styles.cardSub, ...styles.muted }}>
                GPA {profileStats.gpa} - {profile.creditCount} credits
              </p>
            </div>
          </button>

          <button
            type="button"
            style={styles.progressButton}
            onClick={() => setActiveTab("degree-audit")}
          >
            <p style={styles.sectionLabel}>Degree Progress</p>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${profileStats.progressPercent}%`,
                }}
              />
            </div>
            <div style={styles.progressRow}>
              <span>{profile.creditCount}/120 credits</span>
              <span>{profileStats.progressPercent}%</span>
            </div>
          </button>

          <section style={{ display: "grid", gap: "10px" }}>
            <p style={styles.sectionLabel}>Menu</p>
            <div style={styles.menu}>
              {navItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    style={styles.menuButton(active)}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span style={styles.menuDot(active)} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={styles.formCard}>
            <ProfileForm
              profile={profile}
              goals={goals}
              completedCourses={completedCourses}
              onProfileChange={setProfile}
              onGoalsChange={setGoals}
              onCompletedCoursesChange={setCompletedCourses}
              onSubmit={handleSubmit}
              onLoadDemoProfile={handleLoadDemoProfile}
              isLoading={isLoading}
            />
            {error ? <div style={styles.status}>{error}</div> : null}
          </section>
        </aside>

        <section style={styles.main}>
          <div style={styles.content}>
            <header style={styles.topBar}>
              <div>
                <h1 style={styles.topTitle}>{meta.title}</h1>
                <p style={styles.topText}>{meta.subtitle}</p>
                </div>
                <div style={styles.headerActions}>
                  <div style={styles.summaryBadge}>{summaryText}</div>
                  <div style={styles.headerActionRow}>
                    <button
                      type="button"
                      style={styles.subtleButton}
                      onClick={handleResetWorkspace}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      style={styles.exportButton}
                    onClick={handleCopyExport}
                    disabled={!canExportCurrentView}
                  >
                    Copy Plan
                  </button>
                  <button
                    type="button"
                    style={styles.exportButton}
                    onClick={() => handleDownloadExport("txt")}
                    disabled={!canExportCurrentView}
                  >
                    Download .txt
                  </button>
                  <button
                    type="button"
                    style={styles.exportButton}
                    onClick={() => handleDownloadExport("json")}
                    disabled={!canExportCurrentView}
                    >
                      Download .json
                    </button>
                  </div>
                  {exportStatus ? <p style={styles.exportHint}>{exportStatus}</p> : null}
                  {activeTab === "next-semester" && lastScheduleGeneratedAt ? (
                    <p style={styles.exportHint}>
                      Last generated {formatGeneratedTimestamp(lastScheduleGeneratedAt)}
                    </p>
                  ) : null}
                  {activeTab === "academic-plan" && lastPlanGeneratedAt ? (
                    <p style={styles.exportHint}>
                      Last generated {formatGeneratedTimestamp(lastPlanGeneratedAt)}
                    </p>
                  ) : null}
                </div>
              </header>

            <div style={styles.mainPanel}>{currentView}</div>
          </div>

          <ChatBox
            messages={followUpMessages}
            onSend={handleFollowUp}
            disabled={!recommendation || isFollowUpLoading}
            isLoading={isFollowUpLoading}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
