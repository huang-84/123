const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const colors = ["#ff6b6b", "#7952ff", "#00b8a9", "#ff9f1c", "#4d96ff", "#f15bb5"];
const targetLetter = document.querySelector("#targetLetter");
const scoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#timeLeft");
const comboEl = document.querySelector("#combo");
const field = document.querySelector("#balloonField");
const startBtn = document.querySelector("#startBtn");
const soundBtn = document.querySelector("#soundBtn");
const message = document.querySelector("#message");

let target = "A";
let score = 0;
let combo = 0;
let timeLeft = 60;
let timerId;
let speaking = true;
let playing = false;

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function speakTarget() {
  if (!speaking || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`Find the letter ${target}`);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function setTarget() {
  target = randomItem(letters);
  targetLetter.textContent = target;
  speakTarget();
}

function makeBalloon(letter, index) {
  const balloon = document.createElement("button");
  balloon.className = "balloon";
  balloon.type = "button";
  balloon.textContent = letter;
  balloon.style.left = `${8 + (index % 5) * 18 + Math.random() * 5}%`;
  balloon.style.top = `${8 + Math.floor(index / 5) * 25 + Math.random() * 8}%`;
  balloon.style.background = `linear-gradient(135deg, ${randomItem(colors)}, ${randomItem(colors)})`;
  balloon.style.animationDelay = `${Math.random() * 1.6}s`;
  balloon.addEventListener("click", () => popBalloon(balloon, letter));
  return balloon;
}

function renderBalloons() {
  field.innerHTML = "";
  const choices = new Set([target]);
  while (choices.size < 12) choices.add(randomItem(letters));
  [...choices]
    .sort(() => Math.random() - 0.5)
    .forEach((letter, index) => field.appendChild(makeBalloon(letter, index)));
}

function popBalloon(balloon, letter) {
  if (!playing) return;
  balloon.classList.add("pop");
  balloon.disabled = true;

  if (letter === target) {
    combo += 1;
    score += 10 + combo * 2;
    message.textContent = `太棒了！${target} 找对啦，连击 +${combo}！`;
    setTarget();
  } else {
    combo = 0;
    score = Math.max(0, score - 4);
    message.textContent = `这是 ${letter}，目标是 ${target}。再试一次！`;
  }

  scoreEl.textContent = score;
  comboEl.textContent = combo;
  setTimeout(renderBalloons, 230);
}

function endGame() {
  playing = false;
  clearInterval(timerId);
  startBtn.textContent = "再玩一次";
  message.textContent = `时间到！你的最终得分是 ${score}。`;
}

function startGame() {
  score = 0;
  combo = 0;
  timeLeft = 60;
  playing = true;
  scoreEl.textContent = score;
  comboEl.textContent = combo;
  timeEl.textContent = timeLeft;
  startBtn.textContent = "重新开始";
  message.textContent = "快戳中正确的字母气球！";
  setTarget();
  renderBalloons();
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

startBtn.addEventListener("click", startGame);
soundBtn.addEventListener("click", () => {
  speaking = !speaking;
  soundBtn.setAttribute("aria-pressed", String(speaking));
  soundBtn.textContent = speaking ? "🔊 读出目标" : "🔇 静音模式";
  if (speaking) speakTarget();
});

setTarget();
renderBalloons();
