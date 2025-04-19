const axios = require('axios');
const bcrypt = require('bcryptjs');

// Function to create an admin user
async function createAdminUser() {
  try {
    // Admin user data
    const adminData = {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'Admin@123',  // Will be hashed by the API
      phone: '1234567890',
      role: 'Admin',
      city: 'Admin City',
      question1: 'Admin question 1',
      question2: 'Admin question 2',
      status: 'Approved'  // Set status as approved so they can login right away
    };

    console.log('Creating admin user...');
    
    // Make the API call to create the user
    const response = await axios.post('http://localhost:4000/api/v1/users', adminData);
    
    console.log('Admin user created successfully!');
    console.log('User ID:', response.data.id);
    console.log('Login credentials:');
    console.log('- Email:', adminData.email);
    console.log('- Password:', adminData.password);
    console.log('- Role: Admin');
    
  } catch (error) {
    console.error('Error creating admin user:');
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
createAdminUser(); 