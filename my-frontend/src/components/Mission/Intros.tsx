import React from 'react';
import Container from '../container'; // Keeping everything aligned

export const IntroS: React.FC = () => {
    return (
        <section className="py-6 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50">
            <Container>
                <div className="text-center md:text-left max-w-6xl">
                    {/* The "Cute" Title */}
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        <span className="text-teal-600">Drug-</span>
                        <span className="text-emerald-400">Revive</span>
                        <span className="inline-block animate-bounce ml-2 text-2xl">🌱</span>
                    </h1>

                    {/* The Warm & Supportive Words */}
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 italic">
                            Your journey back to <span className="text-teal-500 underline decoration-emerald-200 decoration-4">you</span> starts here.
                        </h2>
                        
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                            Welcome to your safe space. Whether you're here to track your progress, 
                            find a support partner, or just take a breath—we've got your back. 
                            Let's walk this path to wellness together, one small win at a time. ✨
                        </p>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default IntroS;