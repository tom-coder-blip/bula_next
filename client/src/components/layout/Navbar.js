import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MessagesDropdown from "../chat/MessagesDropdown";
import api from "../../services/api";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [searchTerm, setSearchTerm] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // 🔴 Unread chat messages
  const [requestCount, setRequestCount] = useState(0); // 🔵 Unread match requests
  const [qaUnseenCount, setQaUnseenCount] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/profiles?search=${searchTerm}`);
      setSearchTerm("");
    }
  };

  // 🔹 Listen for localStorage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Fetch unread chat messages
  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const res = await api.get("/chat/unread-count");
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // 🔹 Fetch unseen QA
  useEffect(() => {
    if (!user) return;

    const fetchQaUnseen = async () => {
      try {
        const res = await api.get("/qa/unseen-count");
        setQaUnseenCount(res.data.count);
      } catch (err) {
        console.error("Error fetching unseen QA count:", err);
      }
    };
    fetchQaUnseen();
    const interval = setInterval(fetchQaUnseen, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // 🔹 Fetch unread match requests
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      try {
        const res = await api.get("/match-request/my-requests");
        const pending = res.data.filter(
          (r) => String(r.to._id) === String(user._id || user.id) && r.status === "pending"
        );
        setRequestCount(pending.length);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <Link to="/">
          <img src="/images/bulanext.png" alt="BulaNext Logo" className="navbar-logo" />
        </Link>
      </div>

      {/* Center Links */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Me</Link>
        <Link to="/profiles">All Profiles</Link>
        <Link to="/careers">Career Roadmap</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/qa" style={{ position: "relative" }}>
          Q&A
          {qaUnseenCount > 0 && <span className="badge">{qaUnseenCount}</span>}
        </Link>
        {user?.role === "learner" && <Link to="/match-mentors">Match Mentors</Link>}
        {user?.role === "mentor" && <Link to="/match-learners">Match Learners</Link>}

        {/* 🔹 Messages Button */}
        <button
          className="btn-messages"
          onClick={() => setShowMessages(!showMessages)}
          style={{ position: "relative" }}
        >
          {/* 🔵 Left-side badge for requests */}
          {requestCount > 0 && <span className="badge badge-blue left-badge">{requestCount}</span>}

          Messages

          {/* 🔴 Right-side badge for unread chats */}
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>
      </div>

      {/* Right Search */}
      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Right User Info */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-role">
              {user.firstname} ({user.role})
            </span>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {/* Messages Dropdown */}
      {showMessages && (user ? <MessagesDropdown onClose={() => setShowMessages(false)} /> : navigate("/login"))}
    </nav>
  );
};

export default Navbar;