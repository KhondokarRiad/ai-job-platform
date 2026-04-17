# ai-job-platform
# AI-Driven Job Recommendation and Skill Gap Analysis Platform

A full-stack AI-powered career support platform that helps users analyze their resume, identify skills, receive job recommendations, detect skill gaps from job descriptions, get personalized learning recommendations, and track career readiness progress.

---

## 📌 Project Overview

The **AI-Driven Job Recommendation and Skill Gap Analysis Platform** is designed to help students and job seekers understand their current skill level and improve their career preparation. Many users struggle to know which jobs match their skills, which skills they are missing, and what they should learn next. This system solves that problem by combining resume analysis, job recommendation, skill gap detection, and AI-based learning suggestions in one platform.

The system allows users to upload resumes, extract skills using AI, set career preferences, receive job recommendations, analyze job descriptions, identify missing skills, generate learning recommendations, and monitor their progress through a dashboard.

---

##  Main Objectives

- Provide a secure user registration and login system.
- Extract skills and profile information from resumes using AI.
- Recommend jobs based on user skills, preferences, and experience level.
- Analyze job descriptions to detect required and missing skills.
- Recommend courses, certifications, and project ideas for missing skills.
- Track user progress, completed learning resources, and readiness percentage.

---

##  Team Members

| Name | Role | Responsibilities |
|---|---|---|
| Khondokar Riad | Backend Developer / API Integration | Authentication, profile management, job preference logic, learning recommendation backend |
| Elham Fabia Ferdous | Frontend Developer | User interface, dashboard, resume upload UI, jobs page, learning and progress pages |
| Asraful Islam | AI & Database Developer | AI integration, skill extraction, database models, skill gap analysis, readiness logic |

---

##  Core Modules

### Module 1: User Profile and Resume Management

- User registration
- User login
- JWT-based authentication
- Profile view and update
- Resume upload
- AI-based skill extraction from resume

### Module 2: Job Recommendation and Skill Gap Analysis

- User job preference selection
- Job recommendation based on skills and preferences
- Job description analysis
- Required skills extraction
- Missing skill detection
- Readiness percentage calculation

### Module 3: Learning Recommendation and Progress Tracking

- AI-generated learning recommendations
- Course, certification, and project suggestions
- Mark learning resource as completed
- Update skill profile after completion
- Remove completed skill gaps
- Progress dashboard and readiness tracking

---

##  Key Features

- Secure authentication system
- Resume upload and parsing
- AI-based skill extraction
- Job recommendation system
- Job description analyzer
- Skill gap detection
- Learning recommendation generation
- Mark learning as completed
- Progress dashboard
- Readiness percentage tracking
- Profile management
- Frontend-backend API integration

---

## 🛠️ Technology Stack

### Frontend

- Next.js
- React.js
- JavaScript / JSX
- Tailwind CSS
- Fetch API

### Backend

- FastAPI
- Python
- SQLAlchemy
- JWT Authentication
- Passlib / Bcrypt

### Database

- PostgreSQL

### AI Integration

- Google Gemini API

### Tools

- Git
- GitHub
- VS Code
- Postman / FastAPI Swagger Docs

---

##  Project Structure

```text
ai-job-platform/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── skill.py
│   │   │   ├── job.py
│   │   │   └── learning.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── resume.py
│   │   │   ├── jobs.py
│   │   │   ├── learning.py
│   │   │   └── progress.py
│   │   │
│   │   └── utils/
│   │       ├── auth_utils.py
│   │       └── ai_utils.py
│   │
│   ├── main.py
│   ├── database.py
│   ├── backend_requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── resume/
│   │   ├── jobs/
│   │   ├── learning/
│   │   └── progress/
│   │
│   ├── lib/
│   │   └── api.js
│   │
│   ├── package.json
│   └── next.config.ts
│
└── README.md
