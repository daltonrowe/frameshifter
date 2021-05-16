const config = require("./config.json");

// Standard Express + socket.io

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected.");

  socket.emit("CURRENT_STATE", playerData);

  socket.emit("CURRENT_JOURNAL", playerJournal);

  sanitizedConfig = { ...config };
  if (sanitizedConfig.journalDir) delete sanitizedConfig.journalDir;
  if (sanitizedConfig.username) delete sanitizedConfig.username;
  if (sanitizedConfig.password) delete sanitizedConfig.password;
  socket.emit("CURRENT_CONFIG", sanitizedConfig);
});

// Watch relevant status files

const fs = require("fs");

const playerData = {};
const playerJournal = [];

const watchPlayerFile = (file, property) => {
  playerData[property] = {};

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
      console.log(`Player ${property} updated.`);
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

// Tail player journal log

Tail = require("tail").Tail;
let currentLog = "";
let journalWatcher = null;

const checkJournalFiles = () => {
  const logFiles = [];
  files = fs.readdirSync(config.journalDir);

  files.forEach((file) => {
    if (file.includes(".log") && file.includes("Journal.")) logFiles.push(file);
  });

  const mostRecentLog = logFiles[logFiles.length - 1];
  if (currentLog !== mostRecentLog) {
    console.log(`Using journal: ${mostRecentLog}`);
    currentLog = mostRecentLog;
    if (journalWatcher) journalWatcher.unwatch();

    journalWatcher = new Tail(`${config.journalDir}\\${currentLog}`, {
      nLines: config.journalMaxLines,
    });

    journalWatcher.on("line", (line) => {
      const eventData = JSON.parse(line);
      playerJournal.push(eventData);
      io.emit(`JOURNAL_${eventData.event.toUpperCase()}`, eventData);
      console.log("Player journal updated.");
      if (playerJournal.length > config.journalMaxLines) playerJournal.shift();
    });

    journalWatcher.watch();
  }
};

setInterval(() => {
  console.log("Checking for new journal files.");
  checkJournalFiles();
}, config.journalCheckMins * 60 * 1000);

checkJournalFiles();

server.listen(config.serverPort, () => {
  console.log("Server started");
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
