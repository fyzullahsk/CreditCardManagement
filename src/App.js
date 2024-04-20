import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import Home from '../src/Home/Home';
import Application from './Application/Application';
import Admin from './Admin/Admin';
import Bill from './Home/Bill';
import CreditLimitUpdate from './Admin/CreditLimitUpdate';
function App() {
  return (
    
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/application" element={<Application />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/bill/:credit_card_id" element={<Bill />} />
        <Route path="/limitHandler" element={<CreditLimitUpdate />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
