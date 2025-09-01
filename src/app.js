// This is the main entry point of the application.
// It initializes the Express app, sets up middleware, and defines the routes for the application.

const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Import body-parser middleware
const routes = require('./routes/index'); // Import the routes from the index file

const app = express(); // Create an instance of an Express application

// Middleware setup
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static('public')); // Serve static files from the public directory

// Set up routes
app.use('/', routes()); // Use the routes defined in the index file

// Start the server
const PORT = process.env.PORT || 3000; // Define the port to listen on
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log the server start message
});