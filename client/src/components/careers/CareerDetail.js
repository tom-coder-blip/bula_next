import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./Careers.css"; // reuse same css file

const CareerDetail = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [gap, setGap] = useState(null);

  useEffect(() => {
    const fetchCareer = async () => {
      const res = await api.get(`/careers/${id}`);
      setCareer(res.data);
    };
    fetchCareer();

    const token = localStorage.getItem("token");
    if (token) {
      api
        .get(`/careers/${id}/skill-gap`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setGap(res.data));
    }
  }, [id]);

  if (!career) return <p className="loading">Loading...</p>;

  return (
    <div className="career-detail">
      <h2>{career.title}</h2>
      <p className="overview">{career.overview}</p>

      <section className="detail-section">
        <h3>Required Skills</h3>
        <ul>
          {career.requiredSkills.map((s) => (
            <li key={s}>⚡ {s}</li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <h3>Education Path</h3>
        <p>{career.educationPath}</p>
        {career.avgSalary && <p className="salary">💰 Avg Salary: {career.avgSalary}</p>}
      </section>

      <section className="detail-section">
        <h3>Roadmap</h3>
        <ol>
          {career.roadmap.map((stage, i) => (
            <li key={i}>
              <strong>{stage.title}</strong>: {stage.description}
              {stage.resources.length > 0 && (
                <ul>
                  {stage.resources.map((r) => (
                    <li key={r}>
                      <a href={r} target="_blank" rel="noreferrer">{r}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      {gap && (
        <section className="detail-section gap">
          <h3>Skill Gap</h3>
          <p>✅ You currently need: {gap.needs.join(", ") || "None (You have all the main skills needed for this career.)"}</p>
        </section>
      )}

      <section className="detail-section">
        <h3>Tips</h3>
        <ul className="next-steps">
          <li>Identify your current skills and compare them with the required skills.</li>
          <li>Enroll in relevant courses or training programs to fill any skill gaps.</li>
          <li>Network with professionals in the field through LinkedIn.</li>
          <li>Seek mentorship or guidance from experienced individuals.</li>
          <li>Stay updated with industry trends and advancements.</li>
          <li>Consider internships or entry-level positions to gain experience.</li>
          <li>Set short-term and long-term goals to keep yourself motivated.</li>
        </ul>
      </section>
    </div>
  );
};

export default CareerDetail;