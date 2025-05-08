import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpires: Date,
}, { timestamps: true });
export default model('User', UserSchema);
