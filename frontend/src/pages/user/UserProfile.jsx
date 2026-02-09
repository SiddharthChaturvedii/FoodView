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
                // Error handled silently
            });

        // Fetch liked foods
        api.get('/api/user/liked')
            .then(response => {
                setLikedFoods(response.data.likedFoods || []);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await api.get('/api/auth/user/logout');
            navigate('/user/login');
        } catch (error) {
            // Error handled silently
        }
    };

    if (isLoading && !profile) {
        return (
            <main className="profile-page">
                <div className="profile-header" style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p style={{ marginTop: '1rem', color: '#888' }}>Loading profile...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page">
            {/* Back Button */}
            <Link to="/home" className="profile-back-link">
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <section className="profile-header">
                <div className="profile-meta">
                    {/* Avatar */}
                    <div className="profile-avatar">
                        {profile?.fullName?.charAt(0)?.toUpperCase() || <User size={48} />}
                    </div>

                    <div className="profile-info">
                        <h1 className="profile-business">
                            {profile?.fullName || 'User'}
                        </h1>
                        <p className="profile-pill profile-address">
                            {profile?.email}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">liked</span>
                        <span className="profile-stat-value" style={{ color: '#ef4444' }}>
                            <Heart size={24} />
                            {profile?.likedCount || 0}
                        </span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">saved</span>
                        <span className="profile-stat-value" style={{ color: '#f97316' }}>
                            <Bookmark size={24} />
                            {profile?.savedCount || 0}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/saved" className="profile-action-btn profile-action-btn--secondary">
                        <Bookmark size={18} />
                        View Saved
                    </Link>
                    <button onClick={handleLogout} className="profile-action-btn profile-action-btn--danger">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </section>

            <hr className="profile-sep" />

            {/* Liked Foods Section */}
            <section>
                <h2 className="profile-section-title">
                    <Heart size={20} style={{ color: '#ef4444' }} />
                    Your Liked Reels
                </h2>

                {likedFoods.length === 0 ? (
                    <div className="profile-empty-state">
                        <Heart size={48} style={{ color: '#444', marginBottom: '1rem' }} />
                        <p>No liked reels yet</p>
                        <Link to="/explore">
                            Explore reels →
                        </Link>
                    </div>
                ) : (
                    <div className="profile-grid">
                        {likedFoods.map((food) => (
                            <div key={food._id} className="profile-grid-item">
                                <video
                                    className="profile-grid-video"
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
