import React, { useEffect, useState } from 'react'
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Home.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../Components/Button/Button';
import swal from 'sweetalert';
import moment from 'moment';
export default function Bill({}) {
    const {credit_card_id} = useParams();
    const [Bill, setBill] = useState();
    const [error, seterror] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
      return () => {
        getBill();
      }
    }, [credit_card_id])
    async function getBill() {
        const bill = await axios.get('http://localhost:8081/getCreditCardBill',{ params: { credit_card_id: credit_card_id } });
        if(bill.data.status === 'Error'){
            seterror(bill.data.message);
            console.log(bill.data.message);
        }
        else{

            setBill(bill.data.message.Bill);
        }
    }
    async function handleBillPayment() {
        const bill = await axios.post('http://localhost:8081/payCreditCardbill',{ credit_card_id: credit_card_id,amount : Bill ,payment_date:moment().format('DD-MM-YYYY')});
        if(bill.data.status === 'Success')
        {
            swal ({
                title:'Success',
                text:'Bill paid Successfully',
                icon:'success'
            }).then(ok=>{
                navigate('/home')
            })
        }
    }
  return (
    <>
    <CustomNavbar/>
    <div className="customer-details-outer-container">
            {Bill && 
            <>
        <div className="error-message" style={{textAlign:'center',margin:'30px',fontSize:'large'}}>You are only permitted to pay the full amount owed.</div>
            
            <div className="bill-details">
            <div className="customer-details-section billing">
                <span>Utilized Amount</span>
                <span>{Bill}</span>
            </div>
            <div className="customer-details-section billing">
                <span>Pay Amount</span>
                <div className="form billing-amount">
              <input type="number" name="amount" autoComplete="off" required value={Bill} />
              <label htmlFor="amount" className="label-name">
              </label>
            </div>
            </div>
        </div>
            </>
            }
        {error && <div className='not-approved no-bill-message' >{error}</div>}
        <div className="bills-button-section">
        <Button label='Home' buttonType='primary' route='/home' />
        {Bill && <Button label='Pay' buttonType='primary' handleFunction={handleBillPayment}/>}
        </div>
    </div>
    </>
  )
}
