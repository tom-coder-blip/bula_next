import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './MatchLearners.css';

const MatchLearners = () => {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearners = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users/learners');
        setLearners(res.data.data || res.data);
      } catch (err) {
        setError('Failed to load learners');
      } finally {
        setLoading(false);
      }
    };
    fetchLearners();
  }, []);

  return (
    <div className="match-learners-container">
      <h2 className="match-learners-title">Find Learners</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error-text">{error}</div>}
      
      <div className="match-learners-grid">
        {learners.length === 0 && !loading && (
          <div className="match-learners-empty">No learners found.</div>
        )}

        {learners.map((learner) => (
          <div key={learner._id} className="learner-card">
            <h4>{learner.firstname} {learner.lastname}</h4>
            <div><strong>Email:</strong> {learner.email}</div>
            <div><strong>Location:</strong> {learner.location}</div>
            <div><strong>Interests:</strong> {Array.isArray(learner.interests) ? learner.interests.join(', ') : learner.interests}</div>

            <div className="card-actions">
              <button 
                className="btn btn-view"
                onClick={() => navigate(`/learners/${learner._id}`)}
              >
                View Profile
              </button>
              <button
                className="btn btn-request"
                onClick={async () => {
                  try {
                    await api.post(`/match-request/request/${learner._id}`);
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

export default MatchLearners;