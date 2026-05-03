import { useState } from "react";

const styles = {
  wrapper: {
    display: "grid",
    gap: "20px",
  },
  hero: {
    display: "grid",
    gap: "8px",
  },
  title: {
    margin: 0,
    color: "#f5f0ea",
    fontSize: "1.7rem",
  },
  text: {
    margin: 0,
    color: "#c2baae",
    lineHeight: 1.6,
  },
  controlCard: {
    display: "grid",
    gap: "12px",
    padding: "18px",
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  modeBanner: {
    display: "grid",
    gap: "6px",
    padding: "16px 18px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #3a3222 0%, #2b2820 100%)",
    border: "1px solid rgba(240, 218, 138, 0.18)",
  },
  modeTitle: {
    margin: 0,
    color: "#f8efcf",
    fontSize: "1rem",
    fontWeight: 800,
  },
  modeText: {
    margin: 0,
    color: "#e7dcc0",
    lineHeight: 1.6,
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#1f1e1c",
    color: "#f3efe8",
    fontSize: "0.96rem",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "#dfdaf7",
    color: "#4a449c",
    border: "none",
    borderRadius: "14px",
    padding: "12px 16px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "#34322e",
    color: "#e1d8cc",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "9px 12px",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  planGrid: {
    display: "grid",
    gap: "16px",
  },
  semesterCard: {
    display: "grid",
    gap: "14px",
    padding: "18px",
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  semesterHeader: {
    display: "grid",
    gap: "12px",
  },
  semesterHeaderRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 140px",
    gap: "10px",
    alignItems: "end",
  },
  semesterInputs: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
    gap: "10px",
  },
  creditsPill: {
    borderRadius: "999px",
    background: "#e5e1ff",
    color: "#5750ad",
    padding: "8px 12px",
    fontWeight: 700,
    fontSize: "0.88rem",
    whiteSpace: "nowrap",
  },
  courseList: {
    display: "grid",
    gap: "10px",
  },
  courseCard: {
    display: "grid",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    background: "#22211f",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr) 90px auto",
    gap: "10px",
    alignItems: "end",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#1c1b19",
    color: "#f3efe8",
    fontSize: "0.92rem",
    boxSizing: "border-box",
  },
  noteInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#1c1b19",
    color: "#cbbfb0",
    fontSize: "0.88rem",
    boxSizing: "border-box",
  },
  label: {
    display: "grid",
    gap: "6px",
    color: "#e8dfd2",
    fontWeight: 600,
    fontSize: "0.88rem",
  },
  emptyCard: {
    display: "grid",
    gap: "8px",
    padding: "22px",
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  reasoningCard: {
    display: "grid",
    gap: "10px",
    padding: "18px",
    borderRadius: "16px",
    background: "#e4e0ff",
    color: "#4f49a0",
    border: "1px solid rgba(115,99,228,0.12)",
  },
  subTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 800,
  },
  list: {
    margin: 0,
    paddingLeft: "18px",
    lineHeight: 1.65,
  },
  smallText: {
    margin: 0,
    color: "#b8b0a4",
    fontSize: "0.84rem",
    lineHeight: 1.5,
  },
};

function recalcTotal(semester) {
  return semester.recommended_courses.reduce(
    (sum, course) => sum + Number(course.credits || 0),
    0,
  );
}

