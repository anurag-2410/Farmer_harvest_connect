const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { AgriculturalInput } = require('../models/agriculturalInput');
const mongoose = require('mongoose');

// Get all orders
router.get('/', async (req, res) => {
    try {
        console.log("Fetching all orders");
        
        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            console.error("MongoDB connection is not established!");
            return res.status(500).json({ 
                success: false, 
                error: 'Database connection issue', 
                readyState: mongoose.connection.readyState 
            });
        }
        
        // Check if the Order model exists
        if (!Order) {
            console.error("Order model is not defined!");
            return res.status(500).json({ success: false, error: 'Order model not defined' });
        }
        
        const orderList = await Order.find()
            .populate('orderItems.input')
            .sort({ 'createdAt': -1 });

        console.log(`Found ${orderList.length} total orders in the database`);
        
        if (orderList.length === 0) {
            console.log("No orders found in the database");
        }

        res.status(200).send(orderList);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Order ID');
        }

        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name')
            .populate({
                path: 'orderItems.input',
                populate: 'seller'
            });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).send(order);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { orderItems, shippingAddress, customer, totalAmount, paymentMethod } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }
    
    console.log("Creating order with data:", { 
      itemCount: orderItems.length,
      customer: customer?.email || 'No email',
      total: totalAmount
    });
    
    // Validate items
    for (const item of orderItems) {
      if (!item.input) {
        return res.status(400).json({ message: 'Input ID is required for all order items' });
      }
      
      const input = await AgriculturalInput.findById(item.input);
      if (!input) {
        return res.status(400).json({ message: `Product not found: ${item.input}` });
      }
      
      // Check if enough quantity is available
      if (input.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${input.name}. Available: ${input.quantity}` 
        });
      }
    }
    
    // Create the order
    const order = new Order({
      orderItems,
      shippingAddress,
      customer,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    });
    
    // Save the order
    const createdOrder = await order.save();
    console.log("Order created:", createdOrder.id);
    
    // Update product quantities
    for (const item of orderItems) {
      await AgriculturalInput.findByIdAndUpdate(
        item.input,
        { $inc: { quantity: -item.quantity } }
      );
    }
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: error.message || 'Could not create order',
    });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Order ID');
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(400).send('Invalid Order');

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(500).send('The order cannot be updated');
        }

        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Order ID');
        }

        const order = await Order.findByIdAndRemove(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get orders by buyer ID
router.get('/buyer/:buyerId', async (req, res) => {
    try {
        const orderList = await Order.find({ buyer: req.params.buyerId })
            .populate({
                path: 'orderItems.input',
                populate: 'seller'
            })
            .sort({ 'dateOrdered': -1 });

        if (!orderList) {
            return res.status(500).json({ success: false });
        }

        res.status(200).send(orderList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get orders for a seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'name')
            .populate({
                path: 'orderItems.input',
                populate: 'seller'
            });

        // Filter orders that contain products from this seller
        const sellerOrders = orders.filter(order => {
            return order.orderItems.some(item => 
                item.input.seller && item.input.seller._id.toString() === req.params.sellerId
            );
        });

        res.status(200).send(sellerOrders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all orders for a specific user by email
router.get('/get-by-email/:email', async (req, res) => {
  try {
    let email = req.params.email;
    
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }
    
    // Try to decode if it appears to be URL encoded
    if (email.includes('%')) {
      try {
        const decodedEmail = decodeURIComponent(email);
        console.log(`Decoded email from ${email} to ${decodedEmail}`);
        email = decodedEmail;
      } catch (e) {
        console.log(`Failed to decode email: ${email}, using as is`);
      }
    }
    
    console.log(`Fetching orders for email: "${email}"`);
    
    // Find orders where the customer email matches
    const orders = await Order.find({ 'customer.email': email })
      .populate('orderItems.input')
      .sort({ createdAt: -1 }); // Most recent orders first
    
    console.log(`Found ${orders.length} orders for email: ${email}`);
    
    if (orders.length === 0) {
      // Try a case-insensitive search as fallback
      console.log(`Trying case-insensitive search for: ${email}`);
      const insensitiveOrders = await Order.find({ 
        'customer.email': { $regex: new RegExp(`^${email}$`, 'i') } 
      })
        .populate('orderItems.input')
        .sort({ createdAt: -1 });
      
      console.log(`Found ${insensitiveOrders.length} orders with case-insensitive search`);
      
      if (insensitiveOrders.length > 0) {
        return res.status(200).json(insensitiveOrders);
      }
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Special endpoint for testing - creates an order with minimal validation
router.post('/test-create', async (req, res) => {
  try {
    const { orderItems, shippingAddress, customer, totalAmount, paymentMethod } = req.body;
    
    console.log("Creating TEST order with data:", { 
      customer: customer?.email || 'No email',
      total: totalAmount
    });
    
    // Create the order without validation
    const order = new Order({
      orderItems: orderItems || [],
      shippingAddress: shippingAddress || {},
      customer: customer || { email: 'test@example.com' },
      totalAmount: totalAmount || 100,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending'
    });
    
    // Save the order
    const createdOrder = await order.save();
    console.log("TEST order created:", createdOrder.id);
    
    res.status(201).json({
      message: 'Test order created successfully',
      order: createdOrder
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    res.status(500).json({ 
      message: error.message || 'Could not create test order',
    });
  }
});

// Test database and order creation
router.get('/test-db', async (req, res) => {
  try {
    // Check database connection
    console.log("Testing database connection...");
    console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
    
    // Map connection state to human-readable form
    const connectionStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const connectionStatus = connectionStates[mongoose.connection.readyState] || 'unknown';
    
    // Check available collections
    console.log("Checking available collections...");
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Available collections:", collectionNames);
    
    // Try to create a test order
    console.log("Creating a test order...");
    const testOrder = new Order({
      orderItems: [{
        input: mongoose.Types.ObjectId(), // Generate a random ObjectId
        quantity: 1,
        price: 100
      }],
      shippingAddress: {
        street: "Test Street",
        city: "Test City",
        postalCode: "12345",
        phone: "1234567890"
      },
      customer: {
        email: "test-db@example.com"
      },
      totalAmount: 100,
      status: 'Pending'
    });
    
    const savedOrder = await testOrder.save();
    console.log("Test order created successfully:", savedOrder.id);
    
    // Respond with diagnostics
    res.status(200).json({
      status: 'success',
      databaseConnection: {
        state: mongoose.connection.readyState,
        status: connectionStatus
      },
      collections: collectionNames,
      ordersCollectionExists: collectionNames.includes('orders'),
      testOrder: {
        id: savedOrder.id,
        email: savedOrder.customer.email,
        created: savedOrder.createdAt
      }
    });
  } catch (error) {
    console.error('Error in database test:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 