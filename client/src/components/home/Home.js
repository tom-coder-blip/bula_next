import React from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Hero Section */}
        <img
          src="/images/bulanext.png"
          alt="BulaNext Logo"
          className="home-logo"
        />
        <h1 className="home-title">Welcome to BulaNext</h1>
        <p className="home-subtitle">
          Your platform for connecting learners and mentors, sharing knowledge, and growing together.
        </p>

        {!token && (
          <div className="home-actions">
            <Link to="/register" className="btn btn-primary">Register</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/match-mentors" className="btn btn-accent">Find a Mentor</Link>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <section className="home-section">
        <h2>How BulaNext Works</h2>
        <div className="section-cards">
          <div className="card">
            <img src="/images/connect.png" alt="Connect" />
            <h3>Connect</h3>
            <p>Find the right mentor or learner based on your goals and skills.</p>
          </div>
          <div className="card">
            <img src="/images/learn.png" alt="Learn" />
            <h3>Learn</h3>
            <p>Engage in meaningful sessions and exchange real-world knowledge.</p>
          </div>
          <div className="card">
            <img src="/images/grow.png" alt="Grow" />
            <h3>Grow</h3>
            <p>Track your progress and grow both personally and professionally.</p>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="home-section alt">
        <h2>Why Join BulaNext?</h2>
        <div className="section-content">
          <img src="/images/community.png" alt="Community" />
          <p>
            BulaNext is more than just mentorship — it’s a career guidance community. Our platform empowers the youth to explore their passions, gain clarity about career paths, and connect with mentors who can guide them along the way. Whether you’re seeking direction, sharing knowledge, or inspiring the next generation, BulaNext helps you achieve your goals while making a real difference.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Start Your Journey Today 🚀</h2>
        <p>Join thousands of learners and mentors shaping the future together.</p>
        {!token && (
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        )}
      </section>
    </div>
  );
};

export default Home;