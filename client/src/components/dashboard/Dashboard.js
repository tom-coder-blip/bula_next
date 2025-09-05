import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Dashboard.css";
import { GraduationCap, HelpCircle, User, Brain, Target, Settings, Briefcase, Users } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showQuizModal, setShowQuizModal] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (err) {
        setError("Could not fetch user info. Please login again.");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        {user && (
          <p>
            Welcome, <strong>{user.firstname || user.email}</strong> 👋 <br />
            You are logged in as a <strong>{user.role}</strong>
          </p>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="dashboard-cards">
        <Link to="/match-mentors" className="dashboard-card">
          <GraduationCap className="dashboard-icon" size={28} />
          <h3>Match Mentors</h3>
          <p>Find the perfect mentor to guide your journey.</p>
        </Link>

        <Link to="/qa" className="dashboard-card">
          <HelpCircle className="dashboard-icon" size={28} />
          <h3>Q&A</h3>
          <p>Ask questions and share knowledge with others.</p>
        </Link>

        <Link to="/profile" className="dashboard-card">
          <User className="dashboard-icon" size={28} />
          <h3>View Profile</h3>
          <p>Update your details and showcase your skills.</p>
        </Link>

        {/* ✅ Conditional Links */}
        {user?.role === "learner" && (
          <>
            <Link to="/my-mentor" className="dashboard-card">
              <User className="dashboard-icon" size={28} />
              <h3>My Mentor</h3>
              <p>See your assigned mentor.</p>
            </Link>

            {/* 🎯 My Goals Button */}
            <Link to="/learner-goals" className="dashboard-card">
              <Target className="dashboard-icon" size={28} />
              <h3>My Goals</h3>
              <p>Track, manage, and achieve your learning goals.</p>
            </Link>
          </>
        )}

        {user?.role === "mentor" && (
          <>
            <Link to="/my-learners" className="dashboard-card">
              <User className="dashboard-icon" size={28} />
              <h3>My Learners</h3>
              <p>View and support your matched learners.</p>
            </Link>

            {/* 🎯 Mentor Goals Dashboard */}
            <Link to="/mentor/goals" className="dashboard-card">
              <Target className="dashboard-icon" size={28} />
              <h3>My Goals Dashboard</h3>
              <p>Track and manage goals for your learners.</p>
            </Link>
          </>
        )}

        <Link to="/my-skills" className="dashboard-card">
          <Brain className="dashboard-icon" size={28} />
          <h3>My Skills</h3>
          <p>Add, update, and showcase your skills.</p>
        </Link>

        {/* 🆕 Career Roadmap Button */}
        <Link to="/careers" className="dashboard-card">
          <Briefcase className="dashboard-icon" size={28} />
          <h3>Career Roadmap</h3>
          <p>Explore careers, paths, and job opportunities.</p>
        </Link>

        {/* 🆕 All Profiles Button */}
        <Link to="/profiles" className="dashboard-card">
          <Users className="dashboard-icon" size={28} />
          <h3>All Profiles</h3>
          <p>Browse and connect with other learners and mentors.</p>
        </Link>

        <div
          className="dashboard-card"
          onClick={() => setShowQuizModal(true)}
          style={{ cursor: "pointer" }}
        >
          <Brain className="dashboard-icon" size={28} />
          <h3>Career Quizzes</h3>
          <p>Take personality and career aptitude tests.</p>
        </div>

        {/* ⚙️ Settings Button */}
        <Link to="/settings" className="dashboard-card">
          <Settings className="dashboard-icon" size={28} />
          <h3>Settings</h3>
          <p>Manage account preferences and privacy.</p>
        </Link>
      </div>

      {showQuizModal && (
        <div className="quiz-modal-overlay" onClick={() => setShowQuizModal(false)}>
          <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Choose a Career Quiz</h2>
            <p>Click on any link below to take an external quiz:</p>

            <div className="quiz-links">
              <a
                href="https://www.123test.com/career-test/"
                target="_blank"
                rel="noopener noreferrer"
                className="quiz-link"
              >
                🧠 123Test Career Aptitude Test
              </a>
              <a
                href="https://www.careerfitter.com/free_test/careerbuilder/test"
                target="_blank"
                rel="noopener noreferrer"
                className="quiz-link"
              >
                💼 Career Test
                Work Personality Assessment
              </a>
              <a
                href="https://www.truity.com/test/career-personality-profiler-test"
                target="_blank"
                rel="noopener noreferrer"
                className="quiz-link"
              >
                🎯 Truity Career Personality Profiler
              </a>
            </div>

            <button className="close-btn" onClick={() => setShowQuizModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;