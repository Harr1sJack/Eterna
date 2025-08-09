import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET   = process.env.JWT_SECRET;
const JWT_EXPIRES  = process.env.JWT_EXPIRES || '2d';

const buildToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: 'Missing required fields' });

    if (await User.findOne({ email }))
      return res.status(409).json({ msg: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash
    });
    return res
      .status(201)
      .json({ token: buildToken(newUser), msg: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    return res.json({ token: buildToken(user), msg: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};