import React, { useState } from 'react';
import { FaBell } from "react-icons/fa";

import {
  MDBBadge,
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarBrand,
} from 'mdb-react-ui-kit';
import './CustomNavbar.css';
import { useNavigate } from 'react-router-dom';

export default function CustomNavbar({Application_status}) {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const  UserType = window.sessionStorage.getItem('UserType');
  const user_id = window.sessionStorage.getItem('UserId');
  const [openNavRight, setOpenNavRight] = useState(false);

  function handleLogout() {
    window.sessionStorage.setItem('UserId','');
    window.sessionStorage.setItem('UserType','');
    navigate('/');
}
  return (
    <>
    <MDBNavbar expand='lg' light className='navbar'>
      <MDBContainer fluid>
        <MDBNavbarBrand href={UserType === 'admin'?'/admin':'/home'}>
          <img src='assets/logo.png' height='50' alt='' loading='lazy' />
          Credit Card
        </MDBNavbarBrand>

        <MDBNavbarToggler
          type='button'
          data-target='#navbarRightAlignExample'
          aria-controls='navbarRightAlignExample'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenNavRight(!openNavRight)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse
          navbar
          open={openNavRight}
          className='d-flex w-auto mb-3 justify-content-end'
        >
          {user_id !== '' && <MDBNavbarNav right fullWidth={false} className='mb-2 mb-lg-0'>
            {Application_status === 'Approved' && <MDBNavbarItem>
          <FaBell className='bell-icon' onClick={()=>{setShowNotification(!showNotification)}}/>
        <MDBBadge color='danger' notification pill>
          1
        </MDBBadge>
            
            </MDBNavbarItem>}
          
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' onClick={handleLogout}>
                Logout
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>}
          
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
    {showNotification && <div className="notification-container">
    congratulations!!!<br/>
    Your Credit Card is Approved
    </div>}
    
    </>
  );
}
