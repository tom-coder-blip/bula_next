import React, { useState } from "react";
import api from "../../services/api";

const EditProfileForm = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    bio: user.bio || "",
    experience: user.experience || "",
    subjects: user.subjects || "",
    goals: user.goals || "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Update basic profile fields
      const res = await api.put("/users/profile", form);

      // 2. Upload profile picture if selected
      if (file) {
        const formData = new FormData();
        formData.append("profilePic", file);

        const uploadRes = await api.put("/users/profile/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        onUpdated(uploadRes.data);
      } else {
        onUpdated(res.data);
      }

      onClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Your bio"
            className="border p-2 rounded"
          />
          <input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Experience"
            className="border p-2 rounded"
          />
          <input
            name="subjects"
            value={form.subjects}
            onChange={handleChange}
            placeholder="Subjects"
            className="border p-2 rounded"
          />
          <input
            name="goals"
            value={form.goals}
            onChange={handleChange}
            placeholder="Goals"
            className="border p-2 rounded"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button className="bg-green-500 text-white py-2 rounded mt-2" type="submit">
            Save Changes
          </button>
          <button type="button" onClick={onClose} className="text-gray-600 mt-2">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;