const express = require("express");
const router = require("express").Router();

router.use("/api/v1/", require("./Users/auth.controller"));
router.use("/api/v1/user", require("./Users/user.controller"));
router.use("/api/v1/photoshoot", require("./BookPhotoshoot/bookPhotoshoot.controller"));

// ADMIN SHOP CREATING ENDPOINT
router.use("/api/v1/shop", require("./Shop/shop.controller"));

module.exports = router;
