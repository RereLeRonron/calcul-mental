import { useEffect, useState } from "react";

export default function App() {
  const [mode, setMode] = useState("addition");
  const [niveau, setNiveau] = useState(2);
  const [input, setInput] = useState("");

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const [inputMode, setInputMode] = useState("clavier");

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

  function getAnswer(x = a, y = b) {
    if (mode === "addition") return x + y;
    if (mode === "soustraction") return x - y;
    if (mode === "multiplication") return x * y;
    if (mode === "division") return Math.round((x / y) * 100) / 100;
    if (mode === "carre") return x * x;
  }

  function playSuccessSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.value = 0.1;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  function validate(val) {
  if (val === "" || val === null) return;

  const user = parseFloat(val);
  const correct = getAnswer();

  // on attend que la longueur soit suffisante
  if (val.length < String(correct).length) {
    return;
  }

  if (user === correct) {
    setScore((s) => s + 1);
    setMessage("✔ Correct !");
    playSuccessSound();

    setTimeout(() => {
      newQuestion();
    }, 250);
  } else {
    setScore(0);
    setMessage(`❌ Faux`);
    setInput("");
  }
}
  function handleVoice() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Reconnaissance vocale non supportée");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";

    recognition.start();

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const cleaned = text.replace(/[^0-9.-]/g, "");

      setInput(cleaned);
      validate(cleaned);
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

        {/* CONTROLES */}
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
          <>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => {
                const val = e.target.value;
                setInput(val);
                validate(val);
              }}
              placeholder="Réponse"
            />

            {/* PAVÉ NUMÉRIQUE */}
            <div style={styles.pad}>
              {[1,2,3,4,5,6,7,8,9,0].map((n) => (
                <button
                  key={n}
                  style={styles.padBtn}
                  onClick={() => {
                    const val = input + n;
                    setInput(val);
                    validate(val);
                  }}
                >
                  {n}
                </button>
              ))}

              <button style={styles.padBtn} onClick={() => setInput("")}>
                C
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>{input || "..."}</div>
            <button style={styles.voiceBtn} onClick={handleVoice}>
              🎤 Parler
            </button>
          </>
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
    marginBottom: 10,
  },
  pad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 5,
  },
  padBtn: {
    padding: 15,
    fontSize: 18,
    borderRadius: 8,
    border: "none",
    background: "#334155",
    color: "white",
  },
  voiceBtn: {
    padding: 10,
    width: "100%",
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    color: "white",
  },
  message: {
    marginTop: 10,
  },
};