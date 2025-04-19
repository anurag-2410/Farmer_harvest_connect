import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
//import "./App.css";

import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Login from "./components/login";

import Register from  "./components/Register";
import UserHome from  "./components/UserHome";
import BuyerHome from  "./components/BuyerHome";
import ServiceHome from  "./components/ServiceHome";

import Index from './components/Index';

import AdminHome from './components/AdminHome';
import PostHarvest from './components/PostHarvest';
import ViewMyHarvest from './components/ViewMyHarvest';
import ViewAllRequest from './components/ViewAllRequest';
import PostCrop from './components/PostCrop';
import ViewMyCrop from './components/ViewMyCrop';
import ViewService from './components/ViewService';
import ViewRate from './components/ViewRate';
import UserProfile from './components/UserProfile';
import PostService from './components/PostService';
import ViewMyService from './components/ViewMyService';
import ViewHarvest from './components/ViewHarvest';
import ViewMyHarvestRequest from './components/ViewMyHarvestRequest';
import ViewMyFeedback from './components/ViewMyFeedback';
import ServiceProfile from './components/ServiceProfile';
import ViewCrop from './components/ViewCrop';
import ViewMyCropRequest from './components/ViewMyCropRequest';
import PostRate from './components/PostRate';
import ViewMyRate from './components/ViewMyRate';
import BuyerProfile from './components/BuyerProfile';
import EditBuyerProfile from './components/EditBuyerProfile';
import EditUserProfile from './components/EditUserProfile';
import EditServiceProfile from './components/EditServiceProfile';
import ViewBuyerAdmin from './components/ViewBuyerAdmin';
import ViewUserAdmin from './components/ViewUserAdmin';
import PostCropRequest from './components/PostCropRequest';
import PostFeedback from './components/PostFeedback';
import PostHarvestRequest from './components/PostHarvestRequest';
import UpdateCrop from './components/UpdateCrop';
import UpdateHarvest from './components/UpdateHarvest';
import UpdateService from './components/UpdateService';
import UpdateRate from './components/UpdateRate';
import UpdateStatusAdmin from './components/UpdateStatusAdmin';
import UpdateStatusCrop from './components/UpdateStatusCrop';
import UpdateStatusHarvest from './components/UpdateStatusHarvest';
import UploadCropImage from './components/UploadCropImage';
import UploadReceiptImage from './components/UploadReceiptImage';
import ViewAllCropRequest from './components/ViewAllCropRequest';
import ResetPassword from './components/ResetPassword';
import LicenseForm from './components/LicenseForm';
import Logout from './components/Logout';
import SellerHome from './components/SellerHome';
import AddInput from './components/AddInput';
import ManageInputs from './components/ManageInputs';
import AgriculturalMarket from './components/AgriculturalMarket';
import Checkout from './components/Checkout';
import MyOrders from './components/MyOrders';
import SellerOrders from './components/SellerOrders';

function App() {
  return (
      <div>
        <BrowserRouter>
          <Routes>
      
           <Route path='/' element={<Index />} />
           <Route path='/LicenseForm' element={<LicenseForm />} />
          
            <Route path='/login' element={<Login />} />
            <Route path='/admin_home' element={<AdminHome />} />
            <Route path='/user_home' element={<UserHome />} />
            <Route path='/post_harvest' element={<PostHarvest />} />
            <Route path='/view_my_harvest' element={<ViewMyHarvest />} />
            <Route path='/view_all_request' element={<ViewAllRequest />} />
            <Route path='/post_crop' element={<PostCrop />} />
            <Route path='/view_my_crop' element={<ViewMyCrop />} />
            <Route path='/view_all_crop_request' element={<ViewAllCropRequest />} />
            <Route path='/view_service' element={<ViewService />} />
            <Route path='/view_rate' element={<ViewRate />} />
            <Route path='/user_profile' element={<UserProfile />} />
            <Route path='/post_service' element={<PostService />} />
            <Route path='/view_my_service' element={<ViewMyService />} />
            <Route path='/view_harvest' element={<ViewHarvest />} />
            <Route path='/view_my_harvest_request' element={<ViewMyHarvestRequest />} />
            <Route path='/view_my_feedback' element={<ViewMyFeedback />} />
            <Route path='/service_profile' element={<ServiceProfile />} />
            <Route path='/view_crop' element={<ViewCrop />} />
            <Route path='/view_my_crop_request' element={<ViewMyCropRequest />} />
            <Route path='/post_rate' element={<PostRate />} />
            <Route path='/view_my_rate' element={<ViewMyRate />} />
            <Route path='/buyer_profile' element={<BuyerProfile />} />
            <Route path='/edit_buyer_profile/:id' element={<EditBuyerProfile />} />
            <Route path='/edit_user_profile/:id' element={<EditUserProfile />} />
            <Route path='/edit_service_profile/:id' element={<EditServiceProfile />} />
            <Route path='/view_buyer_admin' element={<ViewBuyerAdmin />} />
            <Route path='/view_user_admin' element={<ViewUserAdmin />} />
            <Route path='/reset_password' element={<ResetPassword />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/post_crop_request' element={<PostCropRequest />} />
            <Route path='/post_feedback' element={<PostFeedback />} />
            <Route path='/post_harvest_request' element={<PostHarvestRequest />} />
            <Route path='/update_crop/:id' element={<UpdateCrop />} />
            <Route path='/update_harvest/:id' element={<UpdateHarvest />} />
            <Route path='/update_service/:id' element={<UpdateService />} />
            <Route path='/update_rate/:id' element={<UpdateRate />} />
            <Route path='/update_status_admin/:id' element={<UpdateStatusAdmin />} />
            <Route path='/update_status_crop/:id' element={<UpdateStatusCrop />} />
            <Route path='/update_status_harvest/:id' element={<UpdateStatusHarvest />} />
            <Route path='/upload_crop_image/:id' element={<UploadCropImage />} />
            <Route path='/upload_receipt_image/:id' element={<UploadReceiptImage />} />
            <Route path='/service_home' element={<ServiceHome />} />
            <Route path='/buyer_home' element={<BuyerHome />} />
            
            {/* Agricultural Input Seller Routes */}
            <Route path='/seller_home' element={<SellerHome />} />
            <Route path='/add-input' element={<AddInput />} />
            <Route path='/manage-inputs' element={<ManageInputs />} />
            <Route path='/edit-input/:id' element={<ManageInputs />} />
            <Route path='/seller-orders' element={<SellerOrders />} />
            
            {/* Agricultural Market Routes for Farmers */}
            <Route path='/agricultural-market' element={<AgriculturalMarket />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/post-feedback/:id' element={<PostFeedback />} />
            
            <Route path='/register' element={<Register />} />
            

          </Routes>
        </BrowserRouter>
      </div>
    );
}



export default App;

{/*
unused 
import Viewlist from "./assets/unused/Viewlist";
import Edit from "./assets/unused/Edit";
import CreateBusiness from "./assets/unused/CreateBusiness";
import ViewAxios from "./assets/unused/ViewAxios";

<Route path='/viewtest' element={<Viewlist />} />            
<Route path='/axios' element={<ViewAxios />} />
<Route path='/create' element={<CreateBusiness />} />          
<Route path='/edit/:id' element={<Edit />} />

*/}