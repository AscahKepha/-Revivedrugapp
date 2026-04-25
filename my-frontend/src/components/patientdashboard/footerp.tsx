import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/dashboard" className="flex items-center gap-2 mb-6 group">
              <div className="bg-emerald-600 p-2 rounded-xl text-white">
                <HeartPulse size={20} />
              </div>
              <span className="text-lg font-black tracking-tighter text-gray-900 uppercase">
                Drug<span className="text-emerald-600">-Revive</span>
              </span>
            </Link>
            <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
              Empowering recovery through community, technology, and real-time support systems. 
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/dashboard" label="Dashboard" /></li>
              <li><FooterLink to="/support-circle" label="Support Circle" /></li>
              <li><FooterLink to="/check-in" label="Daily Check-in" /></li>
              <li><FooterLink to="/scores" label="Performance" /></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/help-now" label="Emergency SOS" /></li>
              <li><FooterLink to="/privacy" label="Privacy Policy" /></li>
              <li><FooterLink to="/terms" label="Terms of Service" /></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <ContactItem icon={<Mail size={14} />} text="support@drugrevive.com" />
              <ContactItem icon={<Phone size={14} />} text="+254 700 000 000" />
              <ContactItem icon={<MapPin size={14} />} text="Nyahururu, Kenya" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            © {currentYear} Drug-Revive. Built by Ascah Moraa.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <SocialIcon icon={<Github size={18} />} href="#" />
            <SocialIcon icon={<Linkedin size={18} />} href="#" />
            <SocialIcon icon={<Twitter size={18} />} href="#" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Sub-components for cleaner code
const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <Link 
    to={to} 
    className="text-xs font-black text-gray-600 uppercase tracking-tight hover:text-emerald-600 transition-colors"
  >
    {label}
  </Link>
);

const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
    <span className="text-emerald-500">{icon}</span>
    {text}
  </div>
);

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
  >
    {icon}
  </a>
);

export default Footer;