import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./MatchMentors.css";

const MentorMatches = () => {
  const [matches, setMatches] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get("/match/my-matches");
      setMatches(res.data);
    } catch (err) {
      console.error("Failed to fetch matches", err);
    }
  };

  const openUnmatchDialog = (matchId) => {
    setSelectedMatch(matchId);
    setShowConfirm(true);
  };

  const confirmUnmatch = async () => {
    try {
      await api.delete(`/match/unmatch/${selectedMatch}`);
      setMatches(prev => prev.filter(m => m._id !== selectedMatch));
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Failed to unmatch. Please try again.";

      // Treat "already gone" as success
      if (status === 404) {
        setMatches(prev => prev.filter(m => m._id !== selectedMatch));
        setShowConfirm(false);
        setShowSuccess(true);
        return;
      }
      console.error("Failed to unmatch", err);
      alert(msg);
    }
  };

  return (
    <div className="mentor-matches-container">
      <h2 className="mentor-matches-title">My Learners</h2>

      {matches.length === 0 ? (
        <p className="status-text empty-text">No learners matched yet.</p>
      ) : (
        <div className="mentor-matches-grid">
          {matches.map((match) => (
            <div key={match._id} className="match-card">
              <h4>
                {match.learner.firstname} {match.learner.lastname}
              </h4>
              <p className="match-date">
                Matched on: {new Date(match.matchedAt).toLocaleDateString()}
              </p>
              <div className="card-actions">
                <button
                  className="btn btn-view"
                  onClick={() => navigate(`/learners/${match.learner._id}`)}
                >
                  View Profile
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => openUnmatchDialog(match._id)}
                >
                  Unmatch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Are you sure?</h3>
            <p>Do you really want to unmatch this learner?</p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmUnmatch}>
                Yes, Unmatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccess && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Unmatched Successfully!</h3>
            <button className="btn btn-primary" onClick={() => setShowSuccess(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorMatches;