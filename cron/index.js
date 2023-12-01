const cron = require("node-cron");
const nodeWebCam = require("node-webcam");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fetch = require("node-fetch-commonjs");

const gpiop = require('rpi-gpio').promise;

const dotenv = require("dotenv");

dotenv.config();

const isRelay = typeof process.env.RELAY_ADDRESS !== "undefined";

if (!isRelay) {
  console.error("RELAY_ADDRESS is not defined, using Raspberry PI GPIO");
  
  gpiop.setup(7, gpiop.DIR_OUT);
  gpiop.write(7, true);
};

const openDoor = () => {
  console.log("Opening door");
  if (isRelay) {
    fetch(process.env.RELAY_ADDRESS + 'door/off');
  } else {
    gpiop.write(7, false);
  }
}

const closeDoor = () => {
  console.log("Closing door");
  if (isRelay) {
    fetch(process.env.RELAY_ADDRESS + 'door/on');
  } else {
    gpiop.write(7, true);
  }
}

const db = new sqlite3.Database(path.resolve(__dirname, "../db/sqlite.db"));

const pythonExecutable = process.env.PYTHON ?? "python3";

let timer = undefined;

cron.schedule("*/10 * * * * *", () => {
  console.log("staring");
  nodeWebCam.capture("/tmp/photo.jpg");

  const spawn = require("child_process").spawn;

  const pythonProcess = spawn(pythonExecutable, [
    path.resolve(__dirname, "../deepface/check.py"),
    "--file",
    "/tmp/photo.jpg",
    "--database",
    "../photos",
  ]);

  pythonProcess.stdout.on("data", (data) => {
    try {
      const result = JSON.parse(data.toString());
      if (result.success) {
        console.log('Detected person: ' + result.id)
        if (typeof timer !== "undefined") {
          clearTimeout(timer);
          timer = undefined;
        }

        db.run(`INSERT INTO AccessLog (userId) VALUES (${Number(result.id)})`);

        openDoor();

        timer = setTimeout(() => {
          closeDoor();
          timer = undefined;
        }, 5000);
      } else {
        console.log("No person recognized");
      }
    } catch (err) {
      console.error(err);
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });
});
