// server.mjs
import express from "express";
import mysql from "mysql";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@123",
  database: "creditcardmanagementsystem",
});
const upload = multer({ storage: multer.memoryStorage() })
con.connect((err) => {
  if (err) {
    console.log("Error in Connection");
    console.log(err);
  } else {
    console.log("SQL server Connected Successfully");
  }
});

app.post("/register", (req, res) => {
  const { FullName, DOB, Email, PhoneNumber, Password, UserType } = req.body;
  con.query('SELECT COUNT(*) AS count FROM user WHERE Email = ? ', [Email],(regerr,regres)=>{
    console.log(regres[0].count);
    if(regres[0].count == 0){
      con.query('INSERT INTO user (FullName, DOB, Email, PhoneNumber, Password) VALUES (?, ?, ?, ?, ?)',[FullName, DOB, Email, PhoneNumber, Password],(insErr,insRes)=>{
        if(regres){
          res.json({ status: "Success", message:'User Registered' });
        }
      })
    }
    else{
      res.json({ status: "Error", message:'User already found' });
    }
  })
});


app.get("/login", (req, res) => {
  const { Email, Password } = req.query;
  let sql = "SELECT * FROM customer WHERE Email = ? AND Password = ?";
  con.query(sql, [Email, Password], (err, result) => {
    if (err) {
      return res.status(500).json({ status: "Error", error: "Error in running query" });
    }
    if (result.length > 0) {
      const { user_id, role_name } = result[0];
      return res.json({ status: role_name, Id: user_id });
    } else {
      return res.status(404).json({ status: "Error", message: "User Not found" });
    }
  });
});




app.post("/getUserApplications", (req, res) => {
  const { user_id } = req.body;
  let sql = "SELECT * FROM creditcardapplications WHERE user_id = ?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error in running query" });
    }
    if (result.length > 0) {
      return res.json({ status: "Success", message: result });
    }
    return res.json({ status: "Error", message: "No Previous Applications Found" });
  });
});

app.post("/getCustomerDetails", (req, res) => {
  const { user_id } = req.body;
  let sql = "SELECT * FROM user WHERE user_id = ?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error in running query" });
    }
    if (result.length > 0) {
      return res.json({ status: "Success", message: result[0] });
    }
    return res.json({ status: "Error", message: "No User Found" });
  });
});

app.post("/getCustomerAddress", (req, res) => {
  const { user_id } = req.body;
  let sql = "select * from Address where customer_id = ?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error retrieving address" });
    }
    if (result.length > 0) {

      return res.json({ status: "Success", message: result[0] });
    }
    return res.json({ status: "Error" });
  });
});



app.post("/getCustomerCreditScore", (req, res) => {
  const { user_id } = req.body;
  let sql = "select * from Credit_Score where customer_id = ?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error retrieving address" });
    }
    if (result.length > 0) {

      return res.json({ status: "Success", message: result[0] });
    }
    return res.json({ status: "Error" });
  });
});


app.post("/addCustomerCreditScore", (req, res) => {
  const { user_id, score, assessment_date } = req.body;
  let sql = "INSERT INTO Credit_Score (customer_id, score, assessment_date) VALUES (?, ?, ?)";
  con.query(sql, [user_id, score, assessment_date], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error inserting address" });
    }
    return res.json({ status: "Success", message: "Address added successfully" });
  });
});


app.post("/addCustomerAddress", (req, res) => {
  const { user_id, street, city, state, zipcode } = req.body;
  let sql = "INSERT INTO Address (customer_id, street, city, state, zipcode) VALUES (?, ?, ?, ?, ?)";
  con.query(sql, [user_id, street, city, state, zipcode], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error inserting address" });
    }
    return res.json({ status: "Success", message: "Address added successfully" });
  });
});

app.post('/createApplication', (req, res) => {
  const { customer_id, status, submission_date } = req.body;
  console.log('createApplication',customer_id, status, submission_date);
  con.query('SELECT application_id FROM application WHERE customer_id = ?',[customer_id],(err, result)=>{
    if(result.length > 0){
      return res.json({ status: 'Success', application_id: result[0].application_id });
    }
    else{
      con.query(`INSERT INTO Audit_Log (user_id, action) SELECT ${customer_id}, 'Credit Card Applied' FROM dual WHERE NOT EXISTS ( SELECT 1 FROM application WHERE customer_id = ${customer_id})`);
       con.query('INSERT INTO application (customer_id, status, submission_date) VALUES (?, ?, ?)',[customer_id, status, submission_date],((ApplicationInsertionError, ApplicationInsertionResult)=>{
        if(ApplicationInsertionError)
        {
          return res.json({ status: 'Error', message: 'Failed to create application' });
        }
        const application_id = ApplicationInsertionResult.insertId;
        return res.json({ status: 'Success', application_id: application_id });
       }))
    }
  })
});


