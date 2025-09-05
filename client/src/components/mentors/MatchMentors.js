import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "./MatchMentors.css";

const MatchMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users/mentors');
        setMentors(res.data.data || res.data);
      } catch (err) {
        setError('Failed to load mentors');
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  return (
    <div className="match-mentors-container">
      <h2 className="match-mentors-title">Find Mentors</h2>

      {loading && <div className="status-text">Loading...</div>}
      {error && <div className="status-text error-text">{error}</div>}
      {mentors.length === 0 && !loading && (
        <div className="status-text empty-text">No mentors found.</div>
      )}

      <div className="match-mentors-grid">
        {mentors.map(mentor => (
          <div key={mentor._id} className="mentor-card">
            <h4>{mentor.name || mentor.firstname + ' ' + mentor.lastname}</h4>
            <div><strong>Email:</strong> {mentor.email}</div>
            <div><strong>Location:</strong> {mentor.location}</div>
            <div><strong>Interests:</strong> {Array.isArray(mentor.interests) ? mentor.interests.join(', ') : mentor.interests}</div>

            <div className="card-actions">
              <button 
                className="btn btn-view"
                onClick={() => navigate(`/mentors/${mentor._id}`)}
              >
                View Profile
              </button>
              <button
                className="btn btn-request"
                onClick={async () => {
                  try {
                    await api.post(`/match-request/request/${mentor._id}`);
                    alert("Request sent!");
                  } catch (err) {
                    alert(err.response?.data?.message || "Error sending request");
                  }
                }}
              >
                Send Match Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchMentors;