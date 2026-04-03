// ========== DOM Elements ==========
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const millisecondsEl = document.getElementById('milliseconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');

// ========== Variables ==========
let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let timerInterval = null;
let isRunning = false;
let lapCounter = 1;

// ========== Helper Functions ==========
function formatTime(value) {
    return value < 10 ? `0${value}` : value;
}

function updateDisplay() {
    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);
    millisecondsEl.textContent = formatTime(milliseconds);
}

// ========== Stopwatch Logic ==========
function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(updateTime, 10); // Update every 10ms
        startBtn.disabled = true;
        pauseBtn.disabled = false;
    }
}

function pauseStopwatch() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetStopwatch() {
    // Stop the timer
    isRunning = false;
    clearInterval(timerInterval);
    
    // Reset all time variables
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    
    // Update display
    updateDisplay();
    
    // Reset button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Clear all lap times
    lapCounter = 1;
    lapList.innerHTML = '<p class="empty-laps">No laps recorded. Press "Lap" to track intervals.</p>';
}

function updateTime() {
    milliseconds++;
    
    if (milliseconds >= 100) {
        milliseconds = 0;
        seconds++;
    }
    
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
    
    updateDisplay();
}

// ========== Lap Function ==========
function recordLap() {
    if (!isRunning) {
        return; // Don't record laps when stopwatch is not running
    }
    
    // Get current time formatted
    const currentTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatTime(milliseconds)}`;
    
    // Remove empty message if it exists
    if (lapList.querySelector('.empty-laps')) {
        lapList.innerHTML = '';
    }
    
    // Create new lap element
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <span class="lap-number">Lap ${lapCounter}</span>
        <span class="lap-time">${currentTime}</span>
    `;
    
    // Add to top of list (most recent first)
    lapList.insertBefore(lapItem, lapList.firstChild);
    
    lapCounter++;
    
    // Auto-scroll to top to show latest lap
    lapList.scrollTop = 0;
}

// ========== Event Listeners ==========
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

// ========== Keyboard Shortcuts (Bonus) ==========
document.addEventListener('keydown', function(e) {
    // Space key: Start/Pause
    if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
            pauseStopwatch();
        } else {
            startStopwatch();
        }
    }
    // 'L' key: Record Lap
    if (e.code === 'KeyL') {
        e.preventDefault();
        recordLap();
    }
    // 'R' key: Reset
    if (e.code === 'KeyR') {
        e.preventDefault();
        resetStopwatch();
    }
});