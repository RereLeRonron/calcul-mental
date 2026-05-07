import { useEffect, useState } from "react";

export default function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  function newQuestion() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    setA(x);
    setB(y);
    setInput("");
    setMessage("");
  }

  function checkAnswer() {
    const result = parseInt(input);

    if (result === a + b) {
      setScore(score + 1);
      setMessage("✔ Bonne réponse !");
      newQuestion();
    } else {
      setScore(0);
      setMessage("❌ Mauvais !");
      newQuestion();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      checkAnswer();
    }
  }

  useEffect(() => {
    newQuestion();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Calcul mental</h1>

        <div style={styles.score}>Score : {score}</div>

        <div style={styles.question}>
          {a} + {b} = ?
        </div>

        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ta réponse"
          type="number"
        />

        <button style={styles.button} onClick={checkAnswer}>
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
    padding: 30,
    borderRadius: 20,
    textAlign: "center",
    width: 300,
  },
  title: {
    marginBottom: 20,
  },
  score: {
    marginBottom: 10,
    fontSize: 18,
  },
  question: {
    fontSize: 32,
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
    cursor: "pointer",
  },
  message: {
    marginTop: 15,
    fontSize: 16,
  },
};