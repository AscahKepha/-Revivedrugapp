import React from "react";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaPaperPlane, FaUser, FaBullhorn, FaHandsHelping } from 'react-icons/fa';
// Ensure this path matches your folder structure
import contactImage from '../assets/Screenshot 2026-04-23 125632.png'; 
// import { NavbarH } from "../components/Home/Navbarhome";

export const Contact: React.FC = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden md:grid md:grid-cols-2 gap-0 border border-teal-100">
                
                {/* Left Section: Image & Brand Intro */}
                <div className="relative bg-teal-700 flex flex-col items-center justify-center p-8 text-white">
                    <div className="z-10 text-center mb-6">
                        <h2 className="text-3xl font-bold mb-2">Your Journey, Our Mission.</h2>
                        <p className="text-teal-100 italic">"Recovery is not a race, it's a journey."</p>
                    </div>
                    <img
                        src={contactImage}
                        alt="Support Team"
                        className="z-10 rounded-2xl shadow-2xl max-w-full h-auto object-cover border-4 border-teal-600/50 transition-transform hover:scale-105 duration-500"
                    /> 
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600 rounded-full -mr-16 -mt-16 opacity-50"></div>
                </div>

                {/* Right Section: Contact Form and Info */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-teal-800 mb-2">
                            Get in Touch
                        </h1>
                        <p className="text-gray-500">Have questions about Drug-Revive? Our team is here to support you.</p>
                    </header>

                    {/* Contact Form */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaPaperPlane className="mr-3 text-teal-500" /> Send a Secure Message
                        </h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-teal-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Your Full Name"
                                />
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-teal-400" />
                                </div>
                                <input
                                    type="email"
                                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Email Address"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaPhoneAlt className="h-5 w-5 text-teal-400" />
                                </div>
                                <input
                                    type="tel"
                                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Phone Number"
                                />
                            </div>

                            <textarea
                                rows={4}
                                className="block w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                placeholder="How can we help you today?"
                            ></textarea>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all transform hover:-translate-y-1"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Support Resources */}
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <h2 className="text-lg font-bold text-emerald-800 mb-4 flex items-center">
                            <FaHandsHelping className="mr-2 text-emerald-600" /> Immediate Support
                        </h2>
                        
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-center group">
                                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:bg-teal-500 transition-colors">
                                    <FaPhoneAlt className="text-teal-600 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Helpline</p>
                                    <p className="font-semibold">+254 700 000 000</p>
                                </div>
                            </li>
                            <li className="flex items-center group">
                                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:bg-teal-500 transition-colors">
                                    <FaEnvelope className="text-teal-600 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Email Support</p>
                                    <p className="font-semibold">support@drugrevive.com</p>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-6 pt-4 border-t border-emerald-200">
                            <p className="text-xs text-emerald-700 font-medium">
                                <FaBullhorn className="inline mr-1" /> 
                                Subscribe to our newsletter for recovery tips and community updates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;