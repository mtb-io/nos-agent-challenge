import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "@/mastra/tools";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
});

const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
})

export const mercuryAgent = new Agent({
  name: "Mercury CI Assistant",
  tools: { weatherTool },
  model: openai("gpt-4o"), // Using OpenAI for reliable performance
  // model: ollama(process.env.NOS_MODEL_NAME_AT_ENDPOINT || process.env.MODEL_NAME_AT_ENDPOINT || "qwen3:8b"), // Alternative: Use Ollama
  instructions: "You are Mercury CI, a Commercial Intelligence assistant. You help teams generate daily briefings, analyse CSV data, and create actionable business insights. You specialise in data analysis, market intelligence, and automated reporting.",
  description: "An AI agent that provides commercial intelligence through daily briefings, data analysis, and business insights.",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentState,
      },
    },
  }),
})
