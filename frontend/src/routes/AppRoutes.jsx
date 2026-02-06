import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import LandingPage from '../pages/general/LandingPage';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import UserProfile from '../pages/user/UserProfile';
import ClaimDonation from '../pages/general/ClaimDonation';
import Mission from '../pages/general/Mission';

import Annapurna from '../pages/general/Annapurna';

const ProtectedRoute = ({ children }) => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        return <Navigate to="/user/login" replace />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/user/login" replace />} />

                {/* Homepage (after login) */}
                <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
                <Route path="/annapurna" element={<ProtectedRoute><Annapurna /></ProtectedRoute>} />
                <Route path="/claim-donation/:id" element={<ProtectedRoute><ClaimDonation /></ProtectedRoute>} />

                {/* App Content Routes */}
                <Route path="/explore" element={<ProtectedRoute><Home /><BottomNav /></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute><Saved /><BottomNav /></ProtectedRoute>} />
                <Route path="/create-food" element={<ProtectedRoute><CreateFood /></ProtectedRoute>} />
                <Route path="/food-partner/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* User Profile */}
                <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/mission" element={<Mission />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes