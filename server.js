const config = require("./config.json");

// Standard Express + socket.io

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: `http://127.0.0.1:${config.serverPort}`,
  },
});

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

  sanitizedConfig = { ...config };
  if (sanitizedConfig.journalDir) delete sanitizedConfig.journalDir;
  if (sanitizedConfig.username) delete sanitizedConfig.username;
  if (sanitizedConfig.password) delete sanitizedConfig.password;
  socket.emit("CURRENT_CONFIG", sanitizedConfig);
});

server.listen(config.serverPort, () => {
  console.log(`FrameShifter running at http://127.0.0.1:${config.serverPort}`);
});

// Watch relevant journal files

const fs = require("fs");

const playerData = {};

const watchPlayerFile = (file, property) => {
  playerData[property] = {};

  fs.watchFile(
    file,
    {
      bigint: false,
      persistent: true,
      interval: 2000,
    },
    (_current, _prev) => {
      const newData = JSON.parse(fs.readFileSync(file, "utf8"));
      playerData[property] = { ...newData };
      io.emit(`${property.toUpperCase()}_UPDATE`, playerData[property]);
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

const cargoFile = `${config.journalDir}\\Cargo.json`;
watchPlayerFile(cargoFile, "cargo");

const modulesInfoFile = `${config.journalDir}\\ModulesInfo.json`;
watchPlayerFile(modulesInfoFile, "modulesinfo");

const navRouteFile = `${config.journalDir}\\NavRoute.json`;
watchPlayerFile(navRouteFile, "navRoute");
