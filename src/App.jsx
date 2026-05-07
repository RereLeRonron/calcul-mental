import { useEffect, useState } from "react";

export default function App() {
  const [mode, setMode] = useState("addition");
  const [niveau, setNiveau] = useState(2);
  const [input, setInput] = useState("");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const [inputMode, setInputMode] = useState("clavier"); // clavier ou vocal

  function rand(niveau) {
    const min = Math.pow(10, niveau - 1);
    const max = Math.pow(10, niveau) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function newQuestion() {
    setA(rand(niveau));
    setB(rand(niveau));
    setInput("");
    setMessage("");
  }

  function getAnswer() {
    if (mode === "addition") return a + b;
    if (mode === "soustraction") return a - b;
    if (mode === "multiplication") return a * b;
    if (mode === "division") return Math.round((a / b) * 100) / 100;
    if (mode === "carre") return a * a;
  }

  function check() {
    const user = parseFloat(input);
    const correct = getAnswer();

    if (user === correct) {
      setScore(score + 1);
      setMessage("✔ Correct !");
    } else {
      setScore(0);
      setMessage(`❌ Faux (réponse : ${correct})`);
    }

    newQuestion();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") check();
  }

  /* 🎤 RECONNAISSANCE VOCALE */
  function startVoice() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Reconnaissance vocale non supportée");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      const cleaned = text.replace(/[^0-9.-]/g, "");
      setInput(cleaned);
    };
  }

  useEffect(() => {
    newQuestion();
  }, [mode, niveau]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Coach mental</h2>

        <div>Score : {score}</div>

        {/* MODE + NIVEAU */}
        <div style={styles.row}>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="addition">➕</option>
            <option value="soustraction">➖</option>
            <option value="multiplication">✖️</option>
            <option value="division">➗</option>
            <option value="carre">🔢²</option>
          </select>

          <select value={niveau} onChange={(e) => setNiveau(Number(e.target.value))}>
            <option value={2}>2 chiffres</option>
            <option value={3}>3 chiffres</option>
            <option value={4}>4 chiffres</option>
          </select>

          <select value={inputMode} onChange={(e) => setInputMode(e.target.value)}>
            <option value="clavier">⌨️ clavier</option>
            <option value="vocal">🎤 vocal</option>
          </select>
        </div>

        {/* QUESTION */}
        <div style={styles.question}>
          {mode === "carre"
            ? `${a}² = ?`
            : `${a} ${mode === "addition" ? "+" : mode === "soustraction" ? "-" : mode === "multiplication" ? "×" : "÷"} ${b} = ?`}
        </div>

        {/* INPUT */}
        {inputMode === "clavier" ? (
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Réponse"
          />
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>{input || "..."}</div>
            <button style={styles.buttonVocal} onClick={startVoice}>
              🎤 Parler
            </button>
          </>
        )}

        {/* PAVE NUMERIQUE */}
        {inputMode === "clavier" && (
          <div style={styles.pad}>
            {[1,2,3,4,5,6,7,8,9,0].map((n) => (
              <button
                key={n}
                style={styles.padBtn}
                onClick={() => setInput(input + n)}
              >
                {n}
              </button>
            ))}
            <button style={styles.padBtn} onClick={() => setInput("")}>
              C
            </button>
            <button style={styles.padBtn} onClick={check}>
              OK
            </button>
          </div>
        )}

        <div style={styles.message}>{message}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },
  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 20,
    width: 340,
    textAlign: "center",
  },
  row: {
    display: "flex",
    gap: 5,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  question: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    borderRadius: 8,
    border: "none",
  },
  buttonVocal: {
    padding: 10,
    width: "100%",
    marginBottom: 10,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
  pad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 5,
    marginTop: 10,
  },
  padBtn: {
    padding: 15,
    fontSize: 18,
    borderRadius: 8,
    border: "none",
    background: "#334155",
    color: "white",
  },
  message: {
    marginTop: 10,
  },
};