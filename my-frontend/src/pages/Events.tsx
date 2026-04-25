import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHistory } from 'react-icons/fa';
import Container from '../components/container';
import Wellnesswalk from "../assets/Screenshot 2026-04-23 135548.png"
import Seminar from "../assets/Screenshot 2026-04-23 140508.png"


const EventsPage: React.FC = () => {
    // Static Data for "Upcoming"
    const upcomingEvents = [
        {
            id: 1,
            title: "Community Wellness Walk",
            date: "May 15, 2026",
            time: "8:00 AM",
            location: "Nakuru Central Park",
            image: Wellnesswalk,
        }
    ];

    // Static Data for "Past"
    const pastEvents = [
        {
            id: 2,
            title: "Youth Mental Health Seminar",
            date: "March 10, 2026",
            location: "Laikipia University",
            image: Seminar,
        },
        {
            id: 3,
            title: "Drug Awareness Workshop",
            date: "Jan 22, 2026",
            location: "Nyahururu Community Hall",
            image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800",
        }
    ];

    return (
        <section className="py-16 bg-white min-h-screen">
            <Container>
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-teal-800 mb-4">Events & Outreach</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg italic">
                        Join our community gatherings or look back at our journey of revival.
                    </p>
                </div>

                {/* --- UPCOMING EVENTS (TOP) --- */}
                <div className="mb-20">
                    <div className="flex items-center mb-8">
                        <FaCalendarAlt className="text-teal-500 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
                    </div>
                    
                    <div className="grid gap-8">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="flex flex-col md:flex-row bg-emerald-50 rounded-3xl overflow-hidden shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
                                <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-8 md:w-2/3 flex flex-col justify-center">
                                    <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest">Next Up</span>
                                    <h3 className="text-3xl font-black text-teal-900 mb-4">{event.title}</h3>
                                    <div className="grid grid-cols-2 gap-4 text-gray-600 mb-6">
                                        <div className="flex items-center"><FaCalendarAlt className="mr-2 text-teal-500" /> {event.date}</div>
                                        <div className="flex items-center"><FaClock className="mr-2 text-teal-500" /> {event.time}</div>
                                        <div className="flex items-center col-span-2"><FaMapMarkerAlt className="mr-2 text-teal-500" /> {event.location}</div>
                                    </div>
                                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl w-fit transition-transform transform hover:scale-105">
                                        Register to Attend
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RECENT EVENTS (PAST) --- */}
                <div>
                    <div className="flex items-center mb-8">
                        <FaHistory className="text-gray-400 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Recent Highlights</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {pastEvents.map(event => (
                            <div key={event.id} className="group cursor-pointer">
                                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <span className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-lg">
                                        Completed
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold text-teal-800">{event.title}</h4>
                                <p className="text-gray-500 text-sm">{event.date} • {event.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default EventsPage;