import { useState, useEffect } from "react";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("*");
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  const generate = () => {
    const ops = ["+", "-", "*"];
    setA(Math.floor(Math.random() * 90 + 10));
    setB(Math.floor(Math.random() * 90 + 10));
    setOp(ops[Math.floor(Math.random() * ops.length)]);
    setAnswer("");
  };

  const check = () => {
    let res;
    if (op === "+") res = a + b;
    if (op === "-") res = a - b;
    if (op === "*") res = a * b;

    if (Number(answer) === res) {
      setScore((s) => s + 1);
    }
  };

  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      setTime((x) => {
        if (x <= 1) {
          clearInterval(t);
          setRunning(false);
          setScreen("end");
          return 0;
        }
        return x - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [running]);

  const start = () => {
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
          <button style={styles.btn} onClick={start}>
            Lancer le jeu
          </button>
        </div>
      )}

      {screen === "game" && (
        <div style={styles.center}>
          <h2>{a} {op} {b}</h2>

          <input
            style={styles.input}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            type="number"
          />

          <button
            style={styles.btn}
            onClick={() => {
              check();
              generate();
            }}
          >
            Valider
          </button>

          <p>⏱️ {time}s</p>
          <p>🏆 Score : {score}</p>
        </div>
      )}

      {screen === "end" && (
        <div style={styles.center}>
          <h2>Fin du jeu 🎯</h2>
          <p>Score : {score}</p>

          <button style={styles.btn} onClick={() => setScreen("home")}>
            Rejouer
          </button>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
    background: "#f5f5f5"
  },
  center: {
    textAlign: "center"
  },
  btn: {
    padding: "15px 25px",
    fontSize: "18px",
    marginTop: "10px"
  },
  input: {
    fontSize: "20px",
    padding: "10px",
    marginTop: "10px"
  }
};