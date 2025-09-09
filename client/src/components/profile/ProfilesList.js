import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Profile.css";

const ProfilesList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    firstname: "",
    lastname: "",
    role: "",
    interest: "",
    location: ""
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      fetchProfiles({ firstname: searchTerm, lastname: searchTerm });
    } else {
      fetchProfiles(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const fetchProfiles = async (query = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(query).toString();
      const res = await api.get(`/users/profiles?${params}`);
      setProfiles(res.data.data || []);
    } catch (err) {
      setError("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProfiles(filters);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profiles-container">
      <h2 className="profiles-title">All Profiles</h2>
      {searchTerm && (
        <p className="profiles-search-result">
          Showing results for: <strong>{searchTerm}</strong>
        </p>
      )}

      {/* Search Filters */}
      <div className="profiles-filters">
        <input
          type="text"
          placeholder="Search by firstname"
          value={filters.firstname}
          onChange={(e) => setFilters({ ...filters, firstname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by lastname"
          value={filters.lastname}
          onChange={(e) => setFilters({ ...filters, lastname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by interest"
          value={filters.interest}
          onChange={(e) => setFilters({ ...filters, interest: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All</option>
          <option value="mentor">Mentor</option>
          <option value="learner">Learner</option>
        </select>
        <button className="btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Profile Cards */}
      <div className="profiles-grid">
        {profiles.map((profile) => (
          <div key={profile._id} className="profile-card">
            <img
              src={
                profile?.profilePicture
                  ? `${process.env.REACT_APP_API_URL.replace("/api", "")}${profile.profilePicture}`
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
            <h3>
              {profile.firstname} {profile.lastname}
            </h3>
            <p><strong>Status:</strong> {profile.status || "Unmatched"}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            <p>
              <strong>Interests:</strong>{" "}
              {Array.isArray(profile.interests)
                ? profile.interests.join(", ")
                : profile.interests}
            </p>
            <button
              className="btn-secondary"
              onClick={() => navigate(`/profiles/${profile._id}`)}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesList;
