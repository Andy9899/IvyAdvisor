import { useState } from "react";

const styles = {
  wrapper: {
    display: "grid",
    gap: "20px",
  },
  animated: (delay = 0) => ({
    opacity: 0,
    transform: "translateY(14px)",
    animation: "scheduleFadeUp 420ms ease forwards",
    animationDelay: `${delay}ms`,
  }),
  confidenceRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  modeBanner: {
    borderRadius: "16px",
    padding: "16px 18px",
    background: "linear-gradient(135deg, #3a3222 0%, #2b2820 100%)",
    border: "1px solid rgba(240, 218, 138, 0.18)",
    color: "#f1e6bd",
    display: "grid",
    gap: "6px",
  },
  modeBannerTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 800,
    color: "#f8efcf",
  },
  modeBannerText: {
    margin: 0,
    lineHeight: 1.6,
    color: "#e7dcc0",
  },
  confidencePill: (tone) => ({
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "0.88rem",
    fontWeight: 700,
    background:
      tone === "success"
        ? "#dcebbf"
        : tone === "info"
          ? "#e4e0ff"
          : "#3a3835",
    color:
      tone === "success"
        ? "#4b5d27"
        : tone === "info"
          ? "#4f49a0"
          : "#d7cfbf",
  }),
  loadingCard: {
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#2f2e2b",
    padding: "20px",
    color: "#d8d0c5",
    lineHeight: 1.6,
  },
  emptyCard: {
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#2f2e2b",
    padding: "22px",
    display: "grid",
    gap: "10px",
  },
  heading: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#f7f3ed",
  },
  emptyText: {
    margin: 0,
    color: "#c6beb2",
    lineHeight: 1.6,
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  },
  courseCard: {
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#2b2a27",
    padding: "16px 18px",
    display: "grid",
    gap: "12px",
    minHeight: "182px",
  },
  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "start",
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: (tone) => ({
    borderRadius: "999px",
    padding: "5px 9px",
    fontSize: "0.8rem",
    fontWeight: 700,
    background:
      tone === "difficulty"
        ? "#3f3a22"
        : tone === "ready"
          ? "#22352a"
          : "#373633",
    color:
      tone === "difficulty"
        ? "#f0da8a"
        : tone === "ready"
          ? "#b9e7c7"
          : "#d9d1c4",
  }),
  courseCode: {
    margin: 0,
    color: "#948d82",
    fontWeight: 700,
    fontSize: "1rem",
  },
  courseTitle: {
    margin: 0,
    color: "#f5f0ea",
    fontSize: "1.9rem",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    fontWeight: 700,
  },
  courseMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "center",
    color: "#ddd5c9",
  },
  professorPill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    background: "#dcebbf",
    color: "#4b5d27",
    padding: "5px 10px",
    fontWeight: 700,
    fontSize: "0.92rem",
    border: "none",
    cursor: "pointer",
  },
  professorDropdown: {
    display: "grid",
    gap: "8px",
    padding: "10px",
    borderRadius: "12px",
    background: "#232220",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  professorOption: {
    display: "grid",
    gap: "4px",
    padding: "9px 10px",
    borderRadius: "10px",
    background: "#2c2b28",
  },
  professorNameRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  professorName: {
    margin: 0,
    color: "#f5f0ea",
    fontSize: "0.92rem",
    fontWeight: 700,
  },
  professorRating: {
    margin: 0,
    color: "#d9d1c4",
    fontSize: "0.84rem",
  },
  professorMeta: {
    margin: 0,
    color: "#a79f92",
    fontSize: "0.82rem",
  },
  professorLink: {
    color: "#b8b0ff",
    fontWeight: 700,
    fontSize: "0.82rem",
    textDecoration: "none",
  },
  professorFallback: {
    margin: 0,
    color: "#bfb6aa",
    fontSize: "0.84rem",
    lineHeight: 1.5,
  },
  whyNow: {
    margin: 0,
    color: "#ded5c9",
    lineHeight: 1.55,
    fontSize: "0.96rem",
  },
  explanationCard: {
    borderRadius: "16px",
    background: "#e4e0ff",
    color: "#4f49a0",
    padding: "18px 20px",
    display: "grid",
    gap: "10px",
    border: "1px solid rgba(115, 99, 228, 0.12)",
  },
  explanationTitle: {
    margin: 0,
    fontWeight: 800,
    fontSize: "1.05rem",
  },
  explanationText: {
    margin: 0,
    fontSize: "1rem",
    lineHeight: 1.7,
  },
  supportCard: {
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#2f2e2b",
    padding: "18px 20px",
    display: "grid",
    gap: "12px",
  },
  supportTitle: {
    margin: 0,
    color: "#f3eee7",
    fontSize: "1rem",
  },
  supportList: {
    margin: 0,
    paddingLeft: "18px",
    color: "#cbc3b7",
    lineHeight: 1.65,
  },
  lifestyleCard: {
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#2f2e2b",
    padding: "18px 20px",
    display: "grid",
    gap: "12px",
  },
};

