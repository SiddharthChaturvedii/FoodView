import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../utils/api';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Store } from 'lucide-react';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [fileError, setFileError] = useState('');

    // Donation State
    const [isDonation, setIsDonation] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            return;
        }
        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);
        return () => URL.revokeObjectURL(url);
    }, [videoFile]);

    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) { setVideoFile(null); setFileError(''); return; }
        if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer?.files?.[0];
        if (!file) { return; }
        if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', name);
        formData.append("video", videoFile);

        // Append based on mode
        formData.append('isDonation', isDonation);

        if (isDonation) {
            formData.append('quantity', quantity);
            formData.append('pickupTime', pickupTime);
            formData.append('expiryDate', expiryDate);
            formData.append('description', `[Annapurna Donation] Qty: ${quantity}, Pickup: ${pickupTime}, Expires: ${new Date(expiryDate).toLocaleString()}`);
        } else {
            formData.append('description', description);
        }

        try {
            const response = await api.post("/api/food", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log(response.data);

            // Redirect to the food partner's profile page after successful creation
            const foodPartnerId = response.data.food.foodPartner;
            navigate(`/food-partner/${foodPartnerId}`);
        } catch (error) {
            console.error("Error creating food:", error);
            alert("Failed to save food. Please try again.");
        }
    };

    const isDisabled = useMemo(() => !name.trim() || !videoFile, [name, videoFile]);

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create Food</h1>
                    <p className="create-food-subtitle">Upload a short video, give it a name, and add a description.</p>
                </header>

                <form className="create-food-form" onSubmit={onSubmit}>
                    {/* TOGGLE SWITCH: Sell vs Donate */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 p-1 rounded-full flex gap-1 relative w-full max-w-sm border border-gray-200">
                            <button
                                type="button"
                                onClick={() => setIsDonation(false)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${!isDonation ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Store className="w-4 h-4" />
                                Post to Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsDonation(true)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${isDonation ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Heart className="w-4 h-4" />
                                Donate Food
                            </button>
                        </div>
                    </div>

                    {isDonation && (
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                            <div className="bg-orange-100 p-2 rounded-full shrink-0">
                                <Sparkles className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-orange-900 text-sm">You are an Annapurna Hero! 🧡</h3>
                                <p className="text-orange-800/80 text-xs mt-1">This food will be marked as a donation. Volunteers nearby will be notified to pick it up.</p>
                            </div>
                        </div>
                    )}

                    <div className="field-group">
                        <label htmlFor="foodVideo">Food Video</label>
                        <input
                            id="foodVideo"
                            ref={fileInputRef}
                            className="file-input-hidden"
                            type="file"
                            accept="video/*"
                            onChange={onFileChange}
                        />

                        <div
                            className={`file-dropzone ${isDonation ? 'border-orange-200 bg-orange-50/50' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            <div className="file-dropzone-inner">
                                <svg className={`file-icon ${isDonation ? 'text-orange-400' : ''}`} width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M10.8 3.2a1 1 0 0 1 .4-.08h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1h1.6V3.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .6.2z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" fill="currentColor" />
                                </svg>
                                <div className="file-dropzone-text">
                                    <strong>Tap to upload</strong> or drag and drop
                                </div>
                                <div className="file-hint">MP4, WebM, MOV • Up to ~100MB</div>
                            </div>
                        </div>

                        {fileError && <p className="error-text" role="alert">{fileError}</p>}

                        {videoFile && (
                            <div className="file-chip" aria-live="polite">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" />
                                </svg>
                                <span className="file-chip-name">{videoFile.name}</span>
                                <span className="file-chip-size">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                                <div className="file-chip-actions">
                                    <button type="button" className="btn-ghost" onClick={openFileDialog}>Change</button>
                                    <button type="button" className="btn-ghost danger" onClick={() => { setVideoFile(null); setFileError(''); }}>Remove</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {videoURL && (
                        <div className="video-preview">
                            <video className="video-preview-el" src={videoURL} controls playsInline preload="metadata" />
                        </div>
                    )}

                    <div className="field-group">
                        <label htmlFor="foodName">Name</label>
                        <input
                            id="foodName"
                            type="text"
                            placeholder={isDonation ? "e.g., Leftover Rice & Curry" : "e.g., Spicy Paneer Wrap"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {isDonation ? (
                        /* DONATION SPECIFIC FIELDS */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="field-group">
                                <label htmlFor="foodQuantity">Quantity</label>
                                <input
                                    id="foodQuantity"
                                    type="text"
                                    placeholder="e.g., 5kg or 10 servings"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="field-group">
                                <label htmlFor="pickupTime">Best Pickup Time (Text)</label>
                                <input
                                    id="pickupTime"
                                    type="text"
                                    placeholder="e.g., Before 6PM today"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="field-group md:col-span-2">
                                <label htmlFor="expiryDate">Expires At (Auto-Remove)</label>
                                <input
                                    id="expiryDate"
                                    type="datetime-local"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-lg"
                                />
                                <p className="text-xs text-gray-500 mt-1">The listing will automatically disappear from the feed after this time.</p>
                            </div>
                        </div>
                    ) : (
                        /* STANDARD DESCRIPTION */
                        <div className="field-group">
                            <label htmlFor="foodDesc">Description</label>
                            <textarea
                                id="foodDesc"
                                rows={4}
                                placeholder="Write a short description: ingredients, taste, spice level, etc."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            className={`btn-primary w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isDonation ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200 shadow-lg' : ''}`}
                            type="submit"
                            disabled={isDisabled}
                        >
                            {isDonation ? (
                                <>Donate Food <Heart className="w-5 h-5 fill-white" /></>
                            ) : (
                                "Save Food"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;