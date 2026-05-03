import { useRef, useState } from "react";

const yearOptions = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
];

const gradeOptions = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
const recognizedCourseCodes = new Set([
  "COMS101", "COMS1010", "COMS127", "COMS1270", "COMS227", "COMS2270", "COMS228", "COMS2280",
  "COMS230", "COMS2300", "COMS309", "COMS3090", "COMS311", "COMS3110", "COMS319", "COMS3190",
  "COMS321", "COMS3210", "COMS327", "COMS3270", "COMS331", "COMS3310", "COMS342", "COMS3420",
  "COMS352", "COMS3520", "COMS363", "COMS3630", "COMS402", "COMS4020", "CPRE281", "CPRE2810",
  "ENGL150", "ENGL1500", "ENGL250", "ENGL2500", "LAS203", "LAS2030", "LIB160", "LIB1600",
  "MATH143", "MATH1430", "MATH165", "MATH1650", "MATH166", "MATH1660", "SE185", "SPCM212",
  "SPCM2120", "STAT3005", "STAT3030", "STAT3441", "STAT3447",
]);

const styles = {
  wrapper: {
    display: "grid",
    gap: "14px",
  },
  header: {
    display: "grid",
    gap: "4px",
  },
  title: {
    margin: 0,
    fontSize: "1.02rem",
    color: "#f4f1eb",
  },
  text: {
    margin: 0,
    color: "#bcb4a8",
    lineHeight: 1.55,
    fontSize: "0.92rem",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))",
    gap: "12px",
  },
  label: {
    display: "grid",
    gap: "7px",
    fontWeight: 600,
    color: "#ece5d9",
    fontSize: "0.92rem",
  },
  input: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    background: "#201f1d",
    color: "#f3efe8",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
  textarea: {
    minHeight: "94px",
    resize: "vertical",
  },
  section: {
    display: "grid",
    gap: "10px",
    padding: "12px",
    borderRadius: "14px",
    background: "#252421",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#f3efe8",
  },
  helpText: {
    margin: 0,
    color: "#a8a093",
    fontSize: "0.84rem",
  },
  courseRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    padding: "10px",
    borderRadius: "12px",
    background: "#201f1d",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  courseInfo: {
    display: "grid",
    gap: "4px",
    minWidth: 0,
  },
  courseName: {
    margin: 0,
    color: "#f3efe8",
    fontSize: "0.95rem",
    fontWeight: 700,
    wordBreak: "break-word",
  },
  courseGrade: {
    margin: 0,
    color: "#b8b0a4",
    fontSize: "0.84rem",
  },
  courseMetaRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "10px",
    alignItems: "end",
  },
  controls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  creditModeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  modeButton: (active) => ({
    background: active ? "#dfdaf7" : "#34322e",
    color: active ? "#4a449c" : "#e1d8cc",
    border: active ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    padding: "9px 12px",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
  }),
  helperText: {
    margin: 0,
    color: "#9f978c",
    fontSize: "0.82rem",
    lineHeight: 1.45,
  },
  addCourseRow: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
  },
  addCourseFields: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 110px",
    gap: "10px",
    alignItems: "end",
  },
  addButtonRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  courseList: {
    display: "grid",
    gap: "10px",
    maxHeight: "240px",
    overflowY: "auto",
    paddingRight: "4px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    background: "#201f1d",
    color: "#f3efe8",
    fontSize: "0.92rem",
    boxSizing: "border-box",
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
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    padding: "9px 12px",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  tertiaryButton: {
    background: "#2f2c44",
    color: "#dcd7ff",
    border: "1px solid rgba(184, 176, 255, 0.18)",
    borderRadius: "12px",
    padding: "9px 12px",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

function ProfileForm({
  profile,
  goals,
  completedCourses,
  onProfileChange,
  onGoalsChange,
  onCompletedCoursesChange,
  onSubmit,
  onLoadDemoProfile,
  isLoading,
}) {
  const [pendingCourse, setPendingCourse] = useState({ course_code: "", grade: "A" });
  const [courseError, setCourseError] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const courseInputRef = useRef(null);

  const normalizeCode = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const isRecognizedCourse = (value) => recognizedCourseCodes.has(normalizeCode(value));

  const addCourse = () => {
    const nextCode = pendingCourse.course_code.trim();
    if (!nextCode) {
      setCourseError("Enter a course code before adding.");
      courseInputRef.current?.focus();
      return;
    }

    const duplicateExists = completedCourses.some(
      (course) => normalizeCode(course.course_code) === normalizeCode(nextCode),
    );
    if (duplicateExists) {
      setCourseError("That course is already in your completed list.");
      courseInputRef.current?.focus();
      return;
    }

    if (!isRecognizedCourse(nextCode)) {
      setCourseError("That course is not recognized yet. Check the code format before adding it.");
      courseInputRef.current?.focus();
      return;
    }

    onCompletedCoursesChange([
      ...completedCourses,
      { course_code: nextCode.toUpperCase(), grade: pendingCourse.grade },
    ]);
    setPendingCourse({ course_code: "", grade: "A" });
    setCourseError("");
    courseInputRef.current?.focus();
  };

  const removeCourse = (index) => {
    setCourseError("");
    onCompletedCoursesChange(
      completedCourses.filter((_, courseIndex) => courseIndex !== index),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const filteredCourses = completedCourses.filter((course) => {
    if (!courseSearch.trim()) {
      return true;
    }

    const search = courseSearch.trim().toLowerCase();
    return (
      course.course_code.toLowerCase().includes(search) ||
      course.grade.toLowerCase().includes(search)
    );
  });

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Student Setup</h2>
        <p style={styles.text}>
          Update your profile, completed courses, and goals to personalize the next-semester recommendation.
        </p>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.fieldGrid}>
          <label style={styles.label}>
            Major
            <input
              style={styles.input}
              type="text"
              value={profile.major}
              onChange={(event) =>
                onProfileChange({ ...profile, major: event.target.value })
              }
              placeholder="Computer Science"
              required
            />
          </label>

          <label style={styles.label}>
            Year
            <select
              style={styles.input}
              value={profile.year}
              onChange={(event) =>
                onProfileChange({ ...profile, year: event.target.value })
              }
              required
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Credits
            <input
              style={styles.input}
              type="number"
              min="0"
              max="180"
              value={profile.creditCount}
              disabled={profile.creditMode === "auto"}
              onChange={(event) =>
                onProfileChange({
                  ...profile,
                  creditMode: "manual",
                  creditCount: Number(event.target.value || 0),
                })
              }
            />
          </label>
        </div>

        <div style={styles.creditModeRow}>
          <button
            type="button"
            style={styles.modeButton(profile.creditMode === "auto")}
            onClick={() =>
              onProfileChange({
                ...profile,
                creditMode: "auto",
              })
            }
          >
            Auto credits
          </button>
          <button
            type="button"
            style={styles.modeButton(profile.creditMode === "manual")}
            onClick={() =>
              onProfileChange({
                ...profile,
                creditMode: "manual",
              })
            }
          >
            Manual override
          </button>
        </div>
        <p style={styles.helperText}>
          Auto mode estimates total credits from the completed courses you enter. Switch to manual override if you need to correct the number yourself.
        </p>

        <section style={styles.section} aria-labelledby="completed-courses-heading">
          <div style={styles.sectionHeader}>
            <div>
              <h3 id="completed-courses-heading" style={styles.sectionTitle}>
                Completed Courses
              </h3>
              <p style={styles.helpText}>
                Add what you have already passed.
              </p>
            </div>
          </div>

          <div style={styles.addCourseRow}>
            <div style={styles.addCourseFields}>
              <label style={styles.label}>
                Course
                <input
                  ref={courseInputRef}
                  style={styles.input}
                  type="text"
                  value={pendingCourse.course_code}
                  onChange={(event) =>
                    setPendingCourse((current) => ({
                      ...current,
                      course_code: event.target.value,
                    }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCourse();
                    }
                  }}
                  placeholder="COM S 228"
                />
              </label>

              <label style={styles.label}>
                Grade
                <select
                  style={styles.input}
                  value={pendingCourse.grade}
                  onChange={(event) =>
                    setPendingCourse((current) => ({
                      ...current,
                      grade: event.target.value,
                    }))
                  }
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={styles.addButtonRow}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={addCourse}
              >
                Add
              </button>
            </div>
          </div>

          {courseError ? <p style={styles.helperText}>{courseError}</p> : null}

          <input
            style={styles.searchInput}
            type="text"
            value={courseSearch}
            onChange={(event) => setCourseSearch(event.target.value)}
            placeholder="Search completed courses to remove..."
          />

          <div style={styles.courseList}>
            {filteredCourses.map((course) => {
              const index = completedCourses.findIndex(
                (candidate) =>
                  candidate.course_code === course.course_code && candidate.grade === course.grade,
              );

              return (
              <div key={`${course.course_code}-${index}`} style={styles.courseRow}>
                <div style={styles.courseInfo}>
                  <p style={styles.courseName}>{course.course_code}</p>
                  <p style={styles.courseGrade}>Grade: {course.grade}</p>
                </div>

                <div style={styles.courseMetaRow}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => removeCourse(index)}
                    disabled={completedCourses.length === 1 || index === -1}
                    aria-label={`Remove completed course ${course.course_code}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
              );
            })}
            {!filteredCourses.length ? (
              <p style={styles.helperText}>No completed courses match that search.</p>
            ) : null}
          </div>
        </section>

        <label style={styles.label}>
          Academic Goals
          <textarea
            style={{ ...styles.input, ...styles.textarea }}
            value={goals.summary}
            onChange={(event) =>
              onGoalsChange({ ...goals, summary: event.target.value })
            }
            placeholder="Balanced workload, internships, graduation timing, support needs..."
            required
          />
        </label>

        <div style={styles.controls}>
          <button
            type="button"
            style={styles.tertiaryButton}
            onClick={onLoadDemoProfile}
            disabled={isLoading}
          >
            Load Demo Profile
          </button>
          <button type="submit" style={styles.primaryButton} disabled={isLoading}>
            {isLoading ? "Planning..." : "Generate Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
