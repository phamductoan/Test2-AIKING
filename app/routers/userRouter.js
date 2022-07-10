const express = require("express")
const { createUser, logInUser } = require("../controller/userController")
const router = express.Router();

router.post("/register", createUser);
router.post("/login", logInUser);


// exports router
module.exports = router;

