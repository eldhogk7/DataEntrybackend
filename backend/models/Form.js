import { Schema, model } from 'mongoose';
const FormSchema = new Schema({
    companyName: String,
    companyType: String,
    address: String,
    contactNumber: String,
    contactPerson: String,
    emailId: String,
    shortNote: String,
    visitingDate: Date,
    revisitingDate: Date,
    userEmail: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  }, { timestamps: true });
export default model('Form', FormSchema);