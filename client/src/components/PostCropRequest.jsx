import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const PostCropRequest = () => {
  const userEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)useremail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
  const buyerEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)buyeremail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
  const cropname = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)cropname\s*=\s*([^;]*).*$)|^.*$/, '$1'));
  
  const [formData, setFormData] = useState({
    useremail: '',
    buyeremail: '',
    cropname:'',
    name: '',
    bidding_details:'',
    mobile: '',
  
  });

  const [validationErrors, setValidationErrors] = useState({});

  const postRequestData = async (latitude, longitude) => {
     try {
      const response = await fetch('http://localhost:4000/api/v1/croprequest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Assuming the server expects JSON
        },
        body: JSON.stringify({ ...formData, useremail: userEmail ,buyeremail: buyerEmail ,cropname:cropname,lat:latitude,long:longitude}),
      });

   

      if (response.ok) {
        console.log('Request data posted successfully!');
        alert('Request Successful');
        window.location.href = "/view_my_crop_request";
      } else {
        console.error('Error posting request data:', response.statusText);
        alert('Failed to post request data');
      }
    } catch (error) {
      console.error('Error posting request data:', error.message);
      alert('An error occurred while posting request data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
   
    // Reset validation error for the current field when it's being modified
    setValidationErrors({
      ...validationErrors,
      [name]: '',
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.name) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.bidding_details) {
      errors.bidding_details = 'Bidding Details is required';
      isValid = false;
    }
 
    if (!formData.mobile) {
      errors.mobile = 'Mobile is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Phone must be a 10-digit number';
      isValid = false;
    }
   
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          postRequestData(latitude, longitude);
        },
        (error) => {
          console.error(`Error getting user location: ${error.message}`);
          postRequestData(0, 0);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      postRequestData(0, 0);
    }
  };

  return (
    <div>
      <div>
        <div className="header-area" id="headerArea">
          <div className="container h-100 d-flex align-items-center justify-content-between">
            <div className="logo-wrapper" style={{ color: '#020310' }}>
              <img src={imgSmall} alt="Logo" /> <Title />
            </div>
            <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
          <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          <div className="offcanvas-body">
            <div className="sidenav-profile">
              <div className="user-profile"><img src={imgBg} alt="User" /></div>
              <div className="user-info">
                <h6 className="user-name mb-1">Farmer Harvest App
                </h6>
              </div>
            </div>
            <ul className="sidenav-nav ps-0">
              <li><Link to="/buyer_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6>Add Request</h6>
            </div>
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Name</span></div>
                      <input className="form-control" name="name" id="name" value={formData.name} onChange={handleInputChange} type="text" />
                      {validationErrors.name && <p style={{ color: 'red' }}>{validationErrors.name}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Bidding Details</span></div>
                      <input className="form-control" name="bidding_details" id="bidding_details" value={formData.bidding_details} onChange={handleInputChange} type="text" />
                      {validationErrors.bidding_details && <p style={{ color: 'red' }}>{validationErrors.bidding_details}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Mobile</span></div>
                      <input className="form-control" name="mobile" id="mobile" value={formData.mobile} onChange={handleInputChange} type="text" />
                      {validationErrors.mobile && <p style={{ color: 'red' }}>{validationErrors.mobile}</p>}
                    </div>
                  
                    <button className="btn btn-success w-100" type="submit">Submit</button>
                  </form>
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
              <li className="active"><Link to="/buyer_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCropRequest;