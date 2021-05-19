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

window.frameShifterHelpers.playerIs = (flagName) => {
  const flags = window.frameShifterHelpers.getBinaryFlags();

  if (!flags) {
    console.error("Player flags status not available.");
    return null;
  }

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

  const checkFlag = (num) => {
    return flags[31 - num] === "1";
  };

  if (flagNames.includes(flagName) > 0) {
    return checkFlag(flagNames.indexOf(flagName));
  }

  console.warn(`Status flag "${flagName}" not found.`);
  return null;
};
