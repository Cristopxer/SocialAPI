import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register user
export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();    
    const passwordHash = await bcrypt.hash(req.body.password, salt);
 
    const newUser = new User({
      ...req.body,
      password: passwordHash,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();    
    const { password, ...user } = newUser._doc;
    return res.status(201).json({...user});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// loggin in
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalidad credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userFormatted = user.toJSON();
    delete userFormatted.password;    
    return res.status(200).json({ token, userFormatted });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
