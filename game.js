const board = document.getElementById('game-board');
const attemptsEl = document.getElementById('attempts');
const matchesEl = document.getElementById('matches');
const timeEl = document.getElementById('time');
const bestScoreEl = document.getElementById('best-score');
const bestTimeEl = document.getElementById('best-time');
const resetBtn = document.getElementById('reset');

let cards = [];
let flippedCards = [];
let attempts = 0;
let matches = 0;
let timer = 0;
let timerInterval;

function initGame() {
  attempts = 0;
  matches = 0;
  timer = 0;
  attemptsEl.textContent = attempts;
  matchesEl.textContent = matches;
  timeEl.textContent = timer;
  board.innerHTML = '';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timeEl.textContent = timer;
  }, 1000);

  const values = ['A','B','C','D','E','F','G','H'];
  cards = [...values, ...values].sort(() => Math.random() - 0.5);

  cards.forEach((value, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.dataset.index = index;
    card.addEventListener('click', () => handleCardClick(card));
    board.appendChild(card);
  });

  loadHighscore();
}

function handleCardClick(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

  card.textContent = card.dataset.value;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    attempts++;
    attemptsEl.textContent = attempts;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.value === card2.dataset.value) {
    matches++;
    matchesEl.textContent = matches;
    flippedCards = [];
    if (matches === cards.length / 2) {
      clearInterval(timerInterval);
      saveHighscore();
      alert(`You win! Attempts: ${attempts}, Time: ${timer}s`);
    }
  } else {
    setTimeout(() => {
      card1.textContent = '';
      card2.textContent = '';
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function saveHighscore() {
  const bestScore = JSON.parse(localStorage.getItem('memoryBest')) || { attempts: null, time: null };

  if (!bestScore.attempts || attempts < bestScore.attempts || timer < bestScore.time) {
    localStorage.setItem('memoryBest', JSON.stringify({ attempts, time: timer }));
  }
  loadHighscore();
}

function loadHighscore() {
  const bestScore = JSON.parse(localStorage.getItem('memoryBest'));
  if (bestScore) {
    bestScoreEl.textContent = bestScore.attempts;
    bestTimeEl.textContent = bestScore.time;
  }
}

resetBtn.addEventListener('click', initGame);
initGame();