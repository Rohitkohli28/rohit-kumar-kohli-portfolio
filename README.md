# 🚀 Rohit Kumar Kohli — Full-Stack Developer Portfolio & AI Assistant

[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-3.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini)](https://ai.google.dev)
[![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

A state-of-the-art, production-grade **Developer Portfolio & AI Assistant** built using **React 19**, **TypeScript**, **Express**, **Tailwind CSS v4**, and **Google Gemini 3.5 Flash**. 

Features an integrated **RAG-powered AI Chatbot** that acts as a personal assistant for recruiters and visitors, answering questions about skills, projects, work experience, certifications, and providing direct resume downloads.

---

## 🌟 Live Demos & Links

- 🌐 **Portfolio Website**: [rohit-kumar-kohli-portfolio.vercel.app](https://github.com/Rohitkohli28/rohit-kumar-kohli-portfolio)
- 🏥 **Doctor Appointment System (Project 01)**: [rohit-healthcare-appointment.vercel.app](https://rohit-healthcare-appointment.vercel.app)
- 💬 **Real-Time Chat Application (Project 03)**: [rohit-chat-app.vercel.app](https://rohit-chat-app.vercel.app)
- 👨‍💻 **GitHub Profile**: [@Rohitkohli28](https://github.com/Rohitkohli28)
- 💼 **LinkedIn Profile**: [in/rohitkumarkohli](https://linkedin.com/in/rohitkumarkohli)

---

## 🔥 Key Features

### 🤖 1. Floating AI Portfolio Assistant (RAG Engine)
- **Natural Language Conversations**: Powered by **Google Gemini 3.5 Flash** (`@google/genai`) and a custom server/client-side **Retrieval-Augmented Generation (RAG)** engine.
- **Rich Interactive UI Cards**:
  - 📄 **Resume Card**: Direct PDF download (`/Rohit_Kumar_Kohli_Resume.pdf`) and preview button.
  - 🚀 **Projects Cards**: Interactive cards with Live Demo and GitHub links.
  - ⚡ **Skills Matrix**: Categorized animated badges with proficiency levels (highlighting Java at 90%).
  - 💼 **Experience Timeline**: Internship timeline at Celebal Tech, SmartBridge, SmartED Innovations, and Microsoft Azure.
  - 🏆 **Certifications**: Google Cloud Hackathon Top Rank, Microsoft Azure Developer Associate, Meta Frontend Developer, and ServiceNow Certified.
- **Context-Aware History**: Remembers multi-turn chat context and resolves pronouns naturally.
- **Out-of-Scope Protection**: Gracefully restricts non-portfolio queries to keep conversations professional.

### 📐 2. System Design & Architecture Visualizer
- Visual topology diagrams, request lifecycles, Mongoose database schemas, and security blueprints for every featured project right inside the portfolio modal.

### 💻 3. Konami CLI Terminal Modal
- Interactive CLI terminal modal for developers accessible via shortcut.

### 🎨 4. Ultra-Premium Aesthetics
- Built with **Glassmorphism**, smooth **Framer Motion** micro-animations, theme toggling, and zero layout shift.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons |
| **Backend API** | Node.js, Express 4, Vercel Serverless Functions, Nodemailer SMTP |
| **Artificial Intelligence** | Google Gemini 3.5 Flash API (`@google/genai`), RAG Knowledge Engine |
| **Databases & Tools** | MongoDB, Redis, Docker, Git, Postman, Power BI |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User / Recruiter]) -->|Interacts with UI| ReactClient[React 19 + Vite Frontend]
    ReactClient -->|Sends Query + History| ExpressAPI[Express Server / Vercel Serverless API]
    ExpressAPI -->|1. Out-of-Scope Filter| ScopeCheck{Is Portfolio Query?}
    ScopeCheck -->|No| Restriction[Return Friendly Scope Notice]
    ScopeCheck -->|Yes| RAG[RAG Retrieval Engine - knowledge.json]
    RAG -->|2. Context Framing| GeminiSDK[Google Gemini 3.5 Flash API]
    GeminiSDK -->|3. AI Reply + Card Type| ReactClient
    ReactClient -->|4. Embeds Rich Cards| RichCardsUI[Projects / Skills / Resume / Contact UI Embeds]
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Rohitkohli28/rohit-kumar-kohli-portfolio.git
cd rohit-kumar-kohli-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"

# Nodemailer Contact Form Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
PORTFOLIO_OWNER_EMAIL="kohlirohit2428@gmail.com"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Vercel Deployment

This repository is pre-configured with `vercel.json` and `api/index.ts` for instant Vercel Serverless Function deployment.

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Update README and configuration"
   git push origin main
   ```
2. Import repository on [Vercel Dashboard](https://vercel.com/new).
3. Add your **Environment Variables** (`GEMINI_API_KEY`, `SMTP_USER`, `SMTP_PASS`, `PORTFOLIO_OWNER_EMAIL`).
4. Click **Deploy**!

---

## 👤 Author & Contact

**Rohit Kumar Kohli**
- **Role**: Full-Stack Developer & Software Engineer (B.Tech CSE, 8.4 CGPA)
- **Location**: Dehradun / Jaipur, India
- **Email**: [kohlirohit2428@gmail.com](mailto:kohlirohit2428@gmail.com)
- **GitHub**: [@Rohitkohli28](https://github.com/Rohitkohli28)
- **LinkedIn**: [Rohit Kumar Kohli](https://linkedin.com/in/rohitkumarkohli)

---

&copy; 2026 Rohit Kumar Kohli. All rights reserved.
