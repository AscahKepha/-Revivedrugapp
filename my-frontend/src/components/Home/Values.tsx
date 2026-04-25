import values1 from "../../assets/Screenshot 2026-04-23 184516.png";
import values2 from "../../assets/Screenshot 2026-04-23 183007.png";

export const Values = () => {
    return (
        <section className="bg-slate-50 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                
                {/* Top Heading: The Manifesto */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm">Our Philosophy</h2>
                    <p className="text-4xl md:text-6xl font-black text-teal-900 leading-tight">
                        We're building a movement.
                    </p>
                    <p className="text-2xl md:text-3xl font-medium text-gray-600 italic">
                        "Your revival is our heart's mission."
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* First Row: Mission */}
                    <div className="order-1 flex justify-center items-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img
                                src={values1}
                                alt="Supportive community"
                                className="relative w-full h-auto rounded-2xl shadow-2xl object-cover max-h-[450px]"
                            />
                        </div>
                    </div>

                    <div className="order-2 space-y-6">
                        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-teal-900/5 border border-teal-50">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <span className="text-emerald-600 font-bold text-xl">01</span>
                            </div>
                            <h3 className="text-3xl font-black text-teal-800 mb-4 tracking-tight">Our Mission:</h3>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                To walk alongside every individual in <span className="font-bold text-emerald-600">Nakuru</span> and beyond, 
                                providing the tools, community, and courage needed to turn recovery into a 
                                lifelong journey of success.
                            </p>
                        </div>
                    </div>

                    {/* Second Row: Vision (Reversed for visual flow) */}
                    <div className="order-4 lg:order-3 space-y-6">
                        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-teal-900/5 border border-teal-50">
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                                <span className="text-teal-600 font-bold text-xl">02</span>
                            </div>
                            <h3 className="text-3xl font-black text-teal-800 mb-4 tracking-tight">Our Vision:</h3>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                We're nurturing a global community where holistic well-being is a shared reality. 
                                We believe wellness grows when we care deeply and compassionately—building 
                                a movement where <span className="font-bold text-teal-600">no one</span> walks the path to recovery alone.
                            </p>
                        </div>
                    </div>

                    <div className="order-3 lg:order-4 flex justify-center items-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img
                                src={values2}
                                alt="A new dawn"
                                className="relative w-full h-auto rounded-2xl shadow-2xl object-cover max-h-[450px]"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Values;