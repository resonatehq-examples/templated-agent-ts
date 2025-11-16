import OpenAI from "openai";

/**
 * Agent configuration
 */
export interface AgentConfig {
  system: string;
  tools: Tool[];
  model: string;
  maxIterations: number;
}

/**
 * Message type matching OpenAI's chat completion format
 */
export type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;

/**
 * Tool type matching OpenAI's chat completion format
 */
export type Tool = OpenAI.Chat.Completions.ChatCompletionTool;
