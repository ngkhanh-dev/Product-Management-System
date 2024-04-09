const express = require("express");
const router = express.Router();

//Nhúng controller
const controller = require("../../controllers/client/home.controller");

router.get("/", controller.index);

module.exports = router;
