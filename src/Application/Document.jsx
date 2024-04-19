import React, { useEffect, useState } from 'react'
import moment from 'moment';
import swal from 'sweetalert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Document() {
  const navigate = useNavigate();
  const [applicationId, setapplicationId] = useState();
  const user_id = window.sessionStorage.getItem('UserId');

  const [AddressProof, setAddressProof] = useState();
  const [paySlip, setpaySlip] = useState()
useEffect(() => {

  return () => {
    getApplication();
  }
}, [user_id])

  function handleUploadFile(event) {
    let selectedFile = event.target.files;
    if (selectedFile.length > 0) {
      let fileToLoad = selectedFile[0];
      if (fileToLoad.type === 'application/pdf') {
        if (fileToLoad.size <= 300 * 1024) {
          if (event.target.name === 'address') {
            setAddressProof(fileToLoad);
          } else {
            setpaySlip(fileToLoad);
          }
        }
      }
    }
  }
  async function getApplication() {
    const applicationData = {
      customer_id: user_id,
      status: 'Submitted',
      submission_date: moment().format('DD-MM-YYYY')
    };
    const applicationResponse = await axios.post('http://localhost:8081/createApplication', applicationData);
    if(applicationResponse.data.status === 'Success')
    {
      setapplicationId(applicationResponse.data.application_id);
    }
    console.log('applicationResponse.data',applicationResponse.data);
    
  }

  async function handleFinish() {
    
    if (paySlip === '' || AddressProof === '') {
      swal({
        title: 'No Documents Selected',
        text: 'Please Upload all Documents',
        icon: "error",
      });
      return;
    }
    try {
      console.log('customer_id, status, submission_date',applicationId);
      let formData1 = new FormData();
      formData1.append('application_id', applicationId)
      formData1.append('documentName', 'ProofOfAddress');
      formData1.append('document', AddressProof);
      const documentsUpload = await axios.post('http://localhost:8081/UploadDocuments', formData1, {headers: {'Content-Type':'multipart/form-data'}});
      if(documentsUpload.data.status === 'Success')
      {
        let formData2 = new FormData();
        formData2.append('application_id', applicationId)
        formData2.append('documentName', 'PaySlip');
        formData2.append('document', paySlip);
        const documentsUpload2 = await axios.post('http://localhost:8081/UploadDocuments', formData2, {headers: {'Content-Type':'multipart/form-data'}});
        if(documentsUpload2.data.status === 'Success')
        {
          swal({
              title: 'Success',
              text: 'Your Application for Credit Card is Submitted',
              icon: "success",
            }).then(() => {
              navigate('/home');
            });
        }
      }
    } catch (error) {
      swal({
        title: 'Error',
        text: 'Failed to submit application',
        icon: 'error'
      });
    }
  }

  return (
    <div className="customer-Details-outer-Container">
      <div className="form">
        <input type="file" name="address" autoComplete="off" accept='.pdf' onChange={(e) => handleUploadFile(e)} />
        <label htmlFor="address" className="label-name">
          <span className="content-name">Upload Proof of Address</span>
        </label>
      </div>
      <div className="form">
        <input type="file" name="payslip" autoComplete="off" accept='.pdf' onChange={(e) => handleUploadFile(e)} />
        <label htmlFor="payslip" className="label-name">
          <span className="content-name">Upload Payslips</span>
        </label>
      </div>
      <div className="application-buttions-section">
        <button onClick={()=>navigate(-1)} className='prevButtonStyle'>Cancel</button>
        {/* <button onClick={handleFinish} style={nextButtonStyle}>Submit</button> */}
        <button onClick={handleFinish} className='nextButtonStyle'>Submit</button>
        </div>
      
    </div>
  )
}
