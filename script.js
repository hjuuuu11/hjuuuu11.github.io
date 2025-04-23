
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
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // 檢查是否已經初始化
        if (webcam) {
            return;
        }

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        const webcamContainer = document.getElementById("webcam-container");
        webcamContainer.innerHTML = ''; // 清空容器
        webcamContainer.appendChild(webcam.canvas);
        
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ''; // 清空標籤容器
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    } catch (error) {
        console.error('初始化時發生錯誤:', error);
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
