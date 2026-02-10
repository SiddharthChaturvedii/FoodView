import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth-shared.css';
import AuthLayout from '../../components/auth/AuthLayout';
import api from '../../utils/api';

const FoodPartnerLogin = () => {
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
      const response = await api.post("/api/auth/food-partner/login", {
        email,
        password
      });

      // Store user info for profile ownership checks
      localStorage.setItem('userRole', 'foodPartner');
      localStorage.setItem('userId', response.data.foodPartner._id || response.data.foodPartner.id);
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        {/* Role Toggle */}
        <div className="auth-role-toggle">
          <Link to="/user/login" className="auth-role-btn">User</Link>
          <Link to="/food-partner/login" className="auth-role-btn auth-role-btn--active">Food Partner</Link>
        </div>

        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>

        {error && <div className="auth-error-box">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" required />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" required />
          </div>
          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-alt-action">
          New partner? <Link to="/food-partner/register">Create an account</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default FoodPartnerLogin;
