const DEGREE_CREDIT_TARGET = 120;

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
    lineHeight: 1.1,
  },
  text: {
    margin: 0,
    color: "#c2baae",
    lineHeight: 1.6,
  },
  sourceLink: {
    color: "#b8b0ff",
    textDecoration: "none",
    fontWeight: 700,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  banner: (tone) => ({
    borderRadius: "18px",
    padding: "18px 20px",
    display: "grid",
    gap: "8px",
    background:
      tone === "good"
        ? "linear-gradient(135deg, #22382c 0%, #1f2e25 100%)"
        : tone === "watch"
          ? "linear-gradient(135deg, #3a3222 0%, #2c2820 100%)"
          : "linear-gradient(135deg, #3a2327 0%, #2c1f22 100%)",
    border:
      tone === "good"
        ? "1px solid rgba(185, 231, 199, 0.18)"
        : tone === "watch"
          ? "1px solid rgba(240, 218, 138, 0.18)"
          : "1px solid rgba(244, 171, 171, 0.18)",
  }),
  bannerTitle: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 800,
    color: "#f4efe8",
  },
  bannerText: {
    margin: 0,
    color: "#ddd5c9",
    lineHeight: 1.6,
  },
  summaryCard: {
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "16px",
    display: "grid",
    gap: "6px",
  },
  summaryLabel: {
    margin: 0,
    color: "#9f978c",
    fontSize: "0.84rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  summaryValue: {
    margin: 0,
    color: "#f5f0ea",
    fontSize: "1.45rem",
    fontWeight: 800,
  },
  sectionCard: {
    borderRadius: "16px",
    background: "#2f2e2b",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "18px",
    display: "grid",
    gap: "14px",
  },
  sectionHeader: {
    display: "grid",
    gap: "6px",
  },
  sectionTitle: {
    margin: 0,
    color: "#f5f0ea",
    fontSize: "1.05rem",
  },
  sectionText: {
    margin: 0,
    color: "#b8b0a4",
    lineHeight: 1.55,
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
  bucketGrid: {
    display: "grid",
    gap: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "#272624",
  },
  courseInfo: {
    display: "grid",
    gap: "3px",
  },
  courseCode: {
    margin: 0,
    color: "#f1ebe2",
    fontWeight: 700,
  },
  courseHint: {
    margin: 0,
    color: "#aaa294",
    fontSize: "0.9rem",
    lineHeight: 1.45,
  },
  badge: (complete) => ({
    borderRadius: "999px",
    padding: "6px 10px",
    background: complete ? "#dcebbf" : "#3a3835",
    color: complete ? "#4b5d27" : "#c8c0b4",
    fontWeight: 700,
    fontSize: "0.88rem",
    whiteSpace: "nowrap",
  }),
  badgeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  plannedBadge: {
    borderRadius: "999px",
    padding: "6px 10px",
    background: "#e5e1ff",
    color: "#5750ad",
    fontWeight: 700,
    fontSize: "0.88rem",
    whiteSpace: "nowrap",
  },
  statusBadge: (level) => ({
    borderRadius: "999px",
    padding: "6px 10px",
    background:
      level === "good" ? "#dcebbf" : level === "watch" ? "#f0df9b" : "#4a2f2f",
    color:
      level === "good" ? "#4b5d27" : level === "watch" ? "#6a5312" : "#ffc8c8",
    fontWeight: 800,
    fontSize: "0.84rem",
    whiteSpace: "nowrap",
  }),
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: {
    borderRadius: "999px",
    padding: "6px 10px",
    background: "#3a3835",
    color: "#e7dfd3",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  noteCard: {
    borderRadius: "16px",
    background: "#e4e0ff",
    color: "#4f49a0",
    padding: "18px 20px",
    display: "grid",
    gap: "10px",
    border: "1px solid rgba(115, 99, 228, 0.12)",
  },
  noteTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 800,
  },
  noteText: {
    margin: 0,
    lineHeight: 1.65,
  },
};

