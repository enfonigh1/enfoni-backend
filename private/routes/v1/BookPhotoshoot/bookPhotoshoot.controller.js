const router = require("express").Router();
const multer = require("multer");
const { verify } = require("../../../helpers/verifyToken");
const {
  bookPhotoshoot,
} = require("../../../services/BookPhotoshoot/bookPhotoshoot.service");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("picture");
const fileUpload = multer({ dest: "/tmp" }).single("file");

router.post("/book-photoshoot", verify, upload, async (req, res, next) => {
  try {
    return res.status(200).json(await bookPhotoshoot(req));
  } catch (error) {}
});

module.exports = router;
