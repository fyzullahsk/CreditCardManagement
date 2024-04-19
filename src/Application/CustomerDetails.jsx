import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function CustomerDetails({ onNext }) {
    const user_id = window.sessionStorage.getItem('UserId');
    const navigate = useNavigate();
    const [values, setValues] = useState({
        FullName: '',
        DOB: '',
        PhoneNumber: ''
    });
    useEffect(() => {
        loadCustomerDetails();
    }, [user_id]);

    async function loadCustomerDetails() {
        try {
            const res = await axios.post('http://localhost:8081/getCustomerDetails', { user_id: user_id });
            if (res.data.message) {
                setValues(res.data.message);
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    }

    return (
        <div className="customer-Details-outer-Container">
            <div className="form">
                <input type="text" name="FullName" autoComplete="off" readOnly value={values.FullName} />
                <label htmlFor="FullName" className="label-name">
                    <span className="content-name">Full Name</span>
                </label>
            </div>
            <div className="form">
                <input type="date" name="DOB" autoComplete="off" readOnly value={values.DOB ? moment(values.DOB).format('YYYY-MM-DD') : ''} />
                <label htmlFor="DOB" className="label-name">
                    <span className="content-name">D.O.B</span>
                </label>
            </div>
            <div className="form">
                <input type="number" name="PhoneNumber" autoComplete="off" readOnly value={values.PhoneNumber} />
                <label htmlFor="PhoneNumber" className="label-name">
                    <span className="content-name">Enter Phone Number</span>
                </label>
            </div>
            
            <div className="application-buttions-section">
        <button onClick={()=>navigate(-1)} className='prevButtonStyle'>Cancel</button>
        <button onClick={onNext} className='nextButtonStyle'>Next</button>
        </div>
        </div>
    );
}
