import React, { useEffect, useState, useRef } from 'react';
import '../../styles/taste-ticker.css';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';

const TasteTicker = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                // Fetch existing food items
                const response = await api.get('/api/food');
                // We want enough items to scroll smoothly, so we might duplicate them if there are few
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

    if (loading) return null; // Or a skeleton loader
    if (foods.length === 0) return null;

    // Duplicate list for seamless loop
    const displayFoods = [...foods, ...foods, ...foods, ...foods];
    // If list is small, we duplicate more times to ensure it fills the width

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
                                onMouseEnter={(e) => e.target.play()}
                                onMouseLeave={(e) => {
                                    e.target.pause();
                                    e.target.currentTime = 0;
                                }}
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
