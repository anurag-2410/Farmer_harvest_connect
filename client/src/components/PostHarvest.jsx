import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const PostHarvest = () => {
  const [formData, setFormData] = useState({
    useremail: '',
    vehicle: '',
    manpower: '',
    crop_details: '',
    no_of_acre: '',
    duration_date: '',
    address: '',
    mobile: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Function to post harvest data to the server
  const postHarvestData = async () => {
    const userEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    try {
      const response = await fetch('http://localhost:4000/api/v1/harvest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Assuming the server expects JSON
        },
        body: JSON.stringify({ ...formData, useremail: userEmail }),
      });

      if (response.ok) {
        console.log('Harvest data posted successfully!');
        alert('Created Successfully');
        window.location.href = 'view_my_harvest';
      } else {
        const errorText = await response.text();
        console.error('Error posting Harvest data:', errorText);
        alert('Error: ' + errorText);
      }
    } catch (error) {
      console.error('Error posting Harvest data:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' }); // Reset validation error for the current field
  };

  // Function to validate form data
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.vehicle) {
      errors.vehicle = 'Vehicle is required';
      isValid = false;
    }
    if (!formData.manpower) {
      errors.manpower = 'Manpower is required';
      isValid = false;
    }
    if (!formData.crop_details) {
      errors.crop_details = 'Crop details are required';
      isValid = false;
    }
    if (!formData.no_of_acre) {
      errors.no_of_acre = 'Number of Acres is required';
      isValid = false;
    }
    if (!formData.duration_date) {
      errors.duration_date = 'Duration date is required';
      isValid = false;
    }
    if (!formData.address) {
      errors.address = 'Address is required';
      isValid = false;
    }
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be a 10-digit number';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      postHarvestData();
    }
  };

  return (
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ color: '#020310' }}>
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
              <div className="user-profile">
                <img src={imgBg} alt="Background" />
              </div>
              <div className="user-info">
                <h6 className="user-name mb-1">Farmer Harvest App
                </h6>
              </div>
            </div>
            <ul className="sidenav-nav ps-0">
              <li><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6>Add Harvest Requirement Details</h6>
            </div>
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Vehicle</span></div>
                      <input className="form-control" name="vehicle" value={formData.vehicle} onChange={handleInputChange} type="text" />
                      {validationErrors.vehicle && <p style={{ color: 'red' }}>{validationErrors.vehicle}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Manpower</span></div>
                      <input className="form-control" name="manpower" value={formData.manpower} onChange={handleInputChange} type="text" />
                      {validationErrors.manpower && <p style={{ color: 'red' }}>{validationErrors.manpower}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Crop Details</span></div>
                      <input className="form-control" name="crop_details" value={formData.crop_details} onChange={handleInputChange} type="text" />
                      {validationErrors.crop_details && <p style={{ color: 'red' }}>{validationErrors.crop_details}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>No of Acre</span></div>
                      <input className="form-control" name="no_of_acre" value={formData.no_of_acre} onChange={handleInputChange} type="number" />
                      {validationErrors.no_of_acre && <p style={{ color: 'red' }}>{validationErrors.no_of_acre}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Duration Date</span></div>
                      <input className="form-control" name="duration_date" value={formData.duration_date} onChange={handleInputChange} type="date" />
                      {validationErrors.duration_date && <p style={{ color: 'red' }}>{validationErrors.duration_date}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Address</span></div>
                      <input className="form-control" name="address" value={formData.address} onChange={handleInputChange} type="text" />
                      {validationErrors.address && <p style={{ color: 'red' }}>{validationErrors.address}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Mobile</span></div>
                      <input className="form-control" name="mobile" value={formData.mobile} onChange={handleInputChange} type="tel" />
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
    </div>
  );
};

export default PostHarvest;
