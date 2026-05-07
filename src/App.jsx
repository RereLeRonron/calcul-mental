import React, { useState, useEffect } from "react";

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
      setTimeout(newQuestion, 250);
    }
  }

  function voice() {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) return alert("Vocal non supporté");

    const rec = new SR();
    rec.lang = "fr-FR";
    rec.continuous = false;

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
        success();
        setTimeout(newQuestion, 250);
      } else {
        setInput("");
      }
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
      : "²";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Coach mental</h2>

        <div>Score : {score}</div>

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

        <div style={styles.question}>
          {mode === "carre" ? `${a}²` : `${a} ${op} ${b}`}
        </div>

        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            validate(e.target.value);
          }}
        />

        <button onClick={voice}>
          {listening ? "🎤..." : "🎤 vocal"}
        </button>

        <button onClick={() => setInput("")}>⌫</button>

        <button
          onClick={() => {
            newQuestion();
            setInput("");
          }}
        >
          passer
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
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
    width: 300,
    textAlign: "center",
  },
  question: {
    fontSize: 28,
    margin: 10,
  },
};