import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginUserMutation } from "../features/api/authApi"; 
import { toast } from "react-hot-toast";
import { type BackendLoginResponse, type UserRole } from "../types/auth";

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoginError(null);

        try {
            const response: BackendLoginResponse = await loginUser({
                email,
                password,
            }).unwrap();

            const user = response.user;

            if (!user || !user.userId) {
                toast.error("Login failed: Missing user data.");
                return;
            }

            // ✅ Sync with Redux and LocalStorage
            // Removed profile_picture as it doesn't exist in your schema
            dispatch(
                setCredentials({
                    token: response.token,
                    user: {
                        ...user,
                        address: user.address ?? null, // Standardizing optional fields
                    },
                })
            );

            toast.success(`Welcome back, ${user.userName}!`);

            // Role-based navigation using your UserRole type
            const role = user.userType as UserRole;
            
        
            
            switch (role) {
                case "admin":
                    // Matches: path: "/admindashboard" in adminRoutes
                    navigate("/admindashboard");
                    break;
                case "support_partner":
                    // Matches: path: "/partner" in supportPartnerRoutes
                    navigate("/partner");
                    break;
                case "patient":
                    // Matches: path: "/patient" in patientRoutes
                    navigate("/patient");
                    break;
                default:
                    navigate("/"); 
                    break;
            }

        } catch (error: any) {
            const errorMessage = error?.data?.message || "Login failed. Please check your credentials.";
            setLoginError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
            <div className="bg-transparent flex flex-col items-center">
                <header className="w-full max-w-md text-center mb-8">
                    <h1 className="text-teal-700 text-4xl font-black tracking-tight mb-2">DRUG-REVIVE</h1>
                    <p className="text-gray-600 text-lg font-medium">
                        Empowering your recovery. One day at a time.
                    </p>
                </header>

                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100 transition-all">
                    <div className="bg-white p-6 sm:p-8 flex items-center border-b border-gray-50">
                        <div className="bg-teal-100 p-3 rounded-2xl mr-4">
                            <FaUserCircle className="h-8 w-8 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-teal-600 text-xs font-black uppercase tracking-widest">Secure Access</p>
                            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        </div>
                    </div>

                    <form className="p-6 sm:p-8 space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                                disabled={isLoggingIn}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                                disabled={isLoggingIn}
                            />
                            <div className="text-right mt-2">
                                <button type="button" className="text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 font-medium animate-pulse">
                                {loginError}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-lg font-black text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        VERIFYING...
                                    </span>
                                ) : "LOG IN TO DASHBOARD"}
                            </button>
                        </div>
                    </form>

                    <div className="p-6 sm:p-8 pt-0 text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            New to Drug-Revive?{" "}
                            <button 
                                onClick={() => navigate("/signin")} 
                                className="font-black text-teal-700 hover:text-teal-800 underline underline-offset-4 decoration-2 transition-colors"
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;