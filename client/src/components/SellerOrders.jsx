import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import Logout from './Logout';
import Title from './Title';

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const sellerId = localStorage.getItem('userId');
      if (!sellerId) {
        setError('Not logged in. Please login again.');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Fetch orders for the seller
      const response = await axios.get(`http://localhost:4000/api/v1/orders/seller/${sellerId}`);
      console.log("Seller orders response:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      setError(`Failed to fetch orders: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setProcessingOrder(true);
    try {
      await axios.put(`http://localhost:4000/api/v1/orders/${orderId}`, {
        status: newStatus
      });
      
      // Update the order in the state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      // Update the selected order if it's open in the modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
      
      // Find the updated order to get customer email for notification
      const updatedOrder = updatedOrders.find(order => order.id === orderId);
      if (updatedOrder && updatedOrder.customer && updatedOrder.customer.email) {
        // Simulate email notification (since nodemailer is not installed)
        console.log(`[Email Notification Simulation] 
          To: ${updatedOrder.customer.email}
          Subject: Your order status has been updated
          Message: Dear Customer, your order #${orderId.substring(0, 8)} has been updated to "${newStatus}". 
          Thank you for shopping with Farmer Harvest!
        `);
        
        // In a real app with nodemailer, you would call a backend endpoint here to send an actual email
      }
      
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(`Failed to update order status: ${error.response?.data?.message || error.message}`);
    } finally {
      setProcessingOrder(false);
    }
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
    
    // Handle both possible schemas
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

  // Get item name safely
  const getItemName = (item) => {
    if (item.input && typeof item.input === 'object') {
      return item.input.name || 'Product';
    }
    return 'Agricultural Input';
  };

  // Get item type safely
  const getItemType = (item) => {
    if (item.input && typeof item.input === 'object') {
      return item.input.type || 'Agricultural Product';
    }
    return '';
  };

  // Get item image safely
  const getItemImage = (item) => {
    if (item.input && typeof item.input === 'object' && item.input.images && item.input.images.length > 0) {
      return item.input.images[0];
    }
    return null;
  };

  // Get customer name
  const getCustomerName = (order) => {
    if (order.buyer && order.buyer.name) {
      return order.buyer.name;
    }
    if (order.customer && order.customer.name) {
      return order.customer.name;
    }
    return 'Customer';
  };

  // Get customer email
  const getCustomerEmail = (order) => {
    if (order.customer && order.customer.email) {
      return order.customer.email;
    }
    return 'N/A';
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
            <li><Link to="/seller_home"><i className="lni lni-home"></i>Home</Link></li>
            <li><Link to="/manage-inputs"><i className="lni lni-list"></i>Products</Link></li>
            <li><Link to="/seller-orders"><i className="lni lni-cart"></i>Orders</Link></li>
            <li><Logout /></li>  
          </ul>
        </div>
      </div>

      <div className="container mt-5 pt-4 mb-5 pb-5">
        <h2 className="mb-4">Manage Orders</h2>

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

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center mt-4">
            <div className="alert alert-info">
              <p className="mb-0">You don't have any orders yet.</p>
              <Link to="/seller_home" className="btn btn-primary mt-3">
                Back to Dashboard
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
                      <th>Customer</th>
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
                        <td>{getCustomerName(order)}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => viewOrderDetails(order)}
                          >
                            View
                          </button>
                          {order.status === 'Pending' && (
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => updateOrderStatus(order.id, 'Processing')}
                              disabled={processingOrder}
                            >
                              Process
                            </button>
                          )}
                          {order.status === 'Processing' && (
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => updateOrderStatus(order.id, 'Shipped')}
                              disabled={processingOrder}
                            >
                              Ship
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              disabled={processingOrder}
                            >
                              Mark Delivered
                            </button>
                          )}
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
                    <h6 className="mb-2">Customer Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {getCustomerName(selectedOrder)}</p>
                    <p className="mb-1"><strong>Email:</strong> {getCustomerEmail(selectedOrder)}</p>
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
                
                <div className="mt-4">
                  <h6 className="mb-3">Update Order Status</h6>
                  <div className="d-flex gap-2">
                    {selectedOrder.status !== 'Pending' && (
                      <button 
                        className={`btn ${selectedOrder.status === 'Pending' ? 'btn-warning active' : 'btn-outline-warning'}`}
                        onClick={() => updateOrderStatus(selectedOrder.id, 'Pending')}
                        disabled={processingOrder || selectedOrder.status === 'Pending'}
                      >
                        Pending
                      </button>
                    )}
                    <button 
                      className={`btn ${selectedOrder.status === 'Processing' ? 'btn-info active' : 'btn-outline-info'}`}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Processing')}
                      disabled={processingOrder || selectedOrder.status === 'Processing'}
                    >
                      Processing
                    </button>
                    <button 
                      className={`btn ${selectedOrder.status === 'Shipped' ? 'btn-primary active' : 'btn-outline-primary'}`}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Shipped')}
                      disabled={processingOrder || selectedOrder.status === 'Shipped'}
                    >
                      Shipped
                    </button>
                    <button 
                      className={`btn ${selectedOrder.status === 'Delivered' ? 'btn-success active' : 'btn-outline-success'}`}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Delivered')}
                      disabled={processingOrder || selectedOrder.status === 'Delivered'}
                    >
                      Delivered
                    </button>
                    <button 
                      className={`btn ${selectedOrder.status === 'Cancelled' ? 'btn-danger active' : 'btn-outline-danger'}`}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                      disabled={processingOrder || selectedOrder.status === 'Cancelled'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
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
              <li><Link to="/seller_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Link to="/manage-inputs"><i className="lni lni-list"></i>Products</Link></li>
              <li className="active"><Link to="/seller-orders"><i className="lni lni-cart"></i>Orders</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerOrders; 