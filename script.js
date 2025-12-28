const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const input = document.querySelector(".display");
const buttons = document.querySelectorAll(".button");
const toggleBtn = document.getElementById("themeToggle");

let expression = "";
const operators = ["+", "-", "*", "/"];

/* ---------------- BUTTON CLICKS ---------------- */
buttons.forEach(btn => {
  btn.addEventListener("click", () => handleInput(btn.innerText));
});

/* ---------------- KEYBOARD SUPPORT ---------------- */
document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || "+-*/.%".includes(e.key)) {
    handleInput(e.key);
  }

  if (e.key === "Enter") {
    handleInput("=");
  }

  if (e.key === "Backspace") {
    expression = expression.slice(0, -1);
    input.value = expression;
  }

  if (e.key === "Escape") {
    handleInput("C");
  }
});

/* ---------------- MAIN INPUT HANDLER ---------------- */
function handleInput(value) {
  if (value === "C") {
    expression = "";
    input.value = "";
    return;
  }

  if (value === "=") {
    calculate();
    return;
  }

  if (value === "%") {
    if (expression !== "") {
      expression += "/100";
      input.value = expression;
    }
    return;
  }

  if (operators.includes(value) && expression === "") return;

  let last = expression.slice(-1);
  if (operators.includes(value) && operators.includes(last)) {
    expression = expression.slice(0, -1);
  }

  expression += value;
  input.value = expression;
}

/* ---------------- SAFE CALCULATION ---------------- */
function calculate() {
  try {
    let result = Function(`"use strict"; return (${expression})`)();

    addToHistory(expression, result);

    input.value = result;
    expression = result.toString();
  } catch {
    input.value = "Error";
    expression = "";
  }
}

/* ---------------- HISTORY ---------------- */
function addToHistory(exp, res) {
  const li = document.createElement("li");
  li.textContent = `${exp} = ${res}`;

  // Click history to reuse result
  li.addEventListener("click", () => {
    expression = res.toString();
    input.value = expression;
  });

  historyList.prepend(li);

  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click
