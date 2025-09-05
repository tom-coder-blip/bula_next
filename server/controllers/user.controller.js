import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const filter = {};

    // Role filter
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Name search
    if (req.query.firstname || req.query.lastname) {
      filter.$or = [];
      if (req.query.firstname) {
        filter.$or.push({ firstname: { $regex: req.query.firstname, $options: 'i' } });
      }
      if (req.query.lastname) {
        filter.$or.push({ lastname: { $regex: req.query.lastname, $options: 'i' } });
      }
    }

    // Interests
    if (req.query.interest) {
      filter.interests = { $regex: req.query.interest, $options: 'i' };
    }

    // Location
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: users,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Validate request body
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

export const getAllMentors = async (req, res) => {
  try {
    const filter = { role: 'mentor' };

    if (req.query.interest) {
      filter.interests = { $regex: req.query.interest, $options: 'i' };
    }

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    if (req.query.subject) {
      filter.subject = { $regex: req.query.subject, $options: 'i' };
    }

    if (req.query.goals) {
      filter.goals = { $regex: req.query.goals, $options: 'i' };
    }

    if (req.query.experienceGte) {
      filter.experience = { $gte: parseInt(req.query.experienceGte) };
    }

    if (req.query.name) {
      filter.$or = [
        { firstName: { $regex: req.query.name, $options: 'i' } },
        { lastName: { $regex: req.query.name, $options: 'i' } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);
    const mentors = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: mentors,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllLearners = async (req, res) => {
  try {
    const filter = { role: 'learner' };

    if (req.query.interest) {
      filter.interests = { $regex: req.query.interest, $options: 'i' };
    }

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    if (req.query.subject) {
      filter.subject = { $regex: req.query.subject, $options: 'i' };
    }

    if (req.query.goals) {
      filter.goals = { $regex: req.query.goals, $options: 'i' };
    }

    if (req.query.gradeLevel) {
      filter.gradeLevel = { $regex: req.query.gradeLevel, $options: 'i' };
    }

    if (req.query.name) {
      filter.$or = [
        { firstName: { $regex: req.query.name, $options: 'i' } },
        { lastName: { $regex: req.query.name, $options: 'i' } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);
    const learners = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: learners,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};