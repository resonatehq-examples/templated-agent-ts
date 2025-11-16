import { Context } from "@resonatehq/sdk";
import Database from "better-sqlite3";

export async function sqlquery(
  ctx: Context,
  args: Record<string, any>,
): Promise<any> {
  const db = ctx.getDependency<Database.Database>("dbclient");
  if (!db) {
    throw new Error("Database client not found");
  }
  try {
    const stmt = db.prepare(args.query);
    const results = stmt.all();
    return { success: true, results, rowCount: results.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
