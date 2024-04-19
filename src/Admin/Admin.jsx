import React, { useEffect, useState } from 'react'
import CustomNavbar from '../CustomNavbar/CustomNavbar'
import axios from 'axios';
import moment from 'moment/moment';
import PDFViewer from '../Home/PDFViewer';
import Button from '../Components/Button/Button';
import './Admin.css';
import Modal from '../Components/Modal/Modal';
import swal from 'sweetalert';
export default function Admin() {
  const [Applications, setApplications] = useState([]);
  const [Document, setDocument] = useState({
    show: false,
    document: ''
  });
  useEffect(() => {

    return () => {
      loadSubmittedApplications();
    }
  }, [])
  async function loadSubmittedApplications() {
    const SubmittedApplications = await axios.get('http://localhost:8081/getSubmittedApplications');
    if (SubmittedApplications.data.status === 'Success') {
      setApplications(SubmittedApplications.data.message);
    }
  }
  async function ApproveApplication(id, status) {
    const UpdateApplication = await axios.put('http://localhost:8081/UpdateApplicationStatus', {
      id: id,
      status: status
    })
    if (UpdateApplication.data.status === 'Success') {
      swal({
        title: 'Application ' + status,
        text: 'Application is ' + status + ' Successfully',
        icon: 'success'
      }).then((value) => {
        loadSubmittedApplications();
      })
    }
  }
  function viewDocument(doc) {
    console.log(doc);
    if (Document.show) {
      setDocument({
        show: false,
        document: ''
      })
    }
    else {
      setDocument({
        show: true,
        document: doc
      })
    }

  }
  return (
    <>
      <CustomNavbar />
      {Applications.length == 0 && <div className="no-applications-message">
        Submitted Applications not found
      </div>}
      <div style={{marginLeft:'40%',marginTop:'30px'}}>
      <Button label='Show Available Credit Cards' buttonType='primary' route='/limitHandler'/>
      </div>

      {Applications.length > 0 && <center style={{ marginTop: '20px' }}>
        <table className="gridTable">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>DOB</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Address Proof</th>
              <th>PaySlip</th>
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
                <td>{value.status}</td>
                <td>{value.submission_date}</td>
                <td><Button label='view' buttonType='download' handleFunction={() => viewDocument(value.ProofOfAddress)} /></td>
                <td><Button label='view' buttonType='download' handleFunction={() => viewDocument(value.PaySlip)} /></td>
                <td><div className="action-buttons">
                  <Button label='Approve' buttonType='Approve' handleFunction={() => ApproveApplication(value.application_id, 'Approved')} />
                  <Button label='Reject' buttonType='Reject' handleFunction={() => ApproveApplication(value.application_id, 'Rejected')} />
                </div></td>

              </tr>
            ))}

          </tbody>
        </table>
      </center>}

      {Document.show && <Modal>
        <PDFViewer base64String={Document.document} />
        <div style={{ margin: 'auto' }}>
          <Button label='close' buttonType='download' handleFunction={() => { viewDocument(false) }} />
        </div>
      </Modal>}
    </>
  )
}
