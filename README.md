# Ollama Chatbot

A minimal React + TypeScript frontend and Express + TypeScript backend chatbot that works with a local Ollama model.

## Structure

- `frontend/` → React + TypeScript (Vite)
- `backend/` → Express + TypeScript  
- `shared/` → Future shared utilities

## Prerequisites

- Node.js 20+
- [Ollama](https://ollama.ai/) installed and running locally
- DeepSeek Coder model: `ollama pull deepseek-coder`

## Setup

1. Install dependencies:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

2. Start Ollama (if not already running):
```bash
ollama serve
```

3. Pull the DeepSeek Coder model:
```bash
ollama pull deepseek-coder
```

## Development

Start both frontend and backend:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

## Features

- **Chat Interface**: Clean React UI with message history
- **Streaming Responses**: Real-time streaming from Ollama via Server-Sent Events
- **File Upload**: Support for .txt, .md, .pdf, .zip files
- **TypeScript**: Full type safety across frontend and backend

## Environment Variables

Backend supports these environment variables:
- `OLLAMA_HOST` (default: http://localhost:11434)
- `MODEL` (default: deepseek-coder)
- `PORT` (default: 3001)

## API Endpoints

- `POST /api/chat` - Non-streaming chat
- `POST /api/chat/stream` - Streaming chat with SSE
- `POST /api/upload` - File upload
- `GET /api/health` - Health check

## Build

```bash
npm run build
```

## Production

```bash
npm start
```