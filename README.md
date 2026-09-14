# 📚 Smart Learning Assistant

### An AI-powered learning platform that transforms study PDFs into interactive learning experiences.

**Upload a document → Ask questions → Generate summaries → Create flashcards → Take AI-generated quizzes → Track your progress.**

<p align="center">
  <img src="frontend/vite-project/public/Smart Learning Assistant logo design.png" alt="Smart Learning Assistant" width="700"/>
</p>

<p align="center">
  <strong>Learn smarter. Practice better. Understand faster.</strong>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

</p>

---

## 🌟 Overview

**Smart Learning Assistant** is a full-stack AI-powered education platform that transforms static study material into an interactive learning experience.

Instead of manually reading a PDF, preparing notes, creating flashcards, and making practice questions, users can upload their study material and let the application generate personalized learning resources.

### Core Workflow

```text
                    📄 Upload PDF
                         │
                         ▼
                  🔍 Extract Text
                         │
                         ▼
                   ✂️ Chunk Content
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
         💬 Chat      📝 Summary    🧠 AI Tools
                                      │
                              ┌───────┴───────┐
                              ▼               ▼
                         🃏 Flashcards     🎯 Quizzes
                              │               │
                              └───────┬───────┘
                                      ▼
                              📊 Track Progress
