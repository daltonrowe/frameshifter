const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const package = require("./package.json");

fs.writeFileSync(
  "version.txt",
  `
======
FrameShifter v${package.version}
======

FrameShifter is a tool for displaying Elite Dangerous dashboards and overlays.
Thank you for using and building with FrameShifter!

https://github.com/daltonrowe/frameshifter
https://daltonrowe.com
`
);

// create a file to stream archive data to.
const output = fs.createWriteStream(
  path.join(__dirname, "build", "FrameShifter.zip")
);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level.
});

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log(
    "archiver has been finalized and the output file descriptor has closed."
  );
});

archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

archive.file(path.join(__dirname, "build", "FrameShifter.exe"), {
  name: "FrameShifter.exe",
});

archive.file(path.join(__dirname, "config.json"), {
  name: "config.json",
});

archive.file(path.join(__dirname, "version.txt"), {
  name: "version.txt",
});

archive.directory(path.join(__dirname, "public"), "public");

archive.finalize();
