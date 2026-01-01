# 🪐 Spur AI Support Agent

This project is a small AI-powered customer support chat application built as part of the **Spur – Founding Full-Stack Engineer** take-home assignment.

The goal was to simulate a realistic live chat widget where an AI agent answers customer questions, persists conversations, and handles common edge cases gracefully.

### 🌐 Deployment
- **Backend:** Node.js + Express + Prisma on Render
- **Frontend:** React (built and served as static assets by the backend)
- **Database:** PostgreSQL hosted on Neon
- **LLM:** Hugging Face (OpenAI-compatible API)

---

## ✨ Features
* **Live Chat UI:** Real-time interaction with user & AI messages.
* **Session Persistence:** Conversations are saved in the database and reload on refresh.
* **History Management:** Multiple session history panel to revisit past chats.
* **AI Intelligence:** Powered by a real LLM with context awareness.
* **Robustness:** Graceful error handling for LLM failures or invalid inputs.
* **Clean UX:** Minimalist design inspired by professional support tools.

## 🚀 Live Demo
**Deployed URL:** [https://spur-ai-support-agent-4m9d.onrender.com](https://spur-ai-support-agent-4m9d.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
* React + TypeScript
* Custom CSS (Glassmorphism / Space theme)

### Backend
* Node.js + Express
* TypeScript
* Prisma ORM

### Database
* PostgreSQL (Neon)

### AI / LLM
* **Provider:** Hugging Face Router (OpenAI-compatible API)
* **Model:** `meta-llama/Llama-3.1-8B-Instruct`

---

## 📦 How to Run Locally (Step by Step)

### 1️⃣ Clone the repository
```bash
git clone <repo-url>
cd spur-ai-support-agent
```

### 2️⃣ Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3️⃣ Configure environment variables

Create a .env file inside the backend/ folder:

**Code snippet**
```
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
HF_API_KEY=hf_xxxxxxxxxxxxxxxxx
PORT=8000
```
**⚠️ Note: No quotes around values.**


### 4️⃣ Set up the database (Prisma)

From the backend/ folder:
```bash
npx prisma migrate dev --name init
```
This will create tables and sync the schema with your database.

### 5️⃣ Build frontend and attach to backend

```bash
cd ../frontend
npm run build
```
Copy the generated dist/ folder into backend/dist.

### 6️⃣ Run the backend (Production Mode)

```bash
cd ../backend
npm run build
npm run start
```

**Open: http://localhost:8000**

---

# 🧠 Backend Architecture Overview

## 🏗️ Project Structure
The backend follows a layered architecture to ensure modularity and ease of maintenance.

```text
src/
 ├── routes/          # Express route handlers (HTTP layer)
 ├── repositories/    # DB access logic (Prisma / Persistence layer)
 │    ├── conversation.repo.ts
 │    └── message.repo.ts
 ├── services/        # Business logic & Third-party integrations
 │    ├── chat.service.ts
 │    └── llm.service.ts
 ├── validators/      # Zod request validation schemas
 ├── config/          # Prisma client and environment configuration
 ├── app.ts           # Express application configuration
 └── server.ts        # Server entry point
```

---

## 🗄️ Data Model

The database is structured to support stateful chat sessions, using a one-to-many relationship between conversations and messages.

### **Conversation**
- **id**: `string` (Unique Identifier)
- **createdAt**: `Date`

### **Message**
- **id**: `string` (Unique Identifier)
- **conversationId**: `string` (Link to parent Conversation)
- **sender**: `"user"` | `"ai"`
- **text**: `string`
- **createdAt**: `Date`

> **Note:** Each chat session maps to exactly one conversation, ensuring messages are retrieved in chronological order.

---

## 🤖 LLM Integration Notes

### **Integration**
The system utilizes the **OpenAI SDK** configured to work with the **Hugging Face router**, providing a flexible and high-performance inference bridge.

### **Prompting Approach**
To provide accurate customer support, the **System Prompt** is seeded with specific store metadata:
* Shipping & Logistics policies
* Return and Refund procedures
* Official support hours and contact info

### **Context Management**
To maintain a natural dialogue, the **entire conversation history** is included in the payload for every request, allowing the AI to reference previous user inputs.

### **Error Handling**
The integration includes a robust failure strategy:
* **Timeouts:** If the LLM provider fails to respond, a fallback message is triggered.
* **Resilience:** Ensures the user experience isn't interrupted even if the AI service experiences downtime.

---

## 🧪 Robustness & Edge Cases

Ensuring a reliable user experience by handling unexpected inputs and service interruptions.

* **Input Validation:** Empty or whitespace-only messages are rejected by the backend.
* **Token Management:** Long messages are capped to prevent token overflow and ensure LLM cost-efficiency.
* **Graceful Degradation:** LLM failures are caught via error boundaries; service interruptions do not crash the application.
* **Feedback Loops:** The UI includes loading states and "typing" indicators to provide immediate visual feedback.

---

## 🎨 Product & UX Decisions

The interface was designed with a focus on user engagement and clarity.

* **Distraction-free UI:** A minimalist layout that prioritizes the conversation flow.
* **Visual Hierarchy:** Distinct styling for user and AI message bubbles to make the dialogue easy to scan.
* **Seamless Onboarding:** A dedicated welcome screen captures the user's name to personalize the interaction from the start.
* **Polished Feel:** Subtle animations provide a "live" sensation without being overbearing or distracting.

---

## ⚖️ Trade-offs & "If I Had More Time..."

### **Trade-offs**
* **Serving Strategy:** The frontend is served directly from the backend to simplify deployment for this assignment.
* **Authentication:** Auth was omitted as it was outside the immediate project scope.
* **Response Handling:** Implemented typing indicators instead of token-by-token streaming to prioritize a faster initial development cycle.

### **If I had more time...**
* **Streaming:** Implement **Server-Sent Events (SSE)** or WebSockets for real-time LLM token streaming.
* **Human Handoff:** Develop logic to detect frustration or complex queries and flag them for a human agent.
* **Testing:** Test this properly with all possible methods.

---
## 🤖 AI Usage Disclosure

AI tools (including Large Language Models) were used selectively during development as a productivity and debugging aid, similar to how senior engineers utilize documentation, Stack Overflow, or specialized internal tools.

### **How AI was used**
* **Debugging:** Assisting with environment configuration and deployment nuances (Express, Prisma, Render).
* **TypeScript Safety:** Reasoning about complex TypeScript errors and ensuring robust edge-case handling.
* **Architectural Validation:** Validating high-level design patterns, separation of concerns, and technical trade-offs.
* **Prompt Engineering:** Refining the system prompts and error-handling logic for the LLM integration.
* **README File:** For creating README File.

### **Ownership & Responsibility**
* **Engineering Judgment:** I treated AI as a "thinking partner" to accelerate workflow, rather than a replacement for core engineering principles.
* **Full Understanding:** Every line of code in this project is something I can explain, modify, and extend confidently.

---

## 🙌 Final Note

Thank you for this assignment — it was a genuinely enjoyable and practical exercise. It closely resembles real product work, and I learned a lot while building and deploying it end-to-end.

Looking forward to your feedback!
