export { startTimer, startTime, resetTimer }

const timerDisplay = document.getElementById("Timer");
let timerInterval: ReturnType <typeof setInterval> | null = null;
let startTime: Date | null = null;

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime: any = new Date();
    const elapsedTime = new Date(currentTime.getTime() - startTime!.getTime());

    const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');

    timerDisplay!.textContent = `${minutes}:${seconds}`;
}

function resetTimer() {
    clearInterval(timerInterval!);
    timerInterval = null;
    startTime = null;
    timerDisplay!.textContent = "00:00";
}