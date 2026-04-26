import React from 'react';
import { FaLocationDot } from 'react-icons/fa6';
// Ensure this path matches where you keep your map screenshot
import locationImg from '../assets/Screenshot 2025-07-09 002150.png'; 
import { NavbarH } from '../components/Home/Navbarhome';

export const Locations: React.FC = () => {
    // You can swap these for real coordinates later if you use the Google Maps API
    const googleMapsUrl = "https://www.google.com/maps/search/Kiamunyi+Baraka+Nakuru";

    return (
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center">

            <div className="max-w-7xl w-full">
                <NavbarH />

                {/* Header with Gradient Text */}
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                    <FaLocationDot className="inline-block align-middle mr-3 text-emerald-500" size={36} />
                    Find Our Recovery Centers
                </h1>

                {/* Main Card Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch p-4 lg:p-8 rounded-lg shadow-xl bg-gray-50 border border-gray-100">
                    
                    {/* Left side: Map Visual */}
                    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-md border border-gray-200">
                        <img 
                            src={locationImg}
                            alt='Drug-Revive Location Map'
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Right side: Center Details */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-lg shadow-md flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-emerald-300 pb-3">
                            Primary Center
                        </h2>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Address:</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                <strong className="text-gray-800">Drug-Revive Recovery Companion</strong><br />
                                Kiamunyi Baraka Area,<br />
                                Nakuru, Kenya
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Support Line:</h3>
                            <p className="text-lg text-gray-600">+254 700 000 000</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Inquiries:</h3>
                            <p className="text-lg text-gray-600">support@drugrevive.com</p>
                        </div>

                        <div className="mt-8">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-1"
                            >
                                Get Directions on Google Maps
                                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Locations;