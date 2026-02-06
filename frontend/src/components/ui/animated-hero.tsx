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

                    {/* Mission Tag */}
                    <div className="mb-12">
                        <Link to="/mission" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 border border-[#1A1A1A]/5 backdrop-blur-md text-base md:text-lg font-medium text-orange-800 shadow-sm hover:bg-white/60 transition-colors cursor-pointer">
                            <Sparkles className="w-5 h-5 text-orange-600" />
                            <span>Discover our mission</span>
                        </Link>
                    </div>

                    {/* TEXT CONTENT */}
                    <div className="flex flex-col items-center justify-center w-full z-20">
                        {/* Static Text - Massive */}
                        <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-[#1A1A1A] leading-none m-0">
                            Annapurna is
                        </h1>

                        {/* Rotating Text Container */}
                        <div className="relative flex w-full justify-center overflow-visible text-center mt-2 md:mt-4">
                            <span className="text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-transparent select-none leading-none">
                                &nbsp;
                            </span>

                            {titles.map((title, index) => (
                                <motion.span
                                    key={index}
                                    className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-orange-600 leading-none drop-shadow-sm"
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
                    <p className="text-xl md:text-3xl text-gray-700 max-w-4xl font-light tracking-wide mt-16 md:mt-24 z-20">
                        Bridging the gap between <span className="text-[#1A1A1A] font-semibold">surplus</span> and <span className="text-[#1A1A1A] font-semibold">scarcity</span>.
                        Join us to nourish communities.
                    </p>

                    {/* Special Buttons Container */}
                    <div className="flex flex-row gap-6 mt-16 z-20 justify-center items-center w-full">
                        {/* Primary Button: Donate Now */}
                        <button
                            onClick={onDonateClick}
                            className="px-16 py-4 bg-orange-500 text-black font-bold text-xl rounded-full shadow-lg hover:bg-black hover:text-orange-500 hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            Donate Now
                            <Sparkles className="w-5 h-5" />
                        </button>

                        {/* Secondary Button: Get Involved */}
                        <a
                            href="#stories"
                            className="px-16 py-4 bg-orange-500 text-black font-bold text-xl rounded-full shadow-lg hover:bg-black hover:text-orange-500 hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            Get Involved
                            <MoveRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero };
