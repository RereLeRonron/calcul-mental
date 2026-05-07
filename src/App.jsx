

import React, { useState, useEffect } from "react";

export default function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState("multiplication");
  const [digits, setDigits] = useState(2);
  const [listening, setListening] = useState(false);

  function generateNumber(size) {
    const min = Math.pow(10, size - 1);
    const max = Math.pow(10, size) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateQuestion() {
    const a = generateNumber(digits);
    const b = generateNumber(digits);

    setNum1(a);
    setNum2(b);
    setUserAnswer("");
  }

  useEffect(() => {
    generateQuestion();
  }, [mode, digits]);

  function getCorrectAnswer() {
    if (mode === "addition") return num1 + num2;
    if (mode === "soustraction") return num1 - num2;
    if (mode === "multiplication") return num1 * num2;
    if (mode === "division") return Math.round((num1 / num2) * 100) / 100;
    if (mode === "carre") return num1 * num1;

    return 0;
  }

  function playSuccessSound() {
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

  function validate(value) {
    if (value === "") return;

    const user = parseFloat(value);
    const correct = getCorrectAnswer();

    if (user === correct) {
      setScore((s) => s + 1);

      playSuccessSound();

      setTimeout(() => {
        generateQuestion();
      }, 300);
    }
  }

  function startVoiceRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Reconnaissance vocale non supportée");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = false;

    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      const cleaned = transcript
        .replace(",", ".")
        .replace(/[^\d.-]/g, "")
        .trim();

      if (!cleaned) return;

      setUserAnswer(cleaned);

      validate(cleaned);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      recognition.start();
    };
  }

  const operator =
    mode === "addition"
      ? "+"
      : mode === "soustraction"
      ? "-"
      : mode === "multiplication"
      ? "×"
      : "÷";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Coach Mental</h1>

        <div style={styles.score}>Score : {score}</div>

        <div style={styles.row}>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="addition">Addition</option>
            <option value="soustraction">Soustraction</option>
            <option value="multiplication">Multiplication</option>
            <option value="division">Division</option>
            <option value="carre">Carré</option>
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
          {mode === "carre"
            ? `${num1}²`
            : `${num1} ${operator} ${num2}`}
        </div>

        <input
          style={styles.input}
          value={userAnswer}
          onChange={(e) => {
            const val = e.target.value;

            setUserAnswer(val);

            validate(val);
          }}
          placeholder="Réponse"
        />

        <div style={styles.pad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
            <button
              key={n}
              style={styles.padBtn}
              onClick={() => {
                const val = userAnswer + n;

                setUserAnswer(val);

                validate(val);
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <button style={styles.voiceBtn} onClick={startVoiceRecognition}>
          {listening ? "🎤 Écoute..." : "🎤 Vocal"}
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

  score: {
    marginBottom: 15,
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },

  question: {
    fontSize: 32,
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 12,
    fontSize: 22,
    textAlign: "center",
    borderRadius: 10,
    border: "none",
    marginBottom: 15,
  },

  pad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 5,
    marginBottom: 15,
  },

  padBtn: {
    padding: 15,
    fontSize: 20,
    borderRadius: 10,
    border: "none",
    background: "#334155",
    color: "white",
  },

  voiceBtn: {
    width: "100%",
    padding: 15,
    background: "#7c3aed",
    border: "none",
    borderRadius: 10,
    color: "white",
    fontSize: 18,
  },
};