function AcademicPlanView({
  academicPlan,
  planningPrompt,
  onPlanningPromptChange,
  onGenerate,
  onUpdateCourse,
  onRemoveCourse,
  onAddCourse,
  onUpdateSemester,
  onAddSemester,
  isLoading,
  lastGeneratedAt,
}) {
  const safePlan = academicPlan ?? {
    plan_title: "Academic plan",
    planning_prompt: "",
    semesters: [],
    reasoning: [],
    accessibility_notes: [],
    response_mode: "demo",
  };
  const [pendingBySemester, setPendingBySemester] = useState({});

  const setPendingCourse = (semesterIndex, field, value) => {
    setPendingBySemester((current) => ({
      ...current,
      [semesterIndex]: {
        course_code: "",
        title: "",
        credits: 3,
        notes: "",
        ...(current[semesterIndex] ?? {}),
        [field]: value,
      },
    }));
  };

  const addCourseToSemester = (semesterIndex) => {
    const pending = pendingBySemester[semesterIndex] ?? {
      course_code: "",
      title: "",
      credits: 3,
      notes: "",
    };
    if (!pending.course_code.trim() || !pending.title.trim()) {
      return;
    }
    onAddCourse(semesterIndex, {
      course_code: pending.course_code.trim().toUpperCase(),
      title: pending.title.trim(),
      credits: Number(pending.credits || 0),
      notes: pending.notes.trim(),
    });
    setPendingBySemester((current) => ({
      ...current,
      [semesterIndex]: {
        course_code: "",
        title: "",
        credits: 3,
        notes: "",
      },
    }));
  };

  return (
    <section style={styles.wrapper} aria-live="polite">
      <div style={styles.hero}>
        <h2 style={styles.title}>Academic Plan</h2>
        <p style={styles.text}>
          Ask the planner to map out the next few semesters based on your goals, then adjust the plan manually if you want to customize the roadmap.
        </p>
        {!safePlan.semesters.length ? (
          <p style={styles.smallText}>
            No roadmap yet. Generate a plan from your current profile, or load the demo profile to show a full example.
          </p>
        ) : null}
      </div>

      {safePlan.response_mode === "demo" ? (
        <div style={styles.modeBanner}>
          <p style={styles.modeTitle}>Demo Mode</p>
          <p style={styles.modeText}>
            This roadmap is running in demo mode. It still aims to finish the degree within your chosen semester count and keeps the academic plan aligned with the audit during the presentation.
          </p>
        </div>
      ) : null}

      <div style={styles.controlCard}>
        <label style={styles.label}>
          Planning prompt
          <textarea
            style={styles.textarea}
            value={planningPrompt}
            onChange={(event) => onPlanningPromptChange(event.target.value)}
            placeholder="Build me a balanced path to graduation with internship-friendly courses and manageable credit loads."
          />
        </label>
        <div style={styles.actions}>
          <button type="button" style={styles.primaryButton} onClick={onGenerate} disabled={isLoading}>
            {isLoading ? "Generating plan..." : "Generate Academic Plan"}
          </button>
        </div>
      </div>

      <>
        <div style={styles.actions}>
          <button type="button" style={styles.secondaryButton} onClick={onAddSemester} disabled={safePlan.semesters.length >= 10}>
            Add Semester
          </button>
          <p style={styles.smallText}>
            You can build up to 10 total semesters. The planner will usually target 8 for a standard 4-year path.
          </p>
          {lastGeneratedAt ? (
            <p style={styles.smallText}>
              Last generated {new Date(lastGeneratedAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
          ) : null}
        </div>

        <div style={styles.planGrid}>
          {safePlan.semesters.map((semester, semesterIndex) => (
              <div key={`${semester.term_label}-${semesterIndex}`} style={styles.semesterCard}>
                <div style={styles.semesterHeader}>
                  <div style={styles.semesterHeaderRow}>
                    <div style={styles.semesterInputs}>
                      <label style={styles.label}>
                        Term label
                        <input
                          style={styles.input}
                          value={semester.term_label}
                          onChange={(event) => onUpdateSemester(semesterIndex, "term_label", event.target.value)}
                        />
                      </label>
                      <label style={styles.label}>
                        Focus
                        <input
                          style={styles.input}
                          value={semester.focus}
                          onChange={(event) => onUpdateSemester(semesterIndex, "focus", event.target.value)}
                        />
                      </label>
                    </div>
                    <span style={styles.creditsPill}>{recalcTotal(semester)} credits</span>
                  </div>
                </div>

                <div style={styles.courseList}>
                  {semester.recommended_courses.map((course, courseIndex) => (
                    <div key={`${course.course_code}-${courseIndex}`} style={styles.courseCard}>
                      <div style={styles.row}>
                        <label style={styles.label}>
                          Course
                          <input
                            style={styles.input}
                            value={course.course_code}
                            onChange={(event) =>
                              onUpdateCourse(semesterIndex, courseIndex, "course_code", event.target.value.toUpperCase())
                            }
                          />
                        </label>
                        <label style={styles.label}>
                          Title
                          <input
                            style={styles.input}
                            value={course.title}
                            onChange={(event) =>
                              onUpdateCourse(semesterIndex, courseIndex, "title", event.target.value)
                            }
                          />
                        </label>
                        <label style={styles.label}>
                          Credits
                          <input
                            style={styles.input}
                            type="number"
                            min="0"
                            max="21"
                            value={course.credits}
                            onChange={(event) =>
                              onUpdateCourse(semesterIndex, courseIndex, "credits", Number(event.target.value || 0))
                            }
                          />
                        </label>
                        <button
                          type="button"
                          style={styles.secondaryButton}
                          onClick={() => onRemoveCourse(semesterIndex, courseIndex)}
                        >
                          Remove
                        </button>
                      </div>
                      <label style={styles.label}>
                        Notes
                        <input
                          style={styles.noteInput}
                          value={course.notes}
                          onChange={(event) =>
                            onUpdateCourse(semesterIndex, courseIndex, "notes", event.target.value)
                          }
                        />
                      </label>
                    </div>
                  ))}

                  <div style={styles.courseCard}>
                    <div style={styles.row}>
                      <label style={styles.label}>
                        Course
                        <input
                          style={styles.input}
                          value={pendingBySemester[semesterIndex]?.course_code ?? ""}
                          onChange={(event) => setPendingCourse(semesterIndex, "course_code", event.target.value)}
                          placeholder="COM S 363"
                        />
                      </label>
                      <label style={styles.label}>
                        Title
                        <input
                          style={styles.input}
                          value={pendingBySemester[semesterIndex]?.title ?? ""}
                          onChange={(event) => setPendingCourse(semesterIndex, "title", event.target.value)}
                          placeholder="Intro to Database Systems"
                        />
                      </label>
                      <label style={styles.label}>
                        Credits
                        <input
                          style={styles.input}
                          type="number"
                          min="0"
                          max="21"
                          value={pendingBySemester[semesterIndex]?.credits ?? 3}
                          onChange={(event) => setPendingCourse(semesterIndex, "credits", Number(event.target.value || 0))}
                        />
                      </label>
                      <button
                        type="button"
                        style={styles.secondaryButton}
                        onClick={() => addCourseToSemester(semesterIndex)}
                      >
                        Add course
                      </button>
                    </div>
                    <label style={styles.label}>
                      Notes
                      <input
                        style={styles.noteInput}
                        value={pendingBySemester[semesterIndex]?.notes ?? ""}
                        onChange={(event) => setPendingCourse(semesterIndex, "notes", event.target.value)}
                        placeholder="Optional note about why this belongs in the plan"
                      />
                    </label>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <div style={styles.reasoningCard}>
          <p style={styles.subTitle}>Why this plan?</p>
          <ul style={styles.list}>
            {safePlan.reasoning?.length ? (
              safePlan.reasoning.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))
            ) : (
              <li>Use the semesters above as your starting roadmap, then generate the remaining terms when you are ready.</li>
            )}
          </ul>
          <p style={styles.subTitle}>Accessibility notes</p>
          <ul style={styles.list}>
            {safePlan.accessibility_notes?.length ? (
              safePlan.accessibility_notes.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))
            ) : (
              <li>Manual editing lets you correct or personalize the roadmap whenever the AI estimate is not quite right.</li>
            )}
          </ul>
        </div>
      </>
    </section>
  );
}

export default AcademicPlanView;
