import { useState } from "react";

export default function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [operator, setOperator] = useState("*");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const generate = () => {
    const num1 = Math.floor(Math.random() * 90 + 10);
    const num2 = Math.floor(Math.random() * 90 + 10);
    setA(num1);
    setB(num2);
    setAnswer("");
    setResult(null);
    setShowResult(false);
  };

  const check = () => {
    let correct;
    if (operator === "+") correct = a + b;
    if (operator === "-") correct = a - b;
    if (operator === "*") correct = a * b;

    setResult(Number(answer) === correct);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Calcul Mental</h1>

      <h2>{a} {operator} {b}</h2>

      <button onClick={generate}>Lancer</button>

      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ta réponse"
        />
        <button onClick={check}>Valider</button>
      </div>

      {result === true && <h3 style={{ color: "green" }}>✔ Bravo</h3>}
      {result === false && <h3 style={{ color: "red" }}>❌ Faux</h3>}

      <button onClick={() => setShowResult(!showResult)}>
        Voir résultat
      </button>

      {showResult && result !== null && (
        <p>
          Résultat correct :
          {operator === "+" && a + b}
          {operator === "-" && a - b}
          {operator === "*" && a * b}
        </p>
      )}
    </div>
  );
}