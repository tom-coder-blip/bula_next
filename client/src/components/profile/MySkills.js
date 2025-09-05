import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Profile.css"; // ✅ use existing theme

const MySkills = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        api.get("/skills").then(res => setSkills(res.data));
    }, []);

    const addSkill = async () => {
        if (!newSkill) return;
        const res = await api.post("/skills", { skill: newSkill });
        setSkills(res.data);
        setNewSkill("");
    };

    const removeSkill = async (skill) => {
        try {
            const encodedSkill = encodeURIComponent(skill);
            const res = await api.delete(`/skills/${encodedSkill}`);
            setSkills(res.data);
        } catch (err) {
            console.error("Error removing skill:", err);
        }
    };

    return (
        <div className="skills-page">
            <h2 className="skills-title">My Skills</h2>

            <ul className="skills-list">
                {skills.map(s => (
                    <li key={s} className="skill-item">
                        <span>{s}</span>
                        <button
                          className="btn-remove"
                          onClick={() => removeSkill(s)}
                        >
                          ❌ Remove
                        </button>
                    </li>
                ))}
            </ul>

            <div className="skills-add">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill"
                />
                <button className="btn-primary" onClick={addSkill}>
                    ➕ Add Skill
                </button>
            </div>
        </div>
    );
};

export default MySkills;
