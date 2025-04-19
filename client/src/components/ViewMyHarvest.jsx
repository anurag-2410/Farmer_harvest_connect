import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const ViewMyHarvest = () => {
  const [itemId, setHarvestId] = useState('');
  const [itemData, setHarvestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocationOnServer(latitude, longitude);
        },
        (error) => {
          console.error(`Error getting user location: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  async function updateLocationOnServer(latitude, longitude) {
    const url = `http://localhost:4000/api/v1/harvest/map/${itemId}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: latitude, long: longitude }),
      });
      if (response.ok) {
        alert("Location updated successfully!");
        console.log("Location updated successfully!");
        // Avoid reloading the window. Consider using state updates instead.
      } else {
        console.error(`Error updating location: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating location: ${error.message}`);
    }
  }

  useEffect(() => {
    if (itemId) {
      getUserLocation();
    }
  }, [itemId]);

  const Removefunction = (id) => {
    if (window.confirm('Do you want to remove?')) {
      fetch(`http://localhost:4000/api/v1/harvest/${id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => {
        // Refresh data instead of reloading the page
        setHarvestData((prevData) => prevData.filter(item => item._id !== id));
        setFilteredData((prevData) => prevData.filter(item => item._id !== id));
        window.location.reload();
      }).catch((err) => {
        console.log(err.message);
      });
    }
  };

  const LoadEdit = (id) => {
    navigate(`/update_harvest/${id}`);
  };

  useEffect(() => {
    const fetchHarvestData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/harvest/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const useremail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));
        const filteredHarvest = data.filter((item) => item.useremail === useremail);
        setHarvestData(filteredHarvest);
        setFilteredData(filteredHarvest);
      } catch (error) {
        console.error('Error fetching harvest data:', error.message);
        alert('An error occurred while fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchHarvestData();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = itemData.filter((item) =>
      Object.values(item).some((field) =>
        field.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

 
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
          <li><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
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
            <h6>View My Harvest Details</h6>
			
          </div>
          <div className="row g-3" >
              <div className="top-search-form">
                <form>
                  <input className="form-control"  type="text"  placeholder="Search..."     value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}  />
                  <button type="submit"><i className="fa fa-search"></i></button>
                </form>
              </div>
            </div>

            {/* Show if Null data in table */}

            {filteredData.length > 0 ? (
            <div className="row" style={{marginTop:10}}>
            {/* Get Details Map field and id */}          
                {filteredData.map((item) => (
              <div key={item._id} className="col-12 col-md-6">                                        
              <div className="card product-card" style={{marginBottom:10}}>
                <div className="card-body"    >
          
                      <a className="product-title d-block"  >Vehicle :  <b> {item.vehicle} </b></a>
                      <a className="product-title d-block"  >Manpower:  <b>  {item.manpower} </b></a>
                      <a className="product-title d-block"  >Crop Details:{item.crop_details}  </a>
                      <a className="product-title d-block"  >No of Acre: {item.no_of_acre} </a>
                      <a className="product-title d-block"  >Date:  {item.duration_date} </a>	
                      <a className="product-title d-block"  >Address: {item.address} </a>
                      <a className="product-title d-block"  >Mobile: {item.mobile}  </a>
                     <a className="product-title d-block"  >Lat: {item.lat}  </a>
                      <a className="product-title d-block"  >Long: {item.long}  </a>
                      
                    </div>
                  </div>   
                <a className="btn btn-danger" onClick={() => { LoadEdit(item.id) }}>Edit</a>
                  <a className="btn btn-danger" onClick={() => { Removefunction(item.id) }}>Delete</a>
                 <a className="btn btn-danger" onClick={() => setHarvestId(item.id)}>Geo Map</a> 

                 <a className="btn btn-danger" target="_blank"
                  href={`https://maps.google.com/?q=${item.lat},${item.long}`}>
                  Show Map
                </a>
              </div>
              ))}

              
        </div>
                  ) : (
                    <p>No item details found for the specified vendor email or search term.</p>
            )}

           {/* Show if Null data in table */}

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


</div>
</div>
  )
}

export default ViewMyHarvest