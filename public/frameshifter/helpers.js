window.frameShifterHelpers = {};

window.frameShifterHelpers.hasData = (obj) => {
  if (obj && Object.keys(obj).length > 0) {
    return true;
  }

  return false;
};

window.frameShifterHelpers.waitForDataInterval = null;

window.frameShifterHelpers.waitForData = (callback) => {
  window.frameShifterHelpers.waitForDataInterval = setInterval(() => {
    if (window.frameShifterHelpers.hasData(window.frameShifterState)) {
      callback();
      clearInterval(window.frameShifterHelpers.waitForDataInterval);
    }
  }, 200);
};

window.frameShifterHelpers.getPluginConfigBySlug = (slug) => {
  if (!window.frameShifterConfig) {
    console.warn(`Plugin config for slug "${slug}" is not available.`);
    return false;
  }

  for (let i = 0; i < window.frameShifterConfig.plugins.length; i++) {
    const plugin = window.frameShifterConfig.plugins[i];

    if (plugin.slug && plugin.slug === slug) {
      return plugin;
    }
  }

  console.error(`Plugin config for slug "${slug}" is not found.`);
  return false;
};

// return data if present and as expected
window.frameShifterHelpers.getPlayerData = (value, type) => {
  if (typeof value === "undefined") return null;

  switch (type) {
    case "object":
    case "string":
    case "number":
      if (typeof value === type) return value;
      break;

    case "array":
      if (Array.isArray(value)) return value;
      break;

    default:
      break;
  }

  return null;
};

// turn encoded status integer into a 32 length series of binary flags
window.frameShifterHelpers.getBinaryFlags = (flagsInt, len) => {
  if (!flagsInt) return false;

  function padding(char, num) {
    let str = "";
    for (let i = 0; i < num; i++) {
      str += char;
    }
    return str;
  }

  let flagBinary = flagsInt.toString(2);

  if (flagBinary.length < len) {
    const offset = len - flagBinary.length;
    flagBinary = `${padding("0", offset)}${flagBinary}`;
  }

  return flagBinary;
};

// One giant data grabber to help people make dashboards quickly
window.frameShifterHelpers.playerInfo = (infoType) => {
  const checkFlag = (flags, num, max) => {
    return flags[max - num] === "1";
  };

  // boolean information available in binary status flags
  const flagNames = [
    "landed",
    "docked",
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

  if (flagNames.includes(infoType)) {
    const flags = window.frameShifterHelpers.getBinaryFlags(
      window.frameShifterState.status.Flags,
      32
    );

    if (flags) return checkFlag(flags, flagNames.indexOf(infoType), 31);
    return null;
  }

  // data available from various places in Status.json
  const statusNames = [
    "cargo-weight",
    "firegroup",
    "legal-state",
    "fuel-main",
    "fuel-res",
    "pips-sys",
    "pips-eng",
    "pips-wep",
  ];

  if (statusNames.includes(infoType)) {
    switch (infoType) {
      case "cargo-weight":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Cargo,
          "number"
        );

      case "firegroup":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.FireGroup,
          "number"
        );

      case "legal-state":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.LegalState,
          "string"
        );

      case "fuel-main":
        const tFuelMain = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Fuel,
          "object"
        );
        return tFuelMain ? tFuelMain.FuelMain : null;

      case "fuel-res":
        const tFuelRes = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Fuel,
          "object"
        );
        return tFuelRes ? tFuelRes.FuelReservoir : null;

      case "pips-sys":
        const tPipSys = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Pips,
          "array"
        );
        return tPipSys ? tPipSys[0] / 2 : null;

      case "pips-eng":
        const tPipEng = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Pips,
          "array"
        );
        return tPipEng ? tPipEng[1] / 2 : null;

      case "pips-wep":
        const tPipWep = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Pips,
          "array"
        );
        return tPipWep ? tPipWep[2] / 2 : null;

      default:
        return null;
    }
  }

  // data available in odyssey flags2
  const flag2Names = [
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
  ];

  if (flag2Names.includes(infoType)) {
    const flags2 = window.frameShifterHelpers.getBinaryFlags(
      window.frameShifterState.status.Flags2,
      16
    );

    if (flags2) return checkFlag(flags2, flag2Names.indexOf(infoType), 15);
    return null;
  }

  // data available from loadout and loadgame events
  const journalNames = [
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
    "credits",
  ];

  if (journalNames.includes(infoType)) {
  }

  // combinations of multiple data sources

  const comboNames = ["fuel-main-perc", "fuel-res-perc", "cargo-perc"];

  if (comboNames.includes(infoType)) {
  }

  // unknown info type, avoid this :)

  console.warn(`"${infoType}" is not a valid player info type.`);
  return null;
};
