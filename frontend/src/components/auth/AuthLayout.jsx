import React from 'react';
import { FloatingFoodHero } from '../ui/FloatingFoodHero';

const heroImages = [
    {
        src: 'https://b.zmtcdn.com/data/o2_assets/110a09a9d81f0e5305041c1b507d0f391743058910.png',
        alt: 'A delicious cheeseburger',
        // Increased size: w-16->w-24, md:w-24->md:w-36
        className: 'w-24 md:w-36 top-[15%] left-[5%] md:left-[22%] animate-float',
    },
    {
        src: 'https://b.zmtcdn.com/data/o2_assets/b4f62434088b0ddfa9b370991f58ca601743060218.png',
        alt: 'A bamboo steamer with dumplings',
        // Increased size: w-14->w-20, md:w-20->md:w-28
        className: 'w-20 md:w-28 top-[12%] right-[5%] md:right-[20%] animate-float',
    },
    {
        src: 'https://b.zmtcdn.com/data/o2_assets/316495f4ba2a9c9d9aa97fed9fe61cf71743059024.png',
        alt: 'A slice of pizza',
        // Increased size: w-16->w-24, md:w-24->md:w-36
        className: 'w-24 md:w-36 bottom-[15%] right-[5%] md:right-[22%] animate-float',
    },
    {
        src: 'https://b.zmtcdn.com/data/o2_assets/70b50e1a48a82437bfa2bed925b862701742892555.png',
        alt: 'A basil leaf',
        // Increased size: w-6->w-10, md:w-10->md:w-16
        className: 'w-10 md:w-16 top-[40%] left-[5%] md:left-[25%] animate-float',
    },
    {
        src: 'https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png',
        alt: 'A slice of tomato',
        // Increased size: w-8->w-12, md:w-12->md:w-20
        className: 'w-12 md:w-20 top-[55%] right-[5%] md:right-[25%] animate-float',
    },
    {
        src: 'https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png',
        alt: 'A slice of tomato',
        // Increased size: w-8->w-12, md:w-12->md:w-20
        className: 'w-12 md:w-20 bottom-[25%] left-[5%] md:left-[18%] animate-float',
    },
];

const AuthLayout = ({ children }) => {
    return (
        <FloatingFoodHero images={heroImages}>
            {children}
        </FloatingFoodHero>
    );
};

export default AuthLayout;
