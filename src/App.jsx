import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const isLoggedIn=()=>Boolean(localStorage.getItem('rekyc_admin_token'));
function Protected({children}){return isLoggedIn()?children:<Navigate to="/login" replace/>}
export default function App(){
 return <Routes>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/dashboard" element={<Protected><DashboardPage/></Protected>}/>
  <Route path="*" element={<Navigate to={isLoggedIn()?'/dashboard':'/login'} replace/>}/>
 </Routes>
}
