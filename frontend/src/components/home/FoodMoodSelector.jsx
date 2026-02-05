import React, { useState, useEffect, useRef } from 'react';
import '../../styles/food-mood-selector.css';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Flame, Cake, Salad, Beef, Leaf, Utensils, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Mood definitions with keywords to match in name/description
const MOODS = [
    {
        id: 'spicy',
        label: 'Spicy',
        emoji: '🔥',
        icon: Flame,
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
        keywords: ['spicy', 'hot', 'chili', 'pepper', 'fire', 'schezwan', 'tandoori', 'masala']
    },
    {
        id: 'sweet',
        label: 'Sweet',
        emoji: '🍰',
        icon: Cake,
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
        keywords: ['sweet', 'cake', 'chocolate', 'dessert', 'ice cream', 'pastry', 'sugar', 'honey', 'velvet']
    },
    {
        id: 'healthy',
        label: 'Healthy',
        emoji: '🥗',
        icon: Salad,
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, #22c55e, #84cc16)',
        keywords: ['healthy', 'salad', 'fresh', 'green', 'organic', 'light', 'garden', 'vegetable', 'harvest']
    },
    {
        id: 'comfort',
        label: 'Comfort',
        emoji: '🍔',
        icon: Beef,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        keywords: ['comfort', 'burger', 'fries', 'cheese', 'pasta', 'noodles', 'pizza', 'heritage', 'nonna']
    },
    {
        id: 'vegan',
        label: 'Vegan',
        emoji: '🌿',
        icon: Leaf,
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        keywords: ['vegan', 'plant', 'tofu', 'vegetarian', 'veggie', 'zen', 'artisan']
    },
    {
        id: 'seafood',
        label: 'Seafood',
        emoji: '🦐',
        icon: Utensils,
        color: '#0ea5e9',
        gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
        keywords: ['seafood', 'fish', 'shrimp', 'sushi', 'sashimi', 'roll', 'ocean', 'sea']
    }
];

const FoodMoodSelector = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMood, setSelectedMood] = useState(null);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/food')
            .then(res => {
                setFoods(res.data.foodItems || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load food data", err);
                setLoading(false);
            });
    }, []);

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);

        // Filter foods by keywords in name or description
        const matches = foods.filter(food => {
            const searchText = `${food.name} ${food.description || ''}`.toLowerCase();
            return mood.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
        });

        setFilteredFoods(matches);
        setShowResults(true);

        // Scroll to results after a short delay
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleReset = () => {
        setSelectedMood(null);
        setFilteredFoods([]);
        setShowResults(false);
    };

    const handleFoodClick = () => {
        navigate('/explore');
    };

    if (loading) {
        return (
            <section className="mood-selector-section">
                <div className="mood-loading">
                    <Sparkles className="w-8 h-8 animate-spin text-orange-500" />
                    <p>Loading flavors...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mood-selector-section">
            <div className="mood-selector-container">
                {/* Header */}
                <header className="mood-header">
                    <h2 className="mood-title">
                        <Sparkles className="w-6 h-6 text-orange-400" />
                        What's Your Food Mood?
                    </h2>
                    <p className="mood-subtitle">Pick your craving and discover delicious dishes</p>
                </header>

                {/* Mood Cards Grid */}
                <div className="mood-cards-grid">
                    {MOODS.map((mood) => {
                        const IconComponent = mood.icon;
                        const isSelected = selectedMood?.id === mood.id;

                        return (
                            <button
                                key={mood.id}
                                className={`mood-card ${isSelected ? 'mood-card-selected' : ''}`}
                                style={{
                                    '--mood-color': mood.color,
                                    '--mood-gradient': mood.gradient
                                }}
                                onClick={() => handleMoodSelect(mood)}
                            >
                                <div className="mood-card-emoji">{mood.emoji}</div>
                                <div className="mood-card-icon">
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <span className="mood-card-label">{mood.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Results Section */}
                {showResults && (
                    <div ref={resultsRef} className="mood-results">
                        <div className="results-header">
                            <h3 className="results-title">
                                {selectedMood?.emoji} {selectedMood?.label} Picks
                            </h3>
                            <button className="results-reset-btn" onClick={handleReset}>
                                <ChevronLeft className="w-4 h-4" />
                                Change Mood
                            </button>
                        </div>

                        {filteredFoods.length > 0 ? (
                            <div className="results-carousel">
                                {filteredFoods.filter(f => f.video).map((food) => (
                                    <div
                                        key={food._id}
                                        className="result-card"
                                        onClick={handleFoodClick}
                                    >
                                        <div className="result-card-video">
                                            <video
                                                src={food.video}
                                                muted
                                                loop
                                                playsInline
                                                onMouseEnter={(e) => e.target.play()}
                                                onMouseLeave={(e) => {
                                                    e.target.pause();
                                                    e.target.currentTime = 0;
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.classList.add('video-error');
                                                }}
                                            />
                                            {/* Fallback for video error (handled via CSS or state, but simple CSS hide is easier) */}
                                            <div className="video-fallback absolute inset-0 flex items-center justify-center bg-gray-800 -z-10">
                                                <Utensils className="w-8 h-8 text-gray-600" />
                                            </div>

                                            <div className="result-card-overlay">
                                                <span className="result-card-name">{food.name}</span>
                                                <span className="result-card-partner">
                                                    {food.foodPartner?.name || 'Unknown Partner'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="results-empty">
                                <p>No {selectedMood?.label.toLowerCase()} dishes found yet.</p>
                                <p className="text-sm text-gray-500">Try another mood or check back later!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FoodMoodSelector;
