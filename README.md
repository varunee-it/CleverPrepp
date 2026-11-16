# CleverPrep

**AI-Powered Personalized Learning & Exam Preparation Platform**

CleverPrep transforms static academic PDFs and lecture notes into active study workspaces: active-recall flashcards, 4-option practice quizzes, conversational document Q&A tutoring, and dual-speaker audio podcasts.

---

## 1. Deployment Status

- **Live Application URL:** `Deployment pending` (Cloud deployment scheduled; run locally via Docker Compose below).
- **Backend Health Check:** `http://localhost:5050/api/test` (Local)
- **Repository URL:** [https://github.com/varunee-it/CleverPrepp.git](https://github.com/varunee-it/CleverPrepp.git)

---

## 2. Quick Start — Local Setup (3 Commands)

Initialize and launch the complete stack with Docker Compose in 3 commands:

```bash
# 1. Clone repository
git clone https://github.com/varunee-it/CleverPrepp.git

# 2. Enter project directory
cd CleverPrepp

# 3. Build and run all services
docker compose up --build
```

### Access Points
- **Frontend Web Application:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5050](http://localhost:5050)

---

## 3. Prerequisites & Environment Configuration

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- A MongoDB connection string (local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) URI).
- A [Google Gemini API Key](https://aistudio.google.com/) for AI generation.

### Configuration (`backend/.env`)
Create `backend/.env` with the following variables before launching:

```env
PORT=5050
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cleverprep?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

---

## 4. Our Team

**Academic Program:** M.Sc. (IT), Dhirubhai Ambani University  
**Project Guide:** Prof. Shruti Bhilare  

| Enrollment Number | Team Member |
|---|---|
| 202512001 | Shruti Makwana |
| 202512064 | Krisha Shah |
| 202512067 | Varunee Agrawal |
| 202512085 | Hardi Dhadhal |
