import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      token,
      user : userData
    });


    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: false, // Set to true in production with HTTPS
    //   sameSite: 'lax',
    //   maxAge: 24 * 60 * 60 * 1000 // 1 day
    // });
    // res.status(200).json({ message: "Logged in successfully" });



  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// VERIFY USER (for session persistence)

export const verifyUser = async (req, res) => {

  console.log("verify user is calling...")
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FETCH FULL USER FROM DATABASE
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json({ user: { id: req.user._id, email: req.user.email, role: req.user.role } });
  }
  catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

}

