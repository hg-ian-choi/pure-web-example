let stream = null;

const openCamButton = document.querySelector('button#openCamButton');
const captureButton = document.querySelector('button#captureButton');
const preview = document.querySelector('video#preview');
const capture = document.querySelector('canvas#capture');

async function openCam(type) {
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
          preview.style.display = 'block';
          captureButton.disabled = false;
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
  await openCam('user');
});
captureButton.addEventListener('click', async function () {
  await onCapture();
});
