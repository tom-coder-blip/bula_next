import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./LearnerGoals.css"; // ✅ Import styles

export default function LearnerGoalsPage() {
  const { learnerId } = useParams();
  const [goals, setGoals] = useState([]);
  const [learner, setLearner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearnerGoals = async () => {
      try {
        const res = await api.get(`/mentor/goals?learnerId=${learnerId}`);
        setGoals(res.data.goals);
        setLearner(res.data.learner);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching learner goals:", err);
        setLoading(false);
      }
    };

    fetchLearnerGoals();
  }, [learnerId]);

  if (loading) return <p className="goals-loading">Loading goals...</p>;

  return (
    <div className="goals-page-container">
      <h2 className="goals-header">
        🎯 {learner ? `${learner.firstname} ${learner.lastname}'s Goals` : "Learner Goals"}
      </h2>

      {goals.length === 0 ? (
        <p className="goals-empty">No goals found for this learner.</p>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => (
            <div key={goal._id} className="goal-card">
              <h3>{goal.title}</h3>
              <p className="goal-description">{goal.description}</p>
              <p className="goal-meta">
                <strong>Progress:</strong> {goal.progress}%
              </p>
              <p className="goal-meta">
                <strong>Deadline:</strong> {new Date(goal.deadline).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}