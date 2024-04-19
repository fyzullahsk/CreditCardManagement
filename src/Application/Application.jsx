import React from 'react';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Application.css';
import CustomerDetails from './CustomerDetails';
import Address from './Address';
import Steps from './Steps';
import Document from './Document';
import CreditScore from './CreditScore';
export default function Application() {
  return (
    <>
      <CustomNavbar />
      <div className="application-outer-container">
        <Steps>
          <CustomerDetails />
          <Address />
          <CreditScore/>
          <Document/>
        </Steps>
      </div>
    </>
  );
}
