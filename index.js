const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const Job = require('./job.js');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.nka8sja.mongodb.net/jobPortal?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ✅ Correct Mongoose connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Mongoose connected to MongoDB Atlas'))
.catch(err => console.error('❌ Mongoose connection error:', err));

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //jobs related apis
    const jobsCollection = client.db('jobPortal').collection('jobs');
    const jobApplicationsCollection = client.db('jobPortal').collection('jobApplications');

    app.get('/jobs', async (req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })

    app.get('/job-application', async (req, res) => {
      const email = req.query.email;
      const query = { applicant_email : email };
      const result = await jobApplicationsCollection.find(query).toArray();

      for(const application of result) {
        const query1 = {_id: new ObjectId(application.job_id)}
        const job = await jobsCollection.findOne(query1);

        if(job){
          application.title = job.title;
          application.company = job.company;
          application.location = job.location;        
          application.company_logo = job.company_logo;
          application.category = job.category;
          application.jobType = job.jobType;
        }
      }

      res.send(result);
    })

    app.post('/job-applications', async (req, res) => {
      const jobApplication = req.body;
      const result = await jobApplicationsCollection.insertOne(jobApplication);
      res.send(result);
    })

    app.post('/jobs', async (req, res) => {
      try {
        console.log('Received job:', req.body); // Debug
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        console.log('Saved job:', savedJob); // Debug
        res.status(201).send({ message: 'Job added successfully' });
      } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).send({ message: 'Server error' });
      }
    });
    
    

  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});