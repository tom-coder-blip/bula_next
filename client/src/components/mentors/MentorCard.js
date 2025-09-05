import React from 'react';
import { useNavigate } from 'react-router-dom';

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/profiles/${mentor._id}`);
  };

  return (
    <div className="mentor-card" onClick={goToProfile}>
      <h4 className="mentor-name">
        {mentor.name || `${mentor.firstName || ''} ${mentor.lastName || ''}`}
      </h4>
      <div><strong>Email:</strong> {mentor.email}</div>
      <div><strong>Location:</strong> {mentor.location}</div>
      <div><strong>Interests:</strong> {Array.isArray(mentor.interests) ? mentor.interests.join(', ') : mentor.interests}</div>
    </div>
  );
};

export default MentorCard;