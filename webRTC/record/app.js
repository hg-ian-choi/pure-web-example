let stream;
let camType = 'user';
let isRecording = false;
let mediaRecorder;
let blobs;

const camTypeContext = document.querySelector('span#camType');

const preview = document.querySelector('video#preview');
const capture = document.querySelector('canvas#capture');
const playRecord = document.querySelector('video#playRecord');

const openCamButton = document.querySelector('button#openCamButton');
const changeCamButton = document.querySelector('button#changeCamButton');
const captureButton = document.querySelector('button#captureButton');
const recordButton = document.querySelector('button#recordButton');
const playRecordButton = document.querySelector('button#playRecordButton');

async function changeCam() {
  if (camType === 'user') {
    camType = 'enviroment';
    camTypeContext.textContent = 'Back-End';
  } else {
    camType = 'user';
    camTypeContext.textContent = 'Front-End';
  }
  openCam(camType);
}

async function openCam(_type) {
  await release();
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { facingMode: _type },
      })
      .then((_stream) => {
        if ('srcObject' in preview) {
          stream = _stream;
          preview.srcObject = _stream;
          preview.play();
          preview.style.display = 'block';
          captureButton.disabled = false;
          changeCamButton.disabled = false;
          recordButton.disabled = false;
        }
      });
  }
}

async function onCapture() {
  const context = capture.getContext('2d');
  context.drawImage(preview, 0, 0, 300, 225);
  capture.style.display = 'block';
}

async function onRecord() {
  if (isRecording) {
    mediaRecorder.stop();
    recordButton.textContent = 'Start Record';
    playRecordButton.disabled = false;
    openCamButton.disabled = false;
    changeCamButton.disabled = false;
    isRecording = false;
  } else {
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });
    mediaRecorder.ondataavailable = function (_event) {
      blobs = new Blob([_event.data], { type: _event.data.type });
    };
    mediaRecorder.start();
    recordButton.textContent = 'Stop Record';
    playRecord.pause();
    playRecord.style.display = 'none';
    playRecordButton.disabled = true;
    openCamButton.disabled = true;
    changeCamButton.disabled = true;
    isRecording = true;
  }
}

async function onPlayRecord() {
  playRecord.style.display = 'block';
  playRecord.src = window.URL.createObjectURL(blobs);
  playRecord.play();
}

async function release() {
  preview.style.display = 'none';
  capture.style.display = 'none';
  playRecord.style.display = 'none';

  playRecordButton.disabled = true;
}

openCamButton.addEventListener('click', async function () {
  await openCam(camType);
});

captureButton.addEventListener('click', async function () {
  await onCapture();
});

changeCamButton.addEventListener('click', async function () {
  await changeCam();
});

recordButton.addEventListener('click', async function () {
  await onRecord();
});

playRecordButton.addEventListener('click', async function () {
  await onPlayRecord();
});
