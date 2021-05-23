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
    "on-foot",
    "in-taxi",
    "multicrew",
    "on-foot-in-station",
    "on-foot-on-planet",
    "aim-down-sight",
    "low-o2",
    "low-health",
    "cold",
    "hot",
    "very-cold",
    "very-hot",
    "glide",
    "on-foot-in-hangar",
    "on-foot-in-social",
    "on-foot-exterior",
    "breathable-atom",
    "ship",
    "ship-ident",
    "ship-name",
    "hull-perc",
    "hull-value",
    "unladen-mass",
    "fuel-main-cap",
    "fuel-res-cap",
    "cargo-cap",
    "max-jump",
    "rebuy",
    "cmdr-name",
    "horizons",
    "odyssey",
    "game-mode",
    "credits-at-load",
    "fuel-main-perc",
    "fuel-res-perc",
    "cargo-perc",
  ];

  for (let i = 0; i < playerInfoTypes.length; i++) {
    const el = document.querySelector(
      `#status-panel-${playerInfoTypes[i]} .status-value`
    );
    const wrap = el.parentNode.parentNode;

    let value = window.frameShifterHelpers.playerInfo(playerInfoTypes[i]);
    el.textContent = value !== null ? `${value}` : "-";

    if (value === true) {
      wrap.dataset.statusPanelLight = true;
    } else {
      wrap.dataset.statusPanelLight = false;
    }
  }
};

// update everything on every change
window.addEventListener("UPDATE_STATUS", updateStatusPanel);
window.addEventListener("UPDATE_LOADOUT", updateStatusPanel);
updateStatusPanel();
