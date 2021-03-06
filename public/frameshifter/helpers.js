/**
 * @namespace ClientHelpers
 */
window.frameShifterHelpers = {};

/**
 * @function hasData
 * @param  {object} obj object to test
 * @description test whether an object is empty or not
 * @memberof ClientHelpers
 */
window.frameShifterHelpers.hasData = (obj) => {
  if (obj && Object.keys(obj).length > 0) {
    return true;
  }

  return false;
};

window.frameShifterHelpers.waitForDataInterval = null;

/**
 * @function waitForData
 * @param  {function} callback function to call when found
 * @description check for frameShifterState every 200ms until found, useful for standalone plugins on first load
 * @memberof ClientHelpers
 */
window.frameShifterHelpers.waitForData = (callback) => {
  window.frameShifterHelpers.waitForDataInterval = setInterval(() => {
    if (window.frameShifterHelpers.hasData(window.frameShifterState)) {
      callback();
      clearInterval(window.frameShifterHelpers.waitForDataInterval);
    }
  }, 200);
};

/**
 * @function getPluginConfigBySlug
 * @param  {string} slug plugin slug in config.json
 * @description check for frameShifterState every 200ms until found, useful for standalone plugins on first load
 * @memberof ClientHelpers
 */
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

/**
 * @function pipsToNumber
 * @param  {number} pip some type of number
 * @description converts status pip values into normal numbers because im dumb atm
 * @memberof ClientHelpers
 */
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

/**
 * @function testPlayerData
 * @param  {string} value value on window to test if present and correct type
 * @param  {string} obj data type to check
 * @description check that a value is present and of expected type
 * @memberof ClientHelpers
 */
window.frameShifterHelpers.testPlayerData = (value, type) => {
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
      // unsupported data type
      break;
  }

  return null;
};

/**
 * @function getBinaryFlags
 * @param  {encodedInteger} flagsInt encoded base10 integer from Flags/Flags2
 * @param  {int} len length of the expected binary number
 * @description turn encoded status integer into a 32 length series of binary flags
 * @memberof ClientHelpers
 */
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

/**
 * @function playerInfo
 * @param  {string} infoType data to request from various sources in FrameShifter
 * @description grab any data that FrameShifter knows about.
 * @memberof ClientHelpers
 */
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
      window?.frameShifterState?.status?.Flags,
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
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Cargo,
          "number"
        );

      case "firegroup":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.FireGroup,
          "number"
        );

      case "legal-state":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.LegalState,
          "string"
        );

      case "fuel-main":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Fuel?.FuelMain,
          "number"
        );

      case "fuel-res":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Fuel?.FuelReservoir,
          "number"
        );

      case "pips-sys":
        const tPipSys = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Pips,
          "array"
        );
        return tPipSys
          ? window.frameShifterHelpers.pipsToNumber(tPipSys[0])
          : null;

      case "pips-eng":
        const tPipEng = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Pips,
          "array"
        );
        return tPipEng
          ? window.frameShifterHelpers.pipsToNumber(tPipEng[1])
          : null;

      case "pips-wep":
        const tPipWep = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Pips,
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
      window?.frameShifterState?.status?.Flags2,
      16
    );

    // this is bugged but i'm not sure how
    // i don't understand why the correct max in 31 above but 16 here
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
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.Ship,
          "string"
        );

      case "ship-ident":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.ShipIdent,
          "string"
        );

      case "ship-name":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.ShipName,
          "string"
        );

      case "hull-perc":
        const tHullPerc = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.HullHealth,
          "number"
        );
        return tHullPerc !== null ? `${tHullPerc * 100}%` : null;

      case "hull-value":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.HullValue,
          "number"
        );

      case "hull-value":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.HullValue,
          "number"
        );

      case "unladen-mass":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.UnladenMass,
          "number"
        );

      case "fuel-main-cap":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.FuelCapacity.Main,
          "number"
        );

      case "fuel-res-cap":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.FuelCapacity.Reserve,
          "number"
        );

      case "cargo-cap":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.CargoCapacity,
          "number"
        );

      case "max-jump":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.MaxJumpRange,
          "number"
        );

      case "rebuy":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.Rebuy,
          "number"
        );

      case "cmdr-name":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadgame?.Commander,
          "string"
        );

      case "horizons":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadgame?.Horizons,
          "boolean"
        );

      case "odyssey":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadgame?.Odyssey,
          "booelan"
        );

      case "game-mode":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadgame?.GameMode,
          "string"
        );

      case "credits-at-load":
        return window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadgame?.Credits,
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
        const tFuelMainPerc = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Cargo,
          "number"
        );

        const tFuelMainCapPerc = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.CargoCapacity,
          "number"
        );

        if (tFuelMainPerc !== null && tFuelMainCapPerc !== null)
          return `${100 - tFuelMainPerc / tFuelMainCapPerc}%`;
        return null;

      case "fuel-res-perc":
        const tFuelResPerc = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.FuelCapacity.Reserve,
          "number"
        );

        const tFuelResCapPerc = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.FuelCapacity.Reserve,
          "number"
        );

        if (tFuelResPerc !== null && tFuelResCapPerc !== null)
          return `${100 - tFuelResPerc / tFuelResCapPerc}%`;
        return null;

      case "cargo-perc":
        const tCargoPerc = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.status?.Cargo,
          "number"
        );

        const tCargoCapPerc = window.frameShifterHelpers.testPlayerData(
          window?.frameShifterState?.loadout?.CargoCapacity,
          "number"
        );

        if (tCargoPerc !== null && tCargoCapPerc !== null)
          return `${(tCargoPerc / tCargoCapPerc) * 100}%`;
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

/**
 * @function sendRelay
 * @param  {string} eventName event name to relay, will be recieved at RELAY_EVENTNAME
 * @param  {object} data data to send along with the relay event
 * @description send data to all connected clients
 * @memberof ClientHelpers
 */

window.frameShifterHelpers.sendRelay = (eventName, data) => {
  const browserEvent = new CustomEvent("RELAY", {
    detail: {
      eventName,
      data,
    },
  });
  window.dispatchEvent(browserEvent);
};
