const express = require('express');
const router = express.Router();
const { AgriculturalInput } = require('../models/agriculturalInput');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const multer = require('multer');

// File upload configuration
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// Get all agricultural inputs
router.get('/', async (req, res) => {
    try {
        const inputList = await AgriculturalInput.find().populate('seller', 'name');
        
        if (!inputList) {
            return res.status(500).json({ success: false });
        }
        
        res.status(200).send(inputList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get agricultural input by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Input ID');
        }

        const input = await AgriculturalInput.findById(req.params.id).populate('seller', 'name');
        
        if (!input) {
            return res.status(404).json({ success: false, message: 'Input not found' });
        }
        
        res.status(200).send(input);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new agricultural input
router.post('/', uploadOptions.array('images', 5), async (req, res) => {
    try {
        const seller = await User.findById(req.body.seller);
        if (!seller) return res.status(400).send('Invalid Seller');
        
        if (seller.role !== 'Seller') {
            return res.status(400).send('Only sellers can add agricultural inputs');
        }

        const files = req.files;
        let imagesPaths = [];
        
        if (files) {
            files.map(file => {
                imagesPaths.push(`${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`);
            });
        }

        let input = new AgriculturalInput({
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            manufacturer: req.body.manufacturer,
            images: imagesPaths,
            seller: req.body.seller,
            status: req.body.status || 'Available'
        });

        input = await input.save();
        
        if (!input) {
            return res.status(500).send('The input cannot be created');
        }

        res.status(201).send(input);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update an agricultural input
router.put('/:id', uploadOptions.array('images', 5), async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Input ID');
        }

        const input = await AgriculturalInput.findById(req.params.id);
        if (!input) return res.status(400).send('Invalid Input');

        // Verify seller is updating their own input
        if (input.seller.toString() !== req.body.seller) {
            return res.status(403).send('You can only update your own inputs');
        }

        const files = req.files;
        let imagesPaths = [];
        
        if (files && files.length > 0) {
            files.map(file => {
                imagesPaths.push(`${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`);
            });
        } else {
            imagesPaths = input.images;
        }

        const updatedInput = await AgriculturalInput.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                type: req.body.type,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                manufacturer: req.body.manufacturer,
                images: imagesPaths,
                status: req.body.status
            },
            { new: true }
        );
        
        if (!updatedInput) {
            return res.status(500).send('The input cannot be updated');
        }

        res.status(200).send(updatedInput);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete an agricultural input
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Input ID');
        }

        const input = await AgriculturalInput.findByIdAndRemove(req.params.id);
        
        if (!input) {
            return res.status(404).json({ success: false, message: 'Input not found' });
        }
        
        res.status(200).json({ success: true, message: 'Input deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get inputs by seller ID
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const inputList = await AgriculturalInput.find({ seller: req.params.sellerId });
        
        if (!inputList) {
            return res.status(500).json({ success: false });
        }
        
        res.status(200).send(inputList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get inputs by type
router.get('/type/:type', async (req, res) => {
    try {
        const inputList = await AgriculturalInput.find({ type: req.params.type }).populate('seller', 'name');
        
        if (!inputList) {
            return res.status(500).json({ success: false });
        }
        
        res.status(200).send(inputList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router; 