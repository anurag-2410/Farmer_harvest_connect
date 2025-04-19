import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const UpdateStatusCrop = () => {
  const { id } = useParams(); 
  const [editedRequest, setEditedRequest] = useState({
    status: '',
    report: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/croprequest/${id}`);
        if (response.status === 200) {
          setEditedRequest({
            status: response.data.status || '',
            report: response.data.report || '',
          });
        } else {
          setError('Error fetching request details');
        }
      } catch (error) {
        setError('Error fetching request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRequest(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`http://localhost:4000/api/v1/croprequest/status/${id}`, editedRequest, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Status updated successfully');
        window.location.href = "/view_all_crop_request";
      } else {
        setError('Failed to update status');
      }
    } catch (error) {
      setError('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ color: '#020310' }}>
            <img src={imgSmall} alt="" /> <Title />
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
            <div className="user-profile"><img src={imgBg} alt="" /></div>
            <div className="user-info">
              <h6 className="user-name mb-1">Lost & Found Items Finder App</h6>
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
              <h6>Update Status</h6>
            </div>
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleUpdateRequest}>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Update Status</span></div>
                      <select name="status" id="status" value={editedRequest.status} onChange={handleInputChange}>
                        <option value="Pending">Pending</option>
                        <option value="Accept">Accept</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Report</span></div>
                      <input className="form-control" name="report" id="report" value={editedRequest.report} onChange={handleInputChange} type="text" />
                    </div>
                    <button className="btn btn-success w-100" type="submit" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
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
              <li className="active"><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusCrop;
