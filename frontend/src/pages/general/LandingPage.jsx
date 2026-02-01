import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, Play, Heart } from "lucide-react";
import { Link } from "react-router-dom";

// Transparent Navbar Component
const Navbar = () => (
    <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-4 bg-transparent">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
            <span
                className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight transition-all group-hover:text-orange-400"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
                FoodView
            </span>
        </Link>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3 md:gap-5">
            <Link
                to="/explore"
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
            >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Reels</span>
            </Link>
            <Link
                to="/annapurna"
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold text-white bg-orange-600/80 backdrop-blur-sm border border-orange-500/50 rounded-full hover:bg-orange-500 transition-all"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
            >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Annapurna</span>
            </Link>
        </div>
    </nav>
);
gsap.registerPlugin(ScrollTrigger);

const frameCount = 192;
const generateFramePath = (index) =>
    `/hero-frames/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

const LandingPage = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray = [];

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = generateFramePath(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };
            imgArray.push(img);
        }
        setImages(imgArray);
    }, []);

    useGSAP(() => {
        if (!isLoaded || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const render = (index) => {
            if (images[index]) {
                // Calculate cover sizing
                const scale = Math.max(canvas.width / images[index].width, canvas.height / images[index].height);
                const x = (canvas.width / 2) - (images[index].width / 2) * scale;
                const y = (canvas.height / 2) - (images[index].height / 2) * scale;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(images[index], x, y, images[index].width * scale, images[index].height * scale);
            }
        };

        // Initial Render
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(0);

        // Resize Handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-render current frame (we'd need to track it, but for simplicity re-render 0 or rely on scroll update)
        };
        window.addEventListener("resize", handleResize);

        const frameObject = { frame: 0 };

        // Scroll Animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400%", // Scroll distance (4x screen height)
                scrub: 0.5,
                pin: true,
                onUpdate: (self) => {
                    // Optional: Parallax or other effects based on self.progress
                }
            },
        });

        tl.to(frameObject, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            onUpdate: () => render(Math.round(frameObject.frame)),
        });

        // Text Animations
        gsap.fromTo(textRef.current.children,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "20% top",
                    toggleActions: "play none none reverse"
                }
            }
        );

        return () => window.removeEventListener("resize", handleResize);

    }, [isLoaded]);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
            {/* Transparent Navbar */}
            <Navbar />

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-50 text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm tracking-widest uppercase animate-pulse">Loading Experience...</p>
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-gradient-to-b from-black/30 via-black/40 to-black/70">
                <div ref={textRef} className="text-center">
                    <h1
                        className="text-6xl md:text-9xl font-black text-white tracking-tight uppercase mb-4"
                        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)' }}
                    >
                        FoodView
                    </h1>
                    <p
                        className="text-xl md:text-3xl text-white font-medium tracking-[0.3em] uppercase"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                    >
                        Discover • Share • Savor
                    </p>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                <ArrowDown className="w-8 h-8" />
            </div>
        </div>
    );
};

export default LandingPage;
