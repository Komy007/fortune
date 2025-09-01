// src/services/astrologyService.js

// This service handles the logic related to Western astrology.
// It includes functions to calculate and interpret astrological readings based on the user's birthdate.

const getZodiacSign = (birthdate) => {
    // Function to determine the zodiac sign based on the birthdate
    const month = birthdate.getMonth() + 1; // Months are zero-indexed
    const day = birthdate.getDate();

    // Zodiac sign boundaries
    const zodiacSigns = [
        { sign: 'Capricorn', endDate: new Date(birthdate.getFullYear(), 0, 19) },
        { sign: 'Aquarius', endDate: new Date(birthdate.getFullYear(), 1, 18) },
        { sign: 'Pisces', endDate: new Date(birthdate.getFullYear(), 2, 20) },
        { sign: 'Aries', endDate: new Date(birthdate.getFullYear(), 3, 19) },
        { sign: 'Taurus', endDate: new Date(birthdate.getFullYear(), 4, 20) },
        { sign: 'Gemini', endDate: new Date(birthdate.getFullYear(), 5, 20) },
        { sign: 'Cancer', endDate: new Date(birthdate.getFullYear(), 6, 22) },
        { sign: 'Leo', endDate: new Date(birthdate.getFullYear(), 7, 22) },
        { sign: 'Virgo', endDate: new Date(birthdate.getFullYear(), 8, 22) },
        { sign: 'Libra', endDate: new Date(birthdate.getFullYear(), 9, 22) },
        { sign: 'Scorpio', endDate: new Date(birthdate.getFullYear(), 10, 21) },
        { sign: 'Sagittarius', endDate: new Date(birthdate.getFullYear(), 11, 21) },
        { sign: 'Capricorn', endDate: new Date(birthdate.getFullYear(), 0, 31) } // Capricorn wraps around
    ];

    // Determine the zodiac sign
    for (let i = 0; i < zodiacSigns.length; i++) {
        if (birthdate <= zodiacSigns[i].endDate) {
            return zodiacSigns[i].sign;
        }
    }
    return null; // In case of an error
};

const getAstrologicalReading = (birthdate) => {
    // Function to generate a basic astrological reading based on the zodiac sign
    const zodiacSign = getZodiacSign(birthdate);
    if (!zodiacSign) {
        return 'Invalid birthdate';
    }

    // Placeholder for astrological readings
    const readings = {
        Aries: 'You are adventurous and energetic.',
        Taurus: 'You are reliable and patient.',
        Gemini: 'You are adaptable and communicative.',
        Cancer: 'You are intuitive and emotional.',
        Leo: 'You are confident and charismatic.',
        Virgo: 'You are analytical and meticulous.',
        Libra: 'You are diplomatic and fair-minded.',
        Scorpio: 'You are passionate and resourceful.',
        Sagittarius: 'You are optimistic and freedom-loving.',
        Capricorn: 'You are disciplined and responsible.',
        Aquarius: 'You are innovative and humanitarian.',
        Pisces: 'You are compassionate and artistic.'
    };

    return readings[zodiacSign] || 'No reading available for this sign.';
};

// Export the functions for use in other parts of the application
module.exports = {
    getZodiacSign,
    getAstrologicalReading
};