import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      const { token } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check credentials.');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">Log in to your Account</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-center text-sm text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta-black disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Need an account?{' '}
          <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;