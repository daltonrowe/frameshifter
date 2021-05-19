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
    console.log(
      "lights:",
      window.frameShifterHelpers.playerIs("external-lights")
    );
    console.log("shields:", window.frameShifterHelpers.playerIs("shields-up"));
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
