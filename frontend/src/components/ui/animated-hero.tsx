import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight, Sparkles } from "lucide-react";

interface HeroProps {
    onDonateClick?: () => void;
}

function Hero({ onDonateClick }: HeroProps) {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["impactful", "transparent", "compassionate", "vital", "community-led"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full relative overflow-hidden bg-[#FFF5E1] text-[#1A1A1A] min-h-[90vh] flex items-center justify-center font-sans">
            {/* Background Gradient - Subtle Orange Warmth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-orange-400/20 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="container mx-auto px-4 relative z-10 w-full">
                <div className="flex flex-col items-center justify-center text-center">


                    {/* TEXT CONTENT */}
                    <div className="flex flex-col items-center justify-center w-full z-20 mt-8 md:mt-0">
                        {/* Static Text - MASSIVE on all devices */}
                        <h1 className="text-[15vw] sm:text-8xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-[#1A1A1A] leading-[0.9] m-0">
                            Annapurna is
                        </h1>

                        {/* Rotating Text Container */}
                        <div className="relative flex w-full justify-center overflow-visible text-center mt-2 md:mt-4">
                            <span className="text-[15vw] sm:text-8xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-transparent select-none leading-none">
                                &nbsp;
                            </span>

                            {titles.map((title, index) => (
                                <motion.span
                                    key={index}
                                    className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center text-[15vw] sm:text-8xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-orange-600 leading-none drop-shadow-sm"
                                    initial={{ opacity: 0, y: "-100" }}
                                    transition={{ type: "spring", stiffness: 50 }}
                                    animate={
                                        titleNumber === index
                                            ? {
                                                y: 0,
                                                opacity: 1,
                                            }
                                            : {
                                                y: titleNumber > index ? -150 : 150,
                                                opacity: 0,
                                            }
                                    }
                                >
                                    {title}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Description Line */}
                    <p className="text-base sm:text-xl md:text-3xl text-gray-700 max-w-4xl font-light tracking-wide mt-8 md:mt-24 z-20 px-4 text-center">
                        Bridging the gap between <span className="text-[#1A1A1A] font-semibold">surplus</span> and <span className="text-[#1A1A1A] font-semibold">scarcity</span>.
                        Join us to nourish communities.
                    </p>

                    {/* Buttons Container — Centered, auto width */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 md:mt-16 z-20 justify-center items-center w-full">
                        {/* Primary Button: Donate Now */}
                        <button
                            onClick={onDonateClick}
                            className="px-8 sm:px-12 md:px-16 py-3 md:py-4 bg-orange-500 text-black font-bold text-base md:text-xl rounded-full shadow-lg hover:bg-black hover:text-orange-500 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 w-auto"
                        >
                            Donate Now
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        {/* Secondary Button: Get Involved */}
                        <a
                            href="#stories"
                            className="px-8 sm:px-12 md:px-16 py-3 md:py-4 bg-orange-500 text-black font-bold text-base md:text-xl rounded-full shadow-lg hover:bg-black hover:text-orange-500 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 w-auto"
                        >
                            Get Involved
                            <MoveRight className="w-4 h-4 md:w-5 md:h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero };
