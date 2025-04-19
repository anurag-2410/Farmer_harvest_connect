const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
router.get('/', async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password, phone, role, city, question1, question2, status } = req.body;
        const user = new User({
            name,
            email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone,
            role,
            city,
            question1,
            question2,
            status,
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
});

router.post('/login', async (req, res) => {
    try {
      let { email, password, role } = req.body;
      
      // Map legacy role values to new enum values if needed
      if (role === 'user') role = 'Farmer';
      if (role === 'admin') role = 'Admin';
      
      console.log('Login attempt:', { email, role }); // Debug logging
      
      const user = await User.findOne({ email, role });
      
      if (!user) {
        console.log('User not found with email and role:', { email, role });
        return res.status(400).send('User not found');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
      if (!isPasswordValid) {
        return res.status(400).send('Incorrect password');
      }
      
      // Add user ID to token for easier extraction
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
          algorithm: 'HS256'
        }
      );
  
      console.log('Login successful:', { email, role, status: user.status });
      
      res.status(200).json({
        token,
        userId: user._id, // Include userId directly in response
        role: user.role,
        status: user.status
      });
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).send('Server error');
    }
  });

  router.put('/status/:id',  async (req, res)=> {
      const user = await User.findByIdAndUpdate(
          req.params.id,
          {        
              status: req.body.status
          },
          { new: true}
      )
  
      if(!user)
      return res.status(400).send('the user cannot be created!')
  
      res.send(user);
  })
  
router.put('/:id', async (req, res) => {
    try {
        const { name, email, password, phone, city, role, question1, question2, status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let passwordHash = user.passwordHash;
        if (password) {
            passwordHash = bcrypt.hashSync(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                passwordHash,
                phone,
                city,
                role,
                question1,
                question2,
                status,
            },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Reset password
router.post('/reset_password', async (req, res) => {
    try {
        const { email, question1, question2, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.question1 !== question1 || user.question2 !== question2) {
            return res.status(400).json({ error: 'Security questions do not match' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.passwordHash = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
