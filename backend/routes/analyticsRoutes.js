const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/overview', auth, analyticsController.getOverview);

router.get('/productivity', auth, analyticsController.getProductivity);

router.get('/streaks', auth, analyticsController.getStreaks);

router.get('/bottlenecks', auth, analyticsController.getBottlenecks);

module.exports = router;
