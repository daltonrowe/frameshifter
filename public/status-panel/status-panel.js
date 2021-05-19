const updateStatusPanel = function (_event = null) {
  function updateCargo() {
    const out = document.querySelector("#status-panel-cargo .status-value");
    const value = window.frameShifterState.status.Cargo;

    if (typeof value === "number") {
      out.textContent = `${value}T`;
    } else {
      out.textContent = "-";
    }
  }

  function updateFiregroup() {
    const out = document.querySelector("#status-panel-firegroup .status-value");
    const value = window.frameShifterState.status.FireGroup;

    if (typeof value === "number") {
      out.textContent = `${value + 1}`;
    } else {
      out.textContent = "-";
    }
  }

  function updateLegal() {
    const out = document.querySelector("#status-panel-legal .status-value");
    const value = window.frameShifterState.status.LegalState;

    if (typeof value === "string") {
      out.textContent = value;
    } else {
      out.textContent = "-";
    }
  }

  function updateFuel() {
    const out = document.querySelector("#status-panel-fuel .status-value");
    const value = window.frameShifterState.status.Fuel;

    if (typeof value === "object") {
      out.textContent = `Main: ${
        value.FuelMain
      } / Res: ${value.FuelReservoir.toFixed(2)}`;
    } else {
      out.textContent = "-";
    }
  }

  function updatePips() {
    const out = document.querySelector("#status-panel-pips .status-value");
    const value = window.frameShifterState.status.Pips;

    if (Array.isArray(value)) {
      out.textContent = `SYS: ${value[0] / 2} / SYS: ${value[1] / 2} / SYS: ${
        value[2] / 2
      }`;
    } else {
      out.textContent = "-";
    }
  }

  function updateFlags() {
    const flagNames = [
      "docked",
      "landed",
      "landing-gear",
      "shields-up",
      "supercruise",
      "fa-off",
      "hardpoints",
      "in-wing",
      "external-lights",
      "cargo-scoop",
      "silent-running",
      "scooping-fuel",
      "srv-handbrake",
      "srv-turret",
      "srv-turrent-retracted",
      "srv-drive-assist",
      "mass-locked",
      "fsd-charging",
      "fsd-cooldown",
      "low-fuel",
      "overheat",
      "lat-lng",
      "danger",
      "inderdicted",
      "in-ship",
      "in-fighter",
      "in-srv",
      "analysis-mode",
      "night-vision",
      "altitude",
      "fsd-jump",
      "srv-highbeam",
    ];

    for (let i = 0; i < flagNames.length; i++) {
      const el = document.querySelector(
        `#status-panel-${flagNames[i]} .status-value`
      );
      el.textContent = window.frameShifterHelpers.playerInfo(flagNames[i]);
    }
  }

  updateCargo();
  updateFiregroup();
  updateLegal();
  updateFuel();
  updatePips();

  updateFlags();
};

window.addEventListener("UPDATE_STATUS", updateStatusPanel);
updateStatusPanel();
