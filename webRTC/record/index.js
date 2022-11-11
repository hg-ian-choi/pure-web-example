
let mediaRecorder;
let recordedBlobs;

const recordedVideo = document.querySelector('video#record');
const recordButton = document.querySelector('button#recordButton');
const playButton = document.querySelector('button#playRecord');
const downloadButton = document.querySelector('button#download');

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error: ', e);
  }
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream;
  const liveVideo = document.querySelector('video#live');
  liveVideo.srcObject = stream;
}

function startRecording() {
  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(window.stream);
  } catch (e) {
    console.error('Exception while creating MediaRecorder: ', e);
    return;
  }

  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorder Blobs', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
});

playButton.addEventListener('click', () => {
  const buffer = new Blob(recordedBlobs);
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(buffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});

downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {
    type: 'video/webm',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

document
  .querySelector('button#startButton')
  .addEventListener('click', async () => {
    const constraints = {
      audio: {},
      video: {
        window: 1280,
        height: 720,
      },
    };
    console.log('Using media constraints', constraints);
    await init(constraints);
  });