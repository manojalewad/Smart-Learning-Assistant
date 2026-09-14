

````markdown
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
````

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Secure password hashing with bcrypt
* Protected routes
* Profile management
* Password change

### 📄 Document Management

* Upload PDF study material
* Store PDFs using Cloudinary
* Extract text from PDFs
* Automatic document processing
* Document status tracking
* Rename and delete documents
* User-specific document access

### 🤖 AI-Powered Learning

* Generate AI summaries
* Ask questions about uploaded documents
* Explain concepts using document context
* Generate flashcards automatically
* Generate multiple-choice quizzes

### 💬 AI Document Chat

Ask questions directly about your uploaded study material.

The application retrieves relevant sections from the document and provides them to Google Gemini as context before generating the response.

```text
User Question
      ↓
Query Processing
      ↓
Relevant Chunk Retrieval
      ↓
Top Relevant Chunks
      ↓
Google Gemini
      ↓
Context-Aware Answer
```

### 🃏 Flashcards

* AI-generated questions and answers
* Difficulty levels
* Review tracking
* Star important cards
* Manage flashcard sets

### 🎯 Quizzes

* AI-generated multiple-choice questions
* Difficulty levels
* Automatic score calculation
* Detailed explanations
* Quiz result tracking

### 📊 Progress Dashboard

* Total documents
* Flashcard statistics
* Quiz statistics
* Average quiz score
* Recent learning activity

---

## 🧠 AI & RAG

The document chat feature uses a lightweight **Retrieval-Augmented Generation (RAG)** approach.

```text
PDF
 ↓
Text Extraction
 ↓
Text Chunking
 ↓
Keyword-Based Retrieval
 ↓
Relevant Chunks
 ↓
Google Gemini
 ↓
Context-Aware Response
```

Documents are divided into overlapping chunks of approximately **500 words with 50 words of overlap**.

When a user asks a question, the application scores document chunks based on keyword relevance and sends the most relevant chunks to Gemini.

> **Note:** The current implementation uses keyword-based retrieval rather than embeddings or a vector database.

---

## 🏗️ Architecture

```text
┌───────────────────────┐
│    React Frontend     │
│                       │
│ Pages / Components    │
│ Context / Services   │
│ Axios                 │
└───────────┬───────────┘
            │
        REST API
        + JWT
            │
            ▼
┌───────────────────────┐
│   Express Backend     │
│                       │
│ Routes                │
│ Middleware            │
│ Controllers           │
│ Utilities             │
└───────┬───────┬───────┘
        │       │
        ▼       ▼
   ┌────────┐ ┌──────────────┐
   │MongoDB │ │ External APIs│
   │        │ │              │
   │Mongoose│ │ Gemini       │
   └────────┘ │ Cloudinary   │
              └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* **React 19**
* **Vite**
* **React Router**
* **Axios**
* **Tailwind CSS**
* **Framer Motion**
* **Lucide React**
* **React Hot Toast**
* **React Markdown**
* **React Syntax Highlighter**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt**
* **Multer**
* **Cloudinary**
* **pdf-parse**
* **Google Gemini**
* **express-validator**

---

## 📁 Project Structure

```text
Smart-Learning-Assistant/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── server.js
│
├── frontend/
│   └── vite-project/
│       └── src/
│           ├── components/
│           ├── context/
│           ├── pages/
│           ├── services/
│           └── utils/
│
└── README.md
```

---

## 🔄 How It Works

### 1. Upload

The user uploads a PDF from the React frontend.

```text
React
 ↓
FormData
 ↓
Axios
 ↓
Express
 ↓
Multer
```

### 2. Store

The PDF is uploaded to Cloudinary and document metadata is stored in MongoDB.

### 3. Extract

`pdf-parse` extracts the text from the uploaded PDF.

### 4. Chunk

The extracted text is divided into overlapping chunks.

```text
500 words
+
50 words overlap
```

### 5. Generate

Google Gemini is used to generate:

* Summaries
* Flashcards
* Quizzes
* Concept explanations
* Document chat responses

### 6. Track

Learning resources and activity are stored in MongoDB and displayed through the dashboard.

---

## 🔑 Authentication Flow

```text
Register / Login
      ↓
