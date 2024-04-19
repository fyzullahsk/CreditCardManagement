import React,{useState} from 'react';
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Login.css';
import Button from '../Components/Button/Button';
import swal from 'sweetalert';
export default function Login() {
  const navigate = useNavigate('');
  const [values, setValues] = useState({
Email:'',
Password:''
  })
  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
    
  }
  function handleOnClick() {
    const hasNoErrors = Object.values(values).every(value => value === '');
    console.log(hasNoErrors);
if(!hasNoErrors){
  axios.get('http://localhost:8081/login', { params: { Email: values.Email,Password: values.Password } })
    .then(res=>{
      console.log(res.data);
      if(res.data.status != 'Error')
      {
        window.sessionStorage.setItem('UserType',res.data.status);
        window.sessionStorage.setItem('UserId',res.data.Id)
        res.data.status === 'admin'?navigate('/admin'):navigate('/home')
      }
    })
    .catch(err=>{
      swal({
        title:'Failed',
        text:'No User found with email and password',
        icon:'error'
      })
    });
}
else{
  swal({
    title: 'Invalid Input',
    text: 'Please enter all the details',
    icon: "error",
  })
}

  }
  return (
    <>
      <CustomNavbar />
      <div className="login-outer-container">
      <div className="title">Login</div>
      <div className="form">
              <input type="text" name="Email" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="Email" className="label-name">
                <span className="content-name">Enter Email</span>
              </label>
            </div>
            <div className="form">
              <input type="password" name="Password" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="Password" className="label-name">
                <span className="content-name">Enter Password</span>
              </label>
            </div>
            <div className="login-input-buttons">
            <Button label="Login" buttonType="primary" handleFunction={handleOnClick} />
            </div>
            <div className="register-section" style={{ justifyContent: 'center' }}>
            <span>Already a member?</span> <Link to={"/register"}>Register</Link>
          </div>
      </div>
    </>
  );
}
