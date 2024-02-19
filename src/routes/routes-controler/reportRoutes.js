const express = require('express');
const { getMonthlyReport } = require('../../controllers/reportController');

const router = express.Router();

router.get('/monthly/:instructorId/:startDate/:endDate', getMonthlyReport);

module.exports = router;
