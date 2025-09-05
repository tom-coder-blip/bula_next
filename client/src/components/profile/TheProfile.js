import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "./Profile.css";

const TheProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get logged-in user
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profiles/${id}`);
        setUser(res.data);
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const handleMessageClick = () => {
    navigate(`/chat/${user._id}`);
  };

  const handleRequestClick = async () => {
    try {
      await api.post(`/match-request/request/${user._id}`);
      alert("Request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending request");
    }
  };

  // --- Show button only if roles are opposite (learner->mentor OR mentor->learner)
  const canSendRequest =
    (currentUser?.role === "learner" && user.role === "mentor") ||
    (currentUser?.role === "mentor" && user.role === "learner");

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={
              user.profilePicture
                ? `http://localhost:5000${user.profilePicture}`
                : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Profile"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
          <h2>{user.firstname} {user.lastname}</h2>
          <p className="profile-role">{user.role}</p>
        </div>

        <div className="profile-details">
          <p><strong>Status:</strong> {user.status || "Unmatched"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p>
            <strong>Interests:</strong>{" "}
            {Array.isArray(user.interests)
              ? user.interests.join(", ")
              : user.interests}
          </p>
          <p><strong>Experience:</strong> {user.experience || 'N/A'} years</p>
          <p><strong>Goals:</strong> {user.goals || 'N/A'}</p>
        </div>

        <div className="profile-actions">
          <button className="btn-primary" onClick={handleMessageClick}>
            Message
          </button>

          {canSendRequest && (
            <button className="btn btn-request" onClick={handleRequestClick}>
              Send Match Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheProfile;
