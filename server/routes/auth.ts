import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_key_123";

// Register
router.post("/register", async (req, res): Promise<any> => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      role,
      employeeId,
      department,
      governmentEmail,
      officeLocation,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      ...(role === "officer" && {
        employeeId,
        department,
        governmentEmail,
        officeLocation,
      }),
    });

    await newUser.save();

    res.status(201).json({
      message:
        role === "officer"
          ? "Officer registration successful. Pending approval."
          : "Registration successful.",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed." });
  }
});

// Login
router.post("/login", async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (user.role === "officer" && user.status === "pending") {
      return res
        .status(403)
        .json({ error: "Your officer account is pending approval." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed." });
  }
});

// Verify token middleware
export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get current user
router.get("/me", authMiddleware, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
