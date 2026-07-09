import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BadgeToastProvider } from './context/BadgeToastContext';
import TabBar from './components/TabBar';

// Import all pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WaterTracker from './pages/WaterTracker';
import ExerciseLog from './pages/ExerciseLog';
import MealLog from './pages/MealLog';
import ChallengePicker from './pages/ChallengePicker';
import Leaderboard from './pages/Leaderboard';
import SquadPage from './pages/SquadPage';
import BadgeGallery from './pages/BadgeGallery';
import ChallengeFeed from './pages/ChallengeFeed';
import Profile from './pages/Profile';
import About from './pages/About';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex items-center justify-center h-screen text-white bg-[#090909]">Loading...</div>;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  return (
    <div className="min-h-screen pb-16">
      <Outlet />
      <TabBar />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Turn off protection temporarily if AuthContext isn't fully working yet, 
          but ideally this stays ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/exercise" element={<ExerciseLog />} />
          <Route path="/meals" element={<MealLog />} />
          <Route path="/challenges" element={<ChallengePicker />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/squad" element={<SquadPage />} />
          <Route path="/badges" element={<BadgeGallery />} />
          <Route path="/feed" element={<ChallengeFeed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <BadgeToastProvider>
          <AppRoutes />
        </BadgeToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
