import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        reminderEnabled: user.reminderEnabled,
        reminderHour: user.reminderHour,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        reminderEnabled: user.reminderEnabled,
        reminderHour: user.reminderHour,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email avatar reminderEnabled"
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReminderSettings = async (req, res) => {
  try {
    const { reminderEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { reminderEnabled },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("name email avatar reminderEnabled");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const frontendUrl = process.env.CLIENT_URL;

    if (!frontendUrl) {
      return res
        .status(500)
        .json({ message: "CLIENT_URL is not configured" });
    }

    return res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};