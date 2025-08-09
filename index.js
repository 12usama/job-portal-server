const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Job = require('./job.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(
  `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.nka8sja.mongodb.net/jobPortal?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('✅ Mongoose connected to MongoDB Atlas'))
.catch((err) => console.error('❌ Mongoose connection error:', err));

// ROUTES

// GET all jobs (no status filter)
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.send(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// GET job by ID
app.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send({ message: 'Job not found' });
    res.send(job);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// POST a new job (default status = "user")
app.post('/jobs', async (req, res) => {
  try {
    if (!req.body.status) {
      req.body.status = 'user'; // default for user-added jobs
    }
    console.log('Received job:', req.body);
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    console.log('Saved job:', savedJob);
    res.status(201).send({ message: 'Job added successfully' });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Job Applications (in-memory for now)
const jobApplications = [];

app.get('/job-application', (req, res) => {
  const email = req.query.email;
  const result = jobApplications.filter((app) => app.applicant_email === email);
  res.send(result);
});

app.post('/job-applications', (req, res) => {
  jobApplications.push(req.body);
  res.send({ message: 'Application added' });
});

// Stats route
app.get('/stats', async (req, res) => {
  try {
    const jobsCount = await Job.countDocuments();
    const applicationsCount = jobApplications.length;

    res.json({
      jobsPosted: jobsCount,
      applicationsReceived: applicationsCount,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Could not fetch stats' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
