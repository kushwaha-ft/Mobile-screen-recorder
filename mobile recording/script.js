let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");
let downloadBtn = document.getElementById("downloadBtn");
let timerDisplay = document.getElementById("timer");
let statusDisplay = document.getElementById("status");

let mediaRecorder;
let chunks = [];
let stream;
let timer;
let seconds = 0;

function updateTimer() {
  let mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  let secs = String(seconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

startBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      downloadBtn.href = url;
      downloadBtn.style.display = 'inline-block';
    };

    mediaRecorder.start();

    statusDisplay.textContent = "Recording...";
    statusDisplay.classList.remove("text-muted");
    statusDisplay.classList.add("text-danger");

    startBtn.disabled = true;
    stopBtn.disabled = false;
    downloadBtn.style.display = "none";

    timer = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);
  } catch (err) {
    alert("Screen recording not started: " + err);
  }
});

stopBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  clearInterval(timer);
  seconds = 0;
  updateTimer();

  statusDisplay.textContent = "Not Recording";
  statusDisplay.classList.remove("text-danger");
  statusDisplay.classList.add("text-muted");

  startBtn.disabled = false;
  stopBtn.disabled = true;

  // Stop all tracks to release screen capture
  stream.getTracks().forEach(track => track.stop());
});