const CS_CORE = [
  { label: "COMS 1010", credits: 0, hint: "Orientation", aliases: ["COM S 101", "COMS 101", "COMS1010"] },
  { label: "COMS 1270", credits: 3, hint: "Introduction to Computer Programming", aliases: ["COM S 127", "COMS 127", "COMS1270"] },
  { label: "COMS 2270", credits: 4, hint: "Object-oriented Programming", aliases: ["COM S 227", "COMS 227", "COMS2270"] },
  { label: "COMS 2280", credits: 3, hint: "Introduction to Data Structures", aliases: ["COM S 228", "COMS 228", "COMS2280"] },
  { label: "COMS 3090", credits: 3, hint: "Software Development Practices", aliases: ["COM S 309", "COMS 309", "COMS3090"] },
  { label: "COMS 3110", credits: 3, hint: "Algorithms", aliases: ["COM S 311", "COMS 311", "COMS3110"] },
  { label: "COMS 3210", credits: 3, hint: "Computer Architecture", aliases: ["COM S 321", "COMS 321", "COMS3210"] },
  { label: "COMS 3270", credits: 3, hint: "Advanced Programming Techniques", aliases: ["COM S 327", "COMS 327", "COMS3270"] },
  { label: "COMS 3310", credits: 3, hint: "Theory of Computing", aliases: ["COM S 331", "COMS 331", "COMS3310"] },
  { label: "COMS 3420", credits: 3, hint: "Principles of Programming Languages", aliases: ["COM S 342", "COMS 342", "COMS3420"] },
  { label: "COMS 3520", credits: 3, hint: "Introduction to Operating Systems", aliases: ["COM S 352", "COMS 352", "COMS3520"] },
  { label: "COMS 4020", credits: 3, hint: "Senior Project", aliases: ["COM S 402", "COMS 402", "COMS4020", "COMS 4020C"] },
];

const MATH_AND_STAT = [
  { label: "MATH 1650", credits: 4, hint: "Calculus I", aliases: ["MATH 165", "MATH1650"] },
  { label: "MATH 1660", credits: 4, hint: "Calculus II", aliases: ["MATH 166", "MATH1660"] },
  { label: "COMS 2300", credits: 3, hint: "Discrete Computational Structures", aliases: ["COM S 230", "COMS 230", "COMS2300"] },
  {
    label: "Statistics requirement",
    credits: 3,
    hint: "One of STAT 3005, 3030, 3441, or 3447",
    aliases: ["STAT 3005", "STAT3005", "STAT 3030", "STAT3030", "STAT 3441", "STAT3441", "STAT 3447", "STAT3447"],
  },
  {
    label: "Additional math requirement",
    credits: 3,
    hint: "One of MATH 2070, 2650, 2660, 2670, 3040, 3140, or 3170",
    aliases: ["MATH 2070", "MATH2070", "MATH 2650", "MATH2650", "MATH 2660", "MATH2660", "MATH 2670", "MATH2670", "MATH 3040", "MATH3040", "MATH 3140", "MATH3140", "MATH 3170", "MATH3170"],
  },
];

const COMMUNICATION_AND_CAREER = [
  { label: "ENGL 1500", credits: 3, hint: "Critical Thinking and Communication", aliases: ["ENGL 150", "ENGL1500"] },
  { label: "ENGL 2500", credits: 3, hint: "Written, Oral, Visual, and Electronic Composition", aliases: ["ENGL 250", "ENGL2500"] },
  {
    label: "Upper-level ENGL",
    credits: 3,
    hint: "One of ENGL 3020, 3050, 3090, or 3140",
    aliases: ["ENGL 3020", "ENGL3020", "ENGL 3050", "ENGL3050", "ENGL 3090", "ENGL3090", "ENGL 3140", "ENGL3140"],
  },
  { label: "SPCM 2120", credits: 3, hint: "Fundamentals of Public Speaking", aliases: ["SPCM 212", "SPCM2120"] },
  { label: "LAS 2030", credits: 1, hint: "Professional Career Preparation", aliases: ["LAS 203", "LAS2030"] },
  { label: "LIB 1600", credits: 1, hint: "Introduction to College Level Research", aliases: ["LIB 160", "LIB1600"] },
];

