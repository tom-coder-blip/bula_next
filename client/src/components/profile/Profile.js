import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const data = new FormData();

      // Append image if selected
      if (formData.profilePicture instanceof File) {
        data.append("profilePic", formData.profilePicture); // Multer expects "profilePic"
      }

      // Append other fields
      Object.keys(formData).forEach((key) => {
        if (key !== "profilePicture") {
          data.append(key, formData[key]);
        }
      });

      const res = await api.put("/users/profile/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      {!editing ? (
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={
                profile.profilePicture
                  ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${profile.profilePicture}`
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
            <p className="profile-role">{profile.role}</p>
          </div>

          <div className="profile-details">
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Location:</strong> {profile.location}
            </p>
            <p>
              <strong>Interests:</strong>{" "}
              {Array.isArray(profile.interests)
                ? profile.interests.join(", ")
                : profile.interests}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio || "No bio yet"}
            </p>
            <p>
              <strong>Goals:</strong> {profile.goals || "N/A"}
            </p>
          </div>

          <button className="btn-primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="profile-edit-card">
          <h2>Edit Profile</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, profilePicture: e.target.files[0] })
            }
          />
          <input
            type="text"
            name="firstname"
            value={formData.firstname || ""}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastname"
            value={formData.lastname || ""}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Location"
          />
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            placeholder="Add a short bio"
          />
          <textarea
            name="goals"
            value={formData.goals || ""}
            onChange={handleChange}
            placeholder="Goals"
          />

          <div className="profile-edit-actions">
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn-secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;