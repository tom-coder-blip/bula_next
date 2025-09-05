import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const ProfileDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get(`/users/profiles/${id}`);
      setProfile(res.data);
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", textAlign: "center" }}>
      <img
        src={
          profile.profilePicture
            ? `http://localhost:5000${profile.profilePicture}`
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
      <h2>
        {profile.firstname} {profile.lastname}
      </h2>
      <p><strong>Status:</strong> {profile.status || "Unmatched"}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Location:</strong> {profile.location}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p>
        <strong>Interests:</strong>{" "}
        {Array.isArray(profile.interests)
          ? profile.interests.join(", ")
          : profile.interests}
      </p>
      <p><strong>Bio:</strong> {profile.bio || "No bio yet"}</p>
    </div>
  );
};

export default ProfileDetail;