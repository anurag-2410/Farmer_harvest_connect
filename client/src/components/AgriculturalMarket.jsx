import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import "./css/modal-fix.css";
import Logout from './Logout';
import Title from './Title';

function AgriculturalMarket() {
  const [inputs, setInputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    fetchInputs();
    
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('agricultureCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('agricultureCart', JSON.stringify(cart));
  }, [cart]);

  const fetchInputs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/v1/agricultural-inputs');
      // Filter only available products
      const availableInputs = response.data.filter(input => input.status === 'Available' && input.quantity > 0);
      setInputs(availableInputs);
    } catch (error) {
      setError('Failed to fetch products. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (input) => {
    const existingItem = cart.find(item => item.input.id === input.id);
    
    if (existingItem) {
      // Update quantity if already in cart
      if (existingItem.quantity < input.quantity) {
        setCart(cart.map(item => 
          item.input.id === input.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ));
      } else {
        alert(`Maximum available quantity for ${input.name} is ${input.quantity}`);
      }
    } else {
      // Add new item to cart
      setCart([...cart, { input, quantity: 1 }]);
    }
  };

  const removeFromCart = (inputId) => {
    setCart(cart.filter(item => item.input.id !== inputId));
  };

  const updateCartQuantity = (inputId, newQuantity) => {
    const input = inputs.find(input => input.id === inputId);
    
    if (newQuantity > input.quantity) {
      alert(`Maximum available quantity for ${input.name} is ${input.quantity}`);
      return;
    }
    
    if (newQuantity < 1) {
      removeFromCart(inputId);
      return;
    }
    
    setCart(cart.map(item => 
      item.input.id === inputId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.input.price * item.quantity), 0);
  };

  const filterInputs = () => {
    let filtered = inputs;
    
    // Filter by type
    if (filterType !== 'All') {
      filtered = filtered.filter(input => input.type === filterType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(input => 
        input.name.toLowerCase().includes(term) ||
        input.description.toLowerCase().includes(term) ||
        input.manufacturer.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const filteredInputs = filterInputs();

  // Cart modal fix
  useEffect(() => {
    if (showCartModal) {
      document.body.classList.add('modal-open');
      // Prevent clicks inside modal from closing it
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        modalContent.addEventListener('click', e => e.stopPropagation());
      }
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showCartModal]);

  // Close modal when clicking outside
  const closeModalOnOutsideClick = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowCartModal(false);
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

      <div className="container mt-5 pt-4 mb-5 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Agricultural Inputs Market</h2>
          <button 
            className="btn btn-success position-relative" 
            onClick={() => setShowCartModal(true)}
            disabled={cart.length === 0}
          >
            <i className="bi bi-cart-fill me-2"></i>
            View Cart
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, description, or manufacturer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <select
                  className="form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Seed">Seeds</option>
                  <option value="Pesticide">Pesticides</option>
                  <option value="Fertilizer">Fertilizers</option>
                  <option value="Tool">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredInputs.length === 0 ? (
          <div className="alert alert-info">
            No products found. Try changing your filters.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredInputs.map((input) => (
              <div key={input.id} className="col">
                <div className="card h-100">
                  {input.images && input.images.length > 0 ? (
                    <img 
                      src={input.images[0]} 
                      className="card-img-top"
                      alt={input.name} 
                      style={{ height: '200px', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" 
                      style={{ height: '200px' }}>
                      <i className="bi bi-image text-muted fs-1"></i>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{input.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{input.type}</h6>
                    <p className="card-text">{input.description.substring(0, 100)}...</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-5 fw-bold">₹{input.price}</span>
                      <span className="text-muted">Available: {input.quantity}</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="d-grid">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => addToCart(input)}
                        disabled={input.quantity === 0}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} onClick={closeModalOnOutsideClick}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Shopping Cart</h5>
                <button type="button" className="btn-close" onClick={() => setShowCartModal(false)}></button>
              </div>
              <div className="modal-body">
                {cart.length === 0 ? (
                  <p className="text-center">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => (
                            <tr key={item.input.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {item.input.images && item.input.images.length > 0 ? (
                                    <img 
                                      src={item.input.images[0]} 
                                      alt={item.input.name} 
                                      style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} 
                                    />
                                  ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center me-2" 
                                      style={{ width: '50px', height: '50px' }}>
                                      <i className="bi bi-image text-muted"></i>
                                    </div>
                                  )}
                                  <div>
                                    <div className="fw-bold">{item.input.name}</div>
                                    <div className="text-muted small">{item.input.type}</div>
                                  </div>
                                </div>
                              </td>
                              <td>₹{item.input.price}</td>
                              <td>
                                <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                  <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => updateCartQuantity(item.input.id, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="number" 
                                    className="form-control text-center" 
                                    value={item.quantity}
                                    onChange={(e) => updateCartQuantity(item.input.id, parseInt(e.target.value) || 0)}
                                    min="1"
                                    max={item.input.quantity}
                                  />
                                  <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => updateCartQuantity(item.input.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.input.quantity}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td>₹{item.input.price * item.quantity}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeFromCart(item.input.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">Total:</td>
                            <td colSpan="2" className="fw-bold">₹{calculateTotal()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer" style={{ zIndex: 1060 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCartModal(false)}>Continue Shopping</button>
                {cart.length > 0 && (
                  <Link to="/checkout" className="btn btn-success" style={{ position: 'relative', zIndex: 1070 }}>
                    Proceed to Checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowCartModal(false)} style={{ zIndex: 1040 }}></div>
        </div>
      )}

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
              <li className="active"><Link to="/agricultural-market"><i className="lni lni-shopping-basket"></i>Market</Link></li>
              <li><Link to="/my-orders"><i className="lni lni-ticket"></i>Orders</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgriculturalMarket;

 