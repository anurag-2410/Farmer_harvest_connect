import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";
{/*
import "./js/waypoints.min.js";
import "./js/jquery.easing.min.js";
import "./js/owl.carousel.min.js";
import "./js/jquery.magnific-popup.min.js";
*/}
import imgTruck from "./img/tractor.png";
import imgCrop from "./img/wheat.png";
import imgMyCrop from "./img/leaf.png";

import imgFeed from "./img/feedback.png";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";

import imgOther from "./img/other.png";
import imgMy from "./img/my.png";
import imgAdd from "./img/add.png";
import imgClip from "./img/clipboard.png";
import imgProfile from "./img/man.png";
import Logout from './Logout';
import Title from './Title';

const UserHome = () => {
  return (
    <div>
        <div>
      
        <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
    
        <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
            <div className="logo-wrapper" style={{color:'#020310'}}><img src={imgSmall} alt=""/> <Title /> </div>
        
            <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas"><span></span><span></span><span></span></div>
        </div>
        </div>  

{/* tabindex="-1" */}
        <div className="offcanvas offcanvas-start suha-offcanvas-wrap"  id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
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
          <li><Link to="/service_home"><i className="lni lni-home"></i>Home</Link></li>
          <li><Logout /></li>  
          </ul>
      </div>
    </div>
      </div>
    </div>
    <div className="page-content-wrapper">
      <div className="top-products-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between">
            <h6>Service Provider Home</h6>
          </div>
         
       
        
            <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgAdd} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/post_service">
                   Post Service</Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>
            <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgTruck} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/view_my_service">
                  View My Service </Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>
          <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgMy} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/view_harvest">
                   View Harvest Details  </Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>
            <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgOther} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/view_my_harvest_request">
                   My Request  </Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>
            <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgFeed} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/view_my_feedback">
                   View Feedback </Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>

          <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgProfile} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/service_profile">
                   My Profile  </Link> 
                    </div>
                </div>
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
                    <li className="active"> <Link to="/service_home" ><i className="lni lni-home"></i>Home </Link> </li>
                    <li><Logout /></li> 
                    
                
                  </ul>
                </div>
              </div>
            </div>


</div>
</div>
  )
}

export default UserHome