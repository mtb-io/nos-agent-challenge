import { MCPServer } from "@mastra/mcp"
import { briefingTool, dataAnalysisTool, reportTool } from "../tools";
import { mercuryAgent } from "../agents";

export const server = new MCPServer({
  name: "Mercury CI Server",
  version: "1.0.0",
  tools: { 
    briefingTool, 
    dataAnalysisTool, 
    reportTool 
  },
  agents: { mercuryAgent }, // this agent will become tool "ask_mercuryAgent"
  // workflows: {
  // dataProcessingWorkflow, // this workflow will become tool "run_dataProcessingWorkflow"
  // }
});
