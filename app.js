const express = require("express");
const colors = require("colors");
const compression = require("compression");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const cors = require("cors");
const bodyParser = require("body-parser");
const mp3Route = require("./routes/mp3");
const mp4Route = require("./routes/mp4");
const router = express.Router();
const app = express();
app.use(cors());
app.use(
  compression({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.use(bodyParser.json({ limit: "20mb" }));
// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     extended: true,
//     parameterLimit: 10000,
//   })
// );
// / create connection

const db = config.get("mongoURI");

app.get("/items/:my_item", async (req, res) => {
  let my_item = req.params.my_item;
  let item = await db
    .db("my_db")
    .collection("my_collection")
    .findOne({ my_item: my_item });

  return res.json(item);
});
// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,

    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => console.log(`MongoDb Connected`.bgGreen.bold))
  .catch((err) => console.log(err));
/////
app.use(express.json());
app.use("/api/music", mp3Route);
app.use("/api/mp4", mp4Route);
app.use(express.static(path.join(__dirname, "/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "build/index.html"))
);
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
// app.listen("5000", () => {
//   console.log("Server started on port 5000");
// });
