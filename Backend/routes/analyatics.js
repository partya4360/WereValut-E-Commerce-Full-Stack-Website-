const express = require('express');
const {protect} = require("../middlewere/auth");
const {admin} = require("../middlewere/admin");
const {getAdminStats} = require("../controllers/analyatics");

const router = express.Router();
router.get("/", protect, admin, getAdminStats);
module.exports = router;