import { Router } from 'express';
import { register, login, sendOtp, verifyOtp, updatePassword } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/update-password', updatePassword);

export default router;
