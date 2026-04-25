import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Users, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl text-white">
            <HeartPulse size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">
            Drug<span className="text-emerald-600">-Revive</span>
          </span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-emerald-600 px-4">Login</Link>
          <Link to="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest">
              Join Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            Empowering Recovery in Kenya
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] mb-8">
            Your Journey <br /> 
            <span className="text-emerald-600">Reimagined.</span>
          </h1>
          <p className="text-gray-500 font-bold text-lg mb-10 max-w-md leading-relaxed uppercase tracking-tight">
            A digital sanctuary for recovery, connecting patients with support partners through real-time data and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button className="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
                Start Your Check-in <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Visual Element / Placeholder for Product Image */}
        <div className="relative">
          <div className="bg-emerald-100/50 aspect-square rounded-[4rem] rotate-3 flex items-center justify-center border-4 border-emerald-50 shadow-2xl overflow-hidden">
             <div className="bg-white p-8 rounded-3xl shadow-xl -rotate-3 border border-emerald-100 max-w-xs">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-emerald-600" />
                   <div className="h-4 w-24 bg-gray-100 rounded-full" />
                </div>
                <div className="space-y-2">
                   <div className="h-2 w-full bg-gray-50 rounded-full" />
                   <div className="h-2 w-2/3 bg-gray-50 rounded-full" />
                </div>
                <div className="mt-6 h-10 w-full bg-emerald-50 rounded-xl border border-emerald-100" />
             </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-12 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck size={32} />} 
              title="Secure Privacy" 
              desc="Full control over your data with anonymous chat options for safe expression." 
            />
            <FeatureCard 
              icon={<Users size={32} />} 
              title="Support Circle" 
              desc="Connect with partners who help monitor your progress and provide encouragement." 
            />
            <FeatureCard 
              icon={<Zap size={32} />} 
              title="Real-time Scores" 
              desc="Visualize your recovery journey with detailed daily check-in metrics." 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="text-emerald-600 mb-6 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide leading-loose">{desc}</p>
  </div>
);

export default LandingPage;