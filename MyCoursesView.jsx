const styles = {
  wrapper: {
    display: "grid",
    gap: "18px",
  },
  hero: {
    display: "grid",
    gap: "8px",
  },
  title: {
    margin: 0,
    color: "#f5f0ea",
    fontSize: "1.8rem",
  },
  text: {
    margin: 0,
    color: "#c2baae",
    lineHeight: 1.6,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  statCard: {
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "16px",
    display: "grid",
    gap: "6px",
  },
  statLabel: {
    margin: 0,
    color: "#9f978c",
    textTransform: "uppercase",
    fontSize: "0.84rem",
    letterSpacing: "0.06em",
  },
  statValue: {
    margin: 0,
    color: "#f5f0ea",
    fontSize: "1.5rem",
    fontWeight: 800,
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  courseInfo: {
    display: "grid",
    gap: "3px",
  },
  courseCode: {
    margin: 0,
    color: "#f4efe8",
    fontWeight: 700,
    fontSize: "1.02rem",
  },
  courseText: {
    margin: 0,
    color: "#bdb4a8",
  },
  gradePill: {
    borderRadius: "999px",
    background: "#e4e0ff",
    color: "#4f49a0",
    padding: "8px 12px",
    fontWeight: 800,
    fontSize: "0.92rem",
  },
};

function calculateGpa(completedCourses) {
  const points = {
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

  if (!completedCourses.length) {
    return "0.0";
  }

  const total = completedCourses.reduce(
    (sum, course) => sum + (points[course.grade] ?? 0),
    0,
  );
  return (total / completedCourses.length).toFixed(2);
}

function MyCoursesView({ completedCourses, creditCount }) {
  const filteredCourses = completedCourses.filter((course) => course.course_code.trim());

  return (
    <section style={styles.wrapper} aria-live="polite">
      <div style={styles.hero}>
        <h2 style={styles.title}>My Courses</h2>
        <p style={styles.text}>
          Review the courses you have already reported as completed. This list is what the recommendation and degree audit use to avoid repeats and estimate your progress.
        </p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Completed courses</p>
          <p style={styles.statValue}>{filteredCourses.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Reported credits</p>
          <p style={styles.statValue}>{creditCount}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Estimated GPA</p>
          <p style={styles.statValue}>{calculateGpa(filteredCourses)}</p>
        </div>
      </div>

      <div style={styles.list}>
        {filteredCourses.length ? (
          filteredCourses.map((course, index) => (
            <div key={`${course.course_code}-${index}`} style={styles.row}>
              <div style={styles.courseInfo}>
                <p style={styles.courseCode}>{course.course_code}</p>
                <p style={styles.courseText}>Previously completed by the student</p>
              </div>
              <span style={styles.gradePill}>{course.grade}</span>
            </div>
          ))
        ) : (
          <div style={styles.row}>
            <div style={styles.courseInfo}>
              <p style={styles.courseCode}>No completed courses yet</p>
              <p style={styles.courseText}>Add prior courses in the sidebar or settings, or load the demo profile to see a fuller example.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default MyCoursesView;
