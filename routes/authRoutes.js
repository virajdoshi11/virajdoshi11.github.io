const express = require("express")
const router = express.Router();
const { login_get, login_post } = require("../controllers/authController")

router.get("/", login_get);
router.post("/", login_post);

module.exports = router