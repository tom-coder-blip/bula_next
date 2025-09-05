import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./Careers.css"; // 👈 add external stylesheet

const CareersList = () => {
  const [careers, setCareers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/careers?search=${search}`);
      setCareers(res.data);
    };
    if (search) {
      fetchData();
    } else {
      setCareers([]);
    }
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="careers-container">
      <h2 className="page-title">Career Roadmap</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="🔍 Search careers..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="career-grid">
        {careers.map((career) => (
          <Link key={career._id} to={`/careers/${career._id}`} className="career-card">
            <h3>{career.title}</h3>
            <p>{career.overview?.slice(0, 100)}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CareersList;