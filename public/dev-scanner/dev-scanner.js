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

window.addEventListener("UPDATE_JOURNAL", () => {
  console.log("updating");
  journalOut.textContent = JSON.stringify(window.frameShifterJournal, null, 2);
});

journalOut.textContent = JSON.stringify(window.frameShifterJournal, null, 2);
journalOut.dataset.lastUpdate = `${Date.now()}`;

window.addEventListener("UPDATE_STATUS", () => {
  statusOut.textContent = JSON.stringify(
    window.frameShifterData.status,
    null,
    2
  );
});

statusOut.textContent = JSON.stringify(window.frameShifterData.status, null, 2);
statusOut.dataset.lastUpdate = `${Date.now()}`;

window.addEventListener("UPDATE_CARGO", () => {
  cargoOut.textContent = JSON.stringify(window.frameShifterData.cargo, null, 2);
});

cargoOut.textContent = JSON.stringify(window.frameShifterData.cargo, null, 2);
cargoOut.dataset.lastUpdate = `${Date.now()}`;

window.addEventListener("UPDATE_MARKET", () => {
  marketOut.textContent = JSON.stringify(
    window.frameShifterData.market,
    null,
    2
  );
});

marketOut.textContent = JSON.stringify(window.frameShifterData.market, null, 2);
marketOut.dataset.lastUpdate = `${Date.now()}`;

window.addEventListener("UPDATE_MODULESINFO", () => {
  modulesinfoOut.textContent = JSON.stringify(
    window.frameShifterData.modulesinfo,
    null,
    2
  );
});

modulesinfoOut.textContent = JSON.stringify(
  window.frameShifterData.modulesinfo,
  null,
  2
);
modulesinfoOut.dataset.lastUpdate = `${Date.now()}`;

window.addEventListener("UPDATE_NAVROUTE", () => {
  navrouteOut.textContent = JSON.stringify(
    window.frameShifterData.navroute,
    null,
    2
  );
});

navrouteOut.textContent = JSON.stringify(
  window.frameShifterData.navroute,
  null,
  2
);
navrouteOut.dataset.lastUpdate = `${Date.now()}`;

window.addEventListener("UPDATE_OUTFITTING", () => {
  outfittingOut.textContent = JSON.stringify(
    window.frameShifterData.outfitting,
    null,
    2
  );
});

outfittingOut.textContent = JSON.stringify(
  window.frameShifterData.outfitting,
  null,
  2
);
outfittingOut.dataset.lastUpdate = `${Date.now()}`;

window.addEventListener("UPDATE_SHIPYARD", () => {
  shipyardOut.textContent = JSON.stringify(
    window.frameShifterData.shipyard,
    null,
    2
  );
});

shipyardOut.textContent = JSON.stringify(
  window.frameShifterData.shipyard,
  null,
  2
);
shipyardOut.dataset.lastUpdate = `${Date.now()}`;