const SCIENCE_SEQUENCES = [
  {
    label: "Biology sequence",
    credits: 8,
    courses: ["BIOL 2110", "BIOL 2110L", "BIOL 2120", "BIOL 2120L"],
  },
  {
    label: "Human anatomy / physiology sequence",
    credits: 8,
    courses: ["BIOL 2550", "BIOL 2550L", "BIOL 2560", "BIOL 2560L"],
  },
  {
    label: "Chemistry sequence",
    credits: 9,
    courses: ["CHEM 1770", "CHEM 1770L", "CHEM 1780", "CHEM 1780L"],
  },
  {
    label: "Geology sequence",
    credits: 8,
    courses: ["GEOL 1000", "GEOL 1000L", "GEOL 2020", "GEOL 2020L"],
  },
  {
    label: "Physics sequence",
    credits: 10,
    courses: ["PHYS 2310", "PHYS 2310L", "PHYS 2320", "PHYS 2320L"],
  },
];

const CS_ADVANCED_ELECTIVES = [
  "COMS 3190", "COMS 3360", "COMS 3620", "COMS 3630", "COMS 4070", "COMS 4090",
  "COMS 4120", "COMS 4130", "COMS 4150", "COMS 4170", "COMS 4180", "COMS 4190",
  "COMS 4210", "COMS 4240", "COMS 4250", "COMS 4260", "COMS 4330", "COMS 4340",
  "COMS 4350", "COMS 4370", "COMS 4400", "COMS 4410", "COMS 4530", "COMS 4540",
  "COMS 4550", "COMS 4590", "COMS 4720", "COMS 4740", "COMS 4760", "COMS 4762",
  "COMS 4770", "COMS 4810", "COMS 4870", "COMS 4880", "CPRE 4300", "CPRE 4310",
  "CPRE 4580", "CPRE 4890", "SE 4160", "SE 4190", "SE 4210", "SE 4220",
];

const ARTS_HUMANITIES_PREFIXES = ["ART", "ARCH", "CLST", "ENGL", "HIST", "MUS", "PHIL", "RELIG", "THTRE", "LD ST", "LING"];
const SOCIAL_SCIENCE_PREFIXES = ["ANTHR", "CJ ST", "CJST", "ECON", "GEOG", "HDFS", "HD FS", "POLS", "PSYCH", "SOC", "WGSS"];
const WORLD_LANGUAGE_PREFIXES = ["ARAB", "CHIN", "CLST", "FREN", "GER", "GREEK", "ITAL", "JAPAN", "LATIN", "PORT", "RUSS", "SPAN"];
const USCC_PREFIXES = ["AF AM", "AM IN", "AMIN", "HIST", "SOC", "WGSS", "CJST", "CJ ST"];
const INTERNATIONAL_PREFIXES = ["HIST", "GEOG", "POLS", "LANG", "ARAB", "CHIN", "FREN", "GER", "JAPAN", "RUSS", "SPAN"];

function normalizeCode(code) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function extractNumber(code) {
  const match = normalizeCode(code).match(/(\d{3,4})/);
  return match ? Number(match[1]) : null;
}

function formatCode(code) {
  return code.trim().toUpperCase().replace(/\s+/g, " ");
}

function codeMatches(completedCode, requirementCodes) {
  const normalized = normalizeCode(completedCode);
  return requirementCodes.some((candidate) => {
    const target = normalizeCode(candidate);
    return normalized === target || normalized.startsWith(target) || target.startsWith(normalized);
  });
}

function hasCourse(completedCourses, candidates) {
  return completedCourses.some((course) =>
    codeMatches(course.course_code, Array.isArray(candidates) ? candidates : [candidates]),
  );
}

function getPlannedCourses(completedCourses, academicPlan) {
  if (!academicPlan?.semesters?.length) {
    return [];
  }

  const completedCodes = new Set(
    completedCourses.map((course) => normalizeCode(course.course_code)),
  );

  return academicPlan.semesters
    .flatMap((semester) => semester.recommended_courses ?? [])
    .filter((course) => {
      const code = normalizeCode(course.course_code ?? "");
      return code && !completedCodes.has(code);
    });
}

