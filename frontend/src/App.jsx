import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <nav className="border-b-4 border-black mb-8 py-4 bg-white sticky top-0 z-10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-colors px-2">
          TASK.BOX
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold uppercase text-sm">
            <User size={18} /> {user.name} ({user.role})
          </div>
          <button onClick={logout} className="btn-3d flex items-center gap-2 text-sm px-4">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen font-sans selection:bg-black selection:text-white">
          <Navbar />
          <main className="container mx-auto px-6 pb-20">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'border-2 border-black rounded-none font-bold uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
            }} 
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
