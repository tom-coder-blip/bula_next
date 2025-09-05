import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./LearnerGoals.css"; // ✅ import CSS

export default function LearnerGoals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const addGoal = async () => {
    if (!title || !deadline) return alert("Please enter both a title and deadline.");
    try {
      const res = await api.post("/goals", { title, deadline, progress: 0 });
      setGoals([...goals, res.data]);
      setTitle("");
      setDeadline("");
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const updateProgress = async (id, progress) => {
    try {
      const res = await api.put(`/goals/${id}`, { progress });
      setGoals(goals.map((g) => (g._id === id ? res.data : g)));
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter((g) => g._id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <div className="goals-container">
      <h2 className="goals-header">🎯 My Personal Goals</h2>

      {/* Add Goal */}
      <div className="goal-inputs">
        <input
          className="goal-input"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="goal-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={addGoal} className="goal-btn add-btn">
          Add Goal
        </button>
      </div>

      {/* List Goals */}
      <div className="goal-list">
        {goals.map((goal) => (
          <div key={goal._id} className="goal-card">
            <h3>{goal.title}</h3>
            <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>

            {/* Progress Bar */}
            <progress value={goal.progress} max="100" className="goal-progress" />

            <div className="goal-actions">
              <input
                type="number"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => updateProgress(goal._id, e.target.value)}
                className="goal-progress-input"
              />
              <button onClick={() => deleteGoal(goal._id)} className="goal-btn delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      {goals.length > 0 && (
        <>
          <h3 className="goals-subheader">📊 Goal Progress Overview</h3>
          <div className="goal-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={goals}>
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#1cc2a0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}