import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '2d';

// 🚀 NEW: Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, {
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

    // 🔧 UPDATED: Handle Google users who don't have passwords
    if (user.googleId && !user.password) {
      return res.status(400).json({ 
        msg: 'Please sign in with Google',
        hint: 'This account was created with Google. Use Google Sign-In instead.'
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    return res.json({ token: buildToken(user), msg: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 🚀 NEW: Google OAuth Handler
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ msg: 'Google token is required' });
    }

    console.log('🔍 Verifying Google token...');

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      name,
      picture: profilePicUrl,
      email_verified: emailVerified
    } = payload;

    console.log('✅ Google user data:', { googleId, email, name, emailVerified });

    // Check if user already exists with email or googleId
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (user) {
      console.log('👤 Existing user found');
      
      // If user exists but doesn't have googleId, link the accounts
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = emailVerified || user.isVerified;
        
        // Update profile pic only if user doesn't have one or it's the default
        if (!user.profilePic || user.profilePic === '/profile/default.png') {
          user.profilePic = profilePicUrl || '/profile/default.png';
        }
        
        await user.save();
        console.log('🔄 Linked existing account with Google');
      }
      
      // If user has googleId but email doesn't match, update email
      if (user.googleId === googleId && user.email !== email) {
        user.email = email;
        await user.save();
        console.log('🔄 Updated user email from Google');
      }
    } else {
      console.log('➕ Creating new Google user');
      
      // Create new user with Google data
      user = new User({
        googleId,
        name,
        email,
        profilePic: profilePicUrl || '/profile/default.png',
        isVerified: emailVerified,
        // password is not required due to schema function
      });
      
      await user.save();
      console.log('✅ New Google user created successfully');
    }

    // Generate JWT token (same as your regular login)
    const jwtToken = buildToken(user);

    console.log('🎉 Google auth successful for:', email);

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        isVerified: user.isVerified
      },
      msg: 'Google authentication successful'
    });

  } catch (error) {
    console.error('❌ Google auth error:', error.message);
    
    if (error.message.includes('Token used too early') || 
        error.message.includes('Invalid token') ||
        error.message.includes('Wrong number of segments')) {
      return res.status(400).json({ 
        msg: 'Invalid Google token',
        error: 'TOKEN_INVALID' 
      });
    }
    
    res.status(500).json({ 
      msg: 'Google authentication failed',
      error: error.message 
    });
  }
};
