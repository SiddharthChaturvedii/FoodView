import React from 'react';
import '../../styles/taste-ticker.css'; // Reusing the animation logic
import { Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        text: "FoodView helped our shelter receive 50 fresh meals last night. A blessing!",
        author: "Rahul Verma",
        role: "Seva Shelter",
        color: "#fca5a5" // Light red
    },
    {
        id: 2,
        text: "Donating my restaurant's surplus has never been easier. Zero waste, full hearts.",
        author: "Chef Anjali",
        role: "Turning Tables",
        color: "#fdba74" // Orange
    },
    {
        id: 3,
        text: "Found a donation just 1km away. The quality was excellent.",
        author: "Vikram Singh",
        role: "Volunteer",
        color: "#86efac" // Green
    },
    {
        id: 4,
        text: "This platform bridges the gap beautifully. Highly recommend to all NGOs.",
        author: "Sarah Jones",
        role: "Feed India",
        color: "#93c5fd" // Blue
    },
    {
        id: 5,
        text: "Connecting with local restaurants changed our daily operations for the better.",
        author: "Amit Patel",
        role: "Youth For Change",
        color: "#c4b5fd" // Purple
    }
];

const ImpactTicker = () => {
    // Duplicate for infinite scroll
    const displayItems = [...testimonials, ...testimonials, ...testimonials];

    return (
        <div className="taste-ticker-container" style={{ padding: '0' }}>
            {/* Reusing container but removing padding for layout fit */}
            <div className="taste-ticker-track-wrapper">
                <div className="taste-ticker-track" style={{ animationDuration: '60s' }}>
                    {displayItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="ticker-card"
                            style={{
                                background: '#121212',
                                width: '320px',
                                height: '220px',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                border: `2px solid ${item.color}40`,
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                                borderRadius: '1.5rem'
                            }}
                        >
                            <Quote className="w-8 h-8 mb-2" style={{ color: item.color }} />
                            <p className="text-sm text-gray-200 italic mb-4">"{item.text}"</p>

                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                                    style={{ background: item.color, color: '#000' }}
                                >
                                    {item.author[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{item.author}</p>
                                    <p className="text-xs text-gray-400">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImpactTicker;
