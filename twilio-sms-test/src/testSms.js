// /src/twilioTests.js
const { sendVerificationSms, mockDatabase } = require('../twilio/twilioService');

/**
 * Test: Send SMS with valid phone number
 */
const testValidPhoneNumber = () => {
  const recipientPhoneNumber = '+13125811589'; // Replace with a valid number
  console.log('Running Test: Valid Phone Number');
  
  sendVerificationSms(recipientPhoneNumber)
    .then(message => {
      console.log(`Message sent successfully. SID: ${message.sid}`);
      const savedCode = mockDatabase[recipientPhoneNumber].code;
      console.log('Mock Database:', mockDatabase);
      if (/^\d{6}$/.test(savedCode)) {
        console.log('Verification code is valid:', savedCode);
      } else {
        console.error('Invalid verification code:', savedCode);
      }
    })
    .catch(error => {
      console.error('Failed to send message (Valid Phone):', error);
    });
};

/**
 * Test: Handle missing phone number
 */
const testMissingPhoneNumber = () => {
  const missingPhoneNumber = '';
  console.log('Running Test: Missing Phone Number');

  sendVerificationSms(missingPhoneNumber)
    .then(message => {
      console.log(`Message sent successfully. SID: ${message.sid}`);
    })
    .catch(error => {
      console.error('Failed to send message (Missing Phone):', error.message);
    });
};

/**
 * Test: Handle invalid phone number
 */
const testInvalidPhoneNumber = () => {
  const invalidPhoneNumber = '123456'; // Invalid number format
  console.log('Running Test: Invalid Phone Number');

  sendVerificationSms(invalidPhoneNumber)
    .then(message => {
      console.log(`Message sent successfully. SID: ${message.sid}`);
    })
    .catch(error => {
      console.error('Failed to send message (Invalid Phone):', error.message);
    });
};

/**
 * Test: Simulate expired code (manual expiration check)
 */
const testExpiredCode = () => {
    const recipientPhoneNumber = '+13125811589'; // Replace with valid number
    console.log('Running Test: Expired Code');
  
    // First, send a verification SMS to save a code in the mock database
    sendVerificationSms(recipientPhoneNumber)
      .then(() => {
        // Log the current state of the mock database
        console.log('Original mockDatabase entry:', mockDatabase[recipientPhoneNumber]);
  
        // Simulate that the code was created 10 minutes ago (to force expiration)
        const newCreatedAt = new Date(Date.now() - (10 * 60 * 1000)); // 10 minutes ago
        mockDatabase[recipientPhoneNumber].createdAt = newCreatedAt;
  
        // Log the modified timestamp
        console.log('Simulated expired timestamp (10 minutes ago):', mockDatabase[recipientPhoneNumber].createdAt);
  
        // Log the updated state of the mock database
        console.log('Updated mockDatabase entry:', mockDatabase[recipientPhoneNumber]);
  
       // Now try to send another verification SMS, this time it should detect expiration
      sendVerificationSms(recipientPhoneNumber)
      .then(() => {
        // Code regeneration was successful, no need for error logging here
        console.log('New code generated after expiration.');
      })
      .catch(error => {
        console.log(`Expected result: ${error.message}`);
      });
  })
  .catch(error => {
    console.error('Failed to send initial message:', error);
  });
  };
  
  
  
  
  
  

/**
 * Test: Simulate Twilio API failure
 */
const testTwilioApiFailure = () => {
    console.log('Running Test: Twilio API Failure');
  
    // Create a separate function to simulate Twilio API failure
    const simulateFailure = () => {
      return Promise.reject(new Error('Simulated Twilio failure'));
    };
  
    simulateFailure()
      .catch(error => {
        console.error('Simulated Twilio Failure:', error.message);
      });
  };
  

/**
 * Run all tests sequentially
 */
const runTests = () => {
  console.log('Starting Twilio Tests...\n');

  // Run each test with a slight delay to ensure logs are clear
  setTimeout(testValidPhoneNumber, 1000);
  setTimeout(testMissingPhoneNumber, 3000);
  setTimeout(testInvalidPhoneNumber, 5000);
  setTimeout(testExpiredCode, 7000);
  setTimeout(testTwilioApiFailure, 9000);
};

// Execute all tests
runTests();
