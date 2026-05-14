/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Deals from "./components/Deals";
import Investors from "./components/Investors";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import RoleSelection from "./components/RoleSelection";
import { useUser } from "./contexts/UserContext";

function MainLayout() {
  const { user, profile, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-slate-900 bg-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Deals />
        <Investors />
        <About />
        <Contact />
      </main>
      <Footer />
      {user && !profile && <RoleSelection />}
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useUser();

  if (loading) return null;
  if (profile?.role !== 'admin') return <Navigate to="/" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

