import "../style/style.css";
import punchSource from "@music/punch.mp3";

const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const counntdownBoard = document.querySelector('.countdown');
const startButton = document.querySelector('.start-button');

let lastHole;
let timeUp = false;
let timeLimit = 30000;
let timeLeft = timeLimit;
let currentMoleTimeAnimation = null;
let score = 0;
let countdown = 0;

const punch = new Audio();
punch.src = punchSource;

const pickRandomHole = holes => {
    const randomHole = Math.floor(Math.random() * holes.length);
    const hole = holes[randomHole];
    if (hole === lastHole) {
        return pickRandomHole(holes);
    }
    lastHole  = hole;
    return hole;
};

const popOut = () => {
    const time = Math.random() * ((timeLeft / timeLimit) * 1500) + 1000;
    currentMoleTimeAnimation = time;
    const hole = pickRandomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) popOut();
    }, time);
};

const startGame = () => {
    countdown = timeLimit / 1000;
    scoreBoard.textContent = 0;
    scoreBoard.style.display = 'block'; 
    counntdownBoard.textContent = countdown;
    timeUp = false;
    timeLeft = timeLimit;
    score = 0;
    popOut();
    setTimeout(() => {
        timeUp  = true;
    }, timeLimit);

    let startCountdown = setInterval(() => {
        countdown -= 1;
        timeLeft -= 1000;
        counntdownBoard.textContent = countdown;
        if (countdown < 0) {
            countdown = 0;
            timeLeft = 0;
            clearInterval(startCountdown);
            counntdownBoard.textContent = 'Times up! Thank you for protecting our planet!';
        }
    }, 1000);
};

startButton.addEventListener('click', startGame);

const audioHandler = (audio) => {
    if (audio.currentTime > 0) {
        audio.currentTime = 0;
    }
    audio.play();
}

const whack = e => {
    score++;
    const el = e.target;
    el.classList.add('punched');
    audioHandler(punch);
    el.style.pointerEvents = 'none';
    setTimeout(() => {
        el.classList.remove('punched');
        el.style.pointerEvents = 'all';
    }, currentMoleTimeAnimation);
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', whack));