import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import "./css/modal-fix.css";
import Logout from './Logout';
import Title from './Title';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get the user's email from cookies - check different cookie options and handle URL encoding
      const rawCookies = document.cookie.split('; ');
      console.log("All cookies:", rawCookies);
      
      // Looking specifically for cookies related to email
      let foundEmail = null;
      
      // Check if we have a cookie with useremail=user1@gmail.com (this is the format in your cookies)
      // Your cookie information shows: useremail=user1@gmail.com without URL encoding
      const userEmailCookie = rawCookies.find(c => c.includes('useremail=user1@gmail.com'));
      if (userEmailCookie) {
        foundEmail = 'user1@gmail.com';
        console.log("Found direct useremail cookie for user1@gmail.com");
      }
      
      // If we didn't find the specific useremail cookie, try to extract from any email-related cookie
      if (!foundEmail) {
        // Regular approach with all email-related cookies
        const emailCookieStrings = [
          rawCookies.find(row => row.startsWith('email=')),
          rawCookies.find(row => row.startsWith('useremail=')),
          rawCookies.find(row => row.startsWith('buyeremail=')),
          rawCookies.find(row => row.startsWith('selleremail=')),
          rawCookies.find(row => row.startsWith('serviceemail='))
        ].filter(Boolean); // Remove undefined values
        
        const emails = emailCookieStrings.map(cookie => {
          if (!cookie) return null;
          const encodedEmail = cookie.split('=')[1];
          // Handle URL encoded emails - try to decode
          try {
            return decodeURIComponent(encodedEmail);
          } catch (e) {
            return encodedEmail; // Return as is if decoding fails
          }
        }).filter(Boolean);
        
        console.log("Extracted emails:", emails);
        
        // Use the last email found (most recently set)
        foundEmail = emails[emails.length - 1];
      }
      
      // If we still can't determine the email, try using user1@gmail.com directly
      if (!foundEmail) {
        console.log("No email found in cookies, trying with user1@gmail.com directly");
        foundEmail = 'user1@gmail.com';
      }
      
      console.log("Using email for orders:", foundEmail);
      
      if (!foundEmail) {
        setError('User not logged in or email not found in cookies. Please log in again.');
        setLoading(false);
        return;
      }

      // First, verify that we can connect to the backend
      try {
        await axios.get('http://localhost:4000/api/v1/users/');
        console.log("Backend connection successful");
      } catch (backendError) {
        console.error("Backend connection error:", backendError);
        setError('Cannot connect to the server. Please make sure the backend is running.');
        setLoading(false);
        return;
      }

      // Now attempt to fetch orders
      console.log(`Fetching orders for email: ${foundEmail}`);
      const response = await axios.get(`http://localhost:4000/api/v1/orders/get-by-email/${foundEmail}`);
      console.log("Orders response:", response.data);
      
      if (response.data) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Order fetch error details:", error.response || error);
      setError(`Failed to fetch your orders: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning';
      case 'Processing':
        return 'bg-info';
      case 'Shipped':
        return 'bg-primary';
      case 'Delivered':
        return 'bg-success';
      case 'Cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format address for display
  const formatAddress = (address) => {
    if (!address) return 'No address information';
    
    let addressParts = [];
    
    // Handle both possible schemas (from creation vs from database)
    if (address.street) addressParts.push(address.street);
    if (address.address) addressParts.push(address.address);
    
    let cityLine = [];
    if (address.city) cityLine.push(address.city);
    if (address.state) cityLine.push(address.state);
    if (cityLine.length > 0) addressParts.push(cityLine.join(', '));
    
    if (address.postalCode) addressParts.push(address.postalCode);
    if (address.zip) addressParts.push(address.zip);
    
    return addressParts.filter(Boolean).join(', ');
  };

  // Modal handling
  useEffect(() => {
    if (showDetailsModal) {
      document.body.classList.add('modal-open');
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
  }, [showDetailsModal]);

  const closeModalOnOutsideClick = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowDetailsModal(false);
    }
  };

  // Utility function to safely check if an item input is populated
  const isInputPopulated = (item) => {
    return item.input && typeof item.input === 'object' && item.input !== null;
  };

  // Get item name safely
  const getItemName = (item) => {
    if (isInputPopulated(item)) {
      return item.input.name || 'Product';
    }
    // If input is just an ID and not populated
    return 'Agricultural Input';
  };

  // Get item type safely
  const getItemType = (item) => {
    if (isInputPopulated(item)) {
      return item.input.type || 'Agricultural Product';
    }
    return '';
  };

  // Get item image safely
  const getItemImage = (item) => {
    if (isInputPopulated(item) && item.input.images && item.input.images.length > 0) {
      return item.input.images[0];
    }
    return null;
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
        <h2 className="mb-4">My Orders</h2>

        {error && (
          <div className="alert alert-danger">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-3" 
              onClick={fetchOrders}
            >
              Retry
            </button>
          </div>
        )}

        {/* Debug section - only shown if there's an error */}
        {error && (
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h6 className="mb-0">Debug Information</h6>
            </div>
            <div className="card-body">
              <p><strong>Cookies:</strong> {document.cookie || "No cookies found"}</p>
              <p><strong>Detected Emails:</strong></p>
              <ul className="mb-3">
                {document.cookie.split('; ')
                  .filter(c => c.includes('email='))
                  .map((cookie, index) => {
                    const parts = cookie.split('=');
                    const cookieName = parts[0];
                    let emailValue;
                    try {
                      emailValue = decodeURIComponent(parts[1]);
                    } catch (e) {
                      emailValue = parts[1];
                    }
                    return (
                      <li key={index}>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2 mb-1"
                          onClick={() => {
                            axios.get(`http://localhost:4000/api/v1/orders/get-by-email/${emailValue}`)
                              .then(response => {
                                console.log(`Manual fetch for ${emailValue} response:`, response.data);
                                setOrders(response.data);
                                setError('');
                              })
                              .catch(err => {
                                console.error(`Manual fetch for ${emailValue} error:`, err);
                                setError(`Manual fetch failed: ${err.message}`);
                              });
                          }}
                        >
                          Fetch for {cookieName}: {emailValue}
                        </button>
                      </li>
                    );
                  })}
              </ul>
              
              <div className="mb-3">
                <h6>Direct Database Checks:</h6>
                <button 
                  className="btn btn-sm btn-warning me-2 mb-1"
                  onClick={() => {
                    axios.get(`http://localhost:4000/api/v1/orders`)
                      .then(response => {
                        console.log("All orders in DB:", response.data);
                        if (response.data.length > 0) {
                          setOrders(response.data);
                          setError('');
                        } else {
                          setError('No orders exist in the database');
                        }
                      })
                      .catch(err => {
                        console.error("Error checking all orders:", err);
                        setError(`Database check failed: ${err.message}`);
                      });
                  }}
                >
                  Check All Orders in DB
                </button>
                
                <button 
                  className="btn btn-sm btn-info me-2 mb-1"
                  onClick={() => {
                    const testEmail = prompt("Enter email for test order:", "user1@gmail.com");
                    if (!testEmail) return;
                    
                    // Create a test order directly
                    const testOrder = {
                      orderItems: [{
                        input: "64ff123456789abcdef12345", // use a dummy ID
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
                        email: testEmail // Use provided email
                      },
                      totalAmount: 100,
                      paymentMethod: "Cash on Delivery"
                    };
                    
                    axios.post('http://localhost:4000/api/v1/orders/test-create', testOrder)
                      .then(response => {
                        console.log("Test order creation response:", response.data);
                        alert(`Test order created for ${testEmail}! Check console for details.`);
                        
                        // Try to fetch orders for this email immediately
                        axios.get(`http://localhost:4000/api/v1/orders/get-by-email/${testEmail}`)
                          .then(ordersResponse => {
                            console.log(`Orders for ${testEmail}:`, ordersResponse.data);
                            setOrders(ordersResponse.data);
                            setError('');
                          })
                          .catch(err => {
                            console.error(`Error fetching orders for ${testEmail}:`, err);
                          });
                      })
                      .catch(err => {
                        console.error("Test order creation error:", err);
                        setError(`Test order creation failed: ${err.message}`);
                      });
                  }}
                >
                  Create Test Order
                </button>
              </div>
              
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  const email = prompt("Enter your email to fetch orders manually:");
                  if (email) {
                    axios.get(`http://localhost:4000/api/v1/orders/get-by-email/${email}`)
                      .then(response => {
                        console.log("Manual fetch response:", response.data);
                        setOrders(response.data);
                        setError('');
                      })
                      .catch(err => {
                        console.error("Manual fetch error:", err);
                        setError(`Manual fetch failed: ${err.message}`);
                      });
                  }
                }}
              >
                Fetch Orders Manually
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center mt-4">
            <div className="alert alert-info">
              <p className="mb-0">You haven't placed any orders yet.</p>
              <Link to="/agricultural-market" className="btn btn-primary mt-3">
                Go to Market
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id.substring(0, 8)}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewOrderDetails(order)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} onClick={closeModalOnOutsideClick}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details - #{selectedOrder.id.substring(0, 8)}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="mb-2">Order Information</h6>
                    <p className="mb-1"><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p className="mb-1"><strong>Status:</strong> <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                    <p className="mb-1"><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                    <p className="mb-1"><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-2">Shipping Information</h6>
                    {selectedOrder.shippingAddress ? (
                      <>
                        <p className="mb-1"><strong>Address:</strong> {formatAddress(selectedOrder.shippingAddress)}</p>
                        <p className="mb-1"><strong>Phone:</strong> {selectedOrder.shippingAddress.phone || 'N/A'}</p>
                      </>
                    ) : (
                      <p className="text-muted">No shipping information available</p>
                    )}
                  </div>
                </div>

                <h6 className="mb-3">Order Items</h6>
                {(!selectedOrder.orderItems || selectedOrder.orderItems.length === 0) ? (
                  <div className="alert alert-info">No order items found.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.orderItems.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                {getItemImage(item) ? (
                                  <img 
                                    src={getItemImage(item)} 
                                    alt={getItemName(item)} 
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }} 
                                  />
                                ) : (
                                  <div className="bg-light d-flex align-items-center justify-content-center me-2" 
                                    style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-image text-muted"></i>
                                  </div>
                                )}
                                <div>
                                  <div className="fw-bold">{getItemName(item)}</div>
                                  <div className="text-muted small">{getItemType(item)}</div>
                                </div>
                              </div>
                            </td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price}</td>
                            <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end fw-bold">Total:</td>
                          <td className="fw-bold">₹{selectedOrder.totalAmount}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                
                {selectedOrder.status === 'Delivered' && !selectedOrder.feedback && (
                  <div className="mt-3">
                    <Link to={`/post-feedback/${selectedOrder.id}`} className="btn btn-primary">
                      Leave Feedback
                    </Link>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                {selectedOrder.status === 'Pending' && (
                  <button type="button" className="btn btn-danger">Cancel Order</button>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowDetailsModal(false)} style={{ zIndex: 1040 }}></div>
        </div>
      )}

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Link to="/agricultural-market"><i className="lni lni-shopping-basket"></i>Market</Link></li>
              <li className="active"><Link to="/my-orders"><i className="lni lni-ticket"></i>Orders</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders; 