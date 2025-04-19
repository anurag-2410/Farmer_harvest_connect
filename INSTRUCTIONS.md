# Fixing the Agriculture Seller Login Issue

This document provides instructions to fix the seller login issue by ensuring the database has correctly configured seller accounts.

## Option 1: Create a Seller User Through the Registration Form

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend:
   ```
   cd client
   npm run dev
   ```

3. Open the application in your browser and navigate to the registration page.

4. Create a new account with the following details:
   - Set the role to "Agricultural Input Seller"
   - Fill in all required fields
   - Use a password that meets the requirements (at least 8 characters, with numbers, capital letters and special characters)

5. After registration, you will need to approve the account:
   - Login as an admin
   - Navigate to the user management section
   - Find the seller account and change its status to "Approved"

## Option 2: Manual Database Update

If you have direct access to the MongoDB database, you can create or update a seller account directly:

1. Connect to your MongoDB database using a tool like MongoDB Compass or the mongo shell:
   ```
   mongo 
   use farmer_harvest_new
   ```

2. Create a new seller user by inserting a document:
   ```javascript
   db.users.insertOne({
     name: "Test Seller",
     email: "seller@example.com",
     passwordHash: "$2a$10$6VZ6/nTuPFAl7iJXFrksOehzt2dVnKawVZ5VD03h0eBOsG1G6Fnxe", // This is hashed "Test@123"
     phone: "1234567890",
     role: "Seller",
     city: "Test City",
     question1: "Dog",
     question2: "John",
     status: "Approved",
     createdAt: new Date()
   })
   ```

3. Or, update an existing user to have the Seller role:
   ```javascript
   db.users.updateOne(
     { email: "existinguser@example.com" },
     { 
       $set: { 
         role: "Seller",
         status: "Approved" 
       } 
     }
   )
   ```

## Login Credentials

After setting up the seller account, you can login with:
- Email: the email you registered with (e.g., seller@example.com)
- Password: the password you set (e.g., Test@123)
- Role: Agricultural Input Seller

## Troubleshooting

If you're still experiencing issues, check the following:

1. Make sure the backend server is running properly.
2. Check the server logs for any error messages.
3. Verify the user exists in the database with the correct role "Seller" (not "seller").
4. Ensure the user has the status "Approved".
5. Check that the routes in App.jsx are properly defined.
6. Verify JWT token handling in the frontend and backend.

You can use the browser console to see any error messages and debug authentication issues. 