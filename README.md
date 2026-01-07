🤖 AI Customer Support Chatbot (Full-Stack)

A full-stack AI-powered customer support chatbot built using React, Node.js, Express, SQLite, and Groq AI (LLAMA 3).
The application supports session-based conversations, chat memory, and personalized AI responses.

🚀 Features

💬 Real-time AI chat interface

🧠 Conversation memory using SQLite

👤 User name detection & personalization

🔁 Session-based chat persistence (via LocalStorage)

⚡ Fast AI responses using Groq (LLAMA 3)

🎨 Modern UI with Tailwind CSS

🔄 New Chat functionality

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Fetch API

Backend

Node.js

Express.js

SQLite (better-sqlite3)

Groq AI SDK

📂 Project Structure
project-root/
│
├── backend/
│   ├── .env
│   ├── index.js
│   ├── db.js
│   ├── groq.js
│   ├── test-db.js
│   └── chat.db
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   └── Input.jsx
│   └── main.jsx
│
└── pnpm-lock.yaml

⚙️ Environment Setup
1️⃣ Clone the Repository
git clone <https://github.com/hitaishi18-coder/shopease-ai-support.git>
cd project-root

2️⃣ Backend Setup
cd backend
pnpm install


Create a .env file:

GROQ_API_KEY=your_groq_api_key_here


Start the backend server:

node index.js


Server will run at:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
pnpm install
pnpm dev


Frontend will run at:

http://localhost:5173

🔄 Application Workflow

User opens the frontend application.

A session ID is created or retrieved from LocalStorage.

User sends a message from the UI.

Message is sent to the backend via REST API.

Backend:

Stores conversation & messages in SQLite

Extracts user name if provided

Sends chat history + message to Groq AI

AI generates a response.

Response is saved in the database.

AI reply is sent back to the frontend.

UI updates the chat in real time.

🧠 AI Prompt Design

The AI is instructed as a customer support agent for an e-commerce store (ShopEase) with predefined rules:

Shipping regions & timelines

Return policy

Support working hours

Personalized replies using user's name

🗃️ Database Schema
Conversations Table
id TEXT PRIMARY KEY
userName TEXT
createdAt TEXT

Messages Table
id INTEGER PRIMARY KEY AUTOINCREMENT
conversationId TEXT
sender TEXT
text TEXT
createdAt TEXT

🐞 Known Issue

Frontend expects /chat/history/:sessionId

Backend route must be added for chat history retrieval

✅ Fix is included in development notes.

✨ Future Enhancements

Authentication (Login / Signup)

Streaming AI responses

Multi-agent support

Admin dashboard for chat logs

Deployment (Vercel + Render)

👨‍💻 Author

Hitaishi Lohtia
Full-Stack Developer
📍 Amritsar, India

📜 License

This project is for educational and portfolio purposes.
