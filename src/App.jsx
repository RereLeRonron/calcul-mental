import { useState, useEffect } from "react";

export default function App() {
  const [screen, setScreen] = useState("home");

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  // Génération calcul
  const generate = () => {
    const ops = ["+", "-", "*"];
    setA(Math.floor(Math.random() * 90 + 10));
    setB(Math.floor(Math.random() * 90 + 10));
    setOp(ops[Math.floor(Math.random() * ops.length)]);
    setAnswer("");
  };

  // Validation + passage au suivant
  const handleValidate = () => {
    let result;

    if (op === "+") result = a + b;
    if (op === "-") result = a - b;
    if (op === "*") result = a * b;

    if (Number(answer) === result) {
      setScore((s) => s + 1);
    }

    generate();
  };

  // ENTER clavier (PC + certains claviers mobiles)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && screen === "game") {
        handleValidate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer, screen]);

  // Chrono
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setRunning(false);
          setScreen("end");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const startGame = () => {
    setScore(0);
    setTime(30);
    setRunning(true);
    generate();
    setScreen("game");
  };

  return (
    <div style={styles.container}>

      {screen === "home" && (
        <div style={styles.center}>
          <h1>🧠 Calcul Mental</h1>
          <button style={styles.btn} onClick={startGame}>
            Lancer le jeu
          </button>
        </div>
      )}

      {screen === "game" && (
        <div style={styles.center}>
          <h2>
            {a} {op} {b}
          </h2>

          <input
            style={styles.input}
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ta réponse"
          />

          <button style={styles.btn} onClick={handleValidate}>
            Valider
          </button>

          <p>⏱️ Temps : {time}s</p>
          <p>🏆 Score : {score}</p>
        </div>
      )}

      {screen === "end" && (
        <div style={styles.center}>
          <h2>🎯 Fin du jeu</h2>
          <p>Score final : {score}</p>

          <button style={styles.btn} onClick={() => setScreen("home")}>
            Rejouer
          </button>
        </div>
      )}

    </div>
  );
}

// Styles mobile app
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
    background: "#f5f5f5",
    color: "#111",
    padding: 20
  },
  center: {
    textAlign: "center"
  },
  btn: {
    padding: "15px 25px",
    fontSize: "18px",
    marginTop: "10px",
    cursor: "pointer"
  },
  input: {
    fontSize: "20px",
    padding: "10px",
    marginTop: "10px",
    width: "150px",
    textAlign: "center"
  }
};