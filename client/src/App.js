import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import QAPage from './components/questions/QAPage';
import MatchMentors from './components/mentors/MatchMentors';
import MatchLearners from './components/learners/MatchLearners';
import ProtectedRoute from "./components/layout/ProtectedRoute";
import TheProfile from './components/profile/TheProfile';
import Profile from './components/profile/Profile';
import ProfilesList from './components/profile/ProfilesList';
import ChatPage from "./components/chat/ChatPage";
import CareersList from "./components/careers/CareersList";
import CareerDetail from "./components/careers/CareerDetail";
import MentorMatches from './components/mentors/MentorMatches';
import LearnerMatches from './components/learners/LearnerMatches';
import MySkills from "./components/profile/MySkills";
import LearnerGoals from "./components/goals/LearnerGoals";
import MentorGoalsDashboard from "./components/goals/MentorGoalsDashboard";
import LearnerGoalsPage from "./components/goals/LearnerGoalsPage";
import Settings from "./components/pages/Settings";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qa"
          element={
            <ProtectedRoute>
              <QAPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match-mentors"
          element={
            <ProtectedRoute>
              <MatchMentors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentors/:id"
          element={
            <ProtectedRoute>
              <TheProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match-learners"
          element={
            <ProtectedRoute>
              <MatchLearners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learners/:id"
          element={
            <ProtectedRoute>
              <TheProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:id"
          element={
            <ProtectedRoute>
              <TheProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <ProfilesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:id"
          element={
            <ProtectedRoute>
              <TheProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <CareersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/careers/:id"
          element={
            <ProtectedRoute>
              <CareerDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/my-learners"
          element={
            <ProtectedRoute>
              <MentorMatches />
            </ProtectedRoute>
          }
        />
        <Route path="/my-mentor"
          element={
            <ProtectedRoute>
              <LearnerMatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-skills"
          element={
            <ProtectedRoute>
              <MySkills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner-goals"
          element={
            <ProtectedRoute>
              <LearnerGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/goals"
          element={
            <ProtectedRoute>
              <MentorGoalsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/learner/:learnerId/goals"
          element={
            <ProtectedRoute>
              <LearnerGoalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;