import React, { useEffect, useState } from "react";

export default function App() {
  const [mode, setMode] = useState("addition");
  const [digits, setDigits] = useState(2);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [listening, setListening] = useState(false);

let recognition;

  function rand(n) {
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function newQuestion() {
    setA(rand(digits));
    setB(rand(digits));
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
  }

  function success() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 700;
    gain.gain.value = 0.1;

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  function validate(val) {
    if (val === "") return;

    const user = parseFloat(val);
    const correct = getAnswer();

    if (user === correct) {
      setScore((s) => s + 1);
      success();

      setTimeout(() => {
        newQuestion();
      }, 250);
    }
  }

  function voice() {
  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SR) return alert("Vocal non supporté");

  if (recognition) {
    recognition.stop();
  }

  recognition = new SR();

  recognition.lang = "fr-FR";
  recognition.continuous = true;
  recognition.interimResults = false;

  setListening(true);

  recognition.start();

  recognition.onresult = (e) => {
    const text =
      e.results[e.results.length - 1][0].transcript;

    const cleaned = text.replace(/[^0-9.-]/g, "");

    if (!cleaned) return;

    setInput(cleaned);

    const user = parseFloat(cleaned);
    const correct = getAnswer();

    if (user === correct) {
      setScore((s) => s + 1);
      success();

      setInput("");

      setTimeout(() => {
        newQuestion();

        // 🔥 IMPORTANT : redémarre le micro proprement
        setTimeout(() => {
          if (recognition) {
            recognition.stop();
            recognition.start();
          }
        }, 200);

      }, 250);

    } else {
      setInput("");
    }
  };

  recognition.onend = () => {
    // 🔥 garde le micro vivant en continu
    if (listening) {
      recognition.start();
    }
  };
}

    rec.onend = () => rec.start();
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
      : "²";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Coach mental</h2>

        <div>Score : {score}</div>

        <div style={styles.row}>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="addition">+</option>
            <option value="soustraction">-</option>
            <option value="multiplication">×</option>
            <option value="division">÷</option>
            <option value="carre">²</option>
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

        {/* PAVÉ */}
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

        <button
          style={styles.skip}
          onClick={() => {
            newQuestion();
            setInput("");
          }}
        >
          Passer ➜
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    gap: 10,
    marginBottom: 15,
  },

  question: {
    fontSize: 28,
    marginBottom: 15,
  },

  input: {
    width: "100%",
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },

  pad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 5,
    marginBottom: 10,
  },

  btn: {
    padding: 12,
    background: "#334155",
    color: "white",
    border: "none",
  },

  voice: {
    width: "100%",
    padding: 10,
    background: "#7c3aed",
    border: "none",
    color: "white",
    marginBottom: 5,
  },

  skip: {
    width: "100%",
    padding: 10,
    background: "#ef4444",
    border: "none",
    color: "white",
  },
};