import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
export default function CreditScore({ onNext }) {
    const user_id = window.sessionStorage.getItem('UserId');
    const navigate = useNavigate();
    const [CreditScoreAvailable, setCreditScoreAvailable] = useState(false);
    const [values, setValues] = useState({
        score: '',
        assessment_date: moment().format('DD-MM-YYYY')
    });
    const nextButtonStyle = {
        backgroundColor: 'rgba(28, 43, 104, 1)',
      color: 'white',
      height: '40px',
      borderRadius: '10px',
      width: '15%',
      marginTop: '30px',
      marginBottom: '30px',
      marginLeft: '80%',
      border: 'none',
      cursor: 'pointer',
      };
      useEffect(() => {
    
        return () => {
          getCustomerScore();
        }
      }, [user_id])

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

      async function getCustomerScore() {
        const res = await axios.post('http://localhost:8081/getCustomerCreditScore',{user_id:user_id});
        if(res.data.status === 'Success'){
            setValues(res.data.message);
            setCreditScoreAvailable(true);

        }
      }
      async function handleNextClick() {
        const hasNoErrors = Object.values(values).some(value => value === '');
        if(!hasNoErrors){
            try {
                const res = await axios.post('http://localhost:8081/addCustomerCreditScore', {
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
                title:'Invalid Score',
                text:'Enter Credit Score',
                icon:'error'
            })
        }
      }
  return (
    <div className="customer-Details-outer-Container">
        <div className="form">
                <input type="number" name="score" autoComplete="off" defaultValue={values.score} readOnly={false} onChange={handleInputChange}/>
                <label htmlFor="score" className="label-name">
                    <span className="content-name">Enter Credit Score</span>
                </label>
            </div>
            <div className="form">
                <input type="text" name="assessment_date" autoComplete="off" readOnly defaultValue={values.assessment_date} />
                <label htmlFor="assessment_date" className="label-name">
                    <span className="content-name">Assesment Date</span>
                </label>
            </div>
            <div className="application-buttions-section">
        <button onClick={()=>navigate(-1)} className='prevButtonStyle'>Cancel</button>
            <button onClick={!CreditScoreAvailable?handleNextClick:()=>onNext()} className='nextButtonStyle'>Next</button>
        </div>

    </div>
  )
}
