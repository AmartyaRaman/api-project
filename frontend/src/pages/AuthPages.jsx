import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card-3d w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Email</label>
            <input 
              type="email" 
              className="input-3d" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Password</label>
            <input 
              type="password" 
              className="input-3d" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-3d w-full">Sign In</button>
        </form>
        <p className="mt-4 text-center">
          New here? <Link to="/register" className="font-bold underline">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password, role);
    if (success) navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card-3d w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Full Name</label>
            <input 
              type="text" 
              className="input-3d" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Email</label>
            <input 
              type="email" 
              className="input-3d" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Password</label>
            <input 
              type="password" 
              className="input-3d" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Role</label>
            <select 
              className="input-3d"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-3d w-full">Register</button>
        </form>
        <p className="mt-4 text-center">
          Joined already? <Link to="/login" className="font-bold underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};
