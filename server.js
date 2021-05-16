// read user config file
const config = require("./config.json");

// custom logging function for config controls
const fslog = (...args) => {
  if (config.logging === "debug") console.log(...args);
};

const fswarn = (...args) => {
  if (config.logging === "debug" || config.logging === "warning")
    console.warn(...args);
};

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
app.use(express.static("public"));

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
});

// watch relevant status files

const fs = require("fs");

const playerData = {};
const playerJournal = [];

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
      const newData = JSON.parse(fs.readFileSync(file, "utf8"));
      playerData[property] = { ...newData };
      io.emit(`UPDATE_${property.toUpperCase()}`, playerData[property]);
      fslog(`Player ${property} updated.`);
    }
  );
};

const statusFile = `${config.journalDir}\\Status.json`;
watchPlayerFile(statusFile, "status");

const marketFile = `${config.journalDir}\\Market.json`;
watchPlayerFile(marketFile, "market");

const shipyardFile = `${config.journalDir}\\Shipyard.json`;
watchPlayerFile(shipyardFile, "shipyard");

const outfittingFile = `${config.journalDir}\\Outfitting.json`;
watchPlayerFile(outfittingFile, "outfitting");

const cargoFile = `${config.journalDir}\\Cargo.json`;
watchPlayerFile(cargoFile, "cargo");

const modulesInfoFile = `${config.journalDir}\\ModulesInfo.json`;
watchPlayerFile(modulesInfoFile, "modulesinfo");

const navRouteFile = `${config.journalDir}\\NavRoute.json`;
watchPlayerFile(navRouteFile, "navroute");

// tail player journal log

Tail = require("tail").Tail;
let currentLog = "";
let journalWatcher = null;
let filePingerHack = null;

const checkJournalFiles = () => {
  const logFiles = [];
  files = fs.readdirSync(config.journalDir);

  files.forEach((file) => {
    if (file.includes(".log") && file.includes("Journal.")) logFiles.push(file);
  });

  const mostRecentLog = logFiles[logFiles.length - 1];
  if (currentLog !== mostRecentLog) {
    fslog(`Using journal: ${mostRecentLog}`);
    currentLog = mostRecentLog;
    if (journalWatcher) journalWatcher.unwatch();

    const journalFile = `${config.journalDir}\\${currentLog}`;
    journalWatcher = new Tail(journalFile, {
      nLines: config.journalMaxLines,
    });

    journalWatcher.on("line", (line) => {
      const eventData = JSON.parse(line);
      playerJournal.unshift(eventData);
      io.emit(`JOURNAL_${eventData.event.toUpperCase()}`, eventData);
      fslog("Player journal updated.");
      if (playerJournal.length > config.journalMaxLines) playerJournal.pop();
    });

    journalWatcher.watch();

    if (filePingerHack) clearInterval(filePingerHack);
    filePingerHack = setInterval(() => {
      if (fs.existsSync(journalFile)) {
        // do nothing
        // for some reason the file was only being written when read or something to that effect
        // checking if the file exists triggers the update
      }
    }, config.journalFileRefreshSecs * 1000);
  }
};

setInterval(() => {
  fslog("Checking for new journal files.");
  checkJournalFiles();
}, config.journalCheckMins * 60 * 1000);

checkJournalFiles();

server.listen(config.serverPort, () => {
  fslog("Server started");
});

require("dns").lookup(require("os").hostname(), (_err, networkHost, _fam) => {
  console.log(`

  ███████╗██████╗  █████╗ ███╗   ███╗███████╗    ███████╗██╗  ██╗██╗███████╗████████╗███████╗██████╗ 
  ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝    ██╔════╝██║  ██║██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
  █████╗  ██████╔╝███████║██╔████╔██║█████╗      ███████╗███████║██║█████╗     ██║   █████╗  ██████╔╝
  ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝      ╚════██║██╔══██║██║██╔══╝     ██║   ██╔══╝  ██╔══██╗
  ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗    ███████║██║  ██║██║██║        ██║   ███████╗██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝
  
  FrameShifter :: Online
  
  >> http://127.0.0.1:${config.serverPort}
  >> http://${networkHost}:${config.serverPort}

  `);
});
