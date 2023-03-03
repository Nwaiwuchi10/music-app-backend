const express = require("express");
const colors = require("colors");
const compression = require("compression");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const cors = require("cors");
const bodyParser = require("body-parser");
const mp3Route = require("./routes/mp3");
const router = express.Router();
const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: "10kb" }));
app.use(
  bodyParser.urlencoded({
    limit: "10kb",
    extended: true,
    parameterLimit: 10,
  })
);
// / create connection

const db = config.get("mongoURI");

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,

    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => console.log(`MongoDb Connected`))
  .catch((err) => console.log(err));
/////
app.use(express.json());
app.use("/api/music", mp3Route);
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
