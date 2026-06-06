import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppDashboard from "./pages/dashboard";
import AppLogin from "./pages/(auth)/login";
import AppRegister from "./pages/(auth)/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<AppDashboard />} />
        <Route path="/login" element={<AppLogin />} />
        <Route path="/register" element={<AppRegister />} />
      </Routes>
    </BrowserRouter>
  )
}
