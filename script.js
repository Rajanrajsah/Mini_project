const input = document.querySelector(".display");
const buttons = document.querySelectorAll(".button");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const toggleBtn = document.getElementById("themeToggle");
const clickSound = document.getElementById("clickSound");

let expression = "";
const operators = ["+", "-", "*", "/"];

/* Button click */
buttons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    rippleEffect(e, btn);
    playSound();
    handleInput(btn.innerText);
  });
});

/* Keyboard */
document.addEventListener("keydown", e => {
  if ((e.key >= "0" && e.key <= "9") || "+-*/.%".includes(e.key)) {
    handleInput(e.key);
  }
  if (e.key === "Enter") handleInput("=");
  if (e.key === "Backspace") {
    expression = expression.slice(0, -1);
    input.value = expression;
  }
  if (e.key === "Escape") handleInput("C");
});

/* Logic */
function handleInput(value) {
  if (value === "C") {
    expression = "";
    input.value = "";
    return;
  }

  if (value === "=") {
    try {
      const result = Function(`return (${expression})`)();
      addHistory(expression, result);
      expression = result.toString();
      input.value = expression;
    } catch {
      input.value = "Error";
      expression = "";
    }
    return;
  }

  if (value === "%" && expression !== "") {
    expression += "/100";
    input.value = expression;
    return;
  }

  const last = expression.slice(-1);
  if (operators.includes(value) && operators.includes(last)) return;

  expression += value;
  input.value = expression;
}

/* History */
function addHistory(exp, res) {
  const li = document.createElement("li");
  li.textContent = `${exp} = ${res}`;
  li.onclick = () => {
    expression = res.toString();
    input.value = expression;
  };
  historyList.prepend(li);
}

/* Clear history */
clearHistoryBtn.onclick = () => historyList.innerHTML = "";

/* Dark / Light */
toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent =
    document.body.classList.contains("dark") ? "☀️ Light" : "🌙 Dark";
};

/* Ripple */
function rippleEffect(e, button) {
  const span = document.createElement("span");
  span.classList.add("ripple");
  const rect = button.getBoundingClientRect();
  span.style.left = `${e.clientX - rect.left}px`;
  span.style.top = `${e.clientY - rect.top}px`;
  button.appendChild(span);
  setTimeout(() => span.remove(), 600);
}

/* Sound */
function playSound() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

