# Job Portal Server

This is the backend server for the Job Portal application. It provides REST APIs to manage job postings, job applications, and application statistics.

---

## Deployment
This server is deployed on Vercel and accessible at:
(https://job-portal-server-xi-one.vercel.app/)
---

## Features

- Connects to MongoDB Atlas using Mongoose  
- Provides endpoints to fetch all jobs, fetch job details by ID, add new jobs  
- Supports job applications submission and retrieval  
- Provides statistics on jobs posted and applications received  
- Handles CORS and JSON payloads  

---

## Technologies Used

- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- CORS  
- dotenv  

---

## Getting Started

### Prerequisites

- Node.js installed (v14 or above recommended)  
- MongoDB Atlas account with a database cluster  
- `.env` file in the project root containing:
   DB_User=yourMongoDBUsername
   DB_Pass=yourMongoDBPassword
   PORT=3000 # optional, default is 3000
---


### Installation & Running Locally

1. Clone the repository  
 ```bash
 git clone https://github.com/12usama/job-portal-server.git
 cd job-portal-server
---




