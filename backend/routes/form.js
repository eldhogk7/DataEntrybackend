import{ Router } from 'express';
import { addForm, getForms } from '../controllers/formController.js';
const router = Router();
router.post('/add', addForm);
router.get('/get', getForms);
export default router;