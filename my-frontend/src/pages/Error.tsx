import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

export const Error: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        
        {/* The 404 with your brand color */}
        <h1 className="text-[12rem] font-black text-teal-100 leading-none mb-0 drop-shadow-sm select-none">
          404
        </h1>

        {/* Message moved slightly up */}
        <div className="-mt-12 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-teal-900 mb-4 tracking-tighter">
              Lost your way?
            </h2>
            
            <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed font-medium">
              Even the best of us take a wrong turn sometimes. <br className="hidden md:block" /> 
              Let's get you back to the path of revival.
            </p>
            
            {/* Button using Link and Emerald colors */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-10 rounded-2xl text-lg transition-all shadow-xl shadow-emerald-200 transform hover:scale-105 active:scale-95"
            >
              <FaHome size={20} />
              Go Home
            </Link>
        </div>

        {/* Decorative Circle for visual interest */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default Error;