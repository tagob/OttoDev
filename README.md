# OttoDev

A lightweight local development assistant with AI chat and code generation capabilities. Think of it as a locally runnable version of bolt.diy with essential features for developers.

## 🚀 Features

- **AI Chat Interface**: Clean React-based chat UI with streaming responses
- **Code Generation**: Generate and preview code snippets with syntax highlighting
- **File Management**: Upload, view, and manage project files
- **Live Preview**: Real-time preview of generated HTML/CSS/JS
- **Local AI Integration**: Works with local Ollama models
- **Modern Stack**: React + TypeScript frontend, Express + TypeScript backend

## 🏗️ Project Structure

```
ottodev/
├── server.ts              # Main Express server
├── routes/                # API routes
│   ├── chat.ts           # Chat endpoints
│   ├── upload.ts         # File upload
│   ├── health.ts         # Health check
│   └── code.ts           # Code generation
├── controllers/           # Business logic
├── services/             # External integrations
├── models/               # TypeScript interfaces
├── utils/                # Utilities
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   └── utils/           # Frontend utilities
├── uploads/             # File uploads
└── generated/           # Generated code files
```

## 🛠️ Prerequisites

1. **Node.js 20+** installed
2. **Ollama** running locally:
   ```bash
   ollama serve
   ```
3. **DeepSeek Coder model** installed:
   ```bash
   ollama pull deepseek-coder
   ```

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## 📝 Usage

### Chat with AI
- Type messages to get AI assistance
- Ask for code generation, explanations, or debugging help
- Responses stream in real-time

### Generate Code
- Request HTML, CSS, or JavaScript code
- Preview generated code instantly
- Save generated files to your project

### File Management
- Upload files (.txt, .md, .pdf, .zip)
- View and manage uploaded files
- Reference files in your conversations

## 🔧 Configuration

Environment variables:
- `OLLAMA_HOST` - Ollama server URL (default: `http://localhost:11434`)
- `MODEL` - Ollama model name (default: `deepseek-coder`)
- `PORT` - Backend port (default: `3001`)

## 🏃‍♂️ Development

- `npm run dev` - Start both frontend and backend
- `npm run dev:server` - Backend only (port 3001)
- `npm run dev:client` - Frontend only (port 3000)
- `npm run build` - Build for production
- `npm run clean` - Clean build artifacts

## 🎯 Roadmap

- [ ] Project templates
- [ ] Git integration
- [ ] Database schema generation
- [ ] API endpoint generation
- [ ] Component library
- [ ] Deployment helpers

---

**OttoDev** - Your local development companion 🤖