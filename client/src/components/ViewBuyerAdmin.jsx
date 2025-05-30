import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewBuyerAdmin = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); // Retrieve token from local storage
console.log(token);
  const UpdateStatus = (id) => {
    navigate(`/update_status_admin/${id}`);
  }

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/users/', {
          headers: {
            'x-auth-token': token // Include token in the request headers
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const filteredBuyer = data.filter(user => user.role === 'buyer');
        setBusinessData(filteredBuyer);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [token]);

  const filteredData = businessData.filter(user => 
    Object.values(user).some(field => 
      field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );  

  const handleSearch = (e) => {
    e.preventDefault();
  }

  return (
    <div>
      <header className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{color:'#020310'}}>
            <img src={imgSmall} alt="Logo" />
            <Title />
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
          <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          <div className="offcanvas-body">
            <div className="sidenav-profile">
              <div className="user-profile"><img src={imgBg} alt="User Profile" /></div>
              <div className="user-info">
                <h6 className="user-name mb-1">On Road Help</h6>
              </div>
            </div>
            <ul className="sidenav-nav ps-0">
              <li><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Logout /></li>  
            </ul>
          </div>
        </div>
      </header>
      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6>View Buyers Details</h6>
            </div>
            <div className="row g-3">
              <div className="top-search-form">
                <form onSubmit={handleSearch}>
                  <input className="form-control" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <button type="submit"><i className="fa fa-search"></i></button>
                </form>
              </div>
            </div>
            <div className="row" style={{marginTop:10}}>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">Error: {error}</p>
              ) : (
                filteredData.map((user) => (
                  <div key={user._id} className="col-12 col-md-6">
                    <div className="card product-card" style={{marginBottom:10}}>
                      <div className="card-body">
                        <a className="product-title d-block">Name: <b>{user.name}</b></a>
                        <a className="product-title d-block">Email: {user.email}</a>
                        <a className="product-title d-block">Mobile: {user.phone}</a>
                        <a className="product-title d-block">City: {user.city}</a>
                        <a className="product-title d-block">Role: {user.role}</a>
                        <a className="product-title d-block" style={{color:'orange'}}>Status: {user.status}</a>
                      </div>
                    </div>   
                    <button className="btn btn-danger" onClick={() => UpdateStatus(user._id)}>Update Status</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <footer className="footer-nav-area" id="footerNav">
          <div className="container h-100 px-0">
            <div className="suha-footer-nav h-100">
              <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                <li className="active"><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
                <li><Logout /></li> 
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ViewBuyerAdmin;
