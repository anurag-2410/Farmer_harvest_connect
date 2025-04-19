import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/style.css";
import Logout from './Logout';
import Title from './Title';

function AddInput() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: '',
    type: 'Seed',
    description: '',
    price: '',
    quantity: '',
    manufacturer: '',
    status: 'Available'
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const sellerId = localStorage.getItem('userId');
    if (!sellerId) {
      setError('You must be logged in as a seller');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', input.name);
      formData.append('type', input.type);
      formData.append('description', input.description);
      formData.append('price', input.price);
      formData.append('quantity', input.quantity);
      formData.append('manufacturer', input.manufacturer);
      formData.append('status', input.status);
      formData.append('seller', sellerId);

      // Append images
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }

      const response = await axios.post('http://localhost:4000/api/v1/agricultural-inputs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Product added successfully!');
      setInput({
        name: '',
        type: 'Seed',
        description: '',
        price: '',
        quantity: '',
        manufacturer: '',
        status: 'Available'
      });
      setImages([]);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/manage-inputs');
      }, 2000);
    } catch (error) {
      setError(error.response?.data || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
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
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4>Add New Agricultural Input</h4>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Product Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={input.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type*</label>
                    <select
                      className="form-select"
                      id="type"
                      name="type"
                      value={input.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="Seed">Seed</option>
                      <option value="Pesticide">Pesticide</option>
                      <option value="Fertilizer">Fertilizer</option>
                      <option value="Tool">Tool</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description*</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={input.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">Price (₹)*</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={input.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="quantity" className="form-label">Quantity*</label>
                      <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        value={input.quantity}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="manufacturer" className="form-label">Manufacturer</label>
                    <input
                      type="text"
                      className="form-control"
                      id="manufacturer"
                      name="manufacturer"
                      value={input.manufacturer}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={input.status}
                      onChange={handleChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="images" className="form-label">Product Images</label>
                    <input
                      type="file"
                      className="form-control"
                      id="images"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <small className="text-muted">You can select multiple images (max 5)</small>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => navigate('/manage-inputs')}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li><Link to="/seller_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Link to="/manage-inputs"><i className="lni lni-list"></i>Products</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddInput; 