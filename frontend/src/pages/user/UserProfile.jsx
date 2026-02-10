import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, LogOut, ArrowLeft, User, Pencil, X, Camera } from 'lucide-react';
import api from '../../utils/api';
import '../food-partner/../../styles/profile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [likedFoods, setLikedFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '' });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/user/profile')
            .then(response => {
                setProfile(response.data.user);
                setEditForm({ fullName: response.data.user.fullName || '' });
            })
            .catch(() => { });

        api.get('/api/user/liked')
            .then(response => {
                setLikedFoods(response.data.likedFoods || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const handleLogout = async () => {
        try {
            await api.get('/api/auth/user/logout');
            navigate('/user/login');
        } catch (error) { /* noop */ }
    };

    const openEditModal = () => {
        setEditForm({ fullName: profile?.fullName || '' });
        setPhotoPreview(null);
        setShowEditModal(true);
    };

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            if (editForm.fullName !== profile.fullName) {
                formData.append('fullName', editForm.fullName);
            }
            if (fileInputRef.current?.files[0]) {
                formData.append('profilePhoto', fileInputRef.current.files[0]);
            }

            const response = await api.put('/api/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfile(prev => ({ ...prev, ...response.data.user }));
            setShowEditModal(false);
        } catch (error) {
            // could show error toast
        } finally {
            setIsSaving(false);
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
            <Link to="/home" className="profile-back-link">
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <section className="profile-header">
                <div className="profile-meta">
                    {/* Avatar */}
                    <div className="profile-avatar">
                        {profile?.profilePhoto ? (
                            <img
                                src={profile.profilePhoto}
                                alt={profile.fullName}
                                className="profile-avatar-img"
                            />
                        ) : (
                            <svg className="profile-avatar-default" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                        )}
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
                    <button onClick={openEditModal} className="profile-action-btn profile-action-btn--primary">
                        <Pencil size={18} />
                        Edit Profile
                    </button>
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

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="profile-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="profile-modal-header">
                            <h2>Edit Profile</h2>
                            <button
                                className="profile-modal-close"
                                onClick={() => setShowEditModal(false)}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="profile-modal-form">
                            {/* Photo Upload */}
                            <div className="profile-modal-photo-section">
                                <div
                                    className="profile-modal-photo"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {(photoPreview || profile?.profilePhoto) ? (
                                        <img
                                            src={photoPreview || profile.profilePhoto}
                                            alt="Profile"
                                            className="profile-avatar-img"
                                        />
                                    ) : (
                                        <svg className="profile-avatar-default" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                        </svg>
                                    )}
                                    <div className="profile-modal-photo-overlay">
                                        <Camera size={20} />
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoSelect}
                                    style={{ display: 'none' }}
                                />
                                <span className="profile-modal-photo-label">Tap to change photo</span>
                            </div>

                            {/* Name */}
                            <div className="profile-modal-field">
                                <label htmlFor="edit-fullName">Full Name</label>
                                <input
                                    id="edit-fullName"
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    placeholder="Your name"
                                />
                            </div>

                            {/* Email (read only) */}
                            <div className="profile-modal-field">
                                <label htmlFor="edit-email">Email</label>
                                <input
                                    id="edit-email"
                                    type="email"
                                    value={profile?.email || ''}
                                    disabled
                                    className="profile-modal-field--disabled"
                                />
                                <small style={{ color: '#999', fontSize: '0.75rem' }}>Email cannot be changed</small>
                            </div>

                            <button
                                type="submit"
                                className="profile-modal-submit"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default UserProfile;