function countMatchingCourses(completedCourses, candidates) {
  return completedCourses.filter((course) =>
    codeMatches(course.course_code, candidates),
  ).length;
}

function courseStartsWithPrefix(courseCode, prefixes) {
  const normalized = formatCode(courseCode);
  return prefixes.some((prefix) => normalized.startsWith(prefix));
}

function countPrefixCourses(completedCourses, prefixes, minNumber = 0) {
  return completedCourses.filter((course) => {
    const number = extractNumber(course.course_code) ?? 0;
    return courseStartsWithPrefix(course.course_code, prefixes) && number >= minNumber;
  }).length;
}

function buildRequirementRows(completedCourses, plannedCourses, requirements) {
  return requirements.map((item) => ({
    ...item,
    complete: hasCourse(completedCourses, [item.label, ...item.aliases]),
    planned: hasCourse(plannedCourses, [item.label, ...item.aliases]),
  }));
}

function sumRequirementCredits(rows) {
  return rows.reduce((sum, row) => sum + (row.complete ? row.credits : 0), 0);
}

function buildScienceProgress(completedCourses, plannedCourses) {
  const sequences = SCIENCE_SEQUENCES.map((sequence) => {
    const completedCount = countMatchingCourses(completedCourses, sequence.courses);
    const combinedCount = countMatchingCourses(
      [...completedCourses, ...plannedCourses],
      sequence.courses,
    );
    return {
      ...sequence,
      completedCount,
      plannedCount: Math.max(0, combinedCount - completedCount),
      complete: completedCount >= sequence.courses.length,
      planned: completedCount < sequence.courses.length && combinedCount > completedCount,
    };
  });

  const bestSequence = [...sequences].sort((left, right) => right.completedCount - left.completedCount)[0];
  return {
    sequences,
    bestSequence,
    complete: sequences.some((sequence) => sequence.complete),
    earnedCredits: sequences.find((sequence) => sequence.complete)?.credits ?? 0,
  };
}

function buildAdvancedElectives(completedCourses, plannedCourses) {
  const matchedCourses = completedCourses
    .filter((course) => codeMatches(course.course_code, CS_ADVANCED_ELECTIVES))
    .map((course) => formatCode(course.course_code));
  const matchedPlannedCourses = plannedCourses
    .filter((course) => codeMatches(course.course_code, CS_ADVANCED_ELECTIVES))
    .map((course) => formatCode(course.course_code));

  const uniqueCourses = [...new Set(matchedCourses)];
  const uniquePlannedCourses = [...new Set(matchedPlannedCourses)].filter(
    (course) => !uniqueCourses.includes(course),
  );
  const fourThousandLevelCount = uniqueCourses.filter((courseCode) => (extractNumber(courseCode) ?? 0) >= 4000).length;
  const plannedFourThousandLevelCount = uniquePlannedCourses.filter((courseCode) => (extractNumber(courseCode) ?? 0) >= 4000).length;

  return {
    courses: uniqueCourses,
    plannedCourses: uniquePlannedCourses,
    credits: uniqueCourses.length * 3,
    fourThousandLevelCredits: fourThousandLevelCount * 3,
    plannedCredits: uniquePlannedCourses.length * 3,
    plannedFourThousandLevelCredits: plannedFourThousandLevelCount * 3,
    complete: uniqueCourses.length >= 5 && fourThousandLevelCount >= 2,
  };
}

