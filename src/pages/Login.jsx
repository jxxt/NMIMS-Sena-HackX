import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.phone
        ) {
            toast.error("All fields are required");
            return false;
        }
        if (!formData.email.includes("@")) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        if (formData.phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return false;
        }
        return true;
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setTimeout(() => {
            toast.success("Signup successful (UI only)");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-orange-100">
            <ToastContainer position="top-right" />
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Create an Account
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Please fill in your details to sign up
                            </p>
                        </div>
                        <form onSubmit={handleSignup} className="space-y-5">
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
                            />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
                            />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
                            />
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                            >
                                {isLoading ? "Signing up..." : "Sign Up"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Signup;
