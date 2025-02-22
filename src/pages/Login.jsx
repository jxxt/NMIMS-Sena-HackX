// src/components/Login.js
import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleLogin = async () => {
        if (!email) return alert("Please enter a valid email.");

        const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem("emailForSignIn", email);
            alert("Check your email for the sign-in link.");
        } catch (error) {
            console.error("Error sending email link", error);
            alert("Failed to send email link. Try again.");
        }
    };

    // Function to generate unique eventHostId (8 digits)
    const generateUniqueEventHostId = async () => {
        const id = Math.floor(10000000 + Math.random() * 90000000).toString();
        const usersRef = ref(db, `users`);
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            for (let userId in users) {
                if (users[userId].eventHostId === id) {
                    return await generateUniqueEventHostId(); // Recursively generate if duplicate
                }
            }
        }
        return id;
    };

    // Function to generate unique eventHostApiKey (16-character alphanumeric)
    const generateUniqueEventHostApiKey = async () => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
                    return await generateUniqueEventHostApiKey(); // Recursively generate if duplicate
                }
            }
        }
        return apiKey;
    };

    useEffect(() => {
        const storedEmail = window.localStorage.getItem("emailForSignIn");

        if (isSignInWithEmailLink(auth, window.location.href) && storedEmail) {
            signInWithEmailLink(auth, storedEmail, window.location.href)
                .then((result) => {
                    window.localStorage.removeItem("emailForSignIn");

                    // Store user token and authId in local storage
                    result.user.getIdToken().then((token) => {
                        const authId = result.user.uid;
                        localStorage.setItem("userToken", token);
                        localStorage.setItem("authId", authId);
                        console.log("User Token:", token);
                        console.log("Auth ID:", authId);

                        // Store user data in Firebase Realtime Database
                        const userRef = ref(db, `users/${authId}`);

                        get(userRef)
                            .then(async (snapshot) => {
                                if (!snapshot.exists()) {
                                    const eventHostId =
                                        await generateUniqueEventHostId();
                                    const eventHostApiKey =
                                        await generateUniqueEventHostApiKey();

                                    set(userRef, {
                                        email: storedEmail,
                                        authId: authId,
                                        role: "host",
                                        eventHostId: eventHostId,
                                        eventHostApiKey: eventHostApiKey,
                                    })
                                        .then(() => {
                                            console.log(
                                                "User data stored in database."
                                            );
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error storing user data",
                                                error
                                            );
                                        });
                                } else {
                                    console.log(
                                        "User already exists in database."
                                    );
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    "Error checking user data",
                                    error
                                );
                            });

                        navigate("/"); // Redirect after successful login
                    });
                })
                .catch((error) => {
                    console.error("Error during sign-in", error);
                    alert("Failed to sign in. Try again.");
                });
        }
    }, [navigate]);

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
            />
            <button onClick={handleLogin}>Login with Email Link</button>
        </div>
    );
};

export default Login;
