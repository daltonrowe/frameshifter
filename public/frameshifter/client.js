window.frameShifterState = {};
window.frameShifterJournal = [];
window.frameShifterConfig = {};
window.frameShifterStarted = false;

const socket = io(`http://${window.location.host}/`);
socket.connect();

socket.onAny((event, data) => {
  console.log(event);

  // react to status updates and set global data
  if (event.includes("UPDATE_")) {
    const property = event.replace("UPDATE_", "").toLowerCase();
    window.frameShifterState[property] = data;
  }

  // react to journal updates and trim log
  if (event.includes("JOURNAL_")) {
    window.frameShifterJournal.unshift(data);

    if (
      window.frameShifterJournal.length >
      window.frameShifterConfig.journalMaxLines
    ) {
      window.frameShifterJournal.pop();
    }

    // trigger generic journal event
    const genericJournalEvent = new CustomEvent("UPDATE_JOURNAL", {
      detail: data,
    });

    window.dispatchEvent(genericJournalEvent);
  }

  // handle current info overwrites
  if (event === "CURRENT_STATE") window.frameShifterState = data;
  if (event === "CURRENT_JOURNAL") window.frameShifterJournal = data;
  if (event === "CURRENT_CONFIG") window.frameShifterConfig = data;

  // send all socket events as browser events
  const browserEvent = new CustomEvent(event, {
    detail: data,
  });

  window.dispatchEvent(browserEvent);
});

// set config ready to ui when data is present
window.addEventListener("CURRENT_CONFIG", (event) => {
  if (window.frameShifterStarted) return;

  const browserEvent = new CustomEvent("CONFIG_READY");
  window.dispatchEvent(browserEvent);
  window.frameShifterStarted = true;
});
