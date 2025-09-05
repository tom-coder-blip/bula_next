import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./MatchLearners.css";

const LearnerMatches = () => {
  const [matches, setMatches] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchMatches = async () => {
    const res = await api.get("/match/my-matches");
    setMatches(res.data);
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

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="match-learners-container">
      <h2 className="match-learners-title">My Mentor</h2>
      {matches.length === 0 ? (
        <p className="match-learners-empty">No mentor matched yet.</p>
      ) : (
        matches.map((match) => (
          <div key={match._id} className="match-card">
            <div className="learner-card">
              <strong>
                {match.learner.firstname} {match.learner.lastname}
              </strong>
            </div>
            <span style={{ fontSize: "24px", margin: "0 10px" }}>➡️</span>
            <div className="learner-card">
              <strong>
                {match.mentor.firstname} {match.mentor.lastname}
              </strong>
            </div>
            <button
              className="btn btn-danger"
              style={{ marginLeft: "10px" }}
              onClick={() => openUnmatchDialog(match._id)}
            >
              Unmatch
            </button>
          </div>
        ))
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Are you sure?</h3>
            <p>Do you really want to unmatch your mentor?</p>
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

export default LearnerMatches;