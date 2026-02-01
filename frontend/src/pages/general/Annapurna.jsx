import React from "react";
import { Hero } from "@/components/ui/animated-hero";

const Annapurna = () => {
    return (
        <div className="dark min-h-screen bg-background text-foreground flex flex-col">
            <main className="flex-1 flex items-center justify-center">
                <Hero />
            </main>
        </div>
    );
};

export default Annapurna;
