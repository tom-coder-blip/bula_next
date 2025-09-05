import React from 'react';
import { useNavigate } from 'react-router-dom';

const LearnerCard = ({ learner }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/learners/${learner._id}`); // route to learner profile page
  };

  return (
    <div 
      onClick={goToProfile}
      style={{ 
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 16,
        minWidth: 250,
        background: '#f0faff',
        cursor: 'pointer'
      }}
    >
      <h4>{learner.name || `${learner.firstName || ''} ${learner.lastName || ''}`}</h4>
      <div><strong>Email:</strong> {learner.email}</div>
      <div><strong>Location:</strong> {learner.location}</div>
      <div><strong>Goals:</strong> {learner.goals}</div>
      <div><strong>Interests:</strong> {Array.isArray(learner.interests) ? learner.interests.join(', ') : learner.interests}</div>
    </div>
  );
};

export default LearnerCard;