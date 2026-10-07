const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getUsers} = require("../controllers/auth");
const {protect} = require('../middlewere/auth');
const { admin} = require('../middlewere/admin');

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect,admin,  getUsers);

 module.exports = router;