const axios = require('axios');
const bcrypt = require('bcryptjs');

// Function to create a test seller
async function createTestSeller() {
  try {
    // Test seller data
    const sellerData = {
      name: 'Test Seller',
      email: 'seller@test.com',
      password: 'Test@123',  // Will be hashed by the API
      phone: '1234567890',
      role: 'Seller',
      city: 'Test City',
      question1: 'Test question 1',
      question2: 'Test question 2',
      status: 'Approved'  // Set status as approved so they can login right away
    };

    console.log('Creating test seller...');
    
    // Make the API call to create the user
    const response = await axios.post('http://localhost:4000/api/v1/users', sellerData);
    
    console.log('Test seller created successfully!');
    console.log('User ID:', response.data.id);
    console.log('Login credentials:');
    console.log('- Email:', sellerData.email);
    console.log('- Password:', sellerData.password);
    console.log('- Role: Seller');
    
  } catch (error) {
    console.error('Error creating test seller:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
  }
}

// Execute the function
createTestSeller(); 