import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, LogOut, ArrowLeft, User } from 'lucide-react';
import api from '../../utils/api';
import '../food-partner/../../styles/profile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [likedFoods, setLikedFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user profile
        api.get('/api/user/profile')
            .then(response => {
                setProfile(response.data.user);
            })
            .catch(err => {
                console.error('Error fetching profile:', err);
            });

        // Fetch liked foods
        api.get('/api/user/liked')
            .then(response => {
                setLikedFoods(response.data.likedFoods || []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error fetching liked foods:', err);
                setIsLoading(false);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await api.get('/api/auth/user/logout');
            navigate('/user/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isLoading && !profile) {
        return (
            <main className="profile-page">
                <div className="profile-header" style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading profile...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page">
            {/* Back Button */}
            <Link to="/home" className="profile-back-link" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                marginBottom: '1rem'
            }}>
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <section className="profile-header">
                <div className="profile-meta">
                    {/* Avatar */}
                    <div className="profile-avatar" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: 'bold'
                    }}>
                        {profile?.fullName?.charAt(0)?.toUpperCase() || <User size={48} />}
                    </div>

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Full Name">
                            {profile?.fullName || 'User'}
                        </h1>
                        <p className="profile-pill profile-address" title="Email">
                            {profile?.email}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">liked</span>
                        <span className="profile-stat-value" style={{ color: '#ef4444' }}>
                            <Heart size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            {profile?.likedCount || 0}
                        </span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">saved</span>
                        <span className="profile-stat-value" style={{ color: '#f97316' }}>
                            <Bookmark size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            {profile?.savedCount || 0}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/saved" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'var(--color-surface-alt)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-text)',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>
                        <Bookmark size={18} />
                        View Saved
                    </Link>
                    <button onClick={handleLogout} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: '#ef4444',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </section>

            <hr className="profile-sep" />

            {/* Liked Foods Section */}
            <section>
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Heart size={20} style={{ color: '#ef4444' }} />
                    Your Liked Reels
                </h2>

                {likedFoods.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'var(--color-surface)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <Heart size={48} style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--color-text-secondary)' }}>No liked reels yet</p>
                        <Link to="/explore" style={{ color: '#f97316', textDecoration: 'underline' }}>
                            Explore reels →
                        </Link>
                    </div>
                ) : (
                    <div className="profile-grid">
                        {likedFoods.map((food) => (
                            <div key={food._id} className="profile-grid-item">
                                <video
                                    className="profile-grid-video"
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    src={food.video}
                                    muted
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default UserProfile;
