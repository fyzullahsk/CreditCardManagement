import React, { useEffect, useState } from 'react'
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Home.css';
import axios from 'axios';
import Button from '../Components/Button/Button';
// import PDFViewer from './PDFViewer';
import moment from 'moment';
import Modal from '../Components/Modal/Modal'
export default function Home() {
  const [AddTransaction, setAddTransaction] = useState(false);
  const [data, setdata] = useState({});
  const [CreditCardDetails, setCreditCardDetails] = useState({});
  const user_id = window.sessionStorage.getItem('UserId');
  const [error, seterror] = useState();
  const [showCreditCardDetails, setshowCreditCardDetails] = useState(false);
  const [rewardDetails, setrewardDetails] = useState([]);
  const [ShowReward, setShowReward] = useState(false);
  const [Transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showRewardsCatalouge, setshowRewardsCatalouge] = useState(false);
  const [RewardsCatalouge, setRewardsCatalouge] = useState([]);
  const [TransactionDetails, setTransactionDetails] = useState({
    credit_card_id:'',
    description:'',
    amount:0,
    error:''
  })
  useEffect(() => {
    return () => {
      getApplicationDetails();
    }
  }, [])
  async function getApplicationDetails() {
    const res = await axios.post('http://localhost:8081/getUserApplications', { user_id: user_id });
    if (res.data.status === 'Error') {
      seterror(res.data.message);
    }
    else {
      console.log(res.data.message);
      setdata(res.data.message[0]);
    }
  }
  async function getCreditCardDetails() {
    const CreditCard = await axios.get('http://localhost:8081/getCreditCardDetails', { params: { user_id: user_id } });
    if (CreditCard.data.status === 'Success') {
      setshowCreditCardDetails(true);
      setCreditCardDetails(CreditCard.data.message[0]);
      console.log(CreditCard.data.message);
    }
  }
  async function getRewardPoints() {
    const Reward = await axios.get('http://localhost:8081/getRewardDetails', { params: { credit_card_id: CreditCardDetails.credit_card_id } });
    console.log(Reward.data.message);
    if (Reward.data.status === 'Success') {
      setShowReward(true);
      setrewardDetails(Reward.data.message);
    }
  }

  async function getCreditCardTransactions() {
    const Reward = await axios.get('http://localhost:8081/getCreditCardTransactions', { params: { credit_card_id: CreditCardDetails.credit_card_id } });
    console.log(Reward.data.message);
    if (Reward.data.status === 'Success') {
      setShowTransactions(true);
      setTransactions(Reward.data.message);
    }
  }

  async function getRewards() {
    const Reward = await axios.get('http://localhost:8081/getRewardsCatalogue');
    console.log(Reward.data.message);
    if (Reward.data.status === 'Success') {
      console.log(Reward.data.message);
      setshowRewardsCatalouge(true);
      setRewardsCatalouge(Reward.data.message);
    }
  }
  function handleTransaction() {
    if(AddTransaction)
    {
      setAddTransaction(false);
      setTransactionDetails({
        description: '',
        amount: 0,
        error: ''
      });
            
    }
    else
    {
      setAddTransaction(true);
    }
  }
  function addvaluestoTransaction(event) {
    setTransactionDetails({ ...TransactionDetails, [event.target.name]: event.target.value });
    
  }
  async function handleAddTransaction() {
    if(TransactionDetails.description ==='' && TransactionDetails.amount === '')
    {
      TransactionDetails.error = 'Enter transaction Details';
    }
    else
    {
      const AddTransaction = await axios.post('http://localhost:8081/addTransaction',{credit_card_id: CreditCardDetails.credit_card_id,description:TransactionDetails.description,amount:TransactionDetails.amount,transaction_date:moment()});
      if(AddTransaction.data.status === 'Success'){
        handleTransaction();
        getCreditCardTransactions();
      }
      
    }

  }
  return (
    <>
      <CustomNavbar Application_status={data.status}/>
      {error && (
        <div className="no-applications-message">
          {error}
          <div style={{ marginLeft: '40%', marginTop: '50px' }}>
            <Button label='Apply' buttonType='primary' route='/application' />
          </div>
        </div>
      )}
      <div className="customer-details-outer-container">
        <div className="customer-details">
          {Object.entries(data).map(([key, value]) => (
            <>
              {key !== 'PaySlip' && key !== 'ProofOfAddress' && key !== 'user_id' && (
                <div className='customer-details-section' key={key}>
                  <span>{key}</span>
                  {key != 'status' && <span>{key === 'DOB' ? moment(value).format('DD-MM-YYYY') : value}</span>}
                  {key === 'status' && <span className={value != 'Approved' ? 'not-approved' : 'approved'}>{value}</span>}
                </div>
              )}
              {/* {(key === 'PaySlip' || key === 'ProofOfAddress') && (
      <div className='customer-details-documents-section' key={key} style={{display:'grid'}}>
        <span>{key}</span>
        <PDFViewer base64String={value} />
      </div>
    )} */}
            </>
          ))}
        </div>
        {data.status === 'Approved' && <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
          <Button label='Show Card Details' buttonType='primary' handleFunction={getCreditCardDetails} />
          <Button label='Rewards' handleFunction={getRewards} buttonType='primary' />
          {CreditCardDetails.credit_card_id && (
            <>
              <Button label='Points' handleFunction={getRewardPoints} buttonType='primary' />
              <Button label='Card Transactions' handleFunction={getCreditCardTransactions} buttonType='primary' />
              <Button label='Add Transaction' handleFunction={handleTransaction} buttonType='primary' />
              <Button label='Pay Bill' route={`/bill/${CreditCardDetails.credit_card_id}`} buttonType='primary' />
              <Button label='Close All Tables' buttonType='primary' handleFunction={() => { window.location.reload() }} />
            </>
          )}
        </div>}
        {showCreditCardDetails && <center style={{ marginTop: '20px' }}>
          <table className="gridTable">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>DOB</th>
                <th>Phone Number</th>
                <th>Credit Limit</th>
                <th>Issue Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.FullName}</td>
                <td>{moment(data.DOB).format('DD-MM-YYYY')}</td>
                <td>{data.PhoneNumber}</td>
                <td>{CreditCardDetails.credit_limit}</td>
                <td>{moment(CreditCardDetails.issue_date).format('DD-MM-YYYY')}</td>
              </tr>
            </tbody>
          </table>
        </center>
        }
        {ShowReward && rewardDetails.length > 0 &&
          <center style={{ marginTop: '20px' }}>
            <table className="gridTable">
              <thead>
                <tr>
                  <th>Reward Points</th>
                  <th>Issued Date</th>
                  <th>Expiry Date</th>
                  <th>Reward Status</th>
                </tr>
              </thead>
              <tbody>
                {rewardDetails.map((value, index) => (
                  <tr key={index}> {/* Added key attribute to each row */}
                    <td>{value.reward_points}</td>
                    <td>{moment(value.reward_date).format('DD-MM-YYYY')}</td>
                    <td>{moment(value.expiry_date).format('DD-MM-YYYY')}</td>
                    <td className={moment(value.expiry_date).isAfter(moment(), 'day') ? 'approved' : 'not-approved'}>
                      {moment(value.expiry_date).isAfter(moment(), 'day') ? 'Available' : 'Expired'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        }
        {showTransactions && Transactions.length === 0 && <p className='not-approved' style={{textAlign:'center'}}>No Transactions Found</p>}
        {showTransactions && Transactions.length > 0 && <center style={{ marginTop: '20px' }}>
            <table className="gridTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Transaction Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Transactions.map((value, index) => (
                  <tr key={index}>
                    <td>#{index+1}</td>
                    <td>{value.description}</td>
                    <td>{moment(value.transaction_date).format('DD-MM-YYYY')}</td>
                    <td>{value.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>}
          {showRewardsCatalouge && <center style={{ marginTop: '20px' }}>
            <table className="gridTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Points Required</th>
                </tr>
              </thead>
              <tbody>
                {RewardsCatalouge.map((value, index) => (
                  <tr key={index}>
                    <td>#{index+1}</td>
                    <td>{value.item_name}</td>
                    <td>{value.points_required}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>}
          {AddTransaction && <Modal>
            <div className="modal-add-transaction">
            <div className="form">
              <input type="text" name="description" autoComplete="off" required  defaultValue={TransactionDetails.description} onChange={(e)=>{addvaluestoTransaction(e)}}/>
              <label htmlFor="description" className="label-name">
                <span className="content-name">Enter Description</span>
              </label>
            </div>
            <div className="form">
              <input type="text" name="amount" autoComplete="off" required defaultValue={TransactionDetails.amount} onChange={(e)=>{addvaluestoTransaction(e)}}/>
              <label htmlFor="amount" className="label-name">
                <span className="content-name">Enter Amount</span>
              </label>
            </div>
            </div>
            {TransactionDetails.error && <div className="error-message">{TransactionDetails.error}</div>}
            
            <div className='Modal-button'>
            <Button label='Cancel' handleFunction={handleTransaction} buttonType='primary' />
            <Button label='Add' handleFunction={handleAddTransaction} buttonType='primary' />
            </div>
            </Modal>}
      </div>
    </>
  )
}
