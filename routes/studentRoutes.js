// Student Routes
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET student portal with all awards
router.get('/', studentController.getStudentPortal);

// POST/GET search and filter awards
router.get('/search', studentController.searchAwards);

module.exports = router;
