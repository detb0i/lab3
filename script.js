"use strict";

const logEl = document.getElementById("log");
function log(msg) { console.log(msg); logEl.textContent += msg + "\n"; }
const toNumber = (s) => (s === null || s.trim() === "") ? NaN : Number(s.replace(",", "."));
const round2 = (n) => Math.round(n * 100) / 100;

const tasks = {

  t4_1() {
    function getFullName(firstName, lastName) { return `${firstName} ${lastName}`; }
    function showGreeting(fullName, age) {
      const msg = `Hello, ${fullName}! You are ${age} years old.`;
      alert(msg); log(msg);
    }
    const firstName = prompt("Введіть ім’я:");
    const lastName = prompt("Введіть прізвище:");
    const age = prompt("Введіть вік:");
    if ([firstName, lastName, age].includes(null)) return;
    showGreeting(getFullName(firstName.trim(), lastName.trim()), age.trim());
  },

  t4_2() {
    function getStudentInfo() {
      const name = prompt("Ім’я студента:");
      if (name === null) return null;
      const score = toNumber(prompt("Бал (0–12):"));
      return { name: name.trim(), score };
    }
    function checkGrade(score) {
      if (Number.isNaN(score) || score < 0 || score > 12) return "Invalid score";
      if (score >= 10) return "Excellent";
      if (score >= 7) return "Good";
      if (score >= 4) return "Satisfactory";
      return "Fail";
    }
    function showResult(name, grade) {
      const msg = `Student: ${name}\nGrade: ${grade}`;
      alert(msg); log(msg);
    }
    const info = getStudentInfo();
    if (!info) return;
    showResult(info.name, checkGrade(info.score));
  },

  t4_3() {
    function calculateTip(amount, percent = 10) { return amount * percent / 100; }
    function showResult(amount, tip, percent = 10) {
      const msg = `Bill: ${amount} грн\nTip (${percent}%): ${round2(tip)} грн\nTotal: ${round2(amount + tip)} грн`;
      alert(msg); log(msg);
    }
    const amount = toNumber(prompt("Загальна сума рахунку (грн):", "450"));
    if (Number.isNaN(amount) || amount < 0) { alert("Введіть коректну суму"); return; }
    showResult(amount, calculateTip(amount)); 
  },

  t7_1() {
    function startGreetingTimer(message, seconds, callback) {
      setTimeout(() => {
        log(message);
        callback();
      }, seconds * 1000);
    }
    log("Таймер запущено, чекаємо 3 секунди…");
    startGreetingTimer("Hello! Timer finished.", 3, () => alert("Time is up!"));
  },

  t7_2() {
    function calculate(a, b, operation) {
      switch (operation) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? "Cannot divide by zero" : a / b;
        default:  return "Invalid operation";
      }
    }
    function showResult() {
      const a = toNumber(prompt("Перше число:"));
      const b = toNumber(prompt("Друге число:"));
      if (Number.isNaN(a) || Number.isNaN(b)) { alert("Потрібно ввести два числа"); return; }
      const op = prompt("Операція (+, -, *, /):");
      if (op === null) return;
      const msg = `${a} ${op.trim()} ${b} = ${calculate(a, b, op.trim())}`;
      alert(msg); log(msg);
    }
    showResult();
  }
};

function createClickCounter() {
  let count = 0;
  return function () {
    count++;
    log(`Count: ${count}`);
  };
}
const clickCounter = createClickCounter();
document.getElementById("counterBtn").addEventListener("click", clickCounter);

function* randomGenerator(min, max) {
  while (true) {
    yield Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
let randomGen = null;
const outEl = document.getElementById("out");
document.getElementById("setupRandom").addEventListener("click", () => {
  let min = toNumber(prompt("Мінімум:", "1"));
  let max = toNumber(prompt("Максимум:", "100"));
  if (Number.isNaN(min) || Number.isNaN(max)) { alert("Межі мають бути числами"); return; }
  if (min > max) [min, max] = [max, min];
  randomGen = randomGenerator(Math.ceil(min), Math.floor(max));
  outEl.textContent = "—";
  log(`Межі генератора: від ${min} до ${max}`);
});
document.getElementById("next").addEventListener("click", () => {
  if (!randomGen) { outEl.textContent = "Спочатку задайте межі"; return; }
  outEl.textContent = randomGen.next().value;
});

function* passwordGenerator() {
  let password = "";
  while (true) {
    const ch = yield;            
    if (ch === "done") return password;
    password += ch;
  }
}

function* chatBot() {
  const name = yield "Hi! What is your name?";
  const mood = yield `Nice to meet you, ${name}! How are you?`;
  if (/bad|sad|awful|not good|погано/i.test(mood || "")) yield "Sorry to hear that. Take care!";
  yield "Goodbye!";
}

tasks.t10_2 = function () {
  const gen = passwordGenerator();
  gen.next(); 
  while (true) {
    const input = prompt("Введіть символ (або 'done' для завершення):");
    if (input === null) return;
    const res = gen.next(input);
    if (res.done) {
      alert(`Password: ${res.value}`);
      log(`Password: ${res.value}`);
      return;
    }
  }
};

tasks.t10_3 = function () {
  const bot = chatBot();
  let step = bot.next();                      
  while (!step.done) {
    const text = step.value;
    if (text.endsWith("?")) {                 
      const answer = prompt(text);
      if (answer === null) return;
      log(`Bot: ${text}\nYou: ${answer}`);
      step = bot.next(answer);                
    } else {                                  
      alert(text); log(`Bot: ${text}`);
      step = bot.next();
    }
  }
};

let user = null;
const helloBtn = document.getElementById("hello");
const helloBadBtn = document.getElementById("helloBad");
document.getElementById("setupHello").addEventListener("click", () => {
  const name = prompt("Ваше ім’я:");
  if (!name || !name.trim()) return;
  user = {
    name: name.trim(),
    say() { alert(`Hello, ${this.name}`); }
  };
  helloBtn.onclick = user.say.bind(user);
  helloBadBtn.onclick = user.say;
  helloBtn.disabled = helloBadBtn.disabled = false;
  log(`Ім’я збережено: ${user.name}. Порівняйте дві кнопки.`);
});

document.querySelectorAll("[data-task]").forEach((btn) => {
  btn.addEventListener("click", () => tasks[btn.dataset.task]());
});
document.getElementById("clearLog").addEventListener("click", () => { logEl.textContent = ""; });
