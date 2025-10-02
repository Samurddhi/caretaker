import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import Home from "./pages/home";
import HealthTracking from "./pages/HealthTracking";
import DietPlan from "./pages/DietPlan";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <div>
       <Routes>
  <Route path="/home" element={<Home />} />
  <Route path="/health-tracking" element={<HealthTracking />} />
  <Route path="/diet-plan" element={<DietPlan />} />
  <Route path="/appointments" element={<Appointments />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="*" element={<Navigate to="/home" />} /> {/* default fallback */}
</Routes>

      </div>
    </>
  );
}

export default App;
