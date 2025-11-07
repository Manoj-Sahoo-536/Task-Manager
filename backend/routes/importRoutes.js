const express = require('express');
const importController = require('../controllers/importController');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/csv', auth, upload.single('file'), importController.importFromCSV);

router.post('/json', auth, upload.single('file'), importController.importFromJSON);

module.exports = router;
