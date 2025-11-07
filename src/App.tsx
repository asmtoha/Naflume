import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import SellingHighlight from './components/SellingHighlight';
import SalesPage from './components/SalesPage';
import DocsPage from './components/DocsPage';
import Dashboard from './components/Dashboard';
import Vision from './components/Vision';
import UserGuide from './components/UserGuide';
import Contact from './components/Contact';
import PublicProgressPage from './components/PublicProgressPage';
import CacheManager from './components/CacheManager';
import Store from './components/Store';
import AdminStore from './components/AdminStore';
import ProductDetail from './components/ProductDetail';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/" />;
};

// Landing Page Component
const LandingPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Redirect to dashboard if user is already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10">
        <Header />
        <SellingHighlight />
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CacheManager>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/user-guide" element={<UserGuide />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/offer" element={<SalesPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:slug" element={<ProductDetail />} />
              <Route path="/progress/:userId" element={<PublicProgressPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/store" 
                element={
                  <ProtectedRoute>
                    <AdminStore />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </CacheManager>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
