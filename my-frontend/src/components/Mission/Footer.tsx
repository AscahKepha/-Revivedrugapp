import React from "react";
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";
import Container from "../Container"; // Using the container component you shared!

export const FooterS: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-teal-100 pt-12 pb-8">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div className="md:col-span-1 space-y-4">
                        <h2 className="text-2xl font-black text-teal-700 tracking-tight">
                            DRUG-REVIVE
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Empowering individuals through data-driven recovery and community support. Your journey to revival starts with a single step.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Platform</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/dashboard" className="hover:text-teal-600 transition-colors">Patient Dashboard</a></li>
                            <li><a href="/support" className="hover:text-teal-600 transition-colors">Find a Partner</a></li>
                            <li><a href="/resources" className="hover:text-teal-600 transition-colors">Recovery Resources</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/contact" className="hover:text-teal-600 transition-colors">Contact Us</a></li>
                            <li><a href="/privacy" className="hover:text-teal-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-teal-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Follow the Revival</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors text-xl">
                                <FaFacebook />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors text-xl">
                                <FaTwitter />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors text-xl">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors text-xl">
                                <FaLinkedin />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors text-xl">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
                    <p>© {currentYear} Drug-Revive. All rights reserved.</p>
                    <p className="flex items-center mt-4 md:mt-0">
                        Made with <FaHeart className="mx-1 text-red-400" /> for a healthier tomorrow.
                    </p>
                </div>
            </Container>
        </footer>
    );
};

export default FooterS;