function shortProfessorRating(rating) {
  if (!rating) {
    return "Rating unavailable";
  }

  const match = rating.match(/^([0-9.]+\/5)/);
  return match ? match[1] : rating;
}

function difficultyLabel(rating) {
  const match = rating?.match(/difficulty ([0-9.]+)/i);
  if (!match) {
    return "Difficulty varies";
  }

  const value = Number(match[1]);
  if (value <= 2.3) {
    return `Lighter ${value.toFixed(1)}`;
  }
  if (value <= 3.4) {
    return `Moderate ${value.toFixed(1)}`;
  }
  return `Heavy ${value.toFixed(1)}`;
}

function categoryLabel(courseCode) {
  const normalized = courseCode.toUpperCase();
  if (normalized.includes("ELECTIVE")) {
    return "Flexible elective";
  }
  if (normalized.startsWith("COM S 3") || normalized.startsWith("COMS 3")) {
    return "Upper-level core";
  }
  if (normalized.startsWith("COM S 2") || normalized.startsWith("COMS 2")) {
    return "Foundation core";
  }
  if (normalized.startsWith("MATH") || normalized.startsWith("STAT")) {
    return "Math support";
  }
  if (normalized.startsWith("CPRE") || normalized.startsWith("SE")) {
    return "Supporting requirement";
  }
  return "Degree progress";
}

