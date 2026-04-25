import type React from "react";
import { FaHandshakeSimple } from "react-icons/fa6";
import { BiSolidDonateHeart, BiSolidPhoneCall } from "react-icons/bi";
import { IoNewspaperSharp } from "react-icons/io5";

export const Footerh: React.FC = () => {
    return (
        <footer className="bg-white text-gray-800 py-12 px-4 md:px-8 lg:px-16 border-t border-teal-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12 items-center text-center md:text-left">
                
                {/* Left Column: Community & Partners */}
                <div className="flex flex-col space-y-5 order-1">
                    <a href="/adopt" className="flex items-center justify-center md:justify-start text-lg font-semibold text-teal-700 hover:text-emerald-500 transition-all duration-300 group">
                        <BiSolidDonateHeart className="text-2xl mr-3 group-hover:scale-110 transition-transform" />
                        Adopt a patient
                    </a>
                    <a href="/partners" className="flex items-center justify-center md:justify-start text-lg font-semibold text-teal-700 hover:text-emerald-500 transition-all duration-300 group">
                        <FaHandshakeSimple className="text-2xl mr-3 group-hover:scale-110 transition-transform" />
                        Our trusted partners
                    </a>
                </div>

                {/* Middle Column: Branding & Copyright */}
                <div className="order-3 lg:order-2 md:col-span-2 lg:col-span-1 flex flex-col items-center">
                    <div className="mb-4">
                        <h2 className="text-xl font-black tracking-tighter text-teal-900">
                            Drug-<span className="text-emerald-500">Revive</span>
                        </h2>
                    </div>
                    <div className="text-base text-gray-500 space-y-1">
                        <p>© 2026 Drug-Revive Services. All rights reserved.</p>
                        <p className="font-medium text-teal-600/70">Wellness in Your Hands.</p>
                        <p className="text-sm italic text-gray-400">Together Towards a Healthier Tomorrow.</p>
                    </div>
                </div>

                {/* Right Column: News & Support */}
                <div className="flex flex-col space-y-5 order-2 lg:order-3">
                    <a href="/news" className="flex items-center justify-center md:justify-start lg:justify-end text-lg font-semibold text-teal-700 hover:text-emerald-500 transition-all duration-300 group">
                        <IoNewspaperSharp className="text-2xl mr-3 lg:ml-3 lg:mr-0 lg:order-2 group-hover:scale-110 transition-transform" />
                        <span className="lg:order-1">Notifications and news</span>
                    </a>
                    <a href="/support" className="flex items-center justify-center md:justify-start lg:justify-end text-lg font-semibold text-red-600 hover:text-red-700 transition-all duration-300 group">
                        <BiSolidPhoneCall className="text-2xl mr-3 lg:ml-3 lg:mr-0 lg:order-2 animate-pulse" />
                        <span className="lg:order-1 font-bold">24/7 Hotline numbers</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footerh;