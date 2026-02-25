import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Home from "./pages/Home";

import StaffLogin from "./pages/Staff_login";

import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminProducts from "./pages/AdminProducts";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FeedbackPage from "./pages/FeedbackPage";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Updates from "./pages/Updates";
import Roadmap from "./pages/Roadmap";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("staff_role"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/login" element={<StaffLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/products" element={<AllProducts />} />

        {/* SHOPPING */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/feedback/:orderId" element={<FeedbackPage />} />

        {/* STAFF DASHBOARD */}
        <Route path="/staff-dashboard" element={<StaffDashboard />} />


        {/* ADMIN DASHBOARD */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/admin/products" element={<AdminProducts />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
