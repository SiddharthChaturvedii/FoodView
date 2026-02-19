import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../utils/api';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Store, MapPin, Loader2 } from 'lucide-react';

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

    // Location State
    const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'user' && !isDonation) {
            setIsDonation(true);
        }
    }, [isDonation]);

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

    const handleGetLocation = () => {
        setIsLocating(true);
        setLocationError('');
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));

                // Reverse geocode to auto-fill address
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                'Accept-Language': 'en'
                            }
                        }
                    );
                    const data = await response.json();
                    if (data.display_name) {
                        setLocation(prev => ({ ...prev, address: data.display_name }));
                    }
                } catch (geoError) {
                    // Silently fail — user can still type the address manually
                    console.error("Reverse geocoding failed:", geoError);
                }

                setIsLocating(false);
            },
            (error) => {
                setLocationError("Unable to retrieve your location");
                setIsLocating(false);
            }
        );
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

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

            // Append Location
            formData.append('location', JSON.stringify(location));
        } else {
            formData.append('description', description);
        }

        try {
            const response = await api.post("/api/food", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // console.log(response.data);
            setSuccessMessage('✅ Food saved successfully! Redirecting...');

            // Redirect to the food partner's profile page after successful creation
            const foodPartnerId = response.data.food.foodPartner;
            setTimeout(() => {
                navigate(`/food-partner/${foodPartnerId}`);
            }, 1500);

        } catch (error) {
            // Error handled in UI
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to save food. Please check your connection and try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = useMemo(() => {
        if (!name.trim() || !videoFile) return true;
        if (isDonation) {
            return !quantity || !pickupTime || !expiryDate || !location.lat || !location.address;
        }
        return false;
    }, [name, videoFile, isDonation, quantity, pickupTime, expiryDate, location]);

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create Food</h1>
                    <p className="create-food-subtitle">Upload a short video, give it a name, and add a description.</p>
                </header>

                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                {successMessage && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">{successMessage}</div>}

                <form className="create-food-form" onSubmit={onSubmit}>
                    {/* TOGGLE SWITCH: Sell vs Donate (Hidden for Users) */}
                    {localStorage.getItem('userRole') !== 'user' && (
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
                    )}

                    {/* Auto-set Donation mode for Users handled in useEffect */}
                    {/* Only show label for Users, no toggle/button needed as it's auto-set */}
                    {localStorage.getItem('userRole') === 'user' && (
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-orange-600 flex items-center justify-center gap-2">
                                <Heart className="fill-orange-600" /> Donate Food
                            </h2>
                            <p className="text-sm text-gray-500">Your contribution helps feed the hungry.</p>
                        </div>
                    )}

                    {
                        isDonation && (
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <div className="bg-orange-100 p-2 rounded-full shrink-0">
                                    <Sparkles className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-orange-900 text-sm">You are an Annapurna Hero! 🧡</h3>
                                    <p className="text-orange-800/80 text-xs mt-1">This food will be marked as a donation. Volunteers nearby will be notified to pick it up.</p>
                                </div>
                            </div>
                        )
                    }

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

                    {
                        videoURL && (
                            <div className="video-preview">
                                <video className="video-preview-el" src={videoURL} controls playsInline preload="metadata" />
                            </div>
                        )
                    }

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

                    {
                        isDonation ? (
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

                                {/* LOCATION SECTION */}
                                <div className="field-group md:col-span-2">
                                    <label className="flex items-center justify-between">
                                        Pickup Location
                                        {location.lat && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><MapPin className="w-3 h-3" /> Location Captured</span>}
                                    </label>

                                    <div className="flex gap-2 mb-2">
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            disabled={isLocating || location.lat}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${location.lat ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'}`}
                                        >
                                            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                                            {location.lat ? "Location Detected" : "Detect My Location"}
                                        </button>
                                    </div>

                                    {locationError && <p className="text-red-500 text-xs mb-2">{locationError}</p>}

                                    <input
                                        type="text"
                                        placeholder="Enter complete address (e.g., House No, Street, Landmark)"
                                        value={location.address}
                                        onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full p-3 border rounded-lg text-sm"
                                        required
                                    />
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
                        )
                    }

                    <div className="form-actions">
                        <button
                            className={`btn-primary w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isDonation ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200 shadow-lg' : ''}`}
                            type="submit"
                            disabled={isDisabled || isLoading}
                        >
                            {isLoading ? (
                                <>Saving... <Loader2 className="w-5 h-5 animate-spin" /></>
                            ) : (
                                isDonation ? (
                                    <>Donate Food <Heart className="w-5 h-5 fill-white" /></>
                                ) : (
                                    "Save Food"
                                )
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CreateFood;