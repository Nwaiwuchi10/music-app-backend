const multer = require("multer");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Mp3File = mongoose.model("Mp3File", {
  data: Buffer,
});

// Set up a route to handle the file upload
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
  const mp3File = new Mp3File({
    data: req.file.buffer,
  });
  mp3File.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving mp3 file");
    } else {
      res.send("Mp3 file uploaded");
    }
  });
});
module.exports = { upload };
