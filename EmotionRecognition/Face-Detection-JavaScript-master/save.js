var video;
var surprisedCount = 0;
var disgustedCount = 0;
var fearfulCount = 0;
var sadCount = 0;
var happyCount = 0;
var angryCount = 0;
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(startVideo);

$(document).ready(function () {
  video = document.getElementById("video");
  startbtn = document.getElementById("start");
  console.log(video);
  startbtn.addEventListener("click", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      if (resizedDetections.length) {
        var instrument = document.getElementById("instrument").value;
        var genre = document.getElementById("genre").value;

        var emotionObject = resizedDetections[0].expressions;
        const max = Math.max.apply(null, Object.values(emotionObject));
        const detectedEmotion = getKeyByValue(emotionObject, max);
        if (detectedEmotion == "surprised") {
          surprisedCount += 1;
        }
        if (detectedEmotion == "disgusted") {
          disgustedCount += 1;
        }
        if (detectedEmotion == "fearful") {
          fearfulCount += 1;
        }
        if (detectedEmotion == "sad") {
          sadCount += 1;
          console.log("sad", sadCount);
        }
        if (detectedEmotion == "angry") {
          angryCount += 1;
        }
        if (detectedEmotion == "happy") {
          happyCount += 1;
          console.log("happy", happyCount);
        }
        if (surprisedCount>=20) {
          window.location.replace('http://localhost:8000/youtube/example.html?emotion=Surprised&emoji=128559&instrument='+instrument+'&genre='+genre);
        }
        if (disgustedCount>=20) {
          window.location.replace('http://localhost:8000/youtube/example.html?emotion=Disgusted&emoji=129326&instrument='+instrument+'&genre='+genre);
        }
        if (fearfulCount>=20) {
          window.location.replace('http://localhost:8000/youtube/example.html?emotion=Scared&emoji=128561&instrument='+instrument+'&genre='+genre);
        }
        if (sadCount>=20) {
          window.location.replace('http://localhost:8000/youtube/example.html?emotion=Sad&emoji=128557&instrument='+instrument+'&genre='+genre);
        }
        if (angryCount>=20) {
          window.location.replace('http://localhost:8000/youtube/example.html?emotion=Angry&emoji=128545&instrument='+instrument+'&genre='+genre);
        }
        if (happyCount>=20) {
          window.location.replace('http://localhost:8000/youtube/example.html?emotion=Happy&emoji=128578&instrument='+instrument+'&genre='+genre);
        }
      }
    }, 100);
  });
});

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
        video.srcObject = stream;
        })
        .catch(function (err0r) {
        console.log(err0r);
        });
    }
}