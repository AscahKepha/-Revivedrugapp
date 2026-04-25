import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import Container from '../components/container';
import Sarah from "../assets/Screenshot 2026-04-23 141852.png";
import john from "../assets/Screenshot 2026-04-23 142318.png"

// Import your images here
// import User1 from "../assets/user1.png"; 

const Testimonials: React.FC = () => {
    const reviews = [
        {
            id: 1,
            name: "Sarah W.",
            role: "Community Member",
            note: "Drug-Revive changed the way I look at recovery. The tracking tools helped me celebrate small wins when I felt like giving up. I'm now 6 months sober!",
            image: Sarah,
        },
        {
            id: 2,
            name: "John",
            role: "Support Partner",
            note: "Being a support partner through this platform has been incredibly rewarding. The interface makes it easy to check up on my friends without being intrusive.",
            image: john,
        },
        {
            id: 3,
            name: "Dr. Lilian M.",
            role: "Clinical Psychologist",
            note: "A much-needed tool for the Kenyan context. It bridges the gap between clinical therapy and daily life support.",
            image: Sarah,
        }
    ];

    return (
        <section className="py-20 bg-teal-50/30 min-h-screen font-inter">
            <Container>
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">Voices of Success</h2>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Stories of <span className="text-emerald-500">Revival</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Hear from the brave individuals and dedicated professionals who make our community thrive.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {reviews.map((item) => (
                        <div key={item.id} className="bg-white p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-white hover:border-emerald-200 transition-all group">
                            <div className="flex items-center mb-6">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-14 h-14 rounded-full object-cover ring-4 ring-emerald-50 mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <p className="text-emerald-600 text-xs font-medium">{item.role}</p>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <FaQuoteLeft className="text-teal-100 text-4xl absolute -top-4 -left-2 opacity-50 group-hover:text-emerald-100 transition-colors" />
                                <p className="relative z-10 text-gray-600 leading-relaxed italic">
                                    "{item.note}"
                                </p>
                            </div>

                            <div className="mt-6 flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="mr-1" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Call to Action */}
                <div className="bg-emerald-600 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Want to share your journey?</h2>
                        <p className="text-emerald-100 mb-10 max-w-xl mx-auto text-lg">
                            Your story could be the spark that helps someone else start their revival. We'd love to hear from you.
                        </p>
                        <button className="bg-white text-emerald-700 font-black py-4 px-10 rounded-2xl shadow-lg hover:bg-teal-50 transition-all transform hover:scale-105">
                            Submit a Testimonial
                        </button>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full opacity-50"></div>
                </div>
            </Container>
        </section>
    );
};

export default Testimonials;