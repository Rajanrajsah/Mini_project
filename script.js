const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let input = document.querySelector('.display');
let buttons = document.querySelectorAll('.button');
let expression = "";

const operators = ['+', '-', '*', '/'];

/* Button clicks */
buttons.forEach(btn => {
    btn.addEventListener('click', () => handleInput(btn.innerText));
});

/* Keyboard support */
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isNaN(key) || operators.includes(key) || key === '.') {
        handleInput(key);
    } else if (key === 'Enter') {
        handleInput('=');
    } else if (key === 'Backspace') {
        expression = expression.slice(0, -1);
        input.value = expression;
    } else if (key === 'Escape') {
        handleInput('C');
    }
});

/* Main logic */
function handleInput(value) {

    if (value === 'C') {
        expression = "";
        input.value = "";
        return;
    }

    if (value === '=') {
        calculate();
        return;
    }

    if (value === '%') {
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

/* Safe calculation (no eval) */
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

/* Dark / Light toggle */
const toggleBtn = document.getElementById("themeToggle");
let darkMode = false;

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    darkMode = !darkMode;
    toggleBtn.innerText = darkMode ? "☀️ Light" : "🌙 Dark";
});

function addToHistory(exp, res) {
    const li = document.createElement("li");
    li.textContent = `${exp} = ${res}`;

    // Click history to reuse result
    li.addEventListener("click", () => {
        expression = res.toString();
        input.value = expression;
    });

    historyList.prepend(li);

    // Limit history to last 10
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Clear history
clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
});
