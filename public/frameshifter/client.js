window.frameShifterData = {};

const socket = io(window.location.href);
socket.connect();

socket.onAny((event, data) => {
  console.log(event);

  if (event.includes("_UPDATE")) {
    const property = event.replace("_UPDATE", "").toLowerCase();
    window.frameShifterData[property] = data;
  }
  const browserEvent = new CustomEvent(event, {
    detail: data,
  });

  window.dispatchEvent(browserEvent);
});

window.addEventListener("CURRENT_STATE", (event) => {
  window.frameShifterData = event.detail;
});

window.addEventListener("CURRENT_CONFIG", (event) => {
  window.frameShifterConfig = event.detail;

  const browserEvent = new CustomEvent("CONFIG_READY");
  window.dispatchEvent(browserEvent);
});
