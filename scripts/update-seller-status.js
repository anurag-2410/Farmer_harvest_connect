const axios = require('axios');

// Function to update a seller's status to Approved
async function updateSellerStatus(email) {
  try {
    console.log(`Attempting to update status for seller: ${email}`);
    
    // First, find the user by email
    const findResponse = await axios.get('http://localhost:4000/api/v1/users');
    const users = findResponse.data;
    const seller = users.find(user => user.email === email && user.role === 'Seller');
    
    if (!seller) {
      console.error(`No seller found with email: ${email}`);
      return;
    }
    
    console.log(`Found seller: ${seller.name} (ID: ${seller.id}), current status: ${seller.status}`);
    
    // Update the user's status
    const updateResponse = await axios.put(`http://localhost:4000/api/v1/users/status/${seller.id}`, {
      status: 'Approved'
    });
    
    console.log('Status updated successfully!');
    console.log('User can now login as a seller with:');
    console.log(`- Email: ${email}`);
    console.log('- Role: Seller');
    
  } catch (error) {
    console.error('Error updating seller status:');
    if (error.response) {
      console.error('Server error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error setting up the request:', error.message);
    }
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || 'seller1@gmail.com';
updateSellerStatus(email); 