import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";

// Handles user login by generating and sending an OTP to the user's email and returning a verification token.
export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
      });
    }

    const otp = Math.floor(Math.random() * 1000000);

    const verifyToken = jwt.sign({ user, otp }, process.env.Activation_sec, {
      expiresIn: "5m",
    });

    await sendMail(email, "SmartChatbot", otp);

    res.json({
      message: "OTP sent to your email",
      verifyToken,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Verifies the OTP provided by the user and, if valid, logs the user in by generating a new authentication token.
export const verifyUser = async (req, res) => {
  try {
    const { otp, verifyToken } = req.body;

    const verify = jwt.verify(verifyToken, process.env.Activation_sec);
    if (!verify)
      return res.status(400).json({
        message: "OTP Expired",
      });

    if (verify.otp !== otp)
      return res.status(400).json({
        message: "Invalid OTP",
      });

    const token = jwt.sign(
      { _id: verify.user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "5d",
      }
    );

    res.json({
      message: "Logged In successfully",
      user: verify.user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Retrieves and returns the authenticated user's profile information.
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
