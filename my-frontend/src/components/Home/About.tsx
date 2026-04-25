import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Container from '../container'; // Keeping that layout consistent!

export const About: React.FC = () => {
    return (
        <section className="bg-teal-900 text-teal-50 py-20 px-4">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Quick Navigation */}
                    <div>
                        <h3 className="text-2xl font-black mb-6 text-emerald-400 border-b border-teal-800 pb-2 uppercase tracking-tighter">
                            Explore
                        </h3>
                        <ul className="space-y-3 text-lg font-medium opacity-90">
                            <li className="hover:text-emerald-300 transition-colors cursor-pointer">Home</li>
                            <li className="hover:text-emerald-300 transition-colors cursor-pointer">Our Mission</li>
                            <li className="hover:text-emerald-300 transition-colors cursor-pointer">Success Stories</li>
                            <li className="hover:text-emerald-300 transition-colors cursor-pointer">Find a Partner</li>
                            <li className="hover:text-emerald-300 transition-colors cursor-pointer">Adopt a Patient</li>
                        </ul>
                    </div>

                    {/* Column 2: What We Offer */}
                    <div>
                        <h3 className="text-2xl font-black mb-6 text-emerald-400 border-b border-teal-800 pb-2 uppercase tracking-tighter">
                            Our Focus
                        </h3>
                        <ul className="space-y-3 text-lg font-medium opacity-90">
                            <li>Recovery Tracking</li>
                            <li>Mental Wellness</li>
                            <li>Community Support</li>
                            <li>Outreach Programs</li>
                            <li>Resource Library</li>
                        </ul>
                    </div>

                    {/* Column 3: Regional Presence */}
                    <div>
                        <h3 className="text-2xl font-black mb-6 text-emerald-400 border-b border-teal-800 pb-2 uppercase tracking-tighter">
                            Our Reach
                        </h3>
                        <ul className="space-y-4 text-sm font-medium opacity-90">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-2 text-emerald-400" />
                                <span>Nakuru: Westside Mall Area</span>
                            </li>
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-2 text-emerald-400" />
                                <span>Nairobi: Upperhill Plaza</span>
                            </li>
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-2 text-emerald-400" />
                                <span>Eldoret: Infa Building, 3rd Floor</span>
                            </li>
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-2 text-emerald-400" />
                                <span>Nyahururu: Town Center</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Stay Connected */}
                    <div>
                        <h3 className="text-2xl font-black mb-6 text-emerald-400 border-b border-teal-800 pb-2 uppercase tracking-tighter">
                            Talk to Us
                        </h3>
                        <div className="space-y-4">
                            <a href="tel:0166728" className="flex items-center hover:text-emerald-300 transition-colors">
                                <FaPhoneAlt className="mr-3" /> 016 672 8
                            </a>
                            <a href="mailto:revive@drugrevive.com" className="flex items-center hover:text-emerald-300 transition-colors">
                                <FaEnvelope className="mr-3" /> hello@drugrevive.com
                            </a>
                            <div className="flex space-x-4 mt-6">
                                <FaInstagram className="text-2xl cursor-pointer hover:text-emerald-400" />
                                <FaLinkedin className="text-2xl cursor-pointer hover:text-emerald-400" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Slogan */}
                <div className="mt-16 pt-8 border-t border-teal-800 text-center opacity-60 text-sm italic">
                    "Healing the community, one step at a time."
                </div>
            </Container>
        </section>
    );
};

export default About;