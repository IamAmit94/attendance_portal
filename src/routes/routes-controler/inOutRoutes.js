const express = require("express");
const router = express.Router();
const auth = require('../../../middlewares/auth');
const { checkIn, checkOut, getCheckIns, getCheckOuts } = require('../../controllers/inOutController');



router.post('/check-in',auth, checkIn);
router.post('/check-out',auth, checkOut);

router.get('/all-check-in/:userId', getCheckIns);
router.get('/all-check-out/:userId', getCheckOuts);


module.exports = router;
