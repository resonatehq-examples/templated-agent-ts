import { Context } from "@resonatehq/sdk";
import OpenAI from "openai";
import { AgentConfig, Message } from "./types";

export async function complete(
  context: Context,
  messages: Message[],
  tools: any[],
  model: string,
): Promise<any> {
  const aiclient = context.getDependency<OpenAI>("aiclient");
  if (!aiclient) {
    throw new Error("OpenAI client not found");
  }
  const completion = await aiclient.chat.completions.create({
    model,
    messages,
    tools,
    tool_choice: tools.length > 0 ? "auto" : "none",
  });
  return completion.choices[0]?.message;
}

/**
 * Durable, Templateable Agent
 */
export function* agent(
  context: Context,
  config: AgentConfig,
  prompt: string,
): Generator<any, string, any> {
  const messages: Message[] = [
    { role: "system", content: config.system },
    { role: "user", content: prompt },
  ];

  let iteration = 0;

  while (iteration++ < config.maxIterations) {
    const response: OpenAI.Chat.Completions.ChatCompletionMessage =
      yield* context.run(complete, messages, config.tools, config.model);

    messages.push(response as Message);

    if (response.tool_calls) {
      const toolHandles = [];
      for (const toolCall of response.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);
        const handle = yield* context.beginRun(toolName, toolArgs);
        toolHandles.push({
          tool_call_id: toolCall.id,
          name: toolName,
          handle: handle,
        });
      }
      for (const toolHandle of toolHandles) {
        const result = yield* toolHandle.handle;
        messages.push({
          role: "tool",
          tool_call_id: toolHandle.tool_call_id,
          content: JSON.stringify(result),
        });
      }
    } else {
      return (
        (typeof response.content === "string" ? response.content : "") || ""
      );
    }
  }
  return "";
}
