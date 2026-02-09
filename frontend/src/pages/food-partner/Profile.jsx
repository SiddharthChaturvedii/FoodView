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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
                <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl flex flex-col items-center max-w-sm text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <div className="flex gap-3">
                        <Link to="/home" className="px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={18} /> Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white font-sans">
            {/* Header Navigation */}
            <div className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center border-b border-white/5">
                <Link to="/home" className="group flex items-center gap-2">
                    <span className="text-xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent uppercase tracking-tight">
                        FoodView
                    </span>
                </Link>
                <div className="w-6"></div>
            </div>

            <main className="max-w-4xl mx-auto w-full">
                {/* Profile Header */}
                <header className="px-4 py-8 md:px-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                    {/* Avatar with gradient ring */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500">
                                <img
                                    className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
                                    src="https://images.unsplash.com/photo-1633527950412-82457981a5e8?q=80&w=687&auto=format&fit=crop"
                                    alt="Profile Avatar"
                                />
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-purple-500/30 blur-xl -z-10"></div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-grow text-center md:text-left flex flex-col gap-4 w-full">
                        {/* Name & Actions */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {profile?.name || "Food Partner"}
                            </h1>
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Link to="/create-food" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/30 text-white px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                                    <PlusCircle size={16} />
                                    <span>Create</span>
                                </Link>
                                <button
                                    onClick={handleShare}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors min-w-[90px] flex items-center gap-2 justify-center"
                                >
                                    <Share2 size={14} />
                                    {shareText}
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex justify-center md:justify-start gap-8 md:gap-12 py-4">
                            <div className="text-center">
                                <span className="font-bold text-2xl block text-white">{videos.length}</span>
                                <span className="text-gray-500 text-sm uppercase tracking-wider">posts</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-2xl block text-white">{profile?.totalMeals || 43}</span>
                                <span className="text-gray-500 text-sm uppercase tracking-wider">meals</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-2xl block text-white">{profile?.customersServed || "5k"}</span>
                                <span className="text-gray-500 text-sm uppercase tracking-wider">served</span>
                            </div>
                        </div>

                        {/* Bio / Details */}
                        <div className="hidden md:flex flex-col gap-2 mt-2">
                            {profile?.address && (
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <MapPin size={14} className="text-orange-500" />
                                    {profile.address}
                                </div>
                            )}
                            {profile?.email && (
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Mail size={14} className="text-orange-500" />
                                    {profile.email}
                                </div>
                            )}
                            {profile?.phone && (
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Phone size={14} className="text-orange-500" />
                                    {profile.phone}
                                </div>
                            )}
                        </div>

                        {/* Mobile Bio */}
                        <div className="md:hidden text-sm text-gray-400 mt-2">
                            <div className="font-medium text-gray-300">{profile?.address}</div>
                        </div>
                    </div>
                </header>

                {/* Content Tabs */}
                <div className="border-t border-white/5 mt-2">
                    <div className="flex justify-center gap-16">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex items-center gap-2 border-t-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'posts' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'} -mt-px`}
                        >
                            <Grid size={14} /> Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex items-center gap-2 border-t-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'menu' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'} -mt-px`}
                        >
                            <Utensils size={14} /> Menu
                        </button>
                    </div>
                </div>

                {/* Grid or Menu */}
                {activeTab === 'posts' ? (
                    <div className="grid grid-cols-3 gap-1 md:gap-2 pb-20 p-1 md:p-2">
                        {videos.length > 0 ? (
                            videos.map((v, index) => (
                                <div key={v._id || index} className="relative aspect-[3/4] group cursor-pointer bg-[#111] rounded-lg overflow-hidden">
                                    <video
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        src={v.video}
                                        controls={false}
                                        muted
                                    ></video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 flex flex-col items-center justify-center text-gray-500">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-4">
                                    <Utensils size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Share Your First Reel</h3>
                                <p className="text-gray-500 mb-4">Showcase your culinary creations</p>
                                <Link to="/create-food" className="text-orange-500 font-bold text-sm hover:text-orange-400 transition-colors">
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
                                <div key={v._id || index} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all">
                                    <div className="w-24 h-24 bg-[#111] rounded-xl overflow-hidden flex-shrink-0">
                                        <video className="w-full h-full object-cover" src={v.video} muted></video>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-white">{v.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{v.description || "No description available."}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
                                <Utensils size={32} className="mb-4 text-gray-600" />
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