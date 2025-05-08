
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config as _config } from 'dotenv';
import authRoutes from './routes/auth.js';
import formRoutes from './routes/form.js';

_config();
const app = express();
app.use(cors());
app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    app.listen(process.env.PORT, () => console.log(`Server on ${process.env.PORT}`));
  })
  .catch(err => console.error('DB error', err));


