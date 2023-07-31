const UploadMusic = require("../models/UploadMusic");
const log = require("../Utils/cloudup");
const ImageKit = require("../Utils/imagekit");
const router = require("express").Router();

/////multer storage

/////create new post
const cloudupCredentials = {
  apiKey: "nwaiwuchrys",
  apiSecret: "Chinemerem10",
};
router.post(
  "/",

  async (req, res) => {
    const { title, image, filepath, artist } = req.body;

    const modifytitle = title.replace(/\s+/g, "_");
    const modifyartist = artist.replace(/\s+/g, "_");
    try {
      const results = await log.upload({
        //   // file: fs.createReadStream(req.file.path),
        file: filepath,
        fileName: `${req.body.artist}-${req.body.title}-todaysmuzik.com.ng.MP3`,

        // folder: "/audios",
        //   // useUniqueFileName: true,
        //   // width:300,
        //   // crop:"scale"
      });
      const result = await ImageKit.upload({
        file: image,
        fileName: `${req.body.artist}-${req.body.title}.jpg`,
        //   // width:300,
        //   // crop:"scale"
      });
      const cloudupFile = await cloudupAPI.uploadFile(
        req.file.path,
        cloudupCredentials
      );
      //create new user
      const newAnnouncement = new UploadMusic({
        title: modifytitle,

        description: req.body.description,
        artist: modifyartist,
        lyrics: req.body.lyrics,

        filepath: cloudupFile.url,
        brand: req.body.brand,
        album: req.body.album,

        // image: result.url,
        year: req.body.year,
        recommendSong: req.body.recommendSong,

        description: req.body.description,
        category: req.body.category,
      });

      //save post and respond
      const announcement = await newAnnouncement.save();

      res.status(200).send({
        _id: announcement._id,
        title: announcement.title,

        desription: announcement.description,
        artist: announcement.artist,
        album: announcement.album,
        year: announcement.year,
        recommendSong: announcement.recommendSong,
        genre: announcement.genre,
        brand: announcement.brand,
        image: announcement.image,
        lyrics: announcement.lyrics,
        filepath: announcement.filepath,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

////to get post by latest
router.get("/", async (req, res) => {
  try {
    const announcements = await UploadMusic.find({}).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
