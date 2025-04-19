import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import imgfolder from "./img/login.png";
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [cookies, setCookie] = useCookies(['email']); // Use cookies to store the email
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Farmer'); // Default role updated
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Function to extract userId from JWT token
  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded.userId || ''; // Check for id field first
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false); // Stop loading
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/users/login', {
        email,
        password,
        role
      });

      if (response.status === 200) {
        const { token, role, status, userId } = response.data;

        // Use HTTP-only cookie instead of localStorage (if implemented)
        // document.cookie = `token=${token}; HttpOnly`;

        // Navigate based on role and status
        switch (role) {
          case 'Admin':
            setCookie('adminemail', email, { path: '/' , sameSite: 'strict' });
            navigate('/admin_home');
            break;
          case 'service_provider': // Keep this for backward compatibility
            setCookie('serviceemail', email, { path: '/' , sameSite: 'strict' });
            navigate(status === 'Pending' ? '/service_home' : '/login');
            break;
          case 'Farmer':
            setCookie('email', email, { path: '/' , sameSite: 'strict' });
            navigate(status === 'Pending' ? '/user_home' : '/login');
            break;
          case 'buyer': // Keep this for backward compatibility
            setCookie('buyeremail', email, { path: '/' , sameSite: 'strict' });
            navigate(status === 'Approved' ? '/buyer_home' : '/login');
            break;
          case 'Seller':
            setCookie('selleremail', email, { path: '/' , sameSite: 'strict' });
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId || getUserIdFromToken(token));
            navigate('/seller_home');
            break;
          default:
            setError('Invalid role.');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <title>Onroad Vehicle Break Down Assistance</title>

      <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
        <div className="background-shape"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-9 col-md-7 col-lg-6 col-xl-5">
              <img className="big-logo" src={imgfolder} alt="Logo" />
              <div className="register-form mt-5 px-4">
                <form onSubmit={handleLogin}>
                  <div className="form-group text-start mb-4">
                    <span>Email</span>
                    <label htmlFor="email"><i className="lni lni-user"></i></label>
                    <input
                      className="form-control"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="info@example.com"
                      aria-required="true"
                    />
                  </div>

                  <div className="form-group text-start mb-4">
                    <span>Password</span>
                    <label htmlFor="password"><i className="lni lni-lock"></i></label>
                    <input
                      className="form-control"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="password"
                      aria-required="true"
                    />
                  </div>

                  <div className="form-group text-start mb-4">
                    <span>Role</span>
                    <select id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="form-control">
                      <option value="Farmer">Farmer</option>
                      <option value="Admin">Admin</option>
                      <option value="service_provider">Service Provider</option> 
                      <option value="buyer">Buyer</option>
                      <option value="Seller">Agricultural Input Seller</option>
                    </select>
                  </div>

                  <button className="btn btn-warning btn-lg w-100" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>

                  {error && <p style={{ color: 'white' }}>{error}</p>}
                </form>
              </div>

              <div className="login-meta-data">
                <a className="forgot-password d-block mt-3 mb-1" href="/reset_password">Forgot Password?</a>
                <p className="mb-0">Don't have an account? <Link to="/register" className="ms-1">Register Now</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
