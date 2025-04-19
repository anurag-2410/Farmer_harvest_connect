import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import Logout from './Logout';
import Title from './Title';

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    zip: '',
    phone: ''
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('agricultureCart');
    if (savedCart && JSON.parse(savedCart).length > 0) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/agricultural-market');
    }
    
    // Get user info for prepopulating address
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:4000/api/v1/users/${userId}`)
        .then(response => {
          setShippingAddress(prev => ({
            ...prev,
            city: response.data.city || '',
            phone: response.data.phone || ''
          }));
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.input.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Get user email from cookies with URL encoding handling
    const rawCookies = document.cookie.split('; ');
    console.log("All cookies in checkout:", rawCookies);
    
    // Extract and decode emails from cookies
    const emailCookieStrings = [
      rawCookies.find(row => row.startsWith('email=')),
      rawCookies.find(row => row.startsWith('useremail=')),
      rawCookies.find(row => row.startsWith('buyeremail=')),
      rawCookies.find(row => row.startsWith('selleremail=')),
      rawCookies.find(row => row.startsWith('serviceemail='))
    ].filter(Boolean);
    
    const emails = emailCookieStrings.map(cookie => {
      if (!cookie) return null;
      const encodedEmail = cookie.split('=')[1];
      try {
        return decodeURIComponent(encodedEmail);
      } catch (e) {
        return encodedEmail;
      }
    }).filter(Boolean);
    
    // Use the last email (most recently set)
    const email = emails[emails.length - 1];
    console.log("Using email for order:", email);

    if (!email) {
      setError('User email not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // Format order items
      const orderItems = cart.map(item => ({
        input: item.input.id,
        quantity: item.quantity,
        price: item.input.price
      }));

      // Format shipping address to match the schema
      const formattedAddress = {
        street: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.zip,
        phone: shippingAddress.phone
      };

      // Create order
      const orderData = {
        orderItems,
        shippingAddress: formattedAddress,
        customer: { email },
        totalAmount: calculateTotal(),
        paymentMethod: 'Cash on Delivery'
      };

      console.log("Sending order data:", orderData);
      
      const response = await axios.post('http://localhost:4000/api/v1/orders', orderData);
      console.log("Order created successfully:", response.data);

      setSuccess('Order placed successfully!');
      
      // Clear cart
      localStorage.removeItem('agricultureCart');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } catch (error) {
      console.error("Order creation error:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper"><Title /></div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>  

      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
        <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        <div className="offcanvas-body">
          <div className="sidenav-profile">
            <div className="user-info">
              <h6 className="user-name mb-1">Farmer Harvest App</h6>
            </div>
          </div>
          <ul className="sidenav-nav ps-0">
            <li><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
            <li><Link to="/agricultural-market"><i className="lni lni-shopping-basket"></i>Market</Link></li>
            <li><Link to="/my-orders"><i className="lni lni-ticket"></i>My Orders</Link></li>
            <li><Logout /></li>  
          </ul>
        </div>
      </div>

      <div className="container mt-4">
        <h2 className="mb-4">Checkout</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Shipping Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">City*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="zip" className="form-label">Zip/Postal Code*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="zip"
                        name="zip"
                        value={shippingAddress.zip}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number*</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="d-grid gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/agricultural-market')}
                    >
                      Return to Shop
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  {cart.map((item) => (
                    <div key={item.input.id} className="d-flex justify-content-between mb-2">
                      <div>
                        <span className="fw-bold">{item.quantity} x </span>
                        {item.input.name}
                      </div>
                      <div>₹{item.input.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <div className="fw-bold">Subtotal</div>
                  <div>₹{calculateTotal()}</div>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <div className="fw-bold">Shipping</div>
                  <div>Free</div>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <div className="fw-bold">Total</div>
                  <div className="fs-5 fw-bold">₹{calculateTotal()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Link to="/agricultural-market"><i className="lni lni-shopping-basket"></i>Shop</Link></li>
              <li><Link to="/my-orders"><i className="lni lni-ticket"></i>Orders</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout; 