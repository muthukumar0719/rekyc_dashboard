import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import PaymentsPage from './pages/PaymentsPage';
import TrashPage from './pages/TrashPage';
import ComingSoonPage from './pages/ComingSoonPage';

const isLoggedIn=()=>Boolean(localStorage.getItem('rekyc_admin_token'));
function Protected({children}){return isLoggedIn()?children:<Navigate to="/login" replace/>}
export default function App(){
 return <Routes>
  <Route path="/login" element={<LoginPage/>}/>
  <Route element={<Protected><Layout/></Protected>}>
   <Route path="/dashboard" element={<DashboardPage/>}/>
   <Route path="/clients" element={<ClientsPage/>}/>
   <Route path="/payments" element={<PaymentsPage/>}/>
   <Route path="/upload" element={<ComingSoonPage title="Upload" section="UPLOAD"/>}/>
   <Route path="/users" element={<ComingSoonPage title="User Management" section="USERS"/>}/>
   <Route path="/audit-logs" element={<ComingSoonPage title="Audit Log" section="AUDIT"/>}/>
   <Route path="/trash" element={<TrashPage/>}/>
  </Route>
  <Route path="*" element={<Navigate to={isLoggedIn()?'/dashboard':'/login'} replace/>}/>
 </Routes>
}
