const express = require('express');
const exportController = require('../controllers/exportController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/csv', auth, exportController.exportToCSV);

router.get('/json', auth, exportController.exportToJSON);

module.exports = router;
