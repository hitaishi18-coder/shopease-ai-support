# 🤖 AI Customer Support Chatbot (Full-Stack)

A full-stack AI-powered customer support chatbot built using React, Node.js, Express, SQLite, and Groq AI (LLAMA 3).
The application supports session-based conversations, chat memory, and personalized AI responses.

## 🚀 Features

* **💬 Real-time AI chat interface**
* **🧠 Conversation memory using SQLite**: Stores chat history for context-aware responses.
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

### Backend
* Node.js
* Express.js
* SQLite (better-sqlite3)
* Groq AI SDK

## 📂 Project Structure

```text
project-root/
│
├── backend/
│   ├── .env
│   ├── index.js
│   ├── db.js
│   ├── groq.js
│   ├── test-db.js
│   └── chat.db        # Generated on server start
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   └── Input.jsx
│   │   └── main.jsx
│   └── pnpm-lock.yaml
⚙️ Environment Setup
1️⃣ Clone the Repository
Bash
git clone [https://github.com/hitaishi18-coder/shopease-ai-support.git](https://github.com/hitaishi18-coder/shopease-ai-support.git)
cd project-root
2️⃣ Backend Setup
Navigate to the backend folder and install dependencies:

Bash
cd backend
pnpm install
Create a .env file in the backend/ directory:

Code snippet
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
Start the backend server:

Bash
node index.js
Server will run at: http://localhost:5000

3️⃣ Frontend Setup
Navigate to the frontend folder and install dependencies:

Bash
cd frontend
pnpm install
(Optional) Create a .env file in the frontend/ directory: If you are running the backend on a different port or deploying, set the base URL:

Code snippet
VITE_API_BASE_URL=http://localhost:5000
Start the frontend:

Bash
pnpm dev
Frontend will run at: http://localhost:5173

🔄 Application Workflow
User opens the frontend application.

A session ID is created or retrieved from LocalStorage.

User sends a message from the UI.

Message is sent to the backend via REST API.

Backend processing:

Stores conversation & messages in SQLite.

Extracts user name if provided.

Sends chat history + message to Groq AI.

AI generates a response.

Response is saved in the database.

AI reply is sent back to the frontend.

UI updates the chat in real-time.

🧠 AI Prompt Design
The AI is instructed as a customer support agent for an e-commerce store (ShopEase) with predefined rules:

Shipping regions & timelines

Return policy

Support working hours

Personalized replies using user's name

🗃️ Database Schema
Conversations Table | Column | Type | Description | | :--- | :--- | :--- | | id | TEXT | Primary Key (Session ID) | | userName | TEXT | Detected User Name | | createdAt | TEXT | Timestamp |

Messages Table | Column | Type | Description | | :--- | :--- | :--- | | id | INTEGER | Primary Key (Auto-increment) | | conversationId | TEXT | Foreign Key (Session ID) | | sender | TEXT | 'user' or 'ai' | | text | TEXT | Message Content | | createdAt | TEXT | Timestamp |

✨ Future Enhancements
[ ] Authentication (Login / Signup)

[ ] Streaming AI responses

[ ] Multi-agent support

[ ] Admin dashboard for chat logs

[ ] Deployment (Vercel + Render)

👨‍💻 Author
Hitaishi Lohtia Full-Stack Developer 📍 Amritsar, India

📜 License
This project is for educational and portfolio purposes.
