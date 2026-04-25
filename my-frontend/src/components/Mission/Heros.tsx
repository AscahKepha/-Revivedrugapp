import React from 'react';
import { 
    FaStethoscope, FaBrain, FaDollarSign, FaBookOpen, 
    FaCalendarAlt, FaUserFriends, FaClipboardCheck, FaHandHoldingHeart 
} from 'react-icons/fa';
import { RiMentalHealthFill, RiShieldCrossFill } from "react-icons/ri";
import { GiHealing, GiMedicines } from "react-icons/gi";
import { BiHealth } from "react-icons/bi";
import Container from '../Container'; // Using your Container component

// Small reusable sub-component for the service items
const ServiceCard = ({ icon: Icon, text, colorClass }: { icon: any, text: string, colorClass: string }) => (
    <div className={`flex items-center p-4 ${colorClass} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-x-1`}>
        <Icon className="text-2xl mr-4 flex-shrink-0" />
        <p className="text-md font-medium text-gray-800">{text}</p>
    </div>
);

export const HeroS = () => {
    return (
        <section className="py-16 bg-white">
            <Container>
                <div className="grid md:grid-cols-2 gap-12 bg-white p-8 md:p-12 shadow-2xl rounded-3xl border border-teal-50">

                    {/* Column 1: Core Recovery Services */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-teal-800 flex items-center">
                            <span className="w-2 h-8 bg-teal-500 rounded-full mr-3"></span>
                            Core Recovery Services
                        </h2>
                        <div className="space-y-4">
                            <ServiceCard 
                                icon={FaUserFriends} 
                                text="One-on-One Counseling" 
                                colorClass="bg-teal-50 text-teal-600" 
                            />
                            <ServiceCard 
                                icon={RiMentalHealthFill} 
                                text="Psychological Evaluations" 
                                colorClass="bg-teal-50 text-teal-600" 
                            />
                            <ServiceCard 
                                icon={GiMedicines} 
                                text="Medication Assisted Treatment" 
                                colorClass="bg-teal-50 text-teal-600" 
                            />
                            <ServiceCard 
                                icon={GiHealing} 
                                text="Detoxification Support" 
                                colorClass="bg-teal-50 text-teal-600" 
                            />
                            <ServiceCard 
                                icon={FaClipboardCheck} 
                                text="Personalized Recovery Plans" 
                                colorClass="bg-teal-50 text-teal-600" 
                            />
                        </div>
                    </div>

                    {/* Column 2: Specialized Rehabilitation */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-emerald-800 flex items-center">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
                            Specialized Support
                        </h2>
                        <div className="space-y-4">
                            <ServiceCard 
                                icon={FaBrain} 
                                text="Cognitive Behavioral Therapy" 
                                colorClass="bg-emerald-50 text-emerald-600" 
                            />
                            <ServiceCard 
                                icon={FaHandHoldingHeart} 
                                text="Relapse Prevention Training" 
                                colorClass="bg-emerald-50 text-emerald-600" 
                            />
                            <ServiceCard 
                                icon={RiShieldCrossFill} 
                                text="Crisis Intervention Services" 
                                colorClass="bg-emerald-50 text-emerald-600" 
                            />
                            <ServiceCard 
                                icon={BiHealth} 
                                text="Holistic Wellness Workshops" 
                                colorClass="bg-emerald-50 text-emerald-600" 
                            />
                            <ServiceCard 
                                icon={FaStethoscope} 
                                text="Post-Rehab Medical Checkups" 
                                colorClass="bg-emerald-50 text-emerald-600" 
                            />
                        </div>
                    </div>

                    {/* Footer Sections */}
                    <div className="md:col-span-2 grid md:grid-cols-2 gap-8 mt-8">
                        
                        {/* Insurance */}
                        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-teal-900 flex items-center">
                                <FaDollarSign className="mr-2 text-teal-600" /> Payment & Insurance
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We believe recovery should be accessible. Drug-Revive accepts major health insurance providers and offers flexible NHIF-integrated payment plans.
                            </p>
                        </div>

                        {/* Education */}
                        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-emerald-900 flex items-center">
                                <FaBookOpen className="mr-2 text-emerald-600" /> Patient Resources
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Access our digital library of recovery guides, family support toolkits, and nutritional advice for your journey to wellness.
                            </p>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="md:col-span-2 text-center py-10 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                            Begin Your Revival Today
                        </h2>
                        <p className="text-teal-50 mb-8 max-w-2xl mx-auto">
                            Our team is ready to walk with you. Book a confidential consultation and start your journey back to a healthier life.
                        </p>
                        <button className="bg-white text-teal-700 font-black py-4 px-10 rounded-xl shadow-lg hover:bg-teal-50 transition-all transform hover:scale-105">
                            <FaCalendarAlt className="inline mr-2" /> Book Online Now
                        </button>
                        <p className="text-teal-100 text-xs mt-4 font-medium uppercase tracking-widest">
                            Call us: (0712 344 555) • 24/7 Support Line
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HeroS;