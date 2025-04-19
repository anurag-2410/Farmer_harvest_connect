import React from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import { FaTractor, FaSeedling, FaStore, FaUserPlus, FaShoppingBasket, FaBookReader, FaExternalLinkAlt } from "react-icons/fa";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import imgBack from "./img/bg-img/wall.png";
import Title from './Title.jsx';

const Index = () => {
  return (
    <div>
      {/* Header Section */}
      <div className="header-area bg-success py-2 shadow-sm" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper d-flex align-items-center text-white">
            <img src={imgSmall} alt="Farmer Harvest Connect Logo" className="me-2" /> <Title />
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar */}
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap bg-dark text-white" id="suhaOffcanvas">
        <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas"></button>
        <div className="offcanvas-body">
          <div className="sidenav-profile text-center">
            <div className="user-profile"><img src={imgBg} alt="Background" className="rounded-circle shadow-sm" /></div>
            <div className="user-info mt-3">
              <h6 className="user-name">Farmer Harvest Connect App</h6>
            </div>
          </div>
          <ul className="sidenav-nav ps-0 mt-3">
            <li><Link to="/register" className="text-white"><FaUserPlus className="me-2" /> Register</Link></li>
            <li><Link to="/login" className="text-white"><FaStore className="me-2" /> Login</Link></li>
            <li><Link to="/agricultural-market" className="text-white"><FaShoppingBasket className="me-2" /> Agricultural Market</Link></li>
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container text-center mt-5 pt-5">
        <h2 className="fw-bold text-success">Welcome to Farmer Harvest Connect</h2>
        <p className="lead text-muted">
          Your digital marketplace for a bounty of fresh, locally-sourced fruits and vegetables.
          Our user-friendly platform ensures a hassle-free experience, allowing you to explore,
          connect, and purchase with confidence.
        </p>
        <div className="single-hero-slide mt-3">
          <img src={imgBack} className="img-fluid rounded shadow" alt="Agricultural Background" />
        </div>
      </div>


      {/* About Section */}
      <div className="container mt-5 p-4 bg-light rounded shadow text-center">
        <h3 className="text-success">About Farmer Harvest Connect</h3>
        <p>
          Farmer Harvest Connect is a digital B2B market solution that brings together Farmers and Industrial Buyers.
          We do not buy or sell crops and are not brokers. Instead, we provide you the ability to market your crop via our platform.
        </p>
        <p>
          We open the door to thousands of approved buyers and sellers. Post your crop bid as a registered buyer,
          or create your crop offer as a platform-verified seller. Through our rigorous customer compliance,
          we ensure that only reliable users gain access to our digital marketplace.
        </p>
      </div>

      {/* Educational Content Section */}
      <div className="container mt-5 p-4 bg-light rounded shadow">
        <div className="row">
          <div className="col-md-8">
            <h3 className="text-success">Farming Education</h3>
            <h5 className="text-dark mt-3">Sustainable Farming Practices</h5>
            <p>
              Sustainable farming practices focus on producing crops and livestock while having minimal impact on the environment. These methods conserve water, reduce pollution, minimize soil erosion, and increase soil fertility, all while maintaining profitable farm income.
            </p>
            <p>
              Key sustainable farming techniques include:
            </p>
            <ul>
              <li>Crop rotation and diversification to improve soil health</li>
              <li>Integrated pest management (IPM) to reduce chemical use</li>
              <li>Water conservation and efficient irrigation systems</li>
              <li>Use of organic fertilizers and natural soil amendments</li>
              <li>Agroforestry and cover cropping to prevent soil erosion</li>
            </ul>
            
            <h5 className="text-dark mt-3">Modern Agricultural Technologies</h5>
            <p>
              The adoption of modern technologies has revolutionized farming in India. Precision agriculture, smart irrigation systems, and mobile apps for farmers have made farming more efficient and profitable. These technologies help farmers:
            </p>
            <ul>
              <li>Monitor crop health and predict disease outbreaks</li>
              <li>Optimize water and fertilizer usage</li>
              <li>Access weather forecasts and market prices</li>
              <li>Connect directly with buyers, eliminating middlemen</li>
              <li>Implement data-driven decision making for better yields</li>
            </ul>
          </div>
          <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
            <div className="card border-success mb-4 w-100">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Agroecological Learning Resources</h5>
              </div>
              <div className="card-body text-center">
                <p>Access quality learning videos in local languages that promote agroecological knowledge for fair, healthy and resilient food systems.</p>
                <a 
                  href="https://www.accessagriculture.org/our-mission" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-success btn-lg w-100"
                >
                  <FaBookReader className="me-2" /> Access Agriculture <FaExternalLinkAlt className="ms-1" size={12} />
                </a>
                <p className="mt-3 small text-muted">Access Agriculture enables co-creation and exchange of agroecological knowledge through quality learning videos in local languages using digital tools and innovative scaling models.</p>
              </div>
            </div>
            <div className="card border-warning w-100">
              <div className="card-header bg-warning">
                <h5 className="mb-0">Agricultural Research & Education</h5>
              </div>
              <div className="card-body">
                <p>Explore India's Department of Agricultural Research and Education (DARE) resources for comprehensive agricultural knowledge and educational programs.</p>
                <a 
                  href="https://dare.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline-warning"
                >
                  Visit DARE Website <FaExternalLinkAlt className="ms-1" size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="product-categories-wrapper py-5">
        <div className="container text-center">
          <h4 className="fw-bold text-success">Get Started</h4>
          <div className="row g-3 mt-3">
            <div className="col-4">
              <Link to="/login" className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center">
                <FaTractor className="me-2" /> Farmers Login
              </Link>
            </div>
            <div className="col-4">
              <Link to="/register" className="btn btn-warning btn-lg w-100 d-flex align-items-center justify-content-center">
                <FaSeedling className="me-2" /> Register
              </Link>
            </div>
            <div className="col-4">
              <Link to="/login" className="btn btn-info btn-lg w-100 d-flex align-items-center justify-content-center text-white">
                <FaShoppingBasket className="me-2" /> Seller Login
              </Link>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-muted">Are you an agricultural input seller? <Link to="/register" className="text-success">Register here</Link> to start selling your products.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;