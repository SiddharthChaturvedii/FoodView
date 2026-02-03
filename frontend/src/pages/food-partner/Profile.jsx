import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams, Link } from 'react-router-dom'
import api from '../../utils/api'
import { PlusCircle } from 'lucide-react'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
                console.error("Error fetching profile:", err)
                setError("Failed to load profile.")
                setLoading(false)
            })
    }, [id])

    if (loading) {
        return (
            <main className="profile-page">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="profile-page">
                <div className="text-center text-red-500 py-10">
                    <h2 className="text-2xl font-bold">Error</h2>
                    <p>{error}</p>
                    <Link to="/home" className="text-blue-500 hover:underline mt-4 inline-block">Return Home</Link>
                </div>
            </main>
        )
    }

    return (
        <main className="profile-page">
            <Link to="/home" className="group absolute top-6 left-6 z-50 no-underline">
                <span
                    className="text-2xl font-black text-orange-600 uppercase tracking-tight transition-all group-hover:text-orange-700"
                    style={{ fontFamily: 'Inter, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                    FoodView
                </span>
            </Link>

            <section className="profile-header">
                <div className="profile-meta">
                    <img className="profile-avatar" src="https://images.unsplash.com/photo-1633527950412-82457981a5e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile Avatar" />

                    <div className="profile-info">
                        {profile?.name ? (
                            <h1 className="profile-pill profile-business" title="Business name">
                                {profile.name}
                            </h1>
                        ) : (
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                        )}

                        {profile?.address ? (
                            <p className="profile-pill profile-address" title="Address">
                                {profile.address}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{videos.length}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed || "5k"}</span>
                    </div>
                </div>

                <Link to="/create-food" className="mt-6 w-full bg-[#FF5722] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F4511E] transition-all shadow-md active:scale-95">
                    <PlusCircle className="w-5 h-5" />
                    Create New Post
                </Link>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.length > 0 ? (
                    videos.map((v) => (
                        <div key={v._id || Math.random()} className="profile-grid-item">
                            <video
                                className="profile-grid-video"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                src={v.video}
                                controls
                                muted
                            ></video>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-10 text-gray-500">
                        No food videos uploaded yet.
                    </div>
                )}
            </section>
        </main>
    )
}

export default Profile