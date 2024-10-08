// /twilio/twilioService.js
const twilio = require('twilio');
require('dotenv').config();  // This will load the .env file

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 
const client = require('twilio')(accountSid, authToken);
console.log('Twilio Account SID:', accountSid);
console.log('Twilio Auth Token:', authToken ? 'Loaded' : 'Not Loaded');
console.log('Twilio Phone Number:', twilioPhoneNumber);

// Mock database (an object for now)
const mockDatabase = {};

/**
 * Generates a 6-digit verification code
 * @returns {string} - 6-digit code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Mocks saving the verification code to a "database"
 * @param {string} phoneNumber - User's phone number
 * @param {string} code - 6-digit verification code
 */
const saveCodeToMockDb = (phoneNumber, code) => {
  mockDatabase[phoneNumber] = { code, createdAt: new Date() };
  console.log(`Code for ${phoneNumber} saved: ${code}`);
};

/**
 * Sends an SMS with a 6-digit verification code
 * @param {string} to - The recipient's phone number
 * @returns {Promise} - Returns a promise with the message result
 */
const isValidPhoneNumber = (to) => {
    // Enforce that the number must start with '+'
    return /^\+[1-9]\d{1,14}$/.test(to);
  };
  
  const sendVerificationSms = (to) => {
    // Check for missing or empty phone number
    if (!to || to.trim() === '') {
      return Promise.reject(new Error('Phone number is required.'));
    }
  
    // Validate the phone number format
    if (!isValidPhoneNumber(to)) {
      return Promise.reject(new Error('Invalid phone number format.'));
    }
  
    // Check if a code already exists and whether it is expired
    const existingEntry = mockDatabase[to];
    if (existingEntry) {
      // FOR TESTING: Force expiration of the code here directly
      existingEntry.createdAt = new Date(Date.now() - (10 * 60 * 1000)); // 10 minutes ago for testing
  
      const { code, createdAt } = existingEntry;
      console.log(`Existing code: ${code}, createdAt: ${createdAt}`); // Log the existing code and timestamp
  
      const expirationTimeInMinutes = 5; // Assuming a 5-minute expiry window
      const currentTime = new Date();
      const timeDifference = (currentTime - createdAt) / (1000 * 60); // Convert to minutes
  
      console.log(`Current time: ${currentTime}, Time difference: ${timeDifference} minutes`); // Log time difference
  
      if (timeDifference <= expirationTimeInMinutes) {
        console.log(`Verification code is still valid: ${code}`);
        return Promise.reject(new Error('Existing verification code is still valid.'));
      } else {
        console.log('Verification code has expired. Generating a new code.');
      }
    }
  
    // Generate a new verification code if no valid code exists or if expired
    const code = generateVerificationCode();
  
    // Save the code to the mock "database"
    saveCodeToMockDb(to, code);
  
    // Send the SMS using Twilio client
    return client.messages.create({
      body: `Your verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
  };
  
  
  
  
  
  

module.exports = {
  sendVerificationSms,
  mockDatabase
};
