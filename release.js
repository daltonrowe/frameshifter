const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// create a file to stream archive data to.
const output = fs.createWriteStream(__dirname + "/example.zip");
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

// append a file
archive.file(path.join(__dirname, "FrameShifter.exe"), { name: "file4.txt" });

// append files from a sub-directory and naming it `new-subdir` within the archive
archive.directory(path.join(__dirname, "public"), "public");
