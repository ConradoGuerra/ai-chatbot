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
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
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
  - Supports xAI (default), OpenAI, Fireworks, and other model providers
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
    "ticker": "NFLX",
    "name": "Netflix, Inc.",
    "price": "$224.19",
    "volume": 1049834,
    "change": "-0.15%"
  },
  {
    "ticker": "NVDA",
    "name": "NVIDIA Corporation",
    "price": "$182.35",
    "volume": 127657525,
    "change": "+0.32%"
  }
]
```

> This is not a REST API endpoint. You interact with the chatbot using natural language, and it will respond with up-to-date stock information.

## Model Providers

This template ships with [Gemini](https://gemini.google.com) `gemini-2.5` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET&envDescription=Learn+more+about+how+to+get+the+API+Keys+for+the+application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI+Chatbot&demo-description=An+Open-Source+AI+Chatbot+Template+Built+With+Next.js+and+the+AI+SDK+by+Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22integrationSlug%22%3A%22upstash%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

### Prerequisites

1. Docker installed on your machine
2. Create a `.env` file with the following variables:

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

https://vercel.com/marketplace/neon

1. Visit [Vercel Neon Integration](https://vercel.com/dashboard/stores) and click "Create Database"
2. After creating, you'll be taken to the Neon dashboard
3. Choose the tab ".env.local" abd copy value and key from `POSTGRES_URL`
4. Replace the `POSTGRES_URL` in your `.env` file with this connection string

### Installation Steps

1. Start the required services using Docker Compose:

```bash
docker compose up -d
```

2. Install Vercel CLI: `npm i -g vercel`
3. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000).
