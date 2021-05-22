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

window.frameShifterHelpers.pipsToNumber = (pip) => {
  // giving up and doing this bad
  // there is math number bases that i dont quite get

  switch (pip) {
    case 2:
      return 1;

    case 4:
      return 2;

    case 6:
      return 3;

    case 8:
      return 4;

    default:
      return 0;
  }
};

// return data if present with expected type
window.frameShifterHelpers.getPlayerData = (value, type) => {
  if (typeof value === "undefined") return null;

  switch (type) {
    case "boolean":
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
        return tPipSys
          ? window.frameShifterHelpers.pipsToNumber(tPipSys[0])
          : null;

      case "pips-eng":
        const tPipEng = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Pips,
          "array"
        );
        return tPipEng
          ? window.frameShifterHelpers.pipsToNumber(tPipEng[1])
          : null;

      case "pips-wep":
        const tPipWep = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Pips,
          "array"
        );
        return tPipWep
          ? window.frameShifterHelpers.pipsToNumber(tPipWep[2])
          : null;

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

  // data available from loadout and loadgame journal events
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
    "credits-at-load",
  ];

  if (journalNames.includes(infoType)) {
    switch (infoType) {
      case "ship":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.Ship,
          "string"
        );

      case "ship-ident":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.ShipIdent,
          "string"
        );

      case "ship-name":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.ShipName,
          "string"
        );

      case "hull-perc":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.HullHealth,
          "number"
        );

      case "hull-value":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.HullValue,
          "number"
        );

      case "hull-value":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.HullValue,
          "number"
        );

      case "unladen-mass":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.UnladenMass,
          "number"
        );

      case "fuel-main-cap":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.FuelCapacity.Main,
          "number"
        );

      case "fuel-res-cap":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.FuelCapacity.Reserve,
          "number"
        );

      case "cargo-cap":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.CargoCapacity,
          "number"
        );

      case "max-jump":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.MaxJumpRange,
          "number"
        );

      case "rebuy":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.Rebuy,
          "number"
        );

      case "cmdr-name":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadgame.Commander,
          "string"
        );

      case "horizons":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadgame.Horizons,
          "boolean"
        );

      case "odyssey":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadgame.Odyssey,
          "booelan"
        );

      case "game-mode":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadgame.GameMode,
          "string"
        );

      case "credits-at-load":
        return window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadgame.Credits,
          "number"
        );

      default:
        return null;
    }
  }

  // combinations of multiple data sources
  const comboNames = ["fuel-main-perc", "fuel-res-perc", "cargo-perc"];

  if (comboNames.includes(infoType)) {
    switch (infoType) {
      case "fuel-main-perc":
        const tCurrentFuel = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Fuel,
          "object"
        );

        const tCurrentFuelCap = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.FuelCapacity,
          "object"
        );

        if (tCurrentFuel !== null && tCurrentFuelCap !== null)
          return tCurrentFuel.Main / tCurrentFuelCap.Main;
        return null;

      case "fuel-res-perc":
        const tCurrentFuelRes = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Fuel,
          "object"
        );

        const tCurrentFuelResCap = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.FuelCapacity,
          "number"
        );

        if (tCurrentFuelRes !== null && tCurrentFuelResCap !== null)
          return tCurrentFuelRes.Reserve / tCurrentFuelResCap.Reserve;
        return null;

      case "cargo-perc":
        const tCurrentCargo = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.status.Cargo,
          "object"
        );

        const tCurrentCargoCap = window.frameShifterHelpers.getPlayerData(
          window.frameShifterState.loadout.CargoCapacity,
          "number"
        );

        if (tCurrentCargo !== null && tCurrentCargoCap !== null)
          return tCurrentCargo / tCurrentCargoCap;
        return null;

      default:
        return null;
    }
  }

  // suggest more types and data combinations on github

  // unknown info type, avoid this :)

  console.warn(`"${infoType}" is not a valid player info type.`);
  return null;
};
