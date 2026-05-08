import React, { useEffect, useState } from "react";

export default function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const [mode, setMode] = useState("addition");
  const [digits, setDigits] = useState(2);

  const [listening, setListening] = useState(false);

  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [errors, setErrors] = useState(0);

  function rand(n) {
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;

    return (
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  function generateQuestion(selectedMode = mode) {
    let aVal;
    let bVal;

    // ASTUCE 1
    if (selectedMode === "astuce_unites10") {
      const dizaines = Math.floor(Math.random() * 8) + 1;

      const u1 = Math.floor(Math.random() * 9) + 1;
      const u2 = 10 - u1;

      aVal = dizaines * 10 + u1;
      bVal = dizaines * 10 + u2;
    }

    // ASTUCE 2
    else if (selectedMode === "astuce_dizaines10") {
      const d1 = Math.floor(Math.random() * 9) + 1;
      const d2 = 10 - d1;

      const unite = Math.floor(Math.random() * 9) + 1;

      aVal = d1 * 10 + unite;
      bVal = d2 * 10 + unite;
    }

    // MODES CLASSIQUES
    else {
      aVal = rand(digits);
      bVal = rand(digits);

      if (selectedMode === "division") {
        bVal = Math.floor(Math.random() * 9) + 1;
        aVal = bVal * (Math.floor(Math.random() * 20) + 1);
      }
    }

    setA(aVal);
    setB(bVal);

    setInput("");
  }

  function nextAdaptiveQuestion() {
    let nextMode = "addition";

    if (level <= 2) {
      nextMode = "addition";
    } else if (level <= 4) {
      nextMode =
        Math.random() < 0.5
          ? "addition"
          : "soustraction";
    } else if (level <= 6) {
      const list = [
        "addition",
        "soustraction",
        "multiplication",
      ];

      nextMode =
        list[Math.floor(Math.random() * list.length)];
    } else {
      const list = [
        "multiplication",
        "astuce_unites10",
        "astuce_dizaines10",
      ];

      nextMode =
        list[Math.floor(Math.random() * list.length)];
    }

    setMode(nextMode);

    generateQuestion(nextMode);
  }

  useEffect(() => {
    nextAdaptiveQuestion();
  }, []);

  useEffect(() => {
    generateQuestion(mode);
  }, [digits]);

  function getAnswer() {
    if (mode === "addition") return a + b;

    if (mode === "soustraction") return a - b;

    if (mode === "multiplication") return a * b;

    if (mode === "division") return a / b;

    if (mode === "carre") return a * a;

    return a * b;
  }

  function successSound() {
    const ctx =
      new (window.AudioContext ||
        window.webkitAudioContext)();

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

      setStreak((s) => {
        const newStreak = s + 1;

        if (newStreak % 5 === 0) {
          setLevel((l) => l + 1);
        }

        return newStreak;
      });

      setErrors(0);

      successSound();

      setTimeout(() => {
        nextAdaptiveQuestion();
      }, 250);
    } else {
      setInput("");

      setErrors((e) => {
        const newErrors = e + 1;

        if (newErrors >= 3) {
          setLevel((l) => Math.max(1, l - 1));
        }

        return newErrors;
      });

      setStreak(0);
    }
  }

  function voice() {
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SR) {
      alert("Reconnaissance vocale non supportée");

      return;
    }

    const rec = new SR();

    rec.lang = "fr-FR";

    rec.interimResults = false;

    rec.continuous = false;

    setListening(true);

    rec.start();

    rec.onresult = (e) => {
      const text =
        e.results[0][0].transcript;

      const cleaned =
        text.replace(/[^0-9.-]/g, "");

      if (!cleaned) return;

      setInput(cleaned);

      validate(cleaned);
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
      : mode === "division"
      ? "÷"
      : "×";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Calcul mental</h2>

        <div style={styles.score}>
          Score : {score}
        </div>

        <div style={styles.score}>
          Niveau : {level}
        </div>

        <div style={styles.row}>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              generateQuestion(e.target.value);
            }}
          >
            <option value="addition">
              Addition
            </option>

            <option value="soustraction">
              Soustraction
            </option>

            <option value="multiplication">
              Multiplication
            </option>

            <option value="division">
              Division
            </option>

            <option value="carre">
              Carré
            </option>

            <option value="astuce_unites10">
              Astuce : unités = 10
            </option>

            <option value="astuce_dizaines10">
              Astuce : dizaines = 10
            </option>
          </select>

          <select
            value={digits}
            onChange={(e) =>
              setDigits(Number(e.target.value))
            }
          >
            <option value={2}>
              2 chiffres
            </option>

            <option value={3}>
              3 chiffres
            </option>

            <option value={4}>
              4 chiffres
            </option>
          </select>
        </div>

        <div style={styles.question}>
          {mode === "carre"
            ? `${a}²`
            : `${a} ${op} ${b}`}
        </div>

        <input
          style={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            validate(e.target.value);
          }}
        />

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

          <button
            style={styles.btn}
            onClick={() => setInput("")}
          >
            ⌫
          </button>
        </div>

        <button
          style={styles.voice}
          onClick={voice}
        >
          {listening
            ? "🎤 Écoute..."
            : "🎤 Vocal"}
        </button>

        <div
          style={{
            display: "flex",
            gap: 5,
          }}
        >
          <button
            style={styles.solution}
            onClick={() =>
              alert(
                `Solution : ${getAnswer()}`
              )
            }
          >
            Solution
          </button>

          <button
            style={styles.skip}
            onClick={() => {
              nextAdaptiveQuestion();
            }}
          >
            Passer
          </button>
        </div>
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
    width: 340,
    background: "#1e293b",
    padding: 20,
    borderRadius: 16,
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.4)",
    color: "white",
  },

  score: {
    marginBottom: 8,
    color: "#cbd5e1",
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    justifyContent: "center",
  },

  question: {
    fontSize: 32,
    marginBottom: 15,
    color: "white",
  },

  input: {
    width: "100%",
    padding: 12,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
    borderRadius: 8,
    border: "none",
    background: "#0f172a",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },

  pad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 6,
    marginBottom: 12,
  },

  btn: {
    padding: 12,
    background: "#334155",
    border: "none",
    fontSize: 18,
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },

  voice: {
    width: "100%",
    padding: 12,
    background: "#3b82f6",
    color: "white",
    border: "none",
    marginBottom: 8,
    borderRadius: 8,
    cursor: "pointer",
  },

  solution: {
    width: "100%",
    padding: 12,
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  skip: {
    width: "100%",
    padding: 12,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};