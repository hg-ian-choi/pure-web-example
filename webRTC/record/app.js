let stream;

const openCamButton = document.querySelector('button#openCamButton');

async function openCam(type) {
  let video = document.querySelector('video#preview');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { facingMode: type },
      })
      .then((_stream) => {
        if ('srcObject' in video) {
          video.srcObject = _stream;
          video.play();
          stream = _stream;
        }
      });
  }
}

openCamButton.addEventListener('click', async function () {
  await openCam('user');
});
