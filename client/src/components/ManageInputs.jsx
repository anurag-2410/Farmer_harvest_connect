import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import "./css/modal-fix.css";
import Logout from './Logout';
import Title from './Title';

function ManageInputs() {
  const [inputs, setInputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchInputs();
  }, []);

  const fetchInputs = async () => {
    setLoading(true);
    try {
      const sellerId = localStorage.getItem('userId');
      if (!sellerId) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`http://localhost:4000/api/v1/agricultural-inputs/seller/${sellerId}`);
      setInputs(response.data);
    } catch (error) {
      setError('Failed to fetch your products. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/agricultural-inputs/${id}`);
      setInputs(inputs.filter(input => input.id !== id));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      setError('Failed to delete the product. Please try again.');
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const filterInputs = () => {
    let filtered = inputs;
    
    // Filter by type
    if (filterType !== 'All') {
      filtered = filtered.filter(input => input.type === filterType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(input => 
        input.name.toLowerCase().includes(term) ||
        input.description.toLowerCase().includes(term) ||
        input.manufacturer.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-success';
      case 'Out of Stock':
        return 'bg-warning';
      case 'Discontinued':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const filteredInputs = filterInputs();

  // Modal click handling
  useEffect(() => {
    if (showDeleteModal) {
      document.body.classList.add('modal-open');
      
      // Prevent clicks inside modal from closing it
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        modalContent.addEventListener('click', e => e.stopPropagation());
      }
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showDeleteModal]);

  // Close modal when clicking outside
  const closeModalOnOutsideClick = (e) => {
    if (e.target.classList.contains('modal')) {
      cancelDelete();
    }
  };

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Agricultural Inputs</h2>
          <Link to="/add-input" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i> Add New Product
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, description, or manufacturer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <select
                  className="form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Seed">Seeds</option>
                  <option value="Pesticide">Pesticides</option>
                  <option value="Fertilizer">Fertilizers</option>
                  <option value="Tool">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredInputs.length === 0 ? (
          <div className="alert alert-info">
            No products found. {filterType !== 'All' || searchTerm ? 'Try changing your filters.' : 'Add a new product to get started.'}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInputs.map((input) => (
                  <tr key={input.id}>
                    <td>
                      {input.images && input.images.length > 0 ? (
                        <img 
                          src={input.images[0]} 
                          alt={input.name} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center" 
                          style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-image text-muted"></i>
                        </div>
                      )}
                    </td>
                    <td>{input.name}</td>
                    <td>{input.type}</td>
                    <td>{input.price}</td>
                    <td>{input.quantity}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(input.status)}`}>
                        {input.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Link to={`/edit-input/${input.id}`} className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => confirmDelete(input.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} onClick={closeModalOnOutsideClick}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              </div>
              <div className="modal-footer" style={{ zIndex: 1060 }}>
                <button type="button" className="btn btn-secondary" onClick={cancelDelete} style={{ position: 'relative', zIndex: 1070 }}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(deleteId)} style={{ position: 'relative', zIndex: 1070 }}>Delete</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={cancelDelete} style={{ zIndex: 1040 }}></div>
        </div>
      )}

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li><Link to="/seller_home"><i className="lni lni-home"></i>Home</Link></li>
              <li className="active"><Link to="/manage-inputs"><i className="lni lni-list"></i>Products</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageInputs; 