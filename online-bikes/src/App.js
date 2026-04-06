import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RequireAdmin, RequireUser, GuestOnly } from './components/shared/RouteGuards';

import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import HomePage from './pages/user/HomePage';
import CartPage from './pages/user/CartPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBikesPage from './pages/admin/AdminBikesPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles.css';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest only */}
            <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

            {/* User routes */}
            <Route path="/" element={<RequireUser><HomePage /></RequireUser>} />
            <Route path="/cart" element={<RequireUser><CartPage /></RequireUser>} />

            {/* Admin routes */}
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/bikes" element={<RequireAdmin><AdminBikesPage /></RequireAdmin>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}