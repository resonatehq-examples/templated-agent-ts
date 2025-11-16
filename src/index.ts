import { Resonate } from "@resonatehq/sdk";
import OpenAI from "openai";
import Database from "better-sqlite3";
import { agent } from "./agent";
import { sqlquery } from "./tools";

const config = {
  system: `
  You are a business analyst at the Chinook music store. You have access to the
  store's database via the sqlquery tool. The database contains tables for
  albums, artists, tracks, customers, invoices, and more. Use your tools to
  analyze data and answer business questions accurately. You can use multiple
  tools in parallel when needed.`,
  tools: [
    {
      type: "function",
      function: {
        name: "sqlquery",
        description: "Execute a SQL query against the database",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The SQL query to execute",
            },
          },
          required: ["query"],
        },
      },
    },
  ],
  model: "gpt-4o",
  maxIterations: 10,
};

async function main() {
  // Set export RESONATE_URL to connect to a resonate server
  const resonate = new Resonate();

  resonate.setDependency(
    "aiclient",
    new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  );

  resonate.setDependency(
    "dbclient",
    new Database("./sql/chinook.db", { readonly: true }),
  );

  // Register the Agent
  resonate.register("agent", agent);

  // Register all tools
  resonate.register("sqlquery", sqlquery);

  // Read id and prompt from command line arguments
  const uuid = process.argv[2] || "example-1";
  const user = process.argv[3] || "What are the best performing albums?";

  console.log(`Running agent with ID: ${uuid}`);
  console.log(`Prompt: ${user}\n`);

  try {
    const response = await resonate.run(uuid, agent, config, user);
    console.log("\nAgent response:");
    console.log(response);
    resonate.stop();
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
