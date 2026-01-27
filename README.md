# 🤖 AI Customer Support Chatbot (Full-Stack)

A full-stack AI-powered customer support chatbot built using React, Node.js, Express, SQLite, and Groq AI (LLAMA 3).
The application supports session-based conversations, chat memory, and personalized AI responses.

## 🔗 Live Demo
- **Frontend (Vercel):** [https://shopease-ai-support.vercel.app](https://shopease-ai-support.vercel.app)
- **Backend (Hugging Face):** [https://hitaishi18-shopease-backend.hf.space](https://hitaishi18-shopease-backend.hf.space)

## 🚀 Features

* **💬 Real-time AI chat interface**
* **🧠 Conversation memory using SQLite**: Stores chat history for context-aware responses (persisted on Hugging Face).
* **👤 User name detection & personalization**: Automatically detects and remembers user names.
* **🔁 Session-based chat persistence**: Retains chat history on reload via LocalStorage.
* **⚡ Fast AI responses using Groq (LLAMA 3)**
* **🎨 Modern UI with Tailwind CSS**
* **🔄 New Chat functionality**: Easily clear session and start fresh.

## 🛠️ Tech Stack

### Frontend
* React (Vite)
* Tailwind CSS
* Fetch API
* **Deployment:** Vercel

### Backend
* Node.js
* Express.js
* SQLite (better-sqlite3)
* Groq AI SDK
* **Deployment:** Hugging Face Spaces (Docker)

## 📂 Project Structure

```text
project-root/
│
├── backend/            # Deployed to Hugging Face
│   ├── Dockerfile
│   ├── .env            # (Not committed)
│   ├── index.js
│   ├── db.js
│   ├── groq.js
│   └── chat.db         # Generated on server start
│
├── frontend/           # Deployed to Vercel
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   └── ...
⚙️ Environment Setup
1️⃣ Clone the Repository
Bash
git clone [https://github.com/hitaishi18-coder/shopease-ai-support.git](https://github.com/hitaishi18-coder/shopease-ai-support.git)
cd shopease-ai-support
2️⃣ Backend Setup (Local)
Navigate to the backend folder and install dependencies:

Bash
cd backend
npm install
Create a .env file in the backend/ directory:

Code snippet
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
# FRONTEND_URL=http://localhost:5173  (Optional for local CORS)
Start the backend server:

Bash
node index.js
Server will run at: http://localhost:5000

3️⃣ Frontend Setup (Local)
Navigate to the frontend folder and install dependencies:

Bash
cd frontend
npm install
Create a .env file in the frontend/ directory to point to your backend:

For Local Development:

Code snippet
VITE_API_BASE_URL=http://localhost:5000
For Production (Live):

Code snippet
VITE_API_BASE_URL=[https://hitaishi18-shopease-backend.hf.space](https://hitaishi18-shopease-backend.hf.space)
Start the frontend:

Bash
npm run dev
Frontend will run at: http://localhost:5173

🚀 Deployment Guide
Backend (Hugging Face Spaces)
Create a new Space (Docker SDK).

Upload the backend/ files to the Space root.

Add the following Secrets in Space Settings:

GROQ_API_KEY: Your Groq Cloud API Key.

Add the following Variables in Space Settings:

DB_PATH: /data/chat.db (for persistence).

FRONTEND_URL: https://your-frontend.vercel.app.

Frontend (Vercel)
Import the repository to Vercel.

Set the Root Directory to frontend.

Add the Environment Variable:

VITE_API_BASE_URL: https://hitaishi18-shopease-backend.hf.space

🧠 AI Prompt Design
The AI is instructed as a customer support agent for an e-commerce store (ShopEase) with predefined rules:

Shipping regions & timelines

Return policy

Support working hours

Personalized replies using user's name

👨‍💻 Author
Hitaishi Lohtia - Full-Stack Developer 📍 Amritsar, India

📜 License
ISC
