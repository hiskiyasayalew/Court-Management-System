// src/HomePage.js
// src/pages/HomePage.js
import React from 'react';
import '../Css/HomePage.css'; // Updated path to the CSS file

const HomePage = () => {
    return (
        <div className="home">
            <header className="header">
                <h1>Welcome to Our Website</h1>
                <p>Your journey starts here</p>
            </header>
            <main className="main-content">
                <h2>About Us</h2>
                <p>
                    We are dedicated to providing the best services to our customers.
                    Join us and explore a range of offerings tailored just for you.
                </p>
                <button className="cta-button">Get Started</button>
            </main>
        </div>
    );
};

export default HomePage;
