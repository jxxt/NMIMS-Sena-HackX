import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    auth,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    db,
    ref,
    get,
    set,
} from "../config/firebase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const generateUniqueEventHostId = async () => {
        const id = Math.floor(10000000 + Math.random() * 90000000).toString();
        const usersRef = ref(db, `users`);
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            for (let userId in users) {
                if (users[userId].eventHostId === id) {
                    return await generateUniqueEventHostId();
                }
            }
        }
        return id;
    };

    const generateUniqueEventHostApiKey = async () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let apiKey = "";
        for (let i = 0; i < 16; i++) {
            apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const usersRef = ref(db, `users`);
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            for (let userId in users) {
                if (users[userId].eventHostApiKey === apiKey) {
                    return await generateUniqueEventHostApiKey();
                }
            }
        }
        return apiKey;
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        if (!email) {
            return alert("Please enter a valid email.");
        }

        setIsLoading(true);
        const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem("emailForSignIn", email);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000); // Hide after 5 seconds
        } catch (error) {
            alert("Failed to send email link. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedEmail = window.localStorage.getItem("emailForSignIn");

        if (isSignInWithEmailLink(auth, window.location.href) && storedEmail) {
            signInWithEmailLink(auth, storedEmail, window.location.href)
                .then((result) => {
                    window.localStorage.removeItem("emailForSignIn");

                    result.user.getIdToken().then((token) => {
                        const authId = result.user.uid;
                        localStorage.setItem("userToken", token);
                        localStorage.setItem("authId", authId);

                        const userRef = ref(db, `users/${authId}`);

                        get(userRef)
                            .then(async (snapshot) => {
                                if (!snapshot.exists()) {
                                    const eventHostId = await generateUniqueEventHostId();
                                    const eventHostApiKey = await generateUniqueEventHostApiKey();

                                    set(userRef, {
                                        email: storedEmail,
                                        authId: authId,
                                        role: "host",
                                        eventHostId: eventHostId,
                                        eventHostApiKey: eventHostApiKey,
                                    }).catch(() => {});
                                }
                            })
                            .catch(() => {});

                        navigate("/");
                    });
                })
                .catch(() => {
                    alert("Failed to sign in. Try again.");
                });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4">
            {showNotification && (
                <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>Check your email for the login link!</span>
                </div>
            )}
            
            <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-8">
                <div className="space-y-2 mb-8">
                    <h2 className="text-3xl font-bold text-white text-center">Welcome back</h2>
                    <p className="text-gray-400 text-center">Sign in with your email to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`
                            w-full px-4 py-3 rounded-lg
                            bg-blue-600 hover:bg-blue-700
                            text-white font-medium
                            transition duration-200
                            flex items-center justify-center
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                        `}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            "Continue with Email"
                        )}
                    </button>

                    <p className="text-sm text-gray-400 text-center">
                        We'll send you a magic link for a password-free sign in
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;