// src/components/Home.jsx
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.module.css";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        const authId = localStorage.getItem("authId");

        // If tokens are not present, redirect to login page
        if (!userToken || !authId) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="home-container">
            <h1>Welcome</h1>
            <p>You are successfully logged in!</p>
            <h1 className="text-4xl underline">Hello world!</h1>
        </div>
    );
};

export default Home;
