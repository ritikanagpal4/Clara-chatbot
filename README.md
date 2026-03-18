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
| POST | `/api/chat` | Send chat message with thread context |
| GET | `/api/cache-stats` | View active conversation threads and cache stats |

**POST /api/chat**
```json
{
  "prompt": "What is the latest news about AI?",
  "threadId": "uuid-optional-for-context"
}
```

**Response**
```json
{
  "success": true,
  "text": "The latest AI news includes...",
  "threadId": "uuid-for-maintaining-context"
}
```

**GET /api/cache-stats** - View all cached conversations
```json
{
  "success": true,
  "cache": {
    "totalThreads": 1,
    "threads": {
      "thread-uuid": {
        "messageCount": 5,
        "messages": [
          { "role": "user", "content": "Hello" },
          { "role": "assistant", "content": "Hi there!" }
        ],
        "createdAt": "2026-03-18T10:30:00.000Z",
        "lastUpdated": "2026-03-18T10:35:00.000Z"
      }
    }
  }
}
```

## 🏗️ Backend Architecture

- **Config**: Environment and application configuration
- **Controllers**: HTTP request handlers
- **Services**: 
  - `chatService.js`: LLM chat with agentic loop and thread context
  - `cacheService.js`: Conversation memory with 30-minute TTL
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
- 🧠 **Conversation Memory** - Maintains chat context for 30 minutes per thread
- 📋 Copy button on assistant responses

## 🔧 Technologies

**Frontend**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Turbopack
- uuid (for thread ID generation)

**Backend**
- Express.js
- Groq SDK (LLM)
- Tavily API (Search)
- node-cache (Conversation memory)
- uuid (Thread ID generation)
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

## 💾 Conversation Memory

Clara maintains conversation context for **30 minutes** per chat session:

- **Thread ID**: Each conversation gets a unique UUID
- **Server-side Cache**: Uses node-cache to store message history in backend memory
- **Auto-expiry**: Threads automatically expire after 30 minutes of inactivity
- **Context-aware Responses**: LLM uses full conversation history to maintain context
- **Monitoring**: Visit `http://localhost:5000/api/cache-stats` to view active threads

### How Memory Works

1. Frontend generates a unique thread ID (UUID) on page load
2. Each message includes this thread ID
3. Backend stores all messages (user + assistant) in the thread
4. LLM receives full conversation history for context
5. Thread data persists in memory for 30 minutes
6. After 30 minutes of inactivity, the thread is automatically cleaned up

## 🤖 How It Works

1. **User sends message** → Frontend UI (with thread ID)
2. **Frontend calls API** → `/api/chat` with prompt and threadId (Next.js proxy)
3. **Next.js proxies request** → Backend `/api/chat`
4. **Backend retrieves thread context**:
   - Looks up threadId in cache
   - Gets all previous messages in the conversation
5. **Backend processes with LLM**:
   - Sends full message history to Groq for context
   - If model requests web search, executes Tavily search
   - Sends search result back to model
   - Repeats up to 5 times or until model responds
6. **Cache updated**: Response is saved to thread cache
7. **Response returned** to frontend and displayed
8. **Thread persistence**: Thread remains active for 30 more minutes

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

Ritika

**Happy Coding!** 🎉
