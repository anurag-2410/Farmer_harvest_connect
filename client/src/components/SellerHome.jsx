import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import Logout from './Logout';
import Title from './Title';

function SellerHome() {
  const [seller, setSeller] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInputs: 0,
    totalOrders: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const sellerId = localStorage.getItem('userId');
    
    console.log("Seller Home - Token and userId:", { token: !!token, sellerId });
    
    if (!token || !sellerId) {
      console.error("Missing token or sellerId. Redirecting to login.");
      window.location.href = '/login';
      return;
    }

    // Fetch seller profile
    axios.get(`http://localhost:4000/api/v1/users/${sellerId}`)
      .then(response => {
        console.log("Seller profile loaded:", response.data.name);
        setSeller(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching seller profile:', error.response?.data || error.message);
        setLoading(false);
        // If the error is 404, it means the user doesn't exist with that ID
        if (error.response?.status === 404) {
          alert("User not found. Please login again.");
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        }
      });

    // Fetch seller stats
    axios.get(`http://localhost:4000/api/v1/agricultural-inputs/seller/${sellerId}`)
      .then(response => {
        setStats(prev => ({
          ...prev,
          totalInputs: response.data.length
        }));
      })
      .catch(error => {
        console.error('Error fetching inputs:', error);
      });

    // Fetch orders
    axios.get(`http://localhost:4000/api/v1/orders/seller/${sellerId}`)
      .then(response => {
        const pendingOrders = response.data.filter(order => order.status === 'Pending').length;
        setStats(prev => ({
          ...prev,
          totalOrders: response.data.length,
          pendingOrders
        }));
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

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
            <li><Logout /></li>  
          </ul>
        </div>
      </div>

      <div className="container mt-5 pt-4 mb-5 pb-5">
        <div className="row mb-4">
          <div className="col-md-12">
            <h2>Welcome, {seller.name}</h2>
            <p className="text-muted">Seller Dashboard</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Products</h5>
                <h2 className="card-text">{stats.totalInputs}</h2>
                <Link to="/manage-inputs" className="btn btn-light mt-2">Manage</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Total Orders</h5>
                <h2 className="card-text">{stats.totalOrders}</h2>
                <Link to="/seller-orders" className="btn btn-light mt-2">View</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <h5 className="card-title">Pending Orders</h5>
                <h2 className="card-text">{stats.pendingOrders}</h2>
                <Link to="/seller-orders" className="btn btn-dark mt-2">Process</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-light">
                <h5>Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="list-group">
                  <Link to="/add-input" className="list-group-item list-group-item-action">
                    <i className="bi bi-plus-circle me-2"></i> Add New Product
                  </Link>
                  <Link to="/manage-inputs" className="list-group-item list-group-item-action">
                    <i className="bi bi-gear me-2"></i> Manage Products
                  </Link>
                  <Link to="/seller-orders" className="list-group-item list-group-item-action">
                    <i className="bi bi-cart me-2"></i> View Orders
                  </Link>
                  <Link to="/seller-profile" className="list-group-item list-group-item-action">
                    <i className="bi bi-person me-2"></i> My Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-light">
                <h5>Account Information</h5>
              </div>
              <div className="card-body">
                <p><strong>Name:</strong> {seller.name}</p>
                <p><strong>Email:</strong> {seller.email}</p>
                <p><strong>Phone:</strong> {seller.phone}</p>
                <p><strong>City:</strong> {seller.city}</p>
                <p><strong>Status:</strong> <span className={`badge ${seller.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>{seller.status}</span></p>
                <Link to="/edit-seller-profile" className="btn btn-primary">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active"><Link to="/seller_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Link to="/manage-inputs"><i className="lni lni-list"></i>Products</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerHome; 