<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Chat SDK</h1>
</a>

<p align="center">
    Chat SDK is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#chatbot-capabilities"><strong>Chatbot Capabilities</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports Gemini (default), OpenAI, Fireworks, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

## Chatbot Capabilities

You can ask the chatbot for real-time stock prices and portfolio information using natural language. For example:

**User:**

> What is the price of Netflix and NVIDIA stocks?

**Chatbot Output:**

```json
[
  {
    "empresa": "Netflix, Inc.",
    "ticker": "NFLX",
    "preço": "$224.19",
    "volume": 1049834,
    "variação": "-0.15%"
  },
  {
    "empresa": "NVIDIA Corporation",
    "ticker": "NVDA",
    "preço": "$182.35",
    "volume": 127657525,
    "variação": "+0.32%"
  }
]
```

> This is not a REST API endpoint. You interact with the chatbot using natural language, and it will respond with up-to-date stock information.

## Model Providers

This template ships with [Gemini](https://gemini.google.com) `gemini-2.5` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env.local` file is all that is necessary.

> Note: You should not commit your `.env.local` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

### Prerequisites

1. Docker installed on your machine
2. Create a `.env.local` file with the following variables:

```env
AUTH_SECRET=secret
REDIS_URL=redis://127.0.0.1:6379
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GOGGLE_GEMINI_API_KEY
FMP_API_KEY=YOUR_FMP_API_KEY
POSTGRES_URL=YOUR_NEON_CONFIG
```

- The `GOOGLE_GENERATIVE_AI_API_KEY` can be created at https://ai.google.dev/gemini-api/docs/api-key (It's free!)
- The `FMP_API_KEY` can be created at https://site.financialmodelingprep.com/ (It's also free!)

### Neon Database Setup

1. If you have already an accout, visit [Vercel Neon](https://vercel.com/dashboard/stores) and click "Create Database"
2. If you don't have an account, visit [Vercel Neon](https://vercel.com/marketplace/neon) and click "Install" to create a database for a project.
3. After creating, you'll be taken to the Neon dashboard
4. Choose the tab ".env.local" abd copy value and key from `POSTGRES_URL`
5. Replace the `POSTGRES_URL` in your `.env.local` file with this connection string

### Installation Steps

1. Start the required services using Docker Compose:

```bash
docker compose up -d
```

```bash
pnpm install
npx drizzle-kit push
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000).
