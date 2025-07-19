// State variables
let words: string[] = [];
let currentIndex = 0;
let wpm = 300;
let isPlaying = false;
let isLooping = false;
let intervalId: number | null = null;

// DOM Elements
const displayBox = document.getElementById('display-box') as HTMLDivElement;
const textInput = document.getElementById('text-input') as HTMLTextAreaElement;
const wpmSlider = document.getElementById('wpm-slider') as HTMLInputElement;
const wpmValue = document.getElementById('wpm-value') as HTMLSpanElement;
const startPauseBtn = document.getElementById('start-pause-btn') as HTMLButtonElement;
const startPauseBtnText = startPauseBtn.querySelector('span') as HTMLSpanElement;
const startPauseBtnIcon = startPauseBtn.querySelector('svg') as SVGElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const modeOnceRadio = document.getElementById('mode-once') as HTMLInputElement;
const modeLoopRadio = document.getElementById('mode-loop') as HTMLInputElement;

const playIcon = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
const pauseIcon = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';

// --- Functions ---

/**
 * Updates the WPM display next to the slider.
 */
function updateWpmDisplay() {
  wpm = parseInt(wpmSlider.value, 10);
  wpmValue.textContent = String(wpm);
}

/**
 * Toggles the button state between Play and Pause.
 * @param {'play' | 'pause'} state - The desired state.
 */
function setButtonState(state: 'play' | 'pause') {
    if (state === 'pause') {
        startPauseBtnText.textContent = 'Pausar';
        startPauseBtnIcon.innerHTML = pauseIcon;
        startPauseBtn.classList.add('paused');
        isPlaying = true;
    } else {
        startPauseBtnText.textContent = 'Iniciar';
        startPauseBtnIcon.innerHTML = playIcon;
        startPauseBtn.classList.remove('paused');
        isPlaying = false;
    }
}

/**
 * Displays the next word in the sequence.
 */
function showNextWord() {
  if (currentIndex < words.length) {
    displayBox.textContent = words[currentIndex];
    currentIndex++;
  } else {
    if (isLooping) {
      currentIndex = 0;
    } else {
      stopReader();
      displayBox.textContent = "¿Repetimos?";
    }
  }
}

/**
 * Starts the reading timer.
 */
function startReader() {
  if (intervalId) clearInterval(intervalId);
  const interval = (60 / wpm) * 1000;
  intervalId = window.setInterval(showNextWord, interval);
  setButtonState('pause');
}

/**
 * Stops the reading timer.
 */
function stopReader() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  setButtonState('play');
}

/**
 * Resets the reader to its initial state.
 */
function resetReader() {
    stopReader();
    currentIndex = 0;
    words = [];
    displayBox.textContent = '...';
    // Don't clear the text input, user might want to re-read.
}

/**
 * Prepares the text from the input area for reading.
 */
function processText() {
    const text = textInput.value.trim();
    if (text) {
        words = text.split(/\s+/).filter(word => word.length > 0);
    } else {
        words = [];
    }
    currentIndex = 0;
}

// --- Event Listeners ---

wpmSlider.addEventListener('input', () => {
  updateWpmDisplay();
  if (isPlaying) {
    // Restart the timer with the new speed
    startReader();
  }
});

startPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    stopReader();
  } else {
    processText();
    if (words.length > 0) {
        startReader();
    } else {
        displayBox.textContent = "Pega texto";
    }
  }
});

resetBtn.addEventListener('click', resetReader);

modeOnceRadio.addEventListener('change', () => {
  if (modeOnceRadio.checked) {
    isLooping = false;
  }
});

modeLoopRadio.addEventListener('change', () => {
  if (modeLoopRadio.checked) {
    isLooping = true;
  }
});

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    updateWpmDisplay();
    isLooping = modeLoopRadio.checked;
});