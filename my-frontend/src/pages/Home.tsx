import React from "react";
// import Container from '../components/container';
import { NavbarH } from "../components/Home/Navbarhome"; // Unleashed!
import { Hero } from '../components/Home/Hero';
import { Footerh } from '../components/Home/Footerh';
import { About } from '../components/Home/About';
import { Values } from '../components/Home/Values';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-inter">
            {/* The Navigation Bar */}
            <NavbarH />

            {/* Main Content Area */}
            <main className="pt-20 flex flex-col gap-12">
                <Hero />
                
                <section id="values">
                    <Values />
                </section>

                <section id="about">
                    <About />
                </section>

                <hr className="max-w-7xl mx-auto w-full border-gray-100" />
                
                <Footerh />
            </main>
        </div>
    );
};

export default Home;