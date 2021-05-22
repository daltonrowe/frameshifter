window.frameShifterHelpers = {};

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
window.frameShifterHelpers.getBinaryFlags = () => {
  if (!window.frameShifterState.status.Flags) return false;

  function padding(char, num) {
    let str = "";
    for (let i = 0; i < num; i++) {
      str += char;
    }
    return str;
  }

  let flagBinary = window.frameShifterState.status.Flags.toString(2);

  if (flagBinary.length < 32) {
    const offset = 32 - flagBinary.length;
    flagBinary = `${padding("0", offset)}${flagBinary}`;
  }

  return flagBinary;
};

// One giant data grabber to help people make dashboards quickly
window.frameShifterHelpers.playerInfo = (infoType) => {
  const checkFlag = (flags, num, max) => {
    return flags[max - num] === "1";
  };

  // boolean information available in binary Status flags
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
    const flags = window.frameShifterHelpers.getBinaryFlags();

    if (!flags) {
      console.warn("Player Flags not available.");
      return null;
    } else {
      return checkFlag(flags, flagNames.indexOf(infoType), 31);
    }
  }

  // Data available from various places in Status.json
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

  // TODO

  // ship-type
  // ship-ident
  // ship-name
  // hull-health
  // hull-value
  // unladen-mass
  // fuel-main-cap
  // fuel-res-cap
  // cargo-cap
  // max-jump
  // rebuy
  // cmdr-name
  // horizons
  // odyssey
  // game-mode
  // credits

  // unknown info type, avoid this

  console.warn(`Player info "${infoType}" not found or available.`);
  return null;
};
