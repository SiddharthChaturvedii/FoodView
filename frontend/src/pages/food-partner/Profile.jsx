import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../utils/api'
import { PlusCircle, MapPin, Phone, Mail, Grid, Utensils, AlertCircle, RefreshCw, Share2 } from 'lucide-react'

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
                                <img
                                    className="w-full h-full rounded-full object-cover border-4 border-white"
                                    src="https://images.unsplash.com/photo-1633527950412-82457981a5e8?q=80&w=687&auto=format&fit=crop"
                                    alt="Profile Avatar"
                                />
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
                                <Link to="/create-food" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                                    <PlusCircle size={16} />
                                    <span>Create</span>
                                </Link>
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
                                <span className="font-bold text-2xl block text-gray-900">{profile?.totalMeals || 43}</span>
                                <span className="text-[#4A351D] text-sm uppercase tracking-wider font-medium">meals</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-2xl block text-gray-900">{profile?.customersServed || "5k"}</span>
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
        </div>
    )
}

export default Profile