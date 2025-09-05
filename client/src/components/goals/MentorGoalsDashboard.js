import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { User } from "lucide-react";
import "./LearnerGoals.css"; // ✅ Import CSS

export default function MentorGoalsDashboard() {
  const [learners, setLearners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearners();
  }, []);

  const fetchLearners = async () => {
    try {
      const res = await api.get("/mentor/goals");
      setLearners(res.data.learners || []);
    } catch (err) {
      console.error("Error fetching learners:", err);
    }
  };

  const handleLearnerClick = (learnerId) => {
    navigate(`/mentor/learner/${learnerId}/goals`);
  };

  return (
    <div className="mentor-dashboard-container">
      <h2 className="mentor-dashboard-header">👩‍🏫 My Learners</h2>

      {learners.length === 0 ? (
        <p className="mentor-dashboard-empty">No learners assigned yet.</p>
      ) : (
        <div className="mentor-dashboard-grid">
          {learners.map((learner) => (
            <div
              key={learner._id}
              onClick={() => handleLearnerClick(learner._id)}
              className="mentor-dashboard-card"
            >
              <div className="mentor-card-header">
                <User className="mentor-icon" size={28} />
                <h3>
                  {learner.firstname} {learner.lastname}
                </h3>
              </div>
              <p className="mentor-card-subtext">
                View {learner.firstname}'s goals
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
