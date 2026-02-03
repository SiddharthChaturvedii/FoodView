import React from "react";
import { Hero } from "@/components/ui/animated-hero";
import { Link } from "react-router-dom";

const Annapurna = () => {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Link to="/home" className="group absolute top-6 left-6 z-50 no-underline">
                <span
                    className="text-2xl font-black text-orange-600 uppercase tracking-tight transition-all group-hover:text-orange-700"
                    style={{ fontFamily: 'Inter, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                    FoodView
                </span>
            </Link>
            <main className="flex-1 flex items-center justify-center">
                <Hero />
            </main>
        </div>
    );
};

export default Annapurna;
