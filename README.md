# 🚀 OttoDev - Fully Local Chat Over Documents

An advanced document chat application that runs entirely locally on your machine!

It can even run fully in your browser with a small LLM via [WebLLM](https://webllm.mlc.ai/)!

OttoDev is a Next.js app that reads the content of an uploaded PDF, chunks it, adds it to a vector store, and performs RAG, all client side. You can even turn off your WiFi after the site loads.

Users can choose one of the below options to run inference:

## Browser-only mode

You can run the entire stack in your browser via [WebLLM](https://webllm.mlc.ai/). The model used is the small, 2.7B parameter [Phi-2](https://huggingface.co/microsoft/phi-2).

You don't have to leave the window to set this up - just upload a PDF and go!

Note that the first time you start a chat, the app will download and cache the model weights. This download is several GB in size and may take a little while, so make sure you have a good internet connection!

## Ollama

You can run more powerful, general models outside the browser using [Ollama's desktop app](https://ollama.ai). Users will need to download and set up then run the following commands to allow the site access to a locally running Mistral instance:

### Mac/Linux

```bash
$ OLLAMA_ORIGINS=* OLLAMA_HOST=127.0.0.1:11435 ollama serve
```
Then, in another terminal window:

```bash
$ OLLAMA_HOST=127.0.0.1:11435 ollama pull mistral
```

### Windows

```cmd
$ set OLLAMA_ORIGINS=*
set OLLAMA_HOST=127.0.0.1:11435
ollama serve
```
Then, in another terminal window:

```cmd
$ set OLLAMA_HOST=127.0.0.1:11435
ollama pull mistral
```

## ⚡ Stack

It uses the following:

- [Voy](https://github.com/tantaraio/voy) as the vector store, fully WASM in the browser.
- [Ollama](https://ollama.ai/) or [WebLLM](https://webllm.mlc.ai/) to run an LLM locally and expose it to the web app.
- [LangChain.js](https://js.langchain.com) to call the models, perform retrieval, and generally orchestrate all the pieces.
- [Transformers.js](https://huggingface.co/docs/transformers.js/index) to run open source [Nomic](https://www.nomic.ai/) embeddings in the browser.
  - For higher-quality embeddings, switch to `"nomic-ai/nomic-embed-text-v1"` in `app/worker.ts`.

While the goal is to run as much of the app as possible directly in the browser, you can swap in [Ollama embeddings](https://js.langchain.com/docs/modules/data_connection/text_embedding/integrations/ollama) in lieu of Transformers.js as well.

## 🔱 Getting Started

To run OttoDev locally:

1. Clone this repository
2. Install dependencies with `npm install` or `yarn`
3. Run `npm run dev` or `yarn dev`
4. Open your browser to `http://localhost:3000`

There are no required environment variables, but you can optionally set up [LangSmith tracing](https://smith.langchain.com/) while developing locally to help debug the prompts and the chain. Copy the `.env.local.example` file into a `.env.local` file:

```ini
# No environment variables required!

# LangSmith tracing from the web worker.
# WARNING: FOR DEVELOPMENT ONLY. DO NOT DEPLOY A LIVE VERSION WITH THESE
# VARIABLES SET AS YOU WILL LEAK YOUR LANGCHAIN API KEY.
NEXT_PUBLIC_LANGCHAIN_TRACING_V2="true"
NEXT_PUBLIC_LANGCHAIN_API_KEY=
NEXT_PUBLIC_LANGCHAIN_PROJECT=
```

Just make sure you don't set this in production, as your LangChain API key will be public on the frontend!