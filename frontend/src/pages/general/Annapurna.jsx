import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import '../../styles/annapurna.css';
import ImpactTicker from "../../components/annapurna/ImpactTicker";
import { Hero } from "@/components/ui/animated-hero";
import Footer from "../../components/common/Footer";
import { MapPin, Clock, ArrowLeft, ChevronLeft, ChevronRight, X, QrCode } from "lucide-react";
import qrImg from '../../assets/qr.jpeg';

// Mock Data for Donations (Fallback)
const mockDonations = [
    {
        id: 1,
        title: "Wedding Banquet Rice",
        partner: "Hotel Saffron",
        address: "12, Connaught PI, New Delhi",
        lat: 28.6139,
        lng: 77.2090,
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Fresh Biryani Bowls",
        partner: "Spice Garden Restaurant",
        address: "45, Sector 18, Noida",
        lat: 28.5706,
        lng: 77.3219,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Corporate Lunch Surplus",
        partner: "TechPark Cafeteria",
        address: "Cyber Hub, Gurugram",
        lat: 28.4950,
        lng: 77.0895,
        expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Dal Makhani & Naan",
        partner: "Punjab Kitchen",
        address: "Khan Market, New Delhi",
        lat: 28.6003,
        lng: 77.2268,
        expires: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Fresh Fruit Platters",
        partner: "Green Valley Farms",
        address: "Vasant Kunj, New Delhi",
        lat: 28.5194,
        lng: 77.1571,
        expires: new Date(Date.now() + 5 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Party Snacks Bundle",
        partner: "Grand Hyatt",
        address: "Santacruz East, Mumbai",
        lat: 19.0934,
        lng: 72.8571,
        expires: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 7,
        title: "South Indian Thali",
        partner: "Saravana Bhavan",
        address: "Indiranagar, Bangalore",
        lat: 12.9784,
        lng: 77.6408,
        expires: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 8,
        title: "Bakery Fresh Breads",
        partner: "The Bread Company",
        address: "Bandra West, Mumbai",
        lat: 19.0596,
        lng: 72.8295,
        expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2574&auto=format&fit=crop"
    }
];

// Haversine Formula for Distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const Annapurna = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [distances, setDistances] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [donationsList, setDonationsList] = useState([]); // Real data state
    const [isOffline, setIsOffline] = useState(false);

    const handleCopyUPI = () => {
        navigator.clipboard.writeText("9243566990@ybl");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Number of items to show at once
    const itemsPerPage = 3;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsPerPage >= donationsList.length ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(0, donationsList.length - itemsPerPage) : prevIndex - 1
        );
    };

    const visibleDonations = donationsList.slice(currentIndex, currentIndex + itemsPerPage);
    // Handle wrapping for end of list not strictly needed with the logic above but kept for safety if list < itemsPerPage
    if (visibleDonations.length < itemsPerPage && donationsList.length > itemsPerPage) {
        visibleDonations.push(...donationsList.slice(0, itemsPerPage - visibleDonations.length));
    }


    // Fetch Donations from Backend
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await api.get('/api/food');
                // Filter for donations only and validate expiry
                const validDonations = response.data.foodItems.filter(item =>
                    item.isDonation &&
                    new Date(item.expiryDate) > new Date() &&
                    item.status === 'available'
                ).map(item => ({
                    id: item._id,
                    title: item.name,
                    partner: item.foodPartner?.businessName || item.user?.fullName || "Anonymous Donor",
                    address: item.location?.address || "Location Hidden",
                    lat: item.location?.lat,
                    lng: item.location?.lng,
                    expires: item.expiryDate, // Use actual date object/string
                    image: item.video // Using video thumbnail or placeholder if video
                }));

                setDonationsList(validDonations.length > 0 ? validDonations : mockDonations);
            } catch (error) {
                // Silently handle error by showing offline mock data
                setDonationsList(mockDonations);
                setIsOffline(true);
            }
        };

        fetchDonations();
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                    // Calculate distances for all items
                    const newDistances = {};
                    donationsList.forEach(d => {
                        if (d.lat && d.lng) {
                            newDistances[d.id] = calculateDistance(latitude, longitude, d.lat, d.lng);
                        }
                    });
                    setDistances(newDistances);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        }
    }, [donationsList]);

    return (
        <div className="annapurna-page relative">
            <div className="mesh-background"></div>

            {/* Donate Modal */}
            {showDonateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white text-black w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
                        <button
                            onClick={() => setShowDonateModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-3xl font-black mb-6 text-center">Make an Impact 🧡</h2>

                        <div className="grid gap-4">
                            {/* Option A: Donate Money (QR) */}
                            <div className="border-2 border-orange-500/20 rounded-2xl p-6 hover:border-orange-500 transition-colors bg-orange-50">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-orange-600" />
                                    Donate Money
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">Scan to contribute directly.</p>
                                <div className="bg-white p-2 rounded-xl border border-dashed border-gray-300 flex justify-center overflow-hidden relative">
                                    <div className="w-56 relative rounded-lg bg-white flex items-center justify-center">
                                        {/* QR Code - Full aspect ratio */}
                                        <img
                                            src={qrImg}
                                            alt="UPI QR Code"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopyUPI}
                                    className="w-full mt-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    {copied ? "Copied! ✅" : "Copy UPI ID"}
                                </button>
                            </div>

                            <div className="text-center text-gray-400 font-bold">- OR -</div>

                            {/* Option B: Donate Food */}
                            <Link to="/create-food" className="block">
                                <div className="border-2 border-blue-500/20 rounded-2xl p-6 hover:border-blue-500 transition-colors bg-blue-50">
                                    <h3 className="text-xl font-bold mb-2 text-blue-900">Donate Food</h3>
                                    <p className="text-sm text-gray-600">Have surplus food? Share it with those in need instantly.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Offline Alert Banner */}
            {isOffline && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] bg-orange-100 border border-orange-300 text-orange-800 px-6 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-sm font-semibold">Live updates unavailable. Showing demo data.</span>
                </div>
            )}

            <Link to="/home" className="group fixed top-6 left-6 z-50 no-underline text-gray-800 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold tracking-tight">Back to Home</span>
            </Link>

            {/* 1. Hero Section (Restored Animation) */}
            <header className="flex-1 flex items-center justify-center min-h-[90vh]">
                <Hero onDonateClick={() => setShowDonateModal(true)} />
            </header>

            {/* 2. Impact Stats */}
            <section className="annapurna-section">
                <div className="impact-stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">12,405</span>
                        <span className="stat-label">Meals Served</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">85</span>
                        <span className="stat-label">Active Partners</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">12</span>
                        <span className="stat-label">Cities</span>
                    </div>
                </div>
            </section>

            {/* 3. Donations List (Carousel) */}
            <div className="w-full px-4 mb-8">
                <div className="flex flex-col items-center mb-8 px-4 md:px-8">
                    <h2 className="section-title mb-4 text-center w-full">Live Donations 🍲</h2>
                    <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-black border border-black/10 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-black border border-black/10 transition-colors">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-8">
                    {visibleDonations.map((donation, index) => (
                        <div key={`${donation.id}-${index}`} className="donation-card w-full">
                            <div className="donation-image-wrapper">
                                {donation.image.endsWith('.mp4') || donation.image.endsWith('.webm') ? (
                                    <video src={donation.image} className="donation-image" autoPlay muted loop playsInline />
                                ) : (
                                    <img src={donation.image} alt={donation.title} className="donation-image" />
                                )}
                                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                    LIVE
                                </div>
                            </div>
                            <div className="donation-content">
                                <div className="donation-header">
                                    <h3 className="donation-title">{donation.title}</h3>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                                        VERIFIED
                                    </span>
                                </div>
                                <div className="donation-meta">
                                    <div className="meta-item flex flex-col items-start gap-1">
                                        <span className="font-semibold text-[#1A1A1A]">{donation.partner}</span>
                                        <span className="text-xs text-slate-500">{donation.address}</span>
                                    </div>
                                    <div className="flex justify-between mt-2 w-full">
                                        <div className="meta-item text-orange-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{typeof donation.expires === 'string' ? donation.expires : new Date(donation.expires).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="meta-item text-blue-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{distances[donation.id] || "2.5"} km away</span>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/claim-donation/${donation.id}`} className="block w-full">
                                    <button className="claim-btn w-full">
                                        Claim Donation
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Impact Stories */}
            <section className="annapurna-section" id="stories">
                <h2 className="section-title">Voices of Change 🧡</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 w-full max-w-none px-4 sm:px-6 md:px-12">
                    {/* Story 1 */}
                    <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"
                            alt="Volunteer with kids"
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-orange-500" />
                                <span className="text-sm font-bold text-orange-400 uppercase tracking-widest">Sarah, Volunteer</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3">"More than just food."</h3>
                            <p className="text-gray-400 text-base leading-relaxed italic opacity-80">
                                "Last week, we delivered surplus wedding food to a local shelter. The joy wasn't just about the meal, it was about dignity. Annapurna makes this connection effortless."
                            </p>
                        </div>
                    </div>

                    {/* Story 2 */}
                    <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1613638377394-281765460baa?q=80&w=2670&auto=format&fit=crop"
                            alt="Restaurant owner"
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500" />
                                <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Rajesh, Hotel Owner</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3">"Zero Waste, 100% Heart."</h3>
                            <p className="text-gray-400 text-base leading-relaxed italic opacity-80">
                                "We used to throw away kgs of good food. Now, with one click on the FoodView app, it reaches those who need it within hours. It's transformed our business ethics."
                            </p>
                        </div>
                    </div>

                    {/* Story 3 */}
                    <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1556911073-38141963c9e0?q=80&w=2670&auto=format&fit=crop"
                            alt="Community members"
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-green-500" />
                                <span className="text-sm font-bold text-green-400 uppercase tracking-widest">Anita, Coordinator</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3">"A community that cares."</h3>
                            <p className="text-gray-400 text-base leading-relaxed italic opacity-80">
                                "The speed is incredible. I posted a request for a community kitchen, and within 30 minutes, a local bakery confirmed a donation. This is technology for good."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Wall of Kindness */}
            <section className="w-full px-0 py-12">
                <h2 className="section-title text-center">Wall of Kindness</h2>
                <ImpactTicker />
            </section>

            {/* 6. Footer (Global Footer) */}
            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
};

export default Annapurna;
