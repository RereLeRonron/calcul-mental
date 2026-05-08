import React, { useEffect, useState } from "react";

export default function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const [mode, setMode] = useState("addition");
  const [digits, setDigits] = useState(2);
  const [listening, setListening] = useState(false);

  function rand(n) {
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function newQuestion() {
    // 🎯 MODE ASTUCE 1 : unités complémentaires = 10
    if (mode === "astuce_unites10") {
      const d = rand(digits);
      const u1 = rand(1);
      const u2 = 10 - u1;

      setA(d * 10 + u1);
      setB(d * 10 + u2);
    }

    // 🎯 MODE ASTUCE 2 : dizaines complémentaires = 10 + unités identiques
    else if (mode === "astuce_dizaines10") {
      const d1 = rand(1);
      const d2 = 10 - d1;
      const u = rand(9);

      setA(d1 * 10 + u);
      setB(d2 * 10 + u);
    }

    // 🎯 modes classiques
    else {
      setA(rand(digits));
      setB(rand(digits));
    }

    setInput("");
  }

  useEffect(() => {
    newQuestion();
  }, [mode, digits]);

  function getAnswer() {
    if (mode === "addition") return a + b;
    if (mode === "soustraction") return a - b;
    if (mode === "multiplication") return a * b;
    if (mode === "division") return Math.round((a / b) * 100) / 100;
    if (mode === "carre") return a * a;

    // astuce modes = multiplication réelle
    return a * b;
  }

  function successSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 700;
    gain.gain.value = 0.08;

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  function validate(val) {
    if (val === "") return;

    const user = parseFloat(val);
    const correct = getAnswer();

    if (user === correct) {
      setScore((s) => s + 1);
      successSound();
      setTimeout(newQuestion, 200);
    }
  }

  function voice() {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      alert("Vocal non supporté");
      return;
    }

    const rec = new SR();
    rec.lang = "fr-FR";
    rec.continuous = false;
    rec.interimResults = false;

    setListening(true);

    rec.start();

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const cleaned = text.replace(/[^0-9.-]/g, "");

      if (!cleaned) return;

      setInput(cleaned);

      const user = parseFloat(cleaned);
      const correct = getAnswer();

      if (user === correct) {
        setScore((s) => s + 1);
        successSound();
        setTimeout(newQuestion, 200);
      } else {
        setInput("");
      }
    };

    rec.onend = () => {
      setListening(false);
    };
  }

  const op =
    mode === "addition"
      ? "+"
      : mode === "soustraction"
      ? "-"
      : mode === "multiplication"
      ? "×"
      : mode === "division"
      ? "÷"
      : "×";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Calcul mental</h2>

        <div style={styles.score}>Score : {score}</div>

        <div style={styles.row}>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="addition">Addition</option>
            <option value="soustraction">Soustraction</option>
            <option value="multiplication">Multiplication</option>
            <option value="division">Division</option>
            <option value="carre">Carré</option>

            <option value="astuce_unites10">
              Astuce : unités = 10
            </option>

            <option value="astuce_dizaines10">
              Astuce : dizaines = 10
            </option>
          </select>

          <select
            value={digits}
            onChange={(e) => setDigits(Number(e.target.value))}
          >
            <option value={2}>2 chiffres</option>
            <option value={3}>3 chiffres</option>
            <option value={4}>4 chiffres</option>
          </select>
        </div>

        <div style={styles.question}>
          {mode === "carre" ? `${a}²` : `${a} ${op} ${b}`}
        </div>

        <input
          style={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            validate(e.target.value);
          }}
        />

        {/* PAVÉ NUMÉRIQUE */}
        <div style={styles.pad}>
          {[1,2,3,4,5,6,7,8,9,0].map((n) => (
            <button
              key={n}
              style={styles.btn}
              onClick={() => {
                const val = input + n;
                setInput(val);
                validate(val);
              }}
            >
              {n}
            </button>
          ))}

          <button style={styles.btn} onClick={() => setInput("")}>
            ⌫
          </button>
        </div>

        {/* ACTIONS */}
        <button style={styles.voice} onClick={voice}>
          {listening ? "🎤..." : "🎤 Vocal"}
        </button>

        <div style={{ display: "flex", gap: 5 }}>
  <button
    style={styles.solution}
    onClick={() => {
      alert(`Solution : ${getAnswer()}`);
    }}
  >
    Solution
  </button>

  <button
    style={styles.skip}
    onClick={() => {
      newQuestion();
      setInput("");
    }}
  >
    Passer
  </button>
</div>
          Passer
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    fontFamily: "Arial",
  },

  card: {
    width: 320,
    background: "#1e293b",
    padding: 20,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "white",
  },

  score: {
    marginBottom: 10,
    color: "#cbd5e1",
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    justifyContent: "center",
  },

  question: {
    fontSize: 28,
    marginBottom: 10,
    color: "white",
  },

  input: {
    width: "100%",
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    borderRadius: 8,
    border: "none",
    background: "#0f172a",
    color: "white",
    outline: "none",
  },

  pad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 5,
    marginBottom: 10,
  },

  btn: {
    padding: 10,
    background: "#334155",
    border: "none",
    fontSize: 18,
    color: "white",
    borderRadius: 8,
  },

  voice: {
    width: "100%",
    padding: 10,
    background: "#3b82f6",
    color: "white",
    border: "none",
    marginBottom: 5,
    borderRadius: 8,
  },

solution: {
  width: "100%",
  padding: 10,
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: 8,
},

  skip: {
    width: "100%",
    padding: 10,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
};