function buildGeneralEducation(completedCourses, plannedCourses) {
  const artsHumanitiesCount = countPrefixCourses(completedCourses, ARTS_HUMANITIES_PREFIXES);
  const socialScienceCount = countPrefixCourses(completedCourses, SOCIAL_SCIENCE_PREFIXES);
  const languageCount = countPrefixCourses(completedCourses, WORLD_LANGUAGE_PREFIXES, 1000);
  const usccCount = countPrefixCourses(completedCourses, USCC_PREFIXES, 2000);
  const internationalCount = countPrefixCourses(completedCourses, INTERNATIONAL_PREFIXES, 2000);
  const artsHumanitiesPlannedCount = countPrefixCourses(plannedCourses, ARTS_HUMANITIES_PREFIXES);
  const socialSciencePlannedCount = countPrefixCourses(plannedCourses, SOCIAL_SCIENCE_PREFIXES);
  const languagePlannedCount = countPrefixCourses(plannedCourses, WORLD_LANGUAGE_PREFIXES, 1000);
  const usccPlannedCount = countPrefixCourses(plannedCourses, USCC_PREFIXES, 2000);
  const internationalPlannedCount = countPrefixCourses(plannedCourses, INTERNATIONAL_PREFIXES, 2000);

  return [
    {
      label: "Arts and humanities",
      complete: artsHumanitiesCount >= 4,
      planned: artsHumanitiesCount < 4 && artsHumanitiesPlannedCount > 0,
      hint: `${artsHumanitiesCount}/4 courses detected toward the 12-credit minimum`,
    },
    {
      label: "Social sciences",
      complete: socialScienceCount >= 3,
      planned: socialScienceCount < 3 && socialSciencePlannedCount > 0,
      hint: `${socialScienceCount}/3 courses detected toward the 9-credit minimum`,
    },
    {
      label: "World language",
      complete: languageCount >= 2,
      planned: languageCount < 2 && languagePlannedCount > 0,
      hint: languageCount
        ? `${languageCount}/2 college language courses detected`
        : "No college language courses detected yet; this may still be satisfied by placement or high school preparation",
    },
    {
      label: "U.S. Cultures and Communities",
      complete: usccCount >= 1,
      planned: usccCount < 1 && usccPlannedCount > 0,
      hint: `${usccCount}/1 approved-looking course detected`,
    },
    {
      label: "International Perspectives",
      complete: internationalCount >= 1,
      planned: internationalCount < 1 && internationalPlannedCount > 0,
      hint: `${internationalCount}/1 approved-looking course detected`,
    },
  ];
}

function buildAudit(completedCourses, plannedCourses, creditCount) {
  const completed = completedCourses.filter((course) => course.course_code.trim());
  const planned = plannedCourses.filter((course) => course.course_code?.trim());
  const coreCsItems = buildRequirementRows(completed, planned, CS_CORE);
  const mathAndStatItems = buildRequirementRows(completed, planned, MATH_AND_STAT);
  const communicationItems = buildRequirementRows(completed, planned, COMMUNICATION_AND_CAREER);
  const science = buildScienceProgress(completed, planned);
  const advancedElectives = buildAdvancedElectives(completed, planned);
  const generalEducation = buildGeneralEducation(completed, planned);

  const exactTrackedCredits =
    sumRequirementCredits(coreCsItems) +
    sumRequirementCredits(mathAndStatItems) +
    sumRequirementCredits(communicationItems) +
    science.earnedCredits +
    advancedElectives.credits;

  const inferredElectiveCredits = Math.max(0, creditCount - exactTrackedCredits);

  const exactRequirementCreditsTarget = 49 + 17 + 11;
  const majorRequirementProgress =
    sumRequirementCredits(coreCsItems) +
    sumRequirementCredits(mathAndStatItems) +
    sumRequirementCredits(communicationItems) +
    science.earnedCredits +
    Math.min(advancedElectives.credits, 15);

  const categoryScores = [
    coreCsItems.filter((item) => item.complete).length / coreCsItems.length,
    advancedElectives.complete ? 1 : Math.min(advancedElectives.credits / 15, 1) * 0.6 + Math.min(advancedElectives.fourThousandLevelCredits / 6, 1) * 0.4,
    mathAndStatItems.filter((item) => item.complete).length / mathAndStatItems.length,
    communicationItems.filter((item) => item.complete).length / communicationItems.length,
    science.complete ? 1 : (science.bestSequence?.completedCount ?? 0) / 4,
    generalEducation.filter((item) => item.complete).length / generalEducation.length,
    Math.min(creditCount / DEGREE_CREDIT_TARGET, 1),
  ];

  const weightedPercent = Math.round(
    (
      categoryScores[0] * 0.24 +
      categoryScores[1] * 0.14 +
      categoryScores[2] * 0.12 +
      categoryScores[3] * 0.10 +
      categoryScores[4] * 0.12 +
      categoryScores[5] * 0.12 +
      categoryScores[6] * 0.16
    ) * 100,
  );

  return {
    coreCsItems,
    mathAndStatItems,
    communicationItems,
    science,
    advancedElectives,
    generalEducation,
    exactTrackedCredits,
    inferredElectiveCredits,
    overallPercent: Math.min(100, weightedPercent),
    creditPercent: Math.min(100, Math.round((creditCount / DEGREE_CREDIT_TARGET) * 100)),
    majorRequirementProgress,
    exactRequirementCreditsTarget,
  };
}

function statusLevel(percent) {
  if (percent >= 75) {
    return "good";
  }
  if (percent >= 40) {
    return "watch";
  }
  return "risk";
}

function buildAuditSummary(audit, creditCount) {
  if (audit.overallPercent >= 75) {
    return {
      tone: "good",
      title: "On track for a strong registration conversation",
      text: `You have ${creditCount} reported credits and most major checkpoints are moving in the right direction. The remaining work is mainly about finishing upper-level requirements and keeping graduation-critical courses in sequence.`,
    };
  }

  if (audit.overallPercent >= 40) {
    return {
      tone: "watch",
      title: "Good momentum, but a few requirement buckets need attention",
      text: `Your audit shows real progress, but there are still some missing categories that could turn into bottlenecks later. This is a good moment to prioritize whichever core, science, or communication requirements are still open.`,
    };
  }

  return {
    tone: "risk",
    title: "Early-stage plan with important requirements still ahead",
    text: `You are still in the earlier part of the degree map, so the best next step is sequencing foundational courses correctly now. That will make later semesters much easier to balance.`,
  };
}

function RequirementSection({ title, hint, rows }) {
  const completedCount = rows.filter((row) => row.complete).length;
  const percent = Math.round((completedCount / rows.length) * 100);
  const remainingCount = rows.length - completedCount;
  const level = statusLevel(percent);

  return (
    <div style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <h3 style={styles.sectionTitle}>{title}</h3>
          <span style={styles.statusBadge(level)}>
            {remainingCount === 0 ? "Complete" : `${remainingCount} remaining`}
          </span>
        </div>
        <p style={styles.sectionText}>{hint}</p>
      </div>
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${percent}%`,
          }}
        />
      </div>
      <div style={styles.bucketGrid}>
        {rows.map((row) => (
          <div key={row.label} style={styles.row}>
            <div style={styles.courseInfo}>
              <p style={styles.courseCode}>{row.label}</p>
              <p style={styles.courseHint}>{row.hint}</p>
            </div>
            <div style={styles.badgeRow}>
              <span style={styles.badge(row.complete)}>
                {row.complete ? "Completed" : "Still needed"}
              </span>
              {!row.complete && row.planned ? (
                <span style={styles.plannedBadge}>On academic plan</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DegreeAuditView({ completedCourses, creditCount, major, sourceUrl, academicPlan }) {
  const plannedCourses = getPlannedCourses(completedCourses, academicPlan);
  const audit = buildAudit(completedCourses, plannedCourses, creditCount);
  const summary = buildAuditSummary(audit, creditCount);

  return (
    <section style={styles.wrapper} aria-live="polite">
      <div style={styles.hero}>
        <h2 style={styles.title}>Degree Audit</h2>
        <p style={styles.text}>
          This audit now mirrors the Iowa State Computer Science B.S. flowchart more closely: CS core, approved advanced electives, math and statistics, science sequence, communication and career items, and the main LAS buckets. It is still a planning estimate, not an official registrar audit.{" "}
          <a href={sourceUrl} target="_blank" rel="noreferrer" style={styles.sourceLink}>
            View ISU catalog
          </a>
        </p>
        {plannedCourses.length ? (
          <p style={styles.text}>
            Requirements can now show both <strong>Still needed</strong> and <strong>On academic plan</strong> when you have not completed them yet but already scheduled them into a future semester.
          </p>
        ) : null}
      </div>

      <div style={styles.banner(summary.tone)}>
        <p style={styles.bannerTitle}>{summary.title}</p>
        <p style={styles.bannerText}>{summary.text}</p>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Major</p>
          <p style={styles.summaryValue}>{major}</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Credits Toward Degree</p>
          <p style={styles.summaryValue}>{creditCount}/{DEGREE_CREDIT_TARGET}</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Audit Progress</p>
          <p style={styles.summaryValue}>{audit.overallPercent}%</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Tracked Major Credits</p>
          <p style={styles.summaryValue}>
            {audit.majorRequirementProgress}/{audit.exactRequirementCreditsTarget}
          </p>
        </div>
      </div>

      <RequirementSection
        title="Computer Science Core"
        hint="Required CS sequence from the current B.S. catalog and department flowchart."
        rows={audit.coreCsItems}
      />

      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <h3 style={styles.sectionTitle}>Advanced CS Electives</h3>
            <span style={styles.statusBadge(statusLevel(Math.round((Math.min(audit.advancedElectives.credits / 15, 1)) * 100)))}>
              {Math.max(0, 15 - audit.advancedElectives.credits)} credits remaining
            </span>
          </div>
          <p style={styles.sectionText}>
            The B.S. requires five approved advanced CS electives for 15 credits total, with at least 6 credits at the 4000 level.
          </p>
        </div>
        <div style={styles.bucketGrid}>
          <div style={styles.row}>
            <div style={styles.courseInfo}>
              <p style={styles.courseCode}>Approved advanced elective credits</p>
              <p style={styles.courseHint}>
                Detected {audit.advancedElectives.courses.length} approved elective course{audit.advancedElectives.courses.length === 1 ? "" : "s"}
              </p>
            </div>
            <div style={styles.badgeRow}>
              <span style={styles.badge(audit.advancedElectives.credits >= 15)}>
                {audit.advancedElectives.credits}/15 cr
              </span>
              {audit.advancedElectives.credits < 15 && audit.advancedElectives.plannedCredits > 0 ? (
                <span style={styles.plannedBadge}>On academic plan</span>
              ) : null}
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.courseInfo}>
              <p style={styles.courseCode}>4000-level advanced elective credits</p>
              <p style={styles.courseHint}>At least two approved 4000-level electives are required</p>
            </div>
            <div style={styles.badgeRow}>
              <span style={styles.badge(audit.advancedElectives.fourThousandLevelCredits >= 6)}>
                {audit.advancedElectives.fourThousandLevelCredits}/6 cr
              </span>
              {audit.advancedElectives.fourThousandLevelCredits < 6 && audit.advancedElectives.plannedFourThousandLevelCredits > 0 ? (
                <span style={styles.plannedBadge}>On academic plan</span>
              ) : null}
            </div>
          </div>
        </div>
        {audit.advancedElectives.courses.length ? (
          <div style={styles.chipRow}>
            {audit.advancedElectives.courses.map((courseCode) => (
              <span key={courseCode} style={styles.chip}>
                {courseCode}
              </span>
            ))}
          </div>
        ) : null}
        {audit.advancedElectives.plannedCourses.length ? (
          <div style={styles.chipRow}>
            {audit.advancedElectives.plannedCourses.map((courseCode) => (
              <span key={courseCode} style={styles.plannedBadge}>
                Planned: {courseCode}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <RequirementSection
        title="Math and Statistics"
        hint="Flowchart support requirements: Calculus I and II, discrete structures, one statistics course, and one additional approved math course."
        rows={audit.mathAndStatItems}
      />

      <RequirementSection
        title="Communication and Career"
        hint="Writing, speaking, research, and career-preparation requirements attached to the major plan."
        rows={audit.communicationItems}
      />

      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <h3 style={styles.sectionTitle}>Natural Science Sequence</h3>
            <span style={styles.statusBadge(audit.science.complete ? "good" : statusLevel(Math.round(((audit.science.bestSequence?.completedCount ?? 0) / 4) * 100)))}>
              {audit.science.complete ? "Complete" : `${4 - (audit.science.bestSequence?.completedCount ?? 0)} pieces remaining`}
            </span>
          </div>
          <p style={styles.sectionText}>
            One full two-course science sequence with labs is required. The audit checks the exact sequence combinations listed by Iowa State.
          </p>
        </div>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${audit.science.complete ? 100 : Math.round(((audit.science.bestSequence?.completedCount ?? 0) / 4) * 100)}%`,
            }}
          />
        </div>
        <div style={styles.bucketGrid}>
          {audit.science.sequences.map((sequence) => (
            <div key={sequence.label} style={styles.row}>
              <div style={styles.courseInfo}>
                <p style={styles.courseCode}>{sequence.label}</p>
                <p style={styles.courseHint}>
                  {sequence.completedCount}/4 sequence parts detected
                </p>
              </div>
              <div style={styles.badgeRow}>
                <span style={styles.badge(sequence.complete)}>
                  {sequence.complete ? "Sequence complete" : "Still needed"}
                </span>
                {!sequence.complete && sequence.planned ? (
                  <span style={styles.plannedBadge}>On academic plan</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <RequirementSection
        title="LAS and University Requirements"
        hint="These broader buckets come from the Iowa State CS flowchart and LAS graduation requirements."
        rows={audit.generalEducation}
      />

      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <h3 style={styles.sectionTitle}>Total Credits and Electives</h3>
            <span style={styles.statusBadge(statusLevel(audit.creditPercent))}>
              {Math.max(0, DEGREE_CREDIT_TARGET - creditCount)} credits to go
            </span>
          </div>
          <p style={styles.sectionText}>
            Iowa State's CS B.S. requires at least 120 total credits. This card uses your reported credit count to estimate how much of your degree is already covered beyond the exact tracked major requirements above.
          </p>
        </div>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${audit.creditPercent}%`,
            }}
          />
        </div>
        <div style={styles.bucketGrid}>
          <div style={styles.row}>
            <div style={styles.courseInfo}>
              <p style={styles.courseCode}>Reported total credits</p>
              <p style={styles.courseHint}>Based on the profile credit count you entered in the app</p>
            </div>
            <span style={styles.badge(creditCount >= DEGREE_CREDIT_TARGET)}>
              {creditCount}/{DEGREE_CREDIT_TARGET}
            </span>
          </div>
          <div style={styles.row}>
            <div style={styles.courseInfo}>
              <p style={styles.courseCode}>Exactly tracked credits</p>
              <p style={styles.courseHint}>Credits tied to named CS, math, communication, science, and advanced elective requirements</p>
            </div>
            <span style={styles.badge(audit.exactTrackedCredits > 0)}>
              {audit.exactTrackedCredits} cr
            </span>
          </div>
          <div style={styles.row}>
            <div style={styles.courseInfo}>
              <p style={styles.courseCode}>Inferred elective / broader gen-ed credits</p>
              <p style={styles.courseHint}>Remaining reported credits not matched to the exact named requirements above</p>
            </div>
            <span style={styles.badge(audit.inferredElectiveCredits > 0)}>
              {audit.inferredElectiveCredits} cr
            </span>
          </div>
        </div>
      </div>

      <div style={styles.noteCard}>
        <p style={styles.noteTitle}>Audit Notes</p>
        <p style={styles.noteText}>
          This version is grounded in the current Iowa State catalog and department flowchart instead of the old partial checklist. Some buckets still have unavoidable limits: Arts and Humanities, Social Sciences, U.S. Cultures and Communities, International Perspectives, and World Language are estimated from course prefixes because the app does not yet store official registrar tags or placement exemptions. World language may already be satisfied even if no college language courses are listed here.
        </p>
      </div>
    </section>
  );
}

export default DegreeAuditView;