Verify Credentials
      ↓
Generate JWT
      ↓
Client Stores Token
      ↓
Axios Interceptor
      ↓
Authorization: Bearer <token>
      ↓
Authentication Middleware
      ↓
Protected Controller
```

Passwords are hashed using **bcrypt** before being stored.

---

## 🗄️ Database

The application uses **MongoDB with Mongoose**.

### Main Models

```text
User
 ├── username
 ├── email
 ├── password
 └── profilepicture

Document
 ├── user
 ├── title
 ├── filepath
 ├── extractedtext
 ├── chunks[]
 └── status

FlashcardSet
 ├── user
 ├── document
 └── cards[]

Quiz
 ├── user
 ├── document
 ├── questions[]
 ├── useranswers[]
 └── score

ChatHistory
 ├── user
 ├── document
 └── messages[]
```

---

## 🔌 API Overview

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/getprofile
POST /api/v1/auth/updateprofile
PUT  /api/v1/auth/changepassword
```

### Documents

```http
POST   /api/v1/documents/upload
GET    /api/v1/documents/getdocuments
GET    /api/v1/documents/:id
POST   /api/v1/documents/update/:id
DELETE /api/v1/documents/:id
```

### AI

```http
POST /api/v1/ai/chat
POST /api/v1/ai/generate-summary
POST /api/v1/ai/generate-flashcards
POST /api/v1/ai/generate-quiz
POST /api/v1/ai/explainconcept
POST /api/v1/ai/getchathistory
```

### Flashcards

```http
GET    /api/v1/flashcards/getallflashcards
GET    /api/v1/flashcards/getflashcards/:id
POST   /api/v1/flashcards/review/:id
PUT    /api/v1/flashcards/star/:id
DELETE /api/v1/flashcards/:id
```

### Quizzes

```http
GET    /api/v1/quizess/getallquizes/:id
GET    /api/v1/quizess/getquizebyid/:id
POST   /api/v1/quizess/submitquize/:id
GET    /api/v1/quizess/getquizresult/:id
DELETE /api/v1/quizess/deletequize/:id
```

### Progress

```http
GET /api/v1/progress/dashboard
```

---

## ⚙️ Installation

### Prerequisites

* Node.js
* MongoDB / MongoDB Atlas
* Cloudinary account
* Google Gemini API key

### Clone

```bash
git clone <your-repository-url>
cd Smart-Learning-Assistant
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8000
NODE_ENV=development

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEYS=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run:

```bash
npm run dev
```

### Frontend

```bash
cd frontend/vite-project
npm install
npm run dev
```

---

## 🔒 Security

The application uses:

* JWT authentication
* bcrypt password hashing
* Protected API routes
* User-scoped database queries
* Input validation
* CORS configuration
* Environment variables for secrets

> Never commit `.env` files or API keys to GitHub.

---

## 📸 Screenshots

Add screenshots of the application here.

Recommended:

* Dashboard
* Document page
* AI Chat
* Flashcards
* Quiz
* Quiz Result

Example:

```text
docs/screenshots/dashboard.png
docs/screenshots/chat.png
docs/screenshots/flashcards.png
docs/screenshots/quiz.png
```

---

## 🚀 Future Improvements

* Semantic/vector-based RAG
* Embeddings and vector database
* Page-level document citations
* OCR for scanned PDFs
* DOCX/PPTX support
* Personalized AI tutor
* Adaptive quizzes
* Spaced repetition
* Real study streaks
* Advanced learning analytics
* Background document processing
* Automated testing
* API documentation
* Rate limiting

---

## 👨‍💻 Author

**Manoj Alewad**

Full-Stack Developer | AI Enthusiast

---

## ⭐ Support

If you found this project interesting, consider giving the repository a ⭐.

<p align="center">
  Built with ❤️ using React, Node.js, MongoDB & Google Gemini.
</p>
```
