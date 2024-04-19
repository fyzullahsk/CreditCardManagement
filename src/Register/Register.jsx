import React,{useState} from 'react';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Register.css'
import Button from '../Components/Button/Button';
import { Link ,useNavigate} from "react-router-dom";
import Auth from './Auth';
import axios from 'axios';
import swal from 'sweetalert';
export default function Register() {
  const navigate = useNavigate('');
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    FullName:'',
Email:'',
PhoneNumber:'',
Password:'',
ConfirmPassword:'',
DOB:'',
UserType:'customer'
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  async function handleOnClick() {
    const validationErrors = Auth(values);
    setErrors(validationErrors);
    const hasNoErrors = Object.values(validationErrors).every(error => error === '');
    if(hasNoErrors){
      const res = await axios.post('http://localhost:8081/register', values);
      if(res.data.status === 'Error')
      {
        swal({
              title: 'Failed',
              text: res.data.message,
              icon: "error",
            })
      }
      else{
        swal({
              title: 'Yaay!',
              text: res.data.message,
              icon: "success",
            }).then(result=>{navigate('/')})
      }

    }
  }
  return (
    <>
    <CustomNavbar />
    <div className="register-outer-container">
    <div className="title">Register</div>

    <div className="register-container">
    <div className="form">
              <input type="text" name="FullName" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="FullName" className="label-name">
                <span className="content-name">Enter Full Name</span>
              </label>
            </div>
            <div className="form">
              <input type="text" name="Email" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="Email" className="label-name">
                <span className="content-name">Enter Email</span>
              </label>
            </div>
            <div className="form">
              <input type="date" name="DOB" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="DOB" className="label-name">
                <span className="content-name">Enter D.O.B</span>
              </label>
            </div>
            <div className="form">
              <input type="number" name="PhoneNumber" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="PhoneNumber" className="label-name">
                <span className="content-name">Enter Phone Number</span>
              </label>
            </div>
            <div className="form">
              <input type="password" name="Password" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="Password" className="label-name">
                <span className="content-name">Enter Password</span>
              </label>
            </div>
            <div className="form">
              <input type="password" name="ConfirmPassword" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="ConfirmPassword" className="label-name">
                <span className="content-name">Enter Confirm Password</span>
              </label>
            </div>
      </div>
      <div className="error-container" style={{ marginTop: '20px', textAlign: 'center' }}>
            {Object.values(errors).map((error, index) => (
              <div key={index} className="error-message">{error}</div>
            ))}
          </div>
            <div className="input-buttons">
            <Button label="Sign Up" buttonType="primary" handleFunction={handleOnClick} />
            </div>
            <div className="register-section" style={{ justifyContent: 'center' }}>
            <span>Already a member?</span> <Link to={"/"}>Login</Link>
          </div>
    </div>
  </>
  )
}
