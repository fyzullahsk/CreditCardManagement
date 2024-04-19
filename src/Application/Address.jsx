import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

export default function Address({ onNext }) {
    const [addressAvailable, setaddressAvailable] = useState(false);
    const navigate = useNavigate();
    const user_id = window.sessionStorage.getItem('UserId');
    const [values, setValues] = useState({
        street: '',
        city: '',
        state: '',
        zipcode: ''
    });
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    useEffect(() => {
    
      return () => {
        getCustomerAddress();
      }
    }, [user_id])
    async function getCustomerAddress() {
        const res = await axios.post('http://localhost:8081/getCustomerAddress',{user_id:user_id})
        if(res.data.status === 'Success'){
            setValues(res.data.message);
            setaddressAvailable(true);

        }
    }
    const handleNextClick = async () => {
        const hasNoErrors = Object.values(values).some(value => value === '');
        if(!hasNoErrors){
            try {
                const res = await axios.post('http://localhost:8081/addCustomerAddress', {
                    user_id: user_id,
                    ...values
                });
                if(res.data.status == "Success")
                {
                    onNext();
                }
            } catch (error) {
                console.error('Error adding customer address:', error);
            }
        }
        else{
            swal({
                title:'Invalid Address',
                text:'Enter address',
                icon:'error'
            })
        }
    };

    return (
        <div className="customer-Details-outer-Container">
        <div className="form">
            <input type="text" name="street" autoComplete="off" value={values.street} onChange={handleInputChange} readOnly={addressAvailable}/>
            <label htmlFor="street" className="label-name">
                <span className="content-name">Enter street</span>
            </label>
        </div>
        <div className="form">
            <input type="text" name="city" autoComplete="off" value={values.city} onChange={handleInputChange} readOnly={addressAvailable}/>
            <label htmlFor="city" className="label-name">
                <span className="content-name">Enter city</span>
            </label>
        </div>
        <div className="form">
            <input type="text" name="state" autoComplete="off" value={values.state} onChange={handleInputChange} readOnly={addressAvailable}/>
            <label htmlFor="state" className="label-name">
                <span className="content-name">Enter state</span>
            </label>
        </div>
        <div className="form">
            <input type="text" name="zipcode" autoComplete="off" value={values.zipcode} onChange={handleInputChange} readOnly={addressAvailable}/>
            <label htmlFor="zipcode" className="label-name">
                <span className="content-name">Enter zipcode</span>
            </label>
        </div>
        <div className="application-buttions-section">

        <button onClick={()=>navigate(-1)} className='prevButtonStyle'>Cancel</button>
        <button onClick={!addressAvailable?handleNextClick:()=>onNext()} className='nextButtonStyle'>Next</button>
        </div>
    </div>
    );
}
