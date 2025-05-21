// 菜單開關與平滑捲動
const menuIcon = document.querySelector('.menu-icon');
const navMenu = document.querySelector('.nav-menu');

menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('active');
  navMenu.classList.toggle('active');
});

document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  });
});

// Teachable Machine Code
const URL = "https://teachablemachine.withgoogle.com/models/4YdhgapBu/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
  try {
    // 若已初始化，跳過
    if (webcam) return;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();

    // 將 webcam 畫面插入 DOM
    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.innerHTML = '';
    webcamContainer.appendChild(webcam.canvas);

    // 建立標籤容器內的 div
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    await webcam.play();
    window.requestAnimationFrame(loop);
  } catch (error) {
    console.error('初始化時發生錯誤:', error);
  }
}

function stopWebcam() {
  if (webcam && webcam.stop) {
    webcam.stop();
    webcam = null;

    document.getElementById("webcam-container").innerHTML = '';
    document.getElementById("label-container").innerHTML = '';
  }
}

async function loop() {
  if (!webcam) return; // webcam 已停止時跳出迴圈
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  if (!model || !labelContainer || labelContainer.childNodes.length !== maxPredictions) return;

  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}
