// This file defines the routes for the application and sets up the main route to handle user requests.

const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');

// Define the main route for the application
router.post('/api/birthdate', readingController.processBirthdate);

// Export the router to be used in the main app
module.exports = router;