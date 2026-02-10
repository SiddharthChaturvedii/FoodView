import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../utils/api'
import { PlusCircle, MapPin, Phone, Mail, Grid, Utensils, AlertCircle, RefreshCw, Share2, Pencil, X, Camera } from 'lucide-react'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('posts')
    const [shareText, setShareText] = useState('Share')
    const [isOwner, setIsOwner] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState({})
    const [photoPreview, setPhotoPreview] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (!id) return;

        setLoading(true);

        // Check if current user is the owner of this profile
        const userRole = localStorage.getItem('userRole');
        const currentUserId = localStorage.getItem('userId');
        setIsOwner(userRole === 'foodPartner' && currentUserId === id);

        api.get(`/api/food-partner/${id}`)
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems || [])
                setLoading(false)
            })
            .catch(err => {
                setError("Failed to load profile.")
                setLoading(false)
            })
    }, [id])

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2000);
    }

    const openEditModal = () => {
        setEditForm({
            name: profile?.name || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            totalMeals: profile?.totalMeals || 0,
            customersServed: profile?.customersServed || 0
        });
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
            // Only send changed fields
            if (editForm.name !== profile.name) formData.append('name', editForm.name);
            if (editForm.phone !== profile.phone) formData.append('phone', editForm.phone);
            if (editForm.address !== profile.address) formData.append('address', editForm.address);
            formData.append('totalMeals', editForm.totalMeals);
            formData.append('customersServed', editForm.customersServed);
            if (fileInputRef.current?.files[0]) {
                formData.append('profilePhoto', fileInputRef.current.files[0]);
            }

            const response = await api.put('/api/food-partner/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfile(prev => ({ ...prev, ...response.data.foodPartner }));
            setShowEditModal(false);
        } catch (error) {
            // could show error toast
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFF5E1] flex flex-col items-center justify-center p-4">
                <div className="bg-white border border-[#DBC1A0] p-8 rounded-3xl flex flex-col items-center max-w-sm text-center shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-3">
                        <Link to="/home" className="px-5 py-2.5 bg-[#FFF5E1] border border-[#DBC1A0] text-gray-800 font-semibold rounded-full hover:bg-[#E8B878]/20 transition-colors">
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={18} /> Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FFF5E1] text-[#1A1A1A] font-sans">
            {/* Header Navigation */}
            <div className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center border-b border-[#DBC1A0]">
                <Link to="/home" className="group flex items-center gap-2">
                    <span className="text-xl font-black text-orange-600 uppercase tracking-tight">
                        FoodView
                    </span>
                </Link>
                <div className="w-6"></div>
            </div>

            <main className="max-w-4xl mx-auto w-full">
                {/* Profile Header */}
                <header className="px-4 py-8 md:px-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
                                {profile?.profilePhoto ? (
                                    <img
                                        className="w-full h-full rounded-full object-cover border-4 border-white"
                                        src={profile.profilePhoto}
                                        alt={profile.name || "Profile Avatar"}
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full border-4 border-white bg-gray-100 flex items-center justify-center">
                                        <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-grow text-center md:text-left flex flex-col gap-4 w-full">
                        {/* Name & Actions */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                {profile?.name || "Food Partner"}
                            </h1>
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {isOwner && (
                                    <>
                                        <Link to="/create-food" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                                            <PlusCircle size={16} />
                                            <span>Create</span>
                                        </Link>
                                        <button
                                            onClick={openEditModal}
                                            className="bg-white hover:bg-gray-50 border border-[#DBC1A0] text-gray-800 px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
                                        >
                                            <Pencil size={14} />
                                            Edit Profile
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="bg-white hover:bg-gray-50 border border-[#DBC1A0] text-gray-800 px-5 py-2 rounded-full text-sm font-semibold transition-colors min-w-[90px] flex items-center gap-2 justify-center"
                                >
                                    <Share2 size={14} />
                                    {shareText}
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex justify-center md:justify-start gap-8 md:gap-12 py-4">
                            <div className="text-center">
                                <span className="font-bold text-2xl block text-gray-900">{videos.length}</span>
                                <span className="text-[#4A351D] text-sm uppercase tracking-wider font-medium">posts</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-2xl block text-gray-900">{profile?.totalMeals || '—'}</span>
                                <span className="text-[#4A351D] text-sm uppercase tracking-wider font-medium">meals</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-2xl block text-gray-900">{profile?.customersServed || '—'}</span>
                                <span className="text-[#4A351D] text-sm uppercase tracking-wider font-medium">served</span>
                            </div>
                        </div>

                        {/* Bio / Details */}
                        <div className="hidden md:flex flex-col gap-2 mt-2">
                            {profile?.address && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <MapPin size={14} className="text-orange-500" />
                                    {profile.address}
                                </div>
                            )}
                            {profile?.email && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Mail size={14} className="text-orange-500" />
                                    {profile.email}
                                </div>
                            )}
                            {profile?.phone && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Phone size={14} className="text-orange-500" />
                                    {profile.phone}
                                </div>
                            )}
                        </div>

                        {/* Mobile Bio */}
                        <div className="md:hidden text-sm text-gray-600 mt-2">
                            <div className="font-medium text-gray-700">{profile?.address}</div>
                        </div>
                    </div>
                </header>

                {/* Content Tabs */}
                <div className="border-t border-[#DBC1A0] mt-2 bg-white/50">
                    <div className="flex justify-center gap-16">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex items-center gap-2 border-t-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'posts' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'} -mt-px`}
                        >
                            <Grid size={14} /> Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex items-center gap-2 border-t-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'menu' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'} -mt-px`}
                        >
                            <Utensils size={14} /> Menu
                        </button>
                    </div>
                </div>

                {/* Grid or Menu */}
                {activeTab === 'posts' ? (
                    <div className="grid grid-cols-3 gap-2 md:gap-3 pb-20 p-2 md:p-4">
                        {videos.length > 0 ? (
                            videos.map((v, index) => (
                                <div key={v._id || index} className="relative aspect-[3/4] group cursor-pointer bg-[#E8B878]/30 rounded-xl overflow-hidden border border-[#DBC1A0]">
                                    <video
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        src={v.video}
                                        controls={false}
                                        muted
                                    ></video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 flex flex-col items-center justify-center text-gray-500">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#DBC1A0] flex items-center justify-center mb-4 bg-white">
                                    <Utensils size={32} className="text-orange-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your First Reel</h3>
                                <p className="text-gray-500 mb-4">Showcase your culinary creations</p>
                                <Link to="/create-food" className="text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors">
                                    Create your first post →
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Menu View */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pb-20">
                        {videos.length > 0 ? (
                            videos.map((v, index) => (
                                <div key={v._id || index} className="flex gap-4 p-4 bg-white border border-[#DBC1A0] rounded-2xl hover:shadow-md transition-all">
                                    <div className="w-24 h-24 bg-[#E8B878]/30 rounded-xl overflow-hidden flex-shrink-0">
                                        <video className="w-full h-full object-cover" src={v.video} muted></video>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-gray-900">{v.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{v.description || "No description available."}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
                                <Utensils size={32} className="mb-4 text-[#DBC1A0]" />
                                <p>No menu items available.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
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

                            {/* Business Name */}
                            <div className="profile-modal-field">
                                <label htmlFor="edit-name">Business Name</label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder="Your business name"
                                />
                            </div>

                            {/* Phone */}
                            <div className="profile-modal-field">
                                <label htmlFor="edit-phone">Phone Number</label>
                                <input
                                    id="edit-phone"
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    placeholder="Phone number"
                                />
                            </div>

                            {/* Address */}
                            <div className="profile-modal-field">
                                <label htmlFor="edit-address">Address</label>
                                <input
                                    id="edit-address"
                                    type="text"
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    placeholder="Business address"
                                />
                            </div>

                            {/* Meals & Served (side by side) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="profile-modal-field">
                                    <label htmlFor="edit-meals">Total Meals</label>
                                    <input
                                        id="edit-meals"
                                        type="number"
                                        min="0"
                                        value={editForm.totalMeals}
                                        onChange={(e) => setEditForm({ ...editForm, totalMeals: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="profile-modal-field">
                                    <label htmlFor="edit-served">Customers Served</label>
                                    <input
                                        id="edit-served"
                                        type="number"
                                        min="0"
                                        value={editForm.customersServed}
                                        onChange={(e) => setEditForm({ ...editForm, customersServed: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
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
        </div>
    )
}

export default Profile