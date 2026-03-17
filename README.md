# Clara - AI Chat Application

A modern AI chatbot application with a Next.js frontend and Express.js backend, powered by Groq LLM and Tavily search.

## 📁 Project Structure

```
clara/
├── frontend/                 # Next.js UI Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/         # API routes (proxying to backend)
│   │   │   ├── chat/        # Chat page
│   │   │   └── layout.tsx
│   │   └── components/
│   ├── package.json
│   └── next.config.ts
│
├── backend/                  # Express.js LLM Server
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic (LLM, search)
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utilities (webSearch)
│   │   ├── middleware/       # Express middleware
│   │   └── server.js         # Main server file
│   ├── package.json
│   └── .env.local
│
└── .env.local               # Shared environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- API Keys:
  - Groq API Key
  - Tavily API Key

### Installation

1. **Clone and setup**
   ```bash
   cd clara
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Configure environment variables**
   - Update `.env.local` in the root with your API keys

### Running the Application

**Terminal 1 - Start Backend Server**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
UI runs on `http://localhost:3000`

## 📡 API Endpoints

### Backend Server (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/chat` | Send chat message |

**POST /api/chat**
```json
{
  "prompt": "What is the latest news about AI?"
}
```

## 🏗️ Backend Architecture

- **Config**: Environment and application configuration
- **Controllers**: HTTP request handlers
- **Services**: 
  - `chatService.js`: LLM chat with agentic loop
  - `groqService.js`: Groq client management
  - `searchService.js`: Web search wrapper
- **Routes**: API route definitions
- **Utils**: Helper functions (webSearch)

## 🎨 Frontend Features

- ✨ Modern chat UI with dark/light mode
- 💬 Real-time message display
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- 📱 Responsive design
- 🔄 Auto-scroll to latest messages

## 🔧 Technologies

**Frontend**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Turbopack

**Backend**
- Express.js
- Groq SDK (LLM)
- Tavily API (Search)
- Node.js with ES modules

## 📝 Environment Variables

```env
# Backend
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
PORT=5000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
LLM_SERVER_URL=http://localhost:5000
```

## 🤖 How It Works

1. **User sends message** → Frontend UI
2. **Frontend calls API** → `/api/chat` (Next.js proxy)
3. **Next.js proxies request** → Backend `/api/chat`
4. **Backend processes with LLM**:
   - Sends prompt to Groq
   - If model requests web search, executes Tavily search
   - Sends search result back to model
   - Repeats up to 5 times or until model responds
5. **Response returned** to frontend and displayed

## 📦 Scripts

**Backend**
```bash
npm run start    # Production
npm run dev      # Development with hot reload
```

**Frontend**
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Linting
```

## 🐛 Debugging

Check console logs:
- **Backend**: Terminal running backend server
- **Frontend**: Browser developer tools
- **API calls**: Network tab in browser DevTools

## 📄 License

ISC

## 👤 Author

Your Name

---

**Happy Coding!** 🎉
