import React from 'react';
import '../../styles/footer.css';
import { Github, Linkedin, Instagram, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10 font-sans">
            <div className="container mx-auto px-6 md:px-12">

                {/* TOP SECTION: Brand & Socials */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">

                    {/* Brand / Logo Area */}
                    <div className="max-w-md space-y-6">
                        <div className="flex items-center gap-3">
                            {/* Optional: Add a small logo icon here if available */}
                            <h2 className="text-3xl font-black tracking-tight uppercase">FoodView</h2>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Connecting food lovers with the best culinary experiences and uniting communities against hunger through the <span className="text-orange-500 font-medium">Annapurna Initiative</span>.
                        </p>
                    </div>

                    {/* Social Connect */}
                    <div className="flex flex-col gap-6">
                        <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Connect</span>
                        <div className="flex items-center gap-4">
                            <SocialLink href="https://github.com/SiddharthChaturvedii" label="GitHub" icon={<Github className="w-6 h-6" />} />
                            <SocialLink href="https://www.linkedin.com/in/siddharth-chaturvedi-75772b250" label="LinkedIn" icon={<Linkedin className="w-6 h-6" />} />
                            <SocialLink href="https://www.instagram.com/siddharthhhhh._/?hl=en" label="Instagram" icon={<Instagram className="w-6 h-6" />} />
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="w-full h-px bg-white/10 mb-10" />

                {/* BOTTOM SECTION: Copyright & Links */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">

                    {/* Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
                        <span>&copy; {currentYear} FoodView Inc.</span>
                        <span className="hidden md:block w-1 h-1 bg-gray-700 rounded-full" />
                        <span>All rights reserved.</span>
                    </div>

                    {/* Navigation Links */}
                    <nav>
                        <ul className="flex flex-wrap justify-center gap-8">
                            <FooterLink to="/home">Home</FooterLink>
                            <FooterLink to="/explore">Trending</FooterLink>
                            <FooterLink to="/saved">Collections</FooterLink>
                            <FooterLink to="/annapurna">Annapurna</FooterLink>
                        </ul>
                    </nav>
                </div>

                {/* Credits - Subtle */}
                <div className="mt-12 text-center text-xs text-gray-700">
                    <p className="flex items-center justify-center gap-1">
                        Designed & Developed by <span className="text-gray-500 font-medium">Siddharth Chaturvedi</span>
                        <span className="mx-2">•</span>
                        Made with <Heart className="w-3 h-3 text-red-900 fill-current" />
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Helper Components
const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="p-3 bg-white/5 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-gray-300 hover:text-white"
    >
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="hover:text-white transition-colors duration-200 font-medium">
            {children}
        </Link>
    </li>
);

export default Footer;
