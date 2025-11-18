import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";

import 'bootstrap/dist/css/bootstrap.min.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
