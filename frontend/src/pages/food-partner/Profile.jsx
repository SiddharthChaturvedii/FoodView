import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../utils/api'
import { PlusCircle, MapPin, Phone, Mail, Grid, Utensils, Users, AlertCircle, RefreshCw } from 'lucide-react'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('posts')
    const [shareText, setShareText] = useState('Share')

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        api.get(`/api/food-partner/${id}`)
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems || [])
                setLoading(false)
            })
            .catch(err => {
                // Error is displayed in UI
                setError("Failed to load profile.")
                setLoading(false)
            })
    }, [id])

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2000);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 p-6 rounded-2xl flex flex-col items-center max-w-sm text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-3">
                        <Link to="/home" className="px-4 py-2 bg-gray-100 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw size={18} /> Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">
            {/* Header Navigation */}
            <div className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center border-b border-gray-100">
                <Link to="/home" className="group flex items-center gap-1">
                    <span className="text-xl font-black text-orange-600 uppercase tracking-tight font-sans">
                        FoodView
                    </span>
                </Link>
                {/* Placeholder for future actions (e.g. notifications) */}
                <div className="w-6"></div>
            </div>

            <main className="max-w-4xl mx-auto w-full">
                {/* Profile Header */}
                <header className="px-4 py-8 md:px-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1 border-2 border-gray-100 bg-white">
                            <img
                                className="w-full h-full rounded-full object-cover"
                                src="https://images.unsplash.com/photo-1633527950412-82457981a5e8?q=80&w=687&auto=format&fit=crop"
                                alt="Profile Avatar"
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-grow text-center md:text-left flex flex-col gap-4 w-full">
                        {/* Name & Actions */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                {profile?.name || "Food Partner"}
                            </h1>
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Link to="/create-food" className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                    <PlusCircle size={16} />
                                    <span>New Post</span>
                                </Link>
                                <button
                                    onClick={handleShare}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[80px]"
                                >
                                    {shareText}
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex justify-center md:justify-start gap-8 md:gap-12 py-2">
                            <div className="text-center md:text-left">
                                <span className="font-bold text-lg block md:inline text-gray-900">{videos.length}</span>
                                <span className="text-gray-500 ml-1">posts</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="font-bold text-lg block md:inline text-gray-900">{profile?.totalMeals || 43}</span>
                                <span className="text-gray-500 ml-1">meals</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="font-bold text-lg block md:inline text-gray-900">{profile?.customersServed || "5k"}</span>
                                <span className="text-gray-500 ml-1">served</span>
                            </div>
                        </div>

                        {/* Bio / Details */}
                        <div className="hidden md:block space-y-1">
                            {profile?.address && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <MapPin size={14} className="text-orange-600" />
                                    {profile.address}
                                </div>
                            )}
                            {profile?.email && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Mail size={14} className="text-orange-600" />
                                    {profile.email}
                                </div>
                            )}
                            {profile?.phone && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Phone size={14} className="text-orange-600" />
                                    {profile.phone}
                                </div>
                            )}
                        </div>

                        {/* Mobile Bio (visible only on small screens below stats) */}
                        <div className="md:hidden space-y-1 text-sm text-gray-600 mt-2">
                            <div className="font-medium text-gray-900">{profile?.address}</div>
                            {/* Can add more mobile details here if needed */}
                        </div>
                    </div>
                </header>

                {/* Content Tabs / Divider */}
                <div className="border-t border-gray-200 mt-2">
                    <div className="flex justify-center gap-12">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex items-center gap-2 border-t py-3 text-xs font-semibold tracking-widest uppercase ${activeTab === 'posts' ? 'border-black text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'} -mt-px`}
                        >
                            <Grid size={12} /> Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex items-center gap-2 border-t py-3 text-xs font-semibold tracking-widest uppercase ${activeTab === 'menu' ? 'border-black text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'} -mt-px`}
                        >
                            <Utensils size={12} /> Menu
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {/* Grid or Menu List */}
                {activeTab === 'posts' ? (
                    <div className="grid grid-cols-3 gap-0.5 md:gap-6 pb-20">
                        {videos.length > 0 ? (
                            videos.map((v, index) => (
                                <div key={v._id || index} className="relative aspect-[3/4] group cursor-pointer bg-gray-100">
                                    <video
                                        className="w-full h-full object-cover"
                                        src={v.video}
                                        controls={false}
                                        muted
                                    ></video>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 flex flex-col items-center justify-center text-gray-400">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                                    <Utensils size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Photos</h3>
                                <p>When you share photos, they will appear on your profile.</p>
                                <Link to="/create-food" className="mt-4 text-blue-500 font-semibold text-sm">
                                    Share your first photo
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Menu View */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pb-20">
                        {videos.length > 0 ? (
                            videos.map((v, index) => (
                                <div key={v._id || index} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <video className="w-full h-full object-cover" src={v.video} muted></video>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-gray-900">{v.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{v.description || "No description available."}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                                <Utensils size={32} className="mb-4 text-gray-300" />
                                <p>No menu items available.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Profile