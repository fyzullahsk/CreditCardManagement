import React, { useEffect, useState } from 'react'
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import Button from '../Components/Button/Button';
import axios from 'axios';
import moment from 'moment';
import Modal from '../Components/Modal/Modal';
import './Admin.css';
import swal from 'sweetalert';
export default function CreditLimitUpdate() {
    const [Applications, setApplications] = useState([]);
    const [SelectedApplication, setSelectedApplication] = useState({});
    const [updateCreditlimit, setupdateCreditlimit] = useState(false);
    const [UpdatingLimit, setUpdatingLimit] = useState();
    const [error, seterror] = useState('');
    useEffect(() => {

        return () => {
            loadCreditCards();
        }
    }, [])
    async function loadCreditCards() {
        const ApprovedCreditCards = await axios.get('http://localhost:8081/getcreditCards');
        if (ApprovedCreditCards.data.status === 'Success') {
            setApplications(ApprovedCreditCards.data.message);
        }
    }

    function handleCustomerSelection(customerDetails) {
        setSelectedApplication(customerDetails);
        console.log(SelectedApplication);
        setupdateCreditlimit(true);
    }
    async function handleUpdateLimit() {
        if (UpdatingLimit === '') {
          seterror('Enter limit to update');
          return;
        } else {
          try {
            const response = await axios.put('http://localhost:8081/UpdateCreditlimit', {
              credit_card_id: SelectedApplication.credit_card_id,
              new_limit: UpdatingLimit,
              old_limit: SelectedApplication.credit_limit,
              change_timestamp: moment().format() // Ensure you format the timestamp correctly
            });
      
            if (response.data.status === 'Success') {
              swal({
                title: 'Updated',
                text: 'Credit limit is updated successfully',
                icon: 'success'
              }).then((ok) => {
                setupdateCreditlimit(false);
                seterror('');
                loadCreditCards();
              });
            }
          } catch (error) {
            console.error('Error updating credit limit:', error);
            // Handle error appropriately
            seterror('Error updating credit limit');
          }
        }
      }
      
    return (
        <>
            <CustomNavbar />
            {Applications.length == 0 && <div className="no-applications-message">
                Submitted Applications not found
            </div>}
            {Applications.length > 0 && <center style={{ marginTop: '20px' }}>
                <table className="gridTable">
                    <thead>
                        <tr>
                            <th>Applicant Name</th>
                            <th>DOB</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Credit Limit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {Object.entries(Applications).map(([userId, value], index) => (
                            <tr key={userId}>
                                <td>{value.FullName}</td>
                                <td>{moment(value.DOB).format('DD-MM-YYYY')}</td>
                                <td>{value.Email}</td>
                                <td>{value.PhoneNumber}</td>
                                <td>{value.street}, {value.city}, {value.state}, {value.zipcode}</td>
                                <td>{value.credit_limit}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Button label='Update Limit' buttonType='primary' handleFunction={() => handleCustomerSelection(value)} />
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </center>}

            {updateCreditlimit && <Modal>
                <div className="show-applicant-details">
                    <span>Applicant Name</span>
                    <span>{SelectedApplication.FullName}</span>
                </div>
                <div className="show-applicant-details">
                    <span>Credit Limit</span>
                    <span>{SelectedApplication.credit_limit}</span>
                </div>
                <div className="show-applicant-details">
                    <span>Update Credit Limit</span>
                    <div className="form " style={{ width: '100px', marginLeft: 'auto' }}>
                        <input type="number" name="credit_limit" autoComplete="off" required onChange={(e) => setUpdatingLimit(e.target.value)}/>
                        <label htmlFor="credit_limit" className="label-name">
                        </label>
                    </div>
                </div>
                <div className="error-message">{error}</div>
                <div style={{ margin: 'auto',marginTop:'20px'}} className="action-buttons">
                    <Button label='Cancel' buttonType='download' handleFunction={() => { setupdateCreditlimit(false) }} />
                    <Button label='Update' buttonType='download' handleFunction={() => { handleUpdateLimit() }} />
                </div>
            </Modal>}
            <div style={{ marginLeft: '45%',marginTop:'50px'}} >
                    <Button label='Home' buttonType='download' route='/admin' />
                </div>
        </>
    )
}
