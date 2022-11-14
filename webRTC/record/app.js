let stream = null;
let type = 'user';

const openCamButton = document.querySelector('button#openCamButton');
const changeCamButton = document.querySelector('button#changeCamButton');
const captureButton = document.querySelector('button#captureButton');
const preview = document.querySelector('video#preview');
const capture = document.querySelector('canvas#capture');

async function changeCam() {
  if (type === 'user') {
    type = 'enviroment';
  } else {
    type = 'user';
  }
  openCam(type);
}

async function openCam(_type) {
  await release();
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { facingMode: type },
      })
      .then((_stream) => {
        if ('srcObject' in preview) {
          preview.srcObject = _stream;
          preview.play();
          stream = _stream;
          _type;
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
  preview.srcObject = null;
  preview.src = null;
  stream = null;
  preview.style.display = 'none';
  capture.style.display = 'none';
}

openCamButton.addEventListener('click', async function () {
  await openCam(type);
});

captureButton.addEventListener('click', async function () {
  await onCapture();
});
changeCamButton.addEventListener('click', async function () {
  await changeCam();
});
