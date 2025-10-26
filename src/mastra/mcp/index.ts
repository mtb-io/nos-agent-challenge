import { MCPServer } from "@mastra/mcp"
import { weatherTool } from "../tools";
import { mercuryAgent } from "../agents";

export const server = new MCPServer({
  name: "My Custom Server",
  version: "1.0.0",
  tools: { weatherTool },
  agents: { mercuryAgent }, // this agent will become tool "ask_mercuryAgent"
  // workflows: {
  // dataProcessingWorkflow, // this workflow will become tool "run_dataProcessingWorkflow"
  // }
});
