import React, { useRef } from 'react';
import '../../styles/annapurna-teaser.css';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnnapurnaTeaser = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const btnRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%", // Triggers when top of section hits 60% of viewport
                toggleActions: "play none none reverse"
            }
        });

        tl.to([titleRef.current, descRef.current, btnRef.current], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2, // Clean staggered 1-2-3 reveal
            ease: "power3.out"
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="annapurna-teaser">
            <div className="annapurna-bg-wrapper">
                <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop"
                    alt="Volunteers sharing food"
                    className="annapurna-bg"
                />
            </div>

            <div className="annapurna-content">
                <h2 ref={titleRef} className="annapurna-title">Mission: Zero Hunger</h2>
                <p ref={descRef} className="annapurna-desc">
                    We believe no food should go to waste when millions go hungry.
                    Through Annapurna, our partners donate surplus food to local shelters
                    and NGOs. Join us in bridging the gap between abundance and need.
                </p>
                <Link ref={btnRef} to="/annapurna" className="annapurna-btn">
                    <Heart fill="currentColor" className="w-5 h-5 text-red-500" />
                    Join the Cause
                </Link>
            </div>
        </section>
    );
};

export default AnnapurnaTeaser;
