import React from 'react';
import hero1 from "../../assets/Screenshot 2026-04-23 180853.png";

export const Hero: React.FC = () => {
    // Retaining your custom zoom animation
    const customAnimationStyles = `
    @keyframes zoomIn {
        0% { transform: scale(1); }
        50% { transform: scale(1.08); }
        100% { transform: scale(1); }
    }
    .animate-zoomIn-local {
        animation: zoomIn 20s ease-in-out infinite;
    }`;

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            <style>{customAnimationStyles}</style>
            
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoomIn-local"
                style={{ backgroundImage: `url(${hero1})` }}
            ></div>
            
            {/* Gradient Overlay for better text depth */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-teal-900/40 z-10'></div>

            {/* Content Layer */}
            <div className="relative z-20 text-center max-w-5xl px-6">
                <h1 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                    Your Path to <span className="text-emerald-400">Revival</span> Starts Here.
                </h1>
                
                <p className="text-teal-50 text-xl md:text-3xl font-light leading-relaxed max-w-3xl mx-auto mb-10 drop-shadow-md">
                    Building a stronger, healthier community in <span className="font-semibold text-white">Nakuru</span> through compassionate recovery and constant connection.
                </p>

                {/* Call to Action Buttons - Essential for a Hero Section */}
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg">
                        Begin Your Journey
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold py-4 px-10 rounded-full transition-all">
                        Learn Our Mission
                    </button>
                </div>
            </div>
        </section> 
    );
};

export default Hero;