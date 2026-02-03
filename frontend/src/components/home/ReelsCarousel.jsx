import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { Heart, Play } from 'lucide-react';
import './ReelsCarousel.css';

const ReelsCarousel = () => {
    const [reels, setReels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get("/api/food?limit=8")
            .then(response => {
                setReels(response.data.foodItems || []);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="reels-carousel">
                <div className="carousel-track">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="reel-card skeleton">
                            <div className="skeleton-shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (reels.length === 0) {
        return null;
    }

    // Duplicate reels for seamless loop
    const duplicatedReels = [...reels, ...reels];

    return (
        <section className="reels-carousel-section">
            <div className="carousel-header">
                <h2 className="carousel-title">
                    <Play className="w-5 h-5" />
                    Trending Reels
                </h2>
                <Link to="/explore" className="view-all-link">
                    View All →
                </Link>
            </div>
            <div className="reels-carousel">
                <div className="carousel-track">
                    {duplicatedReels.map((reel, index) => (
                        <ReelCard key={`${reel._id}-${index}`} reel={reel} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ReelCard = ({ reel }) => {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isVisible]);

    return (
        <Link to="/explore" className="reel-card">
            <video
                ref={videoRef}
                src={reel.video}
                className="reel-video"
                muted
                loop
                playsInline
                preload="metadata"
            />
            <div className="reel-overlay">
                <span className="reel-partner">{reel.name || 'Food Item'}</span>
                <span className="reel-likes">
                    <Heart className="w-3 h-3" />
                    {reel.likeCount || 0}
                </span>
            </div>
        </Link>
    );
};

export default ReelsCarousel;
