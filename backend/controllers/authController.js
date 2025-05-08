import User from '../models/User.js';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';


const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req, res) {
  const { fullName, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email exists' });
    const hashed = await hash(password, 10);
    const user = new User({ fullName, email, password: hashed });
    await user.save();
    res.json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });
    const match = await compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });
    const token = sign({ email: user.email }, JWT_SECRET);
    res.json({ token, username: user.fullName });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error' });
  }
}

export async function sendOtp(req, res) {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
  
      // Format HTML email content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>OTP Verification</h2>
          <p>Hi ${user.fullName || 'User'},</p>
          <p>Your OTP code is:</p>
          <h3 style="color: #4CAF50;">${otp}</h3>
          <p>This code is valid for 10 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <br/>
          <p>Thanks,<br/>Abhram Technologies Team</p>
        </div>
      `;
  
      const emailData = {
        sender: { name: 'Abhram Technologies', email: 'support@abhram.com' },
        to: [{ email }],
        subject: '🔐 Your OTP Code – Abhram Technologies',
        htmlContent: emailContent
      };
  
      const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.EMAIL_API_KEY,
        },
        body: JSON.stringify(emailData)
      });
  
      if (!response.ok) {
        const errData = await response.json();
        console.error('Sendinblue error:', errData);
        return res.status(500).json({ message: 'Failed to send OTP email', error: errData });
      }
  
      res.json({ message: 'OTP sent',status: 'success' });
  
    } catch (err) {
      console.error('OTP error:', err);
      res.status(500).json({ message: 'OTP error', error: err.message });
    }
  }

export async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
    res.json({ message: 'OTP verified' , status: 'success'});
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ message: 'OTP verify error' });
  }
}

export async function updatePassword(req, res) {
  const { email, newPassword } = req.body;
  try {
    const hashed = await hash(String(newPassword), 10);
    await User.updateOne({ email }, { password: hashed, otp: null, otpExpires: null });
    res.json({ message: 'Password updated' , status: 'success' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ message: 'Password update error' });
  }
}
