import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth-shared.css';
import AuthLayout from '../../components/auth/AuthLayout';
import api from '../../utils/api';

const UserLogin = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/api/auth/user/login", {
        email,
        password
      });

      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userId', response.data.user?._id || response.data.user?.id || '');
      navigate("/home");

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        {/* Role Toggle */}
        <div className="auth-role-toggle">
          <Link to="/user/login" className="auth-role-btn auth-role-btn--active">User</Link>
          <Link to="/food-partner/login" className="auth-role-btn">Food Partner</Link>
        </div>

        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>

        {error && <div className="auth-error-box">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-alt-action">
          New here? <Link to="/user/register">Create account</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;
