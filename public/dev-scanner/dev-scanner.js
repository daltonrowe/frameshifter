const toggleNext = (event) => {
  const { target } = event;
  const nextNode = target.nextElementSibling;
  nextNode.classList.toggle("collapsed");
};

const allToggles = document.querySelectorAll(".dev-scanner-collapse-next");

allToggles.forEach((toggle) => {
  toggle.addEventListener("click", toggleNext);
});

const journalOut = document.querySelector("#dev-scanner-journal");
const statusOut = document.querySelector("#dev-scanner-status");
const cargoOut = document.querySelector("#dev-scanner-cargo");
const marketOut = document.querySelector("#dev-scanner-market");
const modulesinfoOut = document.querySelector("#dev-scanner-modulesinfo");
const navrouteOut = document.querySelector("#dev-scanner-navroute");
const outfittingOut = document.querySelector("#dev-scanner-outfitting");
const shipyardOut = document.querySelector("#dev-scanner-shipyard");
const backpackOut = document.querySelector("#dev-scanner-backpack");
const loadOutOut = document.querySelector("#dev-scanner-loadout");
const loadGameOut = document.querySelector("#dev-scanner-load-game");

window.addEventListener("UPDATE_JOURNAL", () => {
  journalOut.textContent = JSON.stringify(window.frameShifterJournal, null, 2);
});

window.addEventListener("UPDATE_STATUS", () => {
  statusOut.textContent = JSON.stringify(
    window.frameShifterState.status,
    null,
    2
  );
});

window.addEventListener("UPDATE_CARGO", () => {
  cargoOut.textContent = JSON.stringify(
    window.frameShifterState.cargo,
    null,
    2
  );
});

window.addEventListener("UPDATE_MARKET", () => {
  marketOut.textContent = JSON.stringify(
    window.frameShifterState.market,
    null,
    2
  );
});

window.addEventListener("UPDATE_MODULESINFO", () => {
  modulesinfoOut.textContent = JSON.stringify(
    window.frameShifterState.modulesinfo,
    null,
    2
  );
});

window.addEventListener("UPDATE_NAVROUTE", () => {
  navrouteOut.textContent = JSON.stringify(
    window.frameShifterState.navroute,
    null,
    2
  );
});

window.addEventListener("UPDATE_OUTFITTING", () => {
  outfittingOut.textContent = JSON.stringify(
    window.frameShifterState.outfitting,
    null,
    2
  );
});

window.addEventListener("UPDATE_SHIPYARD", () => {
  shipyardOut.textContent = JSON.stringify(
    window.frameShifterState.shipyard,
    null,
    2
  );
});

window.addEventListener("UPDATE_BACKPACK", () => {
  backpackOut.textContent = JSON.stringify(
    window.frameShifterState.backpack,
    null,
    2
  );
});

window.addEventListener("UPDATE_LOADGAME", () => {
  loadGameOut.textContent = JSON.stringify(
    window.frameShifterState.loadgame,
    null,
    2
  );
});

window.addEventListener("UPDATE_LOADOUT", () => {
  loadOutOut.textContent = JSON.stringify(
    window.frameShifterState.loadout,
    null,
    2
  );
});

const updateAll = () => {
  journalOut.textContent = JSON.stringify(window.frameShifterJournal, null, 2);

  statusOut.textContent = JSON.stringify(
    window.frameShifterState.status,
    null,
    2
  );

  cargoOut.textContent = JSON.stringify(
    window.frameShifterState.cargo,
    null,
    2
  );

  marketOut.textContent = JSON.stringify(
    window.frameShifterState.market,
    null,
    2
  );

  modulesinfoOut.textContent = JSON.stringify(
    window.frameShifterState.modulesinfo,
    null,
    2
  );

  navrouteOut.textContent = JSON.stringify(
    window.frameShifterState.navroute,
    null,
    2
  );

  outfittingOut.textContent = JSON.stringify(
    window.frameShifterState.outfitting,
    null,
    2
  );

  shipyardOut.textContent = JSON.stringify(
    window.frameShifterState.shipyard,
    null,
    2
  );

  backpackOut.textContent = JSON.stringify(
    window.frameShifterState.backpack,
    null,
    2
  );

  loadOutOut.textContent = JSON.stringify(
    window.frameShifterState.loadout,
    null,
    2
  );

  loadGameOut.textContent = JSON.stringify(
    window.frameShifterState.loadgame,
    null,
    2
  );
};

const hasData = (obj) => {
  if (obj && Object.keys(obj).length > 0) {
    return true;
  }

  return false;
};

if (window.location.href.indexOf("standalone") > 0) {
  const waitForData = setInterval(() => {
    if (hasData(window.frameShifterState)) {
      updateAll();
      clearInterval(waitForData);
    }
  }, 200);
} else {
  updateAll();
}
