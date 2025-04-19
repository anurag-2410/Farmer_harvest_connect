import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate ,Link } from 'react-router-dom';

import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";

const Logout = () => {
  const history = useNavigate ();

  const handleLogout = () => {
    // Delete the cookies
    Cookies.remove('email');
    Cookies.remove('vendoremail');
    Cookies.remove('adminemail');
    Cookies.remove('token'); // Add other cookies to delete if needed

    // Redirect to the login page or any other desired route
    //history.push('/');
     // Delete the token from localStorage
    localStorage.removeItem('token');

    alert('Logout Successful!');
    window.location.href = "/";
  };

  return (
    <div>

    <Link to="/" onClick={handleLogout}  ><i className="lni lni-power-switch"></i>  Logout</Link>
                
    </div>
  );
};


export default Logout;
