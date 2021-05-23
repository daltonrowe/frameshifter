/**
 * @namespace Server
 */

const fs = require("fs");
const path = require("path");
const process = require("process");

// read user config file

let configDefault;
let configUser;

try {
  configDefault = require("./config-default.json");
  configUser = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../config.json"), "utf8")
  );
} catch (_err) {
  console.error(_err);
  console.warn(`
==============================
Hold up! Got a little problem.
==============================

Looks like the config.json file is improperly formatted, probably a missing comma or quotes. 
Please try a tool such as https://jsoneditoronline.org/ to test your config.json file for errors.

FrameShifter exiting...
`);
  process.exit(0);
}

const config = { ...configDefault, ...configUser };

/**
 * @param {args} args pass all args to console.log
 * @description log to terminal window if config.logging is set to debug
 * @memberof Server
 */
const fslog = (...args) => {
  if (config.logging === "debug") console.log(...args);
};

/**
 * @param {args} args pass all args to console.log
 * @description log to terminal window if config.logging is set to warn
 * @memberof Server
 */
const fswarn = (...args) => {
  if (config.logging === "debug" || config.logging === "warning")
    console.warn(...args);
};

/**
 * @param {args} args pass all args to console.log
 * @description log to terminal window if config.logging is set to error
 * @memberof Server
 */
const fserror = (...args) => {
  if (
    config.logging === "debug" ||
    config.logging === "warning" ||
    config.logging === "error"
  )
    console.error(...args);
};

// express webserver

const express = require("express");
const app = express();

// co-host socket.io server on same port

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// basic auth
app.use((req, res, next) => {
  const auth = { login: config.username, password: config.password };

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");

  if (
    !config.password ||
    (login && password && login === auth.login && password === auth.password)
  ) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
});

// serve files in public directory as static files
app.use(express.static(path.join(__dirname, "../public")));

// when a new client connects, send them all the current info
io.on("connection", (socket) => {
  fslog("Client connected.");

  socket.emit("CURRENT_STATE", playerData);

  socket.emit("CURRENT_JOURNAL", playerJournal);

  // delete the username and password sending the config the client
  sanitizedConfig = { ...config };
  if (sanitizedConfig.journalDir) delete sanitizedConfig.journalDir;
  if (sanitizedConfig.username) delete sanitizedConfig.username;
  if (sanitizedConfig.password) delete sanitizedConfig.password;
  socket.emit("CURRENT_CONFIG", sanitizedConfig);

  socket.on("RELAY", (eventData) => {
    const { eventName, data } = eventData;
    socket.broadcast.emit(`RELAY_${eventName.toUpperCase()}`, data);
  });
});

// watch relevant status files

const playerData = {};
const playerJournal = [];

/**
 * @param  {string} file file in journal dir to watch
 * @param  {string} property property in playerState to update
 * @description watch file in journal dir and update property on playerState when changed
 * @memberof Server
 */
const watchPlayerFile = (file, property) => {
  playerData[property] = {};

  // check for file on first load
  if (fs.existsSync(file)) {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        fserror(err);
        return;
      }
      playerData[property] = JSON.parse(data);
    });
  }

  fs.watchFile(
    file,
    {
      bigint: false,
      persistent: true,
      interval: config.statusCheckSecs * 1000,
    },
    (_current, _prev) => {
      let newData = null;

      try {
        newData = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch (err) {
        fserror(`Error reading ${file}`, err);
        return;
      }

      playerData[property] = { ...newData };
      io.emit(`UPDATE_${property.toUpperCase()}`, playerData[property]);
      fslog(`Player ${property} updated.`);
    }
  );
};

const statusFile = path.join(config.journalDir, "Status.json");
watchPlayerFile(statusFile, "status");

const marketFile = path.join(config.journalDir, "Market.json");
watchPlayerFile(marketFile, "market");

const shipyardFile = path.join(config.journalDir, "Shipyard.json");
watchPlayerFile(shipyardFile, "shipyard");

const outfittingFile = path.join(config.journalDir, "Outfitting.json");
watchPlayerFile(outfittingFile, "outfitting");

const cargoFile = path.join(config.journalDir, "Cargo.json");
watchPlayerFile(cargoFile, "cargo");

const modulesInfoFile = path.join(config.journalDir, "ModulesInfo.json");
watchPlayerFile(modulesInfoFile, "modulesinfo");

const navRouteFile = path.join(config.journalDir, "NavRoute.json");
watchPlayerFile(navRouteFile, "navroute");

const backpackFile = path.join(config.journalDir, "Backpack.json");
watchPlayerFile(backpackFile, "backpack");

