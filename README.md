# Durable, Extensible Agent Template

A generic, extensible agent template powered by Resonate's Distributed Async Await. The agent template can be instantiated with a system prompt and a set of tools to create a specialized agent. The agent invokes and awaits multiple tools concurrently, suspends for seconds, minutes, or hours and resumes execution on this or a different process—despite process or network failures.

**Key Architecture Principles:**

- **Spatial Transparency**: One execution spans across multiple processes
- **Temporal Transparency**: One execution spans arbitrary time periods

## The Business Analyst

This example ships with a template for a Business Analyst for the [Chinook Music Store](https://www.sqlitetutorial.net/sqlite-sample-database/), demonstrating the pattern in action and is implemented as a terminal application, processing one request, but can also be hosted as a worker process, processing continuous requests 

---

## Crawl

Run the example in-memory without a Resonate Server

### 1. Prerequisits

To run this project you need an [OpenAI API Key](https://platform.openai.com) and export the key as an environment variable

```
export OPENAI_API_KEY="sk-..."
```

### 2. Clone the repository

```
git clone https://github.com/resonatehq-examples/templated-agent-ts
cd templated-agent-ts
```

### 3. Install dependencies

```
npm install
```

### 4. Run the agent

```
npm run dev <id> <prompt>
```

Example:

```
npm run dev "instance-1" "What are the best performing albums"
```

---

## Walk

Run with the Resonate Server for full durability. Install the [Resonate Server](https://github.com/resonatehq/resonate)

```
brew install resonatehq/tap/resonate
```

### 1. Prerequisits

To run this project you need an [OpenAI API Key](https://platform.openai.com) and export the key as an environment variable

```
export OPENAI_API_KEY="sk-..."
```

### 2. Clone the repository

```
git clone https://github.com/resonatehq-examples/templated-agent-ts
cd templated-agent-ts
```

### 3. Install dependencies

```
npm install
```

### 4. Run the agent

### 1. Start the Resonate Server

In Termainl #1, start the Resonate server in development mode listening on `http://localhost:8001`.

```bash
resonate dev
```

When you start the server in development mode, the server does not persist data on disk and lose its state when you stop the process

### 2. Start the Agent

In Termainl #2, start the Agent:

```
export RESONATE_URL=http://localhost:8001
npm run dev <id> <prompt>
```

Example:

```
export RESONATE_URL=http://localhost:8001
npm run dev "instance-1" "What are the best performing albums"
```
