import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../styles/annapurna.css';
import ImpactTicker from "../../components/annapurna/ImpactTicker";
import { Hero } from "@/components/ui/animated-hero";
import Footer from "../../components/common/Footer";
import { MapPin, Clock, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// Mock Data for Donations
const donations = [
    {
        id: 1,
        title: "Wedding Banquet Rice",
        partner: "Hotel Saffron",
        address: "12, Connaught PI, New Delhi",
        lat: 28.6139,
        lng: 77.2090,
        expires: "3h 20m",
        image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Bakery Surplus",
        partner: "Warm Ovens",
        address: "Sector 18, Noida, UP",
        lat: 28.5355,
        lng: 77.3910,
        expires: "5h",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2672&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Fresh Veg Curry",
        partner: "Mom's Kitchen",
        address: "Kamla Nagar, North Delhi",
        lat: 28.7041,
        lng: 77.1025,
        expires: "2h",
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Fruit Basket",
        partner: "Fresh Mart",
        address: "DLF Phase 3, Gurgaon",
        lat: 28.4595,
        lng: 77.0266,
        expires: "4h",
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Sandwich Platter",
        partner: "Cafe Coffee",
        address: "Saket, South Delhi",
        lat: 28.5244,
        lng: 77.2188,
        expires: "1h 30m",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2673&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Pizza Slices",
        partner: "Pizza Hub",
        address: "Lajpat Nagar, New Delhi",
        lat: 28.5672,
        lng: 77.2432,
        expires: "45m",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2281&auto=format&fit=crop"
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

    // Number of items to show at once
    const itemsPerPage = 3;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsPerPage >= donations.length ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? donations.length - itemsPerPage : prevIndex - 1
        );
    };

    const visibleDonations = donations.slice(currentIndex, currentIndex + itemsPerPage);
    // Handle wrapping for end of list
    if (visibleDonations.length < itemsPerPage) {
        visibleDonations.push(...donations.slice(0, itemsPerPage - visibleDonations.length));
    }


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                    // Calculate distances for all items
                    const newDistances = {};
                    donations.forEach(d => {
                        newDistances[d.id] = calculateDistance(latitude, longitude, d.lat, d.lng);
                    });
                    setDistances(newDistances);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    // Default to generic distances if denied
                }
            );
        }
    }, []);

    return (
        <div className="annapurna-page">
            <div className="mesh-background"></div>

            <Link to="/home" className="group fixed top-6 left-6 z-50 no-underline text-gray-800 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold tracking-tight">Back to Home</span>
            </Link>

            {/* 1. Hero Section (Restored Animation) */}
            <header className="flex-1 flex items-center justify-center min-h-[90vh]">
                <Hero />
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
            <section className="annapurna-section" id="donations">
                <div className="flex justify-between items-center mb-8 px-4">
                    <h2 className="section-title mb-0">Live Donations 🍲</h2>
                    <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-black border border-black/10 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-black border border-black/10 transition-colors">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visibleDonations.map((donation, index) => (
                        <div key={`${donation.id}-${index}`} className="donation-card">
                            <div className="donation-image-wrapper">
                                <img src={donation.image} alt={donation.title} className="donation-image" />
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
                                            <span>{donation.expires} left</span>
                                        </div>
                                        <div className="meta-item text-blue-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{distances[donation.id] || "2.5"} km away</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="claim-btn">
                                    Claim Donation
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Impact Stories */}
            <section className="annapurna-section" id="stories">
                <h2 className="section-title">Voices of Change 🧡</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
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
                            src="https://images.unsplash.com/photo-1593113598340-1509de0bc1c41?q=80&w=2670&auto=format&fit=crop"
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
                            src="https://images.unsplash.com/photo-1504159506876-791895319ca5?q=80&w=2671&auto=format&fit=crop"
                            alt="Community meal"
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
            <section className="annapurna-section">
                <h2 className="section-title">Wall of Kindness</h2>
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
