const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  location: String,
  jobType: String,
  category: String,
  applicationDeadline: String,
  salaryRange: {
    min: Number,
    max: Number,
    currency: String,
  },
  description: String,
  company: String,
  requirements: [String],
  responsibilities: [String],
  status: String,
  hr_email: String,
  hr_name: String,
  map: String, // If you're also collecting a Google Map URL
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
