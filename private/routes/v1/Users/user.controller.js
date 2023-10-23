const router = require("express").Router();
const multer = require("multer");
const { updateUser, pushCodeBook } = require("../../../services/User/user.service");
const { verify } = require("../../../helpers/verifyToken");
const { payment, userInfo, fetchAllUsers, fetchSingleUser } = require("../../../services/User/payment.service");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("picture");
const fileUpload = multer({ dest: "/tmp" }).single("file");

router.put("/update-user", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await updateUser(req));
  } catch (error) { }
});

router.post("/book-with-code", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await pushCodeBook(req));
  } catch (error) { }
});

// Payment
router.post("/payment", verify, upload, async (req, res, next) => {
  try {
    return res.status(200).json(await payment(req));
  } catch (error) { }
});

router.get("/:user-id/user", async (req, res) => {
  try {
    return res.status(200).json(await userInfo(req, res));
  } catch (error) { }
});

router.get("/fetch-all-users", async (req, res) => {
  try {
    return res.status(200).json(await fetchAllUsers(req, res));
  } catch (error) { }
});

router.post("/fetch-single-user", async (req, res) => {
  try {
    return res.status(200).json(await fetchSingleUser(req, res));
  } catch (error) { }
});

module.exports = router;
