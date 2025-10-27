import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import { briefingTool, dataAnalysisTool, reportTool } from "@/mastra/tools";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

export const AgentState = z.object({
  recentBriefings: z.array(z.string()).default([]),
  analysisHistory: z.array(z.string()).default([]),
  reportHistory: z.array(z.string()).default([]),
});

const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
})

export const mercuryAgent = new Agent({
  name: "Mercury CI Assistant",
  tools: { 
    briefingTool, 
    dataAnalysisTool, 
    reportTool 
  },
  model: openai("gpt-3.5-turbo"), // Using OpenAI for reliable performance
  // model: ollama(process.env.NOS_MODEL_NAME_AT_ENDPOINT || process.env.MODEL_NAME_AT_ENDPOINT || "qwen3:8b"), // Alternative: Use Ollama
  instructions: `You are Mercury CI, a Commercial Intelligence assistant specialising in business intelligence and data analysis. Your core capabilities include:

**Daily Briefings**: Generate comprehensive intelligence briefings with market insights, KPIs, and strategic recommendations. Use the briefingTool to create personalised briefings based on date, company, and data sources.

**Data Analysis**: Analyse CSV data to identify trends, correlations, and insights. Use the dataAnalysisTool to provide detailed analysis with key findings, recommendations, and suggested visualisations.

**Report Generation**: Create comprehensive business intelligence reports. Use the reportTool to generate executive summaries, market analysis, and strategic recommendations.

**Key Guidelines**:
- Always provide actionable insights and clear recommendations
- Use British English spelling (analyse, optimise, etc.)
- Focus on commercial intelligence and business value
- Be specific about data sources and confidence levels
- Provide context for all recommendations
- Remember user preferences and previous interactions

When users ask for briefings, data analysis, or reports, use the appropriate tools to provide comprehensive, professional intelligence that drives business decisions.`,
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