function whyNowLabel(whyThisCourse) {
  const text = whyThisCourse?.trim() ?? "";
  if (!text) {
    return "Chosen to keep your semester moving forward.";
  }

  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

function buildConfidenceItems(recommendation) {
  const reasoning = (recommendation?.reasoning ?? []).join(" ").toLowerCase();
  return [
    {
      label: "Prereqs checked",
      tone: reasoning.includes("prerequisite") || reasoning.includes("prereq") ? "success" : "info",
    },
    {
      label: "Professor ratings included",
      tone: recommendation?.recommended_courses?.some((course) => course.professor_rating) ? "success" : "info",
    },
    {
      label: "Credit cap respected",
      tone: reasoning.includes("target load") || reasoning.includes("credit goal") ? "success" : "info",
    },
    {
      label: "Plain-language reasoning",
      tone: recommendation?.reasoning?.length ? "success" : "info",
    },
  ];
}

function buildExplanation(recommendation) {
  if (!recommendation) {
    return "";
  }

  const reasonBlock = recommendation.reasoning?.join(" ") ?? "";
  const supportBlock = recommendation.accessibility_notes?.[0] ?? "";
  return `${reasonBlock} ${supportBlock}`.trim();
}

function professorOptionSummary(option) {
  return `${option.overall_quality}/5 - difficulty ${option.difficulty} - ${option.ratings_count} ratings`;
}

function professorPillLabel(course) {
  if (course.professor_options?.length) {
    return `Professor options ${course.professor_options.length}`;
  }
  if (course.professor) {
    return course.professor;
  }
  return "Professor info";
}

function professorPillRating(course) {
  if (course.professor_options?.length) {
    return shortProfessorRating(
      `${course.professor_options[0].overall_quality}/5`,
    );
  }
  return shortProfessorRating(course.professor_rating);
}

function ScheduleOutput({ recommendation, submittedProfile, isLoading, lastGeneratedAt }) {
  const [expandedCourseCode, setExpandedCourseCode] = useState(null);

  if (isLoading) {
    return (
      <section style={styles.wrapper} aria-live="polite">
        <div style={styles.loadingCard}>
          Reviewing your profile, matching degree progress, and building a next-semester plan with plain-language reasoning.
        </div>
      </section>
    );
  }

  if (!recommendation) {
    return (
      <section style={styles.wrapper}>
        <div style={styles.emptyCard}>
          <h2 style={styles.heading}>Recommended Schedule</h2>
          <p style={styles.emptyText}>
            Your course recommendations, professor ratings, and plain-language explanation will appear here after you generate a schedule.
          </p>
          <p style={styles.emptyText}>
            Start by using the sidebar form, or press <strong>Load Demo Profile</strong> for a presentation-ready example.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.wrapper} aria-live="polite">
      <style>
        {`
          @keyframes scheduleFadeUp {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {recommendation.response_mode === "demo" ? (
        <div style={{ ...styles.modeBanner, ...styles.animated(10) }}>
          <p style={styles.modeBannerTitle}>Demo Mode</p>
          <p style={styles.modeBannerText}>
            This schedule is running in demo mode. Prerequisites, credit caps, degree progress, and professor context are still being applied so the experience stays reliable during the presentation.
          </p>
        </div>
      ) : null}

      <div style={{ ...styles.confidenceRow, ...styles.animated(20) }}>
        {buildConfidenceItems(recommendation).map((item) => (
          <span key={item.label} style={styles.confidencePill(item.tone)}>
            {item.label}
          </span>
        ))}
      </div>

      <div style={styles.courseGrid}>
        {recommendation.recommended_courses.map((course, index) => (
          <article
            key={`${course.course_code}-${index}`}
            style={{ ...styles.courseCard, ...styles.animated(70 + index * 80) }}
          >
            <div style={styles.courseHeader}>
              <p style={styles.courseCode}>{course.course_code}</p>
              <div style={styles.chipRow}>
                <span style={styles.chip()}>{categoryLabel(course.course_code)}</span>
                <span style={styles.chip("difficulty")}>{difficultyLabel(course.professor_rating)}</span>
              </div>
            </div>
            <h3 style={styles.courseTitle}>{course.title}</h3>
            <div style={styles.courseMeta}>
              <span>{course.credits} cr</span>
              <button
                type="button"
                style={styles.professorPill}
                onClick={() =>
                  setExpandedCourseCode((current) =>
                    current === `${course.course_code}-${index}`
                      ? null
                      : `${course.course_code}-${index}`,
                  )
                }
              >
                {professorPillLabel(course)} {professorPillRating(course)}
              </button>
            </div>
            {expandedCourseCode === `${course.course_code}-${index}` ? (
              <div style={styles.professorDropdown}>
                <p style={styles.professorFallback}>
                  These are likely or recent Rate My Professors options for this course, not guaranteed current teaching assignments.
                </p>
                {course.professor_options?.length ? (
                  course.professor_options.map((option) => (
                    <div key={`${course.course_code}-${option.name}`} style={styles.professorOption}>
                      <div style={styles.professorNameRow}>
                        <p style={styles.professorName}>{option.name}</p>
                        <a
                          href={option.url}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.professorLink}
                        >
                          Rate My Professor
                        </a>
                      </div>
                      <p style={styles.professorRating}>{professorOptionSummary(option)}</p>
                      <p style={styles.professorMeta}>
                        Would take again: {option.would_take_again} - {option.department}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={styles.professorFallback}>
                    Professor options have not loaded for this course yet. Restart the backend and generate the schedule again to pull the latest list.
                  </p>
                )}
              </div>
            ) : null}
            <div style={styles.chipRow}>
              <span style={styles.chip("ready")}>Eligible this semester</span>
              <span style={styles.chip()}>Why now</span>
            </div>
            <p style={styles.whyNow}>{whyNowLabel(course.why_this_course)}</p>
          </article>
        ))}
      </div>

      <div style={{ ...styles.explanationCard, ...styles.animated(220) }}>
        <p style={styles.explanationTitle}>Why these courses?</p>
        <p style={styles.explanationText}>{buildExplanation(recommendation)}</p>
      </div>

      {recommendation.daily_life_outlook?.length ? (
        <div style={{ ...styles.lifestyleCard, ...styles.animated(260) }}>
          <h3 style={styles.supportTitle}>What daily life may feel like</h3>
          <ul style={styles.supportList}>
            {recommendation.daily_life_outlook.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div style={{ ...styles.supportCard, ...styles.animated(300) }}>
        <h3 style={styles.supportTitle}>
          Support Notes for {submittedProfile?.major || "your plan"}
        </h3>
        {lastGeneratedAt ? (
          <p style={styles.emptyText}>
            Last generated {new Date(lastGeneratedAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </p>
        ) : null}
        <ul style={styles.supportList}>
          {recommendation.accessibility_notes.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ScheduleOutput;
