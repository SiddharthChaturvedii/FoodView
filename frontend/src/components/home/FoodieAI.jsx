import React, { useState, useEffect, useRef } from 'react';
import '../../styles/foodie-ai.css';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const FoodieAI = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your FoodView Guide. Craving something specific? Ask me about spicy food, desserts, or trending spots!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [foods, setFoods] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Pre-fetch food data to recommend from
        api.get('/api/food').then(res => {
            setFoods(res.data.foodItems || []);
        }).catch(err => console.error("AI failed to load food data", err));
    }, []);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        // Simulated AI delay
        setTimeout(() => {
            const response = generateResponse(userMsg);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: response.text,
                sender: 'bot',
                recommendations: response.recommendations
            }]);
            setIsTyping(false);
        }, 1000);
    };

    const generateResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        let matches = [];

        // Simple keyword matching logic for V1
        if (lowerQuery.includes('spicy')) {
            matches = foods.filter(f =>
                f.name.toLowerCase().includes('spicy') ||
                f.description?.toLowerCase().includes('spicy')
            );
            if (matches.length > 0) return {
                text: "Ooh, feeling spicy! 🔥 Here are some hot picks for you:",
                recommendations: matches.slice(0, 2)
            };
        }

        if (lowerQuery.includes('sweet') || lowerQuery.includes('dessert')) {
            matches = foods.filter(f =>
                f.name.toLowerCase().includes('cake') ||
                f.name.toLowerCase().includes('chocolate') ||
                f.description?.toLowerCase().includes('sweet')
            );
            if (matches.length > 0) return {
                text: "Life is short, eat dessert first! 🍰 Check these out:",
                recommendations: matches.slice(0, 2)
            };
        }

        // Generic search fallback
        matches = foods.filter(f =>
            f.name.toLowerCase().includes(lowerQuery) ||
            (f.foodPartner?.name && f.foodPartner.name.toLowerCase().includes(lowerQuery))
        );

        if (matches.length > 0) {
            return {
                text: `I found some matches for "${query}"!`,
                recommendations: matches.slice(0, 2)
            };
        }

        return {
            text: "I couldn't find exactly that, but have you checked our Trending section? There's always something good there! 😋",
            recommendations: []
        };
    };

    return (
        <section className="foodie-ai-section">
            <div className="foodie-ai-container">
                <header className="ai-header">
                    <div className="bot-avatar avatar">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="ai-title">FoodView Assistant</h3>
                        <p className="ai-subtitle">Ask me for recommendations</p>
                    </div>
                </header>

                <div ref={chatContainerRef} className="ai-messages-area">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message-row ${msg.sender === 'bot' ? 'bot-row' : 'user-row'}`}>
                            <div className={`avatar ${msg.sender === 'bot' ? 'bot-avatar' : 'user-avatar'}`}>
                                {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className="message-content">
                                <p>{msg.text}</p>
                                {msg.recommendations && msg.recommendations.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        {msg.recommendations.map(rec => (
                                            <div
                                                key={rec._id}
                                                className="ai-recommendation-card"
                                                onClick={() => navigate('/explore')}
                                            >
                                                <div className="bg-gray-700 w-[60px] h-[60px] rounded flex items-center justify-center overflow-hidden">
                                                    <video src={rec.video} className="w-full h-full object-cover" muted />
                                                </div>
                                                <div className="rec-info">
                                                    <span className="rec-title">{rec.name}</span>
                                                    <span className="rec-place">{rec.foodPartner?.name || 'Unknown Partner'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message-row bot-row">
                            <div className="avatar bot-avatar">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="message-content flex items-center">
                                <Sparkles className="w-4 h-4 mr-2 animate-spin text-green-400" />
                                <span className="text-gray-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="ai-input-area">
                    <form className="input-wrapper" onSubmit={handleSend}>
                        <input
                            className="ai-input"
                            placeholder="Ask for 'spicy food', 'desserts', or 'best momos'..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button className="ai-send-btn" type="submit" disabled={!input.trim()}>
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FoodieAI;
