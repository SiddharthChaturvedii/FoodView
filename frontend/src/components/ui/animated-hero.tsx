import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Sparkles } from "lucide-react";

function Hero() {
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
                        <a href="#mission" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 border border-[#1A1A1A]/5 backdrop-blur-md text-base md:text-lg font-medium text-orange-800 shadow-sm hover:bg-white/60 transition-colors cursor-pointer">
                            <Sparkles className="w-5 h-5 text-orange-600" />
                            <span>Discover our mission</span>
                        </a>
                    </div>

                    {/* TEXT CONTENT */}
                    <div className="flex flex-col items-center justify-center w-full z-20">
                        {/* Static Text - Massive */}
                        <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-[#1A1A1A] leading-none m-0">
                            Annapurna is
                        </h1>

                        {/* Rotating Text Container - Adapted from Reference */}
                        {/* Using flex and explicit height management via &nbsp; trick + absolute positioning */}
                        <div className="relative flex w-full justify-center overflow-visible text-center mt-6 md:mt-10">
                            <span className="text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-transparent select-none leading-none">
                                &nbsp; {/* Invisible placeholder to hold height */}
                            </span>

                            {titles.map((title, index) => (
                                <motion.span
                                    key={index}
                                    className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-orange-600 leading-none drop-shadow-sm"
                                    initial={{ opacity: 0, y: "-100" }} // Reference code initial
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

                    {/* Special Buttons */}
                    <div className="flex flex-row gap-8 mt-32 z-20 justify-center items-center flex-wrap">
                        {/* Primary Button */}
                        <button className="group relative px-10 py-5 bg-[#1A1A1A] text-[#FFF5E1] font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-100 group-hover:opacity-90 transition-opacity" />
                            <span className="relative flex items-center gap-3">
                                Donate Now <Sparkles className="w-6 h-6 text-orange-400" />
                            </span>
                        </button>

                        {/* Secondary Button */}
                        <button className="group px-10 py-5 bg-white/50 border border-[#1A1A1A]/10 text-[#1A1A1A] font-bold text-xl rounded-full backdrop-blur-sm transition-all hover:bg-white/80 hover:border-[#1A1A1A]/30 shadow-sm">
                            <span className="flex items-center gap-3">
                                Get Involved <MoveRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero };
