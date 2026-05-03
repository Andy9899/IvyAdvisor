import { useEffect, useRef, useState } from "react";

const styles = {
  wrapper: {
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "16px 22px 18px",
    display: "grid",
    gap: "12px",
    background: "#262523",
  },
  guideRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    color: "#bdb5aa",
    fontSize: "0.9rem",
  },
  guidePill: {
    borderRadius: "999px",
    background: "#302f2c",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    padding: "6px 10px",
  },
  promptRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  promptButton: {
    borderRadius: "999px",
    background: "#e4e0ff",
    color: "#4f49a0",
    border: "1px solid rgba(115, 99, 228, 0.12)",
    padding: "8px 12px",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  transcript: {
    display: "grid",
    gap: "10px",
    maxHeight: "180px",
    overflowY: "auto",
  },
  bubbleWrap: {
    display: "grid",
    gap: "4px",
  },
  speaker: {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#9f978c",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  bubble: {
    padding: "11px 14px",
    borderRadius: "14px",
    lineHeight: 1.55,
    maxWidth: "90%",
  },
  assistantBubble: {
    background: "#33312f",
    color: "#f2ece3",
    justifySelf: "start",
  },
  userBubble: {
    background: "#e2ddfb",
    color: "#4f49a0",
    justifySelf: "end",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "10px",
    alignItems: "end",
  },
  inputWrap: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    alignItems: "stretch",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    background: "#302f2c",
    overflow: "hidden",
  },
  inputIcon: {
    width: "48px",
    height: "48px",
    display: "grid",
    placeItems: "center",
    color: "#ddd6cc",
    fontSize: "1.15rem",
    borderRight: "1px solid rgba(255, 255, 255, 0.06)",
  },
  input: {
    width: "100%",
    minHeight: "52px",
    padding: "13px 14px",
    border: "none",
    background: "transparent",
    color: "#f5efe7",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    lineHeight: 1.45,
  },
  button: {
    background: "#363430",
    color: "#f3ece4",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    borderRadius: "14px",
    padding: "13px 18px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  helper: {
    margin: 0,
    color: "#9f978c",
    fontSize: "0.9rem",
  },
  loadingDots: {
    display: "inline-flex",
    gap: "6px",
    alignItems: "center",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#d5cdc2",
    display: "inline-block",
  },
};

const guideItems = [
  "Ask about workload",
  "Ask about professor fit",
  "Ask about internship value",
  "Avoid asking for guarantees",
];

const promptSuggestions = [
  "Make this lighter",
  "Why this course?",
  "Which class helps internships most?",
  "What should I swap first?",
];

function ChatBox({ messages, onSend, disabled, isLoading }) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled && !isLoading) {
      inputRef.current?.focus();
    }
  }, [disabled, isLoading, messages.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextMessage = draft.trim();
    if (!nextMessage) {
      return;
    }

    await onSend(nextMessage);
    setDraft("");
  };

  const handlePromptClick = async (prompt) => {
    if (disabled) {
      return;
    }

    setDraft(prompt);
    await onSend(prompt);
    setDraft("");
  };

  return (
    <section style={styles.wrapper} aria-labelledby="follow-up-heading">
      <div style={styles.guideRow}>
        {guideItems.map((item) => (
          <span key={item} style={styles.guidePill}>
            {item}
          </span>
        ))}
      </div>

      <div style={styles.promptRow}>
        {promptSuggestions.map((prompt) => (
          <button
            key={prompt}
            type="button"
            style={styles.promptButton}
            onClick={() => handlePromptClick(prompt)}
            disabled={disabled}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div style={styles.transcript}>
        {messages.length ? (
          <>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  ...styles.bubbleWrap,
                  justifyItems: message.role === "user" ? "end" : "start",
                }}
              >
                <span style={styles.speaker}>
                  {message.role === "user" ? "You" : "AdvisorAI"}
                </span>
                <div
                  style={{
                    ...styles.bubble,
                    ...(message.role === "user"
                      ? styles.userBubble
                      : styles.assistantBubble),
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div style={styles.bubbleWrap}>
                <span style={styles.speaker}>AdvisorAI</span>
                <div style={{ ...styles.bubble, ...styles.assistantBubble }}>
                  <span style={styles.loadingDots}>
                    <span style={styles.dot} />
                    <span style={styles.dot} />
                    <span style={styles.dot} />
                  </span>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p style={styles.helper}>
            Ask follow-up questions here after your schedule appears.
          </p>
        )}
      </div>

      <form style={styles.formRow} onSubmit={handleSubmit}>
        <div style={styles.inputWrap}>
          <div style={styles.inputIcon}>v</div>
          <textarea
            ref={inputRef}
            style={styles.input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            placeholder="Ask anything - what if I need a lighter semester?"
            disabled={disabled}
          />
        </div>
        <button type="submit" style={styles.button} disabled={disabled}>
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </section>
  );
}

export default ChatBox;
