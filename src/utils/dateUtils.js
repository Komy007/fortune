// src/utils/dateUtils.js

// Utility functions for date manipulation

/**
 * Validates the given birthdate string.
 * @param {string} dateString - The birthdate in 'YYYY-MM-DD' format.
 * @returns {boolean} - Returns true if the date is valid, otherwise false.
 */
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false; // Invalid format
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date); // Check if date is valid
}

/**
 * Formats the given date to a more readable format.
 * @param {string} dateString - The birthdate in 'YYYY-MM-DD' format.
 * @returns {string} - Returns the formatted date as 'DD/MM/YYYY'.
 */
function formatDate(dateString) {
    if (!isValidDate(dateString)) return null; // Return null if date is invalid
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Return formatted date
}

// Exporting the utility functions
module.exports = {
    isValidDate,
    formatDate
};