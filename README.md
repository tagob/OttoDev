# Ollama Chatbot

A minimal React + TypeScript frontend and Express + TypeScript backend chatbot that works with local Ollama models.

## Project Structure

```
├── frontend/          # React + TypeScript (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
├── backend/           # Express + TypeScript
│   ├── src/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── shared/            # Future shared utilities
└── README.md
```

## Features

- **Chat Interface**: Clean React-based chat UI with message history
- **Streaming Responses**: Real-time streaming from Ollama via Server-Sent Events
- **File Upload**: Support for .txt, .md, .pdf, .zip files
- **TypeScript**: Full type safety across frontend and backend
- **CORS Enabled**: Proper cross-origin setup for development

## Prerequisites

1. **Node.js 20+** installed
2. **Ollama** running locally:
   ```bash
   ollama serve
   ```
3. **DeepSeek Coder model** installed:
   ```bash
   ollama pull deepseek-coder
   ```

## Quick Start

1. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

2. **Start development servers**:
   ```bash
   # From project root - starts both frontend and backend
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend (port 3001)
   cd backend && npm run dev
   
   # Terminal 2 - Frontend (port 3000)
   cd frontend && npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## API Endpoints

- `POST /api/chat` - Non-streaming chat with Ollama
- `POST /api/chat/stream` - Streaming chat via Server-Sent Events
- `POST /api/upload` - File upload (returns filename)
- `GET /api/health` - Health check

## Environment Variables

Backend supports these environment variables:

- `OLLAMA_HOST` - Ollama server URL (default: `http://localhost:11434`)
- `MODEL` - Ollama model name (default: `deepseek-coder`)
- `PORT` - Backend port (default: `3001`)

## Usage

1. Type messages in the chat input and press Send
2. Upload files using the file input (supported: .txt, .md, .pdf, .zip)
3. Watch responses stream in real-time from the Ollama model
4. View chat history with user and assistant messages

## Development

- Frontend runs on port 3000 with Vite dev server
- Backend runs on port 3001 with ts-node-dev for hot reloading
- Vite proxy forwards `/api/*` requests to the backend
- TypeScript compilation and type checking enabled for both projects