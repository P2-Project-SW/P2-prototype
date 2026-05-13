export { startTimer, startTime, resetTimer }

const timerDisplay = document.getElementById("Timer");
let timerInterval: ReturnType <typeof setInterval> | null = null;
let startTime: Date | null = null;
let timeOut: (()=> void) | null;

function startTimer(onTimeOut: ()=> void) {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    timeOut = onTimeOut; //save the function
}

function updateTimer() {
    const currentTime: any = new Date();
    const maxTime = 120000;
    const elapsedTime = currentTime.getTime() - startTime!.getTime();
    const timeLeft = maxTime - elapsedTime;

    if (timeLeft <= 0) {
        resetTimer();

        if(timeOut === null) return;
        timeOut();
        return;
    }
    let timeLeftMinutes = Math.floor(timeLeft/1000 / 60);
    let timeLeftSeconds = Math.floor(timeLeft/1000 % 60);

    const minutes = String(timeLeftMinutes).padStart(2, '0');
    const seconds = String(timeLeftSeconds).padStart(2, '0');

    timerDisplay!.textContent = `${minutes}:${seconds}`;
}

function resetTimer() {
    clearInterval(timerInterval!);
    timerInterval = null;
    startTime = null;
    timerDisplay!.textContent = "00:00";
}