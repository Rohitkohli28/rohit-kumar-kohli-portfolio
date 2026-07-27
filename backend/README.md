# 🚀 Rohit's Portfolio Backend Service

Production-grade, modular Node.js + Express + TypeScript backend service built for Rohit Kumar Kohli's developer portfolio website.

---

## 📁 Architecture & Directory Structure

```
backend/
├── src/
│   ├── config/          # Environment variables & MongoDB Mongoose connection
│   │   ├── db.ts
│   │   └── env.ts
│   ├── models/          # Mongoose database schemas
│   │   ├── ContactMessage.ts   # Contact form submissions (with email status)
│   │   ├── StatsCache.ts       # GitHub & LeetCode API cache in MongoDB
│   │   └── ResumeAnalytics.ts  # Track resume PDF download metrics
│   ├── services/        # Business logic layer
│   │   ├── emailService.ts    # Nodemailer transport, retry backoff & HTML emails
│   │   ├── githubService.ts   # GitHub REST API fetch & MongoDB caching
│   │   ├── leetcodeService.ts # LeetCode GraphQL query & MongoDB caching
│   │   └── geminiService.ts   # AI symptom analyzer, resume ATS score & chatbot RAG
│   ├── controllers/     # Request handlers
│   │   ├── contactController.ts
│   │   ├── statsController.ts
│   │   ├── geminiController.ts
│   │   └── resumeController.ts
│   ├── routes/          # Express route definitions
│   │   ├── healthRoutes.ts
│   │   ├── contactRoutes.ts
│   │   ├── statsRoutes.ts
│   │   ├── geminiRoutes.ts
│   │   └── resumeRoutes.ts
│   ├── middleware/      # Rate limiting, Zod validation, security & error handling
│   │   ├── rateLimiter.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── utils/           # Input sanitization & logger
│   │   ├── logger.ts
│   │   └── sanitize.ts
│   ├── app.ts           # Express application setup, Helmet & CORS
│   └── server.ts        # Server entrypoint
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/contact` | Submits contact form inquiry (validates input, rate-limits, saves to MongoDB, dispatches email via Nodemailer) |
| `GET` | `/api/github/stats` | Returns GitHub profile, repos, and contribution calendar (cached in MongoDB) |
| `GET` | `/api/leetcode/stats` | Returns LeetCode solved counts, rankings & recent submissions (cached in MongoDB) |
| `GET` | `/api/resume/download` | Serves and downloads the official PDF resume with attachment headers & logs analytics |
| `POST` | `/api/gemini/symptom-analyze` | Healthcare symptom evaluation using Google Gemini |
| `POST` | `/api/gemini/resume-analyze` | ATS resume scoring & section feedback using Google Gemini |
| `POST` | `/api/chat` | AI Portfolio Assistant RAG conversational endpoint |

---

## 🔑 Environment Variables Setup

Copy `.env.example` to `.env` in `backend/` and populate:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=kohlirohit2428@gmail.com
SMTP_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=kohlirohit2428@gmail.com
GITHUB_TOKEN=your_github_personal_access_token
LEETCODE_USERNAME=Rohit2028
GEMINI_API_KEY=your_gemini_api_key
```

---

## 💻 Local Development

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start development server with live reload
npm run dev
```

---

## 🌐 Production Deployment Recommendations

For hosting this Express backend with MongoDB connections and rate limiting:

- **Recommended Host**: **Render** or **Railway** (Web Service container tier).
- **Reasoning**: A persistent Express server with Mongoose connections and on-demand caching runs best on a container platform with persistent connections. Vercel serverless functions freeze between invocations, breaking connection pools and rate limiting.