app.post("/UploadDocuments", upload.single('document'), (req, res) => {
  const { application_id, documentName } = req.body;
  console.log(application_id, documentName);
  const document = req.file.buffer.toString('base64');
con.query('select * from application_document where application_id = ? and document_name = ?',[application_id,documentName],(documentsError,documentsResult)=>{
  if(documentsResult.length > 0)
  {
    console.log('doc found');
    con.query('UPDATE application_document SET document = ? WHERE application_id = ? and document_name = ?',[document, application_id, documentName],(DocUpdateError,DocUpdateResult)=>{
      console.log(DocUpdateError,DocUpdateResult);
      if (DocUpdateError) {
        return res.json({ status: 'Error', message: 'Failed to Update document' });
      }
      return res.json({ status: 'Success', message: 'Document uUpdated successfully' });
    })
  }
  else
  {
    con.query('INSERT INTO application_document (application_id, document_name, document) VALUES (?, ?, ?)', [application_id, documentName, document], (docerr, docres) => {
      if (docerr) {
        return res.json({ status: 'Error', message: 'Failed to insert document' });
      }
      return res.json({ status: 'Success', message: 'Document uploaded successfully' });
    })
  }
})
});

app.get("/getCreditCardDetails", (req, res) => {
  const { user_id } = req.query;
  let sql = "SELECT * FROM CreditCard WHERE customer_id = ?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error fetching credit card details" });
    }
    return res.json({ status: "Success", message: result });
  });
});

app.get("/getRewardDetails", (req, res) => {
  const { credit_card_id } = req.query;
  let sql = "SELECT * FROM credit_card_reward WHERE credit_card_id = ?";
  con.query(sql, [credit_card_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error fetching credit card details" });
    }
    return res.json({ status: "Success", message: result });
  });
});

app.get("/getCreditCardTransactions", (req, res) => {
  const { credit_card_id } = req.query;
  let sql = "SELECT * FROM credit_card_transaction WHERE credit_card_id = ? and YEAR(transaction_date) = YEAR(CURRENT_DATE())  AND MONTH(transaction_date) = MONTH(CURRENT_DATE())";
  con.query(sql, [credit_card_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error fetching credit card details" });
    }
    return res.json({ status: "Success", message: result });
  });
});

app.get("/getRewardsCatalogue", (req, res) => {
  let sql = "SELECT * FROM Reward_Catalogue";
  con.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error fetching credit card details" });
    }
    return res.json({ status: "Success", message: result });
  });
});

app.get("/getCreditCardBill", (req, res) => {
  const { credit_card_id } = req.query;
  let sql = "SELECT SUM(amount) as Bill FROM credit_card_transaction WHERE credit_card_id = ? AND YEAR(transaction_date) = YEAR(CURRENT_DATE())  AND MONTH(transaction_date) = MONTH(CURRENT_DATE())";
  con.query(sql, [credit_card_id], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error fetching credit card details" });
    }
    console.log(result[0]);
    if(result[0].Bill == null){
      return res.json({ status: "Error", message: `you don't have any transactions to pay bill off` });
    }
    else{
      return res.json({ status: "Success", message: result[0] });
    }
  });
});

app.post("/payCreditCardbill", (req, res) => {
  const { credit_card_id, amount, payment_date} = req.body;
  con.query('INSERT INTO payment (credit_card_id, amount, payment_date) VALUES (?, ?, ?)', [credit_card_id, amount, payment_date], (docerr, docres) => {
    if (docerr) {
      return res.json({ status: 'Error', message: 'Failed to pay bill' });
    }
    return res.json({ status: 'Success', message: 'Credit Card Bill Paid successfully' });
  })
});

app.post("/addTransaction", (req, res) => {
  const { credit_card_id, description, amount,transaction_date} = req.body;
  console.log(credit_card_id, description, amount,transaction_date);
  con.query('INSERT INTO credit_card_transaction (credit_card_id, description, amount, transaction_date) VALUES (?, ?,?,?)', [credit_card_id, description, amount,transaction_date], (docerr, docres) => {
    if (docerr) {
      return res.json({ status: 'Error', message: 'Failed to insert document' });
    }
    return res.json({ status: 'Success', message: 'Transaction added successfully' });
  })
});

app.get("/getSubmittedApplications", (req, res) => {
  let sql = "SELECT * FROM creditcardapplications where status = 'Submitted' or status = 'Rejected'";
  con.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error fetching credit card details" });
    }
    return res.json({ status: "Success", message: result });
  });
});

// UPDATE application SET status = ? WHERE application_id = ?

app.put('/UpdateApplicationStatus', (req, res) => {
  const { id, status } = req.body;
  con.query('UPDATE application SET status = ? WHERE application_id = ?', [status, id], (err, queryResult) => {
    if (err) {
      return res.json({ status: "Error", error: "Error Updating Application Status" });
    }
    return res.json({ status: "Success" });
  });
});

app.get('/getcreditCards',(req,res)=>{
  let sql = "SELECT * FROM approvedapplications";
  con.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error fetching credit card details" });
    }
    return res.json({ status: "Success", message: result });
  });
})

app.put('/UpdateCreditlimit', (req, res) => {
  const { credit_card_id, new_limit, old_limit, change_timestamp } = req.body;
  con.query('UPDATE creditcard SET credit_limit = ? WHERE credit_card_id = ?', [new_limit, credit_card_id], (err, queryResult) => {
    if (err) {
      return res.status(500).json({ status: "Error", error: "Error Updating Credit Limit" });
    }
      return res.json({ status: "Success" });
  });
});


app.listen(8081, () => {
  console.log("Server is running on port 8081");
});