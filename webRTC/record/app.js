let stream = null;
let camType = 'user';

const openCamButton = document.querySelector('button#openCamButton');
const changeCamButton = document.querySelector('button#changeCamButton');
const camTypeContext = document.querySelector('span#camType');
const captureButton = document.querySelector('button#captureButton');
const preview = document.querySelector('video#preview');
const capture = document.querySelector('canvas#capture');

async function changeCam() {
  if (camType === 'user') {
    camType = 'enviroment';
    camTypeContext.context = 'Back-End';
  } else {
    camType = 'user';
    camTypeContext.context = 'Front-End';
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
        }
      });
  }
}

async function onCapture() {
  const context = capture.getContext('2d');
  context.drawImage(preview, 0, 0, 300, 225);
  capture.style.display = 'block';
}

async function release() {
  preview.style.display = 'none';
  capture.style.display = 'none';
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
