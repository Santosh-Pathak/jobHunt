🚀 Hire Hub

* A comprehensive job seeking and posting platform that connects job seekers with recruiters.

✨ Features

👤 Job Seekers

* Account creation and management
* Job search with advanced filters
* Save jobs of interest
* Apply to jobs seamlessly
* Customizable user profile
* Resume upload and tracking

💼 Recruiters

* Company registration & dashboard
* Post and manage job listings
* View applicant details (name, phone, resume)
* Track and manage applicants

---

📸 Screenshots

| Section              | Features           |
| -------------------- | ------------------ |
| Job Description Page | Landing Page       |
| Sign In Interface    | Job Search UI      |
| Footer               | Profile Management |
| Chat Bot             | Company Dashboard  |
| Landing Page         | Job Posting Form   |


---

🛠️ Tech Stack

* Frontend**: React.js
* Backend**: Node.js
* Database**: MongoDB
* Cloud Storage**: Cloudinary
* AI Integration**: Google Gemini API

---

⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=8000
MONGO_URI=your_mongo_connection_uri
SECRET_KEY=your_secret_key
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUD_NAME=your_cloudinary_cloud_name
GIMINIAI_API=your_gemini_api_key
FRONTEND_URL=https://hire-hub-chandan.vercel.app
```

---

🔧 Frontend Configuration

Update the backend base URL in:
`client/src/utils/constant.js`

---

💻 Local Development

Step 1: Clone the repository

```bash
git clone https://github.com/Santosh-Pathak/JobHunt.git
cd JobHunt
```

Step 2: Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../Frontend
npm install
```

Step 3: Start development servers

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../Fronted
npm run dev
```
