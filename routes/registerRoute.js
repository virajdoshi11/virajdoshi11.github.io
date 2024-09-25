const express = require("express")
const router = express.Router();
const { register_get, register_post } = require("../controllers/registerController");

router.get("/", register_get);
router.post("/", register_post);

module.exports = router