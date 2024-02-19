const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth");
const {userSignup,  userAll, userLogin} = require('../../controllers/userControlller')

// user Registration
router.post("/signup" ,userSignup);
router.get('/allUser',auth,  userAll);
router.post('/login', userLogin)

module.exports = router;
