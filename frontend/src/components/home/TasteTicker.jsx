import React, { useEffect, useState, useRef } from 'react';
import '../../styles/taste-ticker.css';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Flame, Film } from 'lucide-react';

const TasteTicker = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await api.get('/api/food');
                const items = response.data.foodItems || [];
                setFoods(items);
            } catch (error) {
                console.error("Failed to load taste ticker:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    // IntersectionObserver for mobile autoplay
    useEffect(() => {
        if (foods.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (!(video instanceof HTMLVideoElement)) return;
                    if (entry.isIntersecting) {
                        video.play().catch(() => { /* autoplay blocked */ });
                    } else {
                        video.pause();
                        video.currentTime = 0;
                    }
                });
            },
            { threshold: 0.3 }
        );

        // Observe after a short delay to let DOM render
        const timer = setTimeout(() => {
            const videos = document.querySelectorAll('.ticker-video');
            videos.forEach((v) => observer.observe(v));
        }, 200);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [foods]);

    if (loading) return null;

    // Empty state instead of returning null
    if (foods.length === 0) {
        return (
            <section className="taste-ticker-container">
                <h2 className="taste-ticker-header">
                    <Flame className="text-orange-500" fill="currentColor" />
                    Trending Now
                </h2>
                <div className="taste-ticker-empty">
                    <Film className="w-8 h-8 text-gray-500" />
                    <p>No reels yet — check back soon!</p>
                </div>
            </section>
        );
    }

    // Duplicate list for seamless loop
    const displayFoods = [...foods, ...foods, ...foods, ...foods];

    const handleCardClick = () => {
        navigate('/explore');
    };

    return (
        <section className="taste-ticker-container">
            <h2 className="taste-ticker-header">
                <Flame className="text-orange-500" fill="currentColor" />
                Trending Now
            </h2>

            <div className="taste-ticker-track-wrapper">
                <div className="taste-ticker-track"
                    style={{ animationDuration: `${Math.max(40, foods.length * 5)}s` }}>
                    {displayFoods.map((food, index) => (
                        <div
                            key={`${food._id}-${index}`}
                            className="ticker-card"
                            onClick={handleCardClick}
                            role="button"
                            tabIndex={0}
                        >
                            <video
                                src={food.video}
                                className="ticker-video"
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            />
                            <div className="ticker-overlay">
                                <span className="ticker-food-name line-clamp-2">{food.name}</span>
                                <span className="ticker-partner-name truncate">
                                    {food.foodPartner?.name || "Unknown"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TasteTicker;