// tail player journal log

Tail = require("tail").Tail;
let currentLog = "";
let journalFile = "";
let journalWatcher = null;
let filePingerHack = null;

/**
 * @param  {string} line journal line of (hopefully) JSON
 * @description handles each line of journal log as they are discovered. store important journal entries in playerData
 * @memberof Server
 */
const handleLine = (line) => {
  const eventData = JSON.parse(line);
  const eventName = eventData.event.toUpperCase();
  playerJournal.unshift(eventData);
  io.emit(`JOURNAL_${eventName}`, eventData);
  fslog("Player journal updated.");
  if (playerJournal.length > config.journalMaxLines) playerJournal.pop();

  // player state data that is collected from journal logs
  const specialStates = ["LOADOUT", "LOADGAME"];

  if (specialStates.includes(eventName)) {
    const eventLower = eventName.toLowerCase();
    playerData[eventLower] = eventData;

    io.emit(`UPDATE_${eventName}`, playerData[eventLower]);
    fslog(`Player special data ${eventLower} updated.`);
  }
};

/**
 * @param  {string} nextLog file name of newest discovered log file
 * @description handles each line of journal log as they are discovered. store important journal entries in playerData
 * @memberof Server
 */
const swapToNewLog = (nextLog) => {
  currentLog = nextLog;
  journalFile = path.join(config.journalDir, currentLog);

  if (journalWatcher) journalWatcher.unwatch();

  journalWatcher = new Tail(journalFile, {
    nLines: config.journalMaxLines,
  });

  journalWatcher.on("line", handleLine);
  journalWatcher.watch();

  if (filePingerHack) clearInterval(filePingerHack);
  filePingerHack = setInterval(() => {
    if (journalFile && fs.existsSync(journalFile)) {
      // do nothing
      // for some reason the file was only being written when read or something to that effect
      // checking if the file exists triggers the update
    }
  }, config.journalFileRefreshSecs * 1000);
};

/**
 * @description check for new log files and switch to the newest if needed
 * @memberof Server
 */
const checkJournalFiles = () => {
  const logFiles = [];
  files = fs.readdirSync(config.journalDir);

  files.forEach((file) => {
    if (file.includes(".log") && file.includes("Journal.")) logFiles.push(file);
  });

  const mostRecentLog = logFiles[logFiles.length - 1];

  if (currentLog !== mostRecentLog) swapToNewLog(mostRecentLog);
};

setInterval(() => {
  fslog("Checking for new journal files.");
  checkJournalFiles();
}, config.journalCheckSecs * 1000);

checkJournalFiles();

server.listen(config.serverPort, () => {
  fslog("Server started");
});

/**
 * @description collect the plugin name and file paths for standalone html files
 * @memberof Server
 */
const collectStandalonePlugins = () => {
  let standalonePlugins = [];

  // collect all plugin standalone URLs from config
  // do this better with a spread
  for (let i = 0; i < config.plugins.length; i++) {
    const plugin = config.plugins[i];
    if (plugin.standaloneUrls) {
      for (let j = 0; j < plugin.standaloneUrls.length; j++) {
        const pluginUrl = plugin.standaloneUrls[j];
        standalonePlugins.push({
          name: plugin.name,
          url: `/${plugin.slug}/${pluginUrl}`,
        });
      }
    }
  }

  return standalonePlugins;
};

require("dns").lookup(require("os").hostname(), (_err, networkHost, _fam) => {
  console.log(`

    ███████╗██████╗  █████╗ ███╗   ███╗███████╗    ███████╗██╗  ██╗██╗███████╗████████╗███████╗██████╗ 
    ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝    ██╔════╝██║  ██║██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
    █████╗  ██████╔╝███████║██╔████╔██║█████╗      ███████╗███████║██║█████╗     ██║   █████╗  ██████╔╝
    ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝      ╚════██║██╔══██║██║██╔══╝     ██║   ██╔══╝  ██╔══██╗
    ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗    ███████║██║  ██║██║██║        ██║   ███████╗██║  ██║
    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝

    FrameShifter Dashboard:

    >> Local:   http://127.0.0.1:${config.serverPort}
    >> Network: http://${networkHost}:${config.serverPort}`);

  const standalonePlugins = collectStandalonePlugins();

  if (standalonePlugins) {
    console.log(`
    Standalone Plugins:`);
    standalonePlugins.forEach((standalone) => {
      console.log(
        `
    ${standalone.name}
    >> Local:   http://127.0.0.1:${config.serverPort}${standalone.url}
    >> Network: http://${networkHost}:${config.serverPort}${standalone.url}`
      );
    });
  }
});
