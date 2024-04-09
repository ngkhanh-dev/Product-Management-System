const express = require("express");
const router = express.Router();

//Nhúng controller
const controller = require("../../controllers/admin/dashboard.controller");

router.get("/", controller.index);

module.exports = router;
