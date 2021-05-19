window.frameShifterHelpers = {};

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

window.frameShifterHelpers.playerInfo = (infoType) => {
  const checkFlag = (num, max) => {
    return flags[max - num] === "1";
  };

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

  if (flagNames.includes(infoType)) {
    const flags = window.frameShifterHelpers.getBinaryFlags();

    if (!flags) {
      console.warn("Player Flags not available.");
      return null;
    } else {
      return checkFlag(flagNames.indexOf(infoType), 31);
    }
  }

  console.warn(`Player info "${infoType}" not found or available.`);
  return null;
};
