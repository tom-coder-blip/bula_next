import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  getAllProfiles, 
  getProfileById, 
  getAllMentors, 
  getAllLearners 
} from '../controllers/user.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import User from '../models/User.js';

const router = express.Router();

// Authenticated user’s own profile
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Upload profile picture
router.put(
  "/profile/upload",
  verifyToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      // 🔎 Debug incoming request
      console.log("Decoded user:", req.user);   // From verifyToken
      console.log("Uploaded file:", req.file);  // From multer
      console.log("Body:", req.body);           // Any extra form fields

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imagePath = `/uploads/${req.file.filename}`;

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: imagePath },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Image upload failed:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Public/admin listing
router.get('/profiles', verifyToken, getAllProfiles);
router.get('/profiles/:id', verifyToken, getProfileById);

// Mentor/Learner filters
router.get('/mentors', verifyToken, getAllMentors);
router.get('/learners', verifyToken, getAllLearners);

export default router;
