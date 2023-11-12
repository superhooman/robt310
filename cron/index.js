const cron = require("node-cron");
const nodeWebCam = require("node-webcam");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(path.resolve(__dirname, "../db/sqlite.db"));

const pythonExecutable = process.env.PYTHON ?? "python3";

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
      console.log(result);
      if (result.success) {
        db.run(`INSERT INTO AccessLog (userId) VALUES (${Number(result.id)})`);
      }
    } catch (err) {
      console.error(err);
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });
});
