import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required.';
        if (!formData.lastName) newErrors.lastName = 'Last name is required.';
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setBackendError('');
        setSuccessMessage('');

        try {
            const response = await axios.post("http://localhost:3000/api/auth/user/register", {
                fullName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password
            }, {
                withCredentials: true
            });

            console.log(response.data);
            setSuccessMessage('✅ Registration successful, redirecting…');
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            const message = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            setBackendError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card" role="region" aria-labelledby="user-register-title">
                <header>
                    <h1 id="user-register-title" className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join to explore and enjoy delicious meals.</p>
                </header>
                <nav className="auth-alt-action" style={{ marginTop: '-4px' }}>
                    <strong style={{ fontWeight: 600 }}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
                </nav>

                {backendError && <div className="auth-error-box">{backendError}</div>}
                {successMessage && <div className="auth-success-box">{successMessage}</div>}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="two-col">
                        <div className="field-group">
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" name="firstName" placeholder="Jane" autoComplete="given-name" value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <p className="auth-error-text">{errors.firstName}</p>}
                        </div>
                        <div className="field-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" name="lastName" placeholder="Doe" autoComplete="family-name" value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <p className="auth-error-text">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <p className="auth-error-text">{errors.email}</p>}
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" value={formData.password} onChange={handleChange} />
                        {errors.password && <p className="auth-error-text">{errors.password}</p>}
                    </div>
                    <button className="auth-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <div className="auth-alt-action">
                    Already have an account? <Link to="/user/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
