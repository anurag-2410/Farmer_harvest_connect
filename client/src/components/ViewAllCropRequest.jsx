import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import axios from 'axios';
import "./js/jquery.min.js";
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewAllCropRequest = () => {
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/croprequest/');
        const data = response.data;

        const userEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));
        
        const filteredRequest = data.filter(request => request.useremail === userEmail);
        setRequestData(filteredRequest);
        setFilteredData(filteredRequest);
      } catch (error) {
        console.error('Error fetching request data:', error.message);
      }
    };

    fetchRequestData();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = requestData.filter(request =>
      Object.values(request).some(field =>
        field.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  
  const UpdateStatus = (id) => {
    navigate("/update_status_crop/" + id);
  }
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  
  return (
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{color:'#020310'}}>
            <img src={imgSmall} alt=""/> <Title />
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
            <div className="user-profile"><img src={imgBg} alt=""/></div>
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

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6>Crop Request Details</h6>
            </div>
            <div className="row g-3">
              <div className="top-search-form">
                <form>
                  <input className="form-control" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
                  <button type="submit"><i className="fa fa-search"></i></button>
                </form>
              </div>
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              {filteredData.map((request) => (
                <div key={request._id} className="col-12 col-md-6">
                  <div className="card product-card" style={{ marginBottom: 40 }}>
                    <div className="card-body">
                      <p className="product-title d-block">Date: {new Date(request.dateCreated).toLocaleDateString('en-GB', timeOptions)}</p>
                      <a className="product-title d-block"  >Crop Name:  <b> {request.cropname} </b></a>
              
                      <p className="product-title d-block">Name: <b>{request.name}</b></p>
                      <p className="product-title d-block">Mobile: {request.mobile}</p>
                      <p className="product-title d-block">Bidding Details: {request.bidding_details}</p>
                      <p className="product-title d-block">Lat: {request.lat}</p>
                      <p className="product-title d-block">Long: {request.long}</p>
                      <p className="product-title d-block" style={{ color: 'orange' }}>Status: {request.status}</p>
                      <p className="product-title d-block" style={{ color: 'orange' }}>Report: {request.report}</p>
                     
                      
                      <td>
  {/* Display the event image */}Receipt:
  
  {request.receipt && (
    <a href={`http://localhost:4000/${request.receipt}`} target="_blank" rel="noopener noreferrer" className="product-title d-block">

      <img src={`http://localhost:4000/${request.receipt}`} alt="receipt" style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
    </a>
  )}
 
</td><br></br>  </div>
</div>

                  
                        <a 
                          className="btn btn-danger" 
                          onClick={() => UpdateStatus(request._id)} 
                          style={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                          Update Status
                        </a>

                        <a 
                          className="btn btn-danger" 
                          href={`https://maps.google.com/?q=${request.lat},${request.long}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          Show Map
                        </a>
                     
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active"> <Link to="/user_home" ><i className="lni lni-home"></i>Home </Link> </li>
              <li><Logout /></li> 
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllCropRequest;
