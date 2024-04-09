const express = require("express");
const router = express.Router();

//Nhúng controller
const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

router.get("/detail/:slug", controller.detail);

module.exports = router;
