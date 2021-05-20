const updateStatusPanel = function (_event = null) {
  const playerInfoTypes = [
    "cargo-weight",
    "firegroup",
    "legal-state",
    "fuel-main",
    "fuel-res",
    "pips-sys",
    "pips-eng",
    "pips-wep",
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
    "srv-turret-retracted",
    "srv-drive-assist",
    "mass-locked",
    "fsd-charging",
    "fsd-cooldown",
    "low-fuel",
    "overheat",
    "has-lat-lng",
    "danger",
    "interdicted",
    "in-ship",
    "in-fighter",
    "in-srv",
    "analysis-mode",
    "night-vision",
    "has-altitude",
    "fsd-jump",
    "srv-highbeam",
  ];

  for (let i = 0; i < playerInfoTypes.length; i++) {
    const el = document.querySelector(
      `#status-panel-${playerInfoTypes[i]} .status-value`
    );

    let value = window.frameShifterHelpers.playerInfo(playerInfoTypes[i]);
    el.textContent = value ? value : "-";
  }
};

window.addEventListener("UPDATE_STATUS", updateStatusPanel);
updateStatusPanel();
