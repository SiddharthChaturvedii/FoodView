import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShieldAlert, Phone, Users, Globe, Sparkles } from 'lucide-react';
import Footer from '../../components/common/Footer';

const Mission = () => {
    return (
        <div className="min-h-screen bg-[#FFF5E1] text-[#1A1A1A] font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-black/5">
                <Link to="/home" className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
                    <Heart className="w-8 h-8 text-orange-600 fill-orange-600" />
                    FOODVIEW
                </Link>
                <Link to="/home" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </Link>
            </nav>

            {/* Hero Section - Relatable Background & Massive Text */}
            <section className="relative h-[100vh] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop"
                        alt="Community meal"
                        className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFF5E1] via-transparent to-black/30"></div>
                </div>

                <div className="container mx-auto px-4 z-10 text-center">
                    <h1 className="text-[12vw] md:text-[10vw] font-black uppercase leading-[0.8] tracking-tighter text-white drop-shadow-2xl">
                        End<br /><span className="text-orange-500">Hunger</span><br />Together
                    </h1>
                    <p className="text-xl md:text-3xl text-white mt-8 font-medium max-w-3xl mx-auto drop-shadow-lg">
                        We believe that in a world of plenty, no one should go to sleep on an empty stomach.
                    </p>
                </div>
            </section>

            {/* Detailed Mission Content */}
            <section className="py-24 container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
                                Our<br />Manifesto
                            </h2>
                            <div className="space-y-6 text-xl text-gray-700 leading-relaxed">
                                <p>
                                    Every single day, tonnes of perfectly good, nutritious food is discarded by restaurants, households, and banquets. Simultaneously, millions of our fellow citizens struggle to find their next meal.
                                </p>
                                <p className="font-bold text-gray-900 text-2xl">
                                    This isn't a scarcity problem; it's a logistics problem.
                                </p>
                                <p>
                                    FoodView (formerly Annapurna) was born from a simple yet powerful realization: Technology can bridge the gap between surplus and scarcity in real-time. We are building the infrastructure of kindness.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl hover:-translate-y-2 transition-transform">
                                <Users className="w-12 h-12 text-orange-600 mb-4" />
                                <h3 className="font-black text-2xl uppercase tracking-tighter">Community</h3>
                                <p className="text-sm text-gray-500 mt-2">Connecting local donors with volunteers.</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl hover:-translate-y-2 transition-transform mt-8">
                                <Globe className="w-12 h-12 text-blue-600 mb-4" />
                                <h3 className="font-black text-2xl uppercase tracking-tighter">Scale</h3>
                                <p className="text-sm text-gray-500 mt-2">Operating across 12 cities and growing.</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl hover:-translate-y-2 transition-transform">
                                <Sparkles className="w-12 h-12 text-yellow-600 mb-4" />
                                <h3 className="font-black text-2xl uppercase tracking-tighter">Impact</h3>
                                <p className="text-sm text-gray-500 mt-2">Over 12,000+ meals served this year.</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl hover:-translate-y-2 transition-transform mt-8">
                                <ShieldAlert className="w-12 h-12 text-red-600 mb-4" />
                                <h3 className="font-black text-2xl uppercase tracking-tighter">Dignity</h3>
                                <p className="text-sm text-gray-500 mt-2">ensuring quality and respect for all.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Support & Helpline Numbers */}
            <section className="bg-red-600 py-24 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">
                            Emergency Support
                        </h2>
                        <p className="text-xl md:text-2xl mb-16 font-medium opacity-90">
                            If you know someone in immediate need of food or suffering from severe malnutrition, please reach out to these national helplines immediately.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <Phone className="w-8 h-8" />
                                    <h3 className="text-3xl font-black tracking-tighter">1967</h3>
                                </div>
                                <p className="font-bold text-lg uppercase">National PDS Helpline</p>
                                <p className="opacity-80 text-sm mt-2">Contact for Public Distribution System (Ration) assistance and food grain queries across India.</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <Phone className="w-8 h-8" />
                                    <h3 className="text-3xl font-black tracking-tighter">14408</h3>
                                </div>
                                <p className="font-bold text-lg uppercase">POSHAN Abhiyan</p>
                                <p className="opacity-80 text-sm mt-2">National Nutrition Mission helpline for queries related to nutrition, stunted growth, and malnutrition support.</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-colors md:col-span-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <Phone className="w-8 h-8" />
                                    <h3 className="text-3xl font-black tracking-tighter">14445</h3>
                                </div>
                                <p className="font-bold text-lg uppercase">One Nation One Ration Card</p>
                                <p className="opacity-80 text-sm mt-2">Support for inter-state ration portability and addressing food security issues for migrants.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 text-center bg-white">
                <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">Join the mission</h2>
                <div className="flex flex-col md:flex-row gap-6 justify-center px-4">
                    <Link to="/home" className="px-12 py-5 bg-orange-500 text-black font-black text-2xl rounded-full hover:bg-black hover:text-orange-500 transition-all shadow-xl">
                        START DONATING
                    </Link>
                    <Link to="/home" className="px-12 py-5 border-4 border-black text-black font-black text-2xl rounded-full hover:bg-black hover:text-white transition-all">
                        BECOME A PARTNER
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Mission;
