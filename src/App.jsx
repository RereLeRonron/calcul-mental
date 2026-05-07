import { useEffect, useState } from "react";

export default function App() {
  const [mode, setMode] = useState("addition");
  const [niveau, setNiveau] = useState(2);

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  function rand(niveau) {
    const min = Math.pow(10, niveau - 1);
    const max = Math.pow(10, niveau) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function newQuestion() {
    const x = rand(niveau);
    const y = rand(niveau);

    setA(x);
    setB(y);
    setInput("");
    setMessage("");
  }

  function getAnswer() {
    if (mode === "addition") return a + b;
    if (mode === "soustraction") return a - b;
    if (mode === "multiplication") return a * b;
    if (mode === "division") return Math.round((a / b) * 100) / 100;
    if (mode === "carre") return a * a;
    return 0;
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

  useEffect(() => {
    newQuestion();
  }, [mode, niveau]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Coach mental</h1>

        <div style={styles.score}>Score : {score}</div>

        {/* MODE */}
        <div style={styles.row}>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="addition">➕ Addition</option>
            <option value="soustraction">➖ Soustraction</option>
            <option value="multiplication">✖️ Multiplication</option>
            <option value="division">➗ Division</option>
            <option value="carre">🔢 Carré</option>
          </select>

          <select value={niveau} onChange={(e) => setNiveau(parseInt(e.target.value))}>
            <option value={2}>2 chiffres</option>
            <option value={3}>3 chiffres</option>
            <option value={4}>4 chiffres</option>
          </select>
        </div>

        {/* QUESTION */}
        <div style={styles.question}>
          {mode === "carre"
            ? `${a}² = ?`
            : `${a} ${mode === "addition" ? "+" : mode === "soustraction" ? "-" : mode === "multiplication" ? "×" : "÷"} ${b} = ?`}
        </div>

        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Réponse"
        />

        <button style={styles.button} onClick={check}>
          Valider
        </button>

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
    padding: 25,
    borderRadius: 20,
    textAlign: "center",
    width: 340,
  },
  score: {
    marginBottom: 10,
    fontSize: 18,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
  },
  question: {
    fontSize: 26,
    marginBottom: 20,
  },
  input: {
    padding: 10,
    fontSize: 18,
    width: "100%",
    marginBottom: 10,
    borderRadius: 8,
    border: "none",
    textAlign: "center",
  },
  button: {
    padding: 10,
    width: "100%",
    fontSize: 18,
    borderRadius: 8,
    border: "none",
    background: "#22c55e",
    color: "white",
  },
  message: {
    marginTop: 15,
    fontSize: 16,
  },
};