import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import "./Auth.css";

const Register = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'learner',
    location: '',
    interests: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        interests: form.interests.split(',').map(i => i.trim())
      };

      await api.post('/auth/register', payload);

      setSuccess('Registration successful! Redirecting to login...');
      
      // Reset form fields
      setForm({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'learner',
        location: '',
        interests: ''
      });

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="learner">Learner</option>
            <option value="mentor">Mentor</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="interests"
            placeholder="Interests (comma separated)"
            value={form.interests}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default Register;