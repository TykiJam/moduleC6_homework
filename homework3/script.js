const url = "wss://echo-ws-service.herokuapp.com";

function contentLoaded() {
  const div = document.getElementById("correspondence-window");
  const btn = document.querySelector(".canvas-overlay #send-message");
  const btnGeo = document.querySelector(".canvas-overlay #geo");
  const input = document.querySelector(".canvas-overlay #input-1");
  const canvas = document.getElementById("canvas");
  const overlay = document.querySelector(".canvas-overlay");

  let websocket = new WebSocket(url);

  function innerTag(data, classValue) {
    inOut = classValue ? "out-send" : "in-send";
    div.innerHTML += `<div class="send ${inOut}">${data}</div>`;
  }

  websocket.onopen = function () {
    console.log("WS CONNECTED");
  };

  websocket.onmessage = (event) => {
    innerTag(event.data, false);
  };

  function sendMessage() {
    if (input.value) {
      websocket.send(input.value);
      innerTag(input.value, true);
      input.value = "";
    } else {
      return;
    }
  }

  function gLocation() {
    if (!navigator.geolocation) {
      attention = "Geolocation не поддерживается вашим браузером";
      innerTag(attention, true);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        console.log(coords.latitude, coords.longitude);
        const href = `https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}`;
        link = `<a href="${href}" class="href" target="_blank">Гео-локация</a>`;
        innerTag(link, true);
      });
    }
  }

  btn.addEventListener("click", (event) => {
    sendMessage();
    event.preventDefault();
  });

  btnGeo.addEventListener("click", (event) => {
    gLocation();
    event.preventDefault();
  });

  let isDrawing = false;
  let ctx = canvas.getContext("2d");
  
 


  overlay.addEventListener("mousedown", startDrawing);
  overlay.addEventListener("mousemove", draw);
  overlay.addEventListener("mouseup", stopDrawing);
  overlay.addEventListener("mouseout", stopDrawing);
}

document.addEventListener("DOMContentLoaded", contentLoaded);