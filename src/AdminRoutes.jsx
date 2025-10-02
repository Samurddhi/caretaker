import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./Components/Dashboard";
import Orders from './Components/Orders';
import ParadiseItemList from './Components/ParadiseItemList';
import Orders from './Components/Orders';

function AdminRoutes() {
  return (
    <Routes>
      {/* Redirect /admin to /admin/dashboard */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<Dashboard />} />
      <Route path="orders" element={<Orders/>} />
      <Route path="paradiseitemlist" element={<ParadiseItemList />} />
    </Routes>
  );
}

export default AdminRoutes;
