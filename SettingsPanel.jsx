const yearOptions = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
];

const courseLoadOptions = ["Light", "Balanced", "Heavy"];
const pathOptions = ["Industry job", "Graduate school", "Still deciding"];
const dayPatternOptions = ["MWF", "TTh", "No preference"];

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
  section: {
    display: "grid",
    gap: "14px",
    padding: "18px",
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  sectionTitle: {
    margin: 0,
    color: "#f4efe8",
    fontSize: "1.05rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  label: {
    display: "grid",
    gap: "7px",
    color: "#ece5d9",
    fontWeight: 600,
    fontSize: "0.92rem",
  },
  modeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  modeButton: (active) => ({
    background: active ? "#dfdaf7" : "#201f1d",
    color: active ? "#4a449c" : "#ece5d9",
    border: active ? "none" : "1px solid rgba(255, 255, 255, 0.09)",
    borderRadius: "12px",
    padding: "9px 12px",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
  }),
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
    minHeight: "96px",
    resize: "vertical",
  },
  checkboxRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    color: "#ece5d9",
    fontWeight: 600,
  },
  link: {
    color: "#b8b0ff",
    textDecoration: "none",
    fontWeight: 700,
  },
  helper: {
    margin: 0,
    color: "#a8a093",
    fontSize: "0.84rem",
    lineHeight: 1.45,
  },
};

function SettingsPanel({ profile, goals, preferences, notifications, dataSource, onProfileChange, onGoalsChange, onPreferencesChange, onNotificationsChange, onDataSourceChange }) {
  return (
    <section style={styles.wrapper} aria-live="polite">
      <div style={styles.hero}>
        <h2 style={styles.title}>Settings</h2>
        <p style={styles.text}>
          Update your profile details, goals, schedule preferences, notifications, and catalog source. Changes here feed the rest of the dashboard.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Profile Info</h3>
        <div style={styles.grid}>
          <label style={styles.label}>
            Major
            <input style={styles.input} value={profile.major} onChange={(event) => onProfileChange({ ...profile, major: event.target.value })} />
          </label>
          <label style={styles.label}>
            Year
            <select style={styles.input} value={profile.year} onChange={(event) => onProfileChange({ ...profile, year: event.target.value })}>
              {yearOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label style={styles.label}>
            Credit count
            <input style={styles.input} type="number" min="0" max="180" value={profile.creditCount} disabled={profile.creditMode === "auto"} onChange={(event) => onProfileChange({ ...profile, creditMode: "manual", creditCount: Number(event.target.value || 0) })} />
          </label>
        </div>
        <div style={styles.modeRow}>
          <button type="button" style={styles.modeButton(profile.creditMode === "auto")} onClick={() => onProfileChange({ ...profile, creditMode: "auto" })}>
            Auto credits
          </button>
          <button type="button" style={styles.modeButton(profile.creditMode === "manual")} onClick={() => onProfileChange({ ...profile, creditMode: "manual" })}>
            Manual override
          </button>
        </div>
        <p style={styles.helper}>
          Auto mode estimates credits from your completed-course list. Manual override lets you correct the number if the estimate is off.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Goals</h3>
        <div style={styles.grid}>
          <label style={styles.label}>
            Graduation timeline
            <input style={styles.input} value={goals.timeline} onChange={(event) => onGoalsChange({ ...goals, timeline: event.target.value })} placeholder="Graduate in Spring 2027" />
          </label>
          <label style={styles.label}>
            Grad school vs job
            <select style={styles.input} value={goals.path} onChange={(event) => onGoalsChange({ ...goals, path: event.target.value })}>
              {pathOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label style={styles.label}>
            Course load preference
            <select style={styles.input} value={goals.courseLoadPreference} onChange={(event) => onGoalsChange({ ...goals, courseLoadPreference: event.target.value })}>
              {courseLoadOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <label style={styles.label}>
          Goal summary
          <textarea style={{ ...styles.input, ...styles.textarea }} value={goals.summary} onChange={(event) => onGoalsChange({ ...goals, summary: event.target.value })} />
        </label>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Preferences</h3>
        <div style={styles.grid}>
          <label style={styles.label}>
            Avoid 8am classes
            <select style={styles.input} value={preferences.avoidEarly ? "Yes" : "No"} onChange={(event) => onPreferencesChange({ ...preferences, avoidEarly: event.target.value === "Yes" })}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
          <label style={styles.label}>
            Preferred class days
            <select style={styles.input} value={preferences.dayPattern} onChange={(event) => onPreferencesChange({ ...preferences, dayPattern: event.target.value })}>
              {dayPatternOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label style={styles.label}>
            Max credits per semester
            <input style={styles.input} type="number" min="6" max="21" value={preferences.maxCredits} onChange={(event) => onPreferencesChange({ ...preferences, maxCredits: Number(event.target.value || 0) })} />
          </label>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Notifications</h3>
        <div style={styles.grid}>
          <label style={styles.checkboxRow}>
            <input type="checkbox" checked={notifications.registrationOpen} onChange={(event) => onNotificationsChange({ ...notifications, registrationOpen: event.target.checked })} />
            Remind me when registration opens
          </label>
          <label style={styles.checkboxRow}>
            <input type="checkbox" checked={notifications.fallingBehind} onChange={(event) => onNotificationsChange({ ...notifications, fallingBehind: event.target.checked })} />
            Alert if I am falling behind
          </label>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Data Sources</h3>
        <div style={styles.grid}>
          <label style={styles.label}>
            School catalog name
            <input style={styles.input} value={dataSource.schoolName} onChange={(event) => onDataSourceChange({ ...dataSource, schoolName: event.target.value })} />
          </label>
          <label style={styles.label}>
            Catalog URL
            <input style={styles.input} value={dataSource.catalogUrl} onChange={(event) => onDataSourceChange({ ...dataSource, catalogUrl: event.target.value })} />
          </label>
        </div>
        <a href={dataSource.catalogUrl} target="_blank" rel="noreferrer" style={styles.link}>
          Open current catalog source
        </a>
      </div>
    </section>
  );
}

export default SettingsPanel;
