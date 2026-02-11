// Generated on 2026-02-11T11:17:44.510Z by mcporter@0.0.0
// Server: genkit
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO npx -y genkit-cli@^1.22.0 mcp -- --no-update-notification --non-interactive

import type { CallResult } from 'mcporter';

export interface GenkitTools {
  /**
   * Use this to look up documentation for the Genkit AI framework.
   *
   * @param language? which language these docs are for (default js).
   * @param files? Specific docs files to look up. If empty or not specified an index will be returned.
   *               Always lookup index first for exact file names.
   */
  lookup_genkit_docs(language?: "js" | "go" | "python", files?: string[]): Promise<CallResult>;

  /**
   * Use this tool to look up the Genkit usage guide before implementing any AI feature
   *
   * @param language? which language this usage guide is for
   */
  get_usage_guide(language?: "js" | "go"): Promise<CallResult>;

  /**
   * Use this to discover available Genkit flows or inspect the input schema of Genkit flows to know how
   * to successfully call them.
   */
  list_flows(): Promise<CallResult>;

  /**
   * Runs the flow with the provided input
   *
   * @param flowName name of the flow
   * @param input? Flow input as JSON object encoded as string (it will be passed through `JSON.parse`).
   *               Must conform to the schema.
   */
  run_flow(flowName: string, input?: string): Promise<CallResult>;

  /**
   * Returns the trace details
   *
   * @param traceId trace id (typically returned after running a flow or other actions)
   */
  get_trace(traceId: string): Promise<CallResult>;

  /**
   * Use this to start a Genkit runtime process (This is typically the entry point to the users app).
   * Once started, the runtime will be picked up by the `genkit start` command to power the Dev UI
   * features like model and flow playgrounds. The inputSchema for this tool matches the function
   * prototype for `NodeJS.child_process.spawn`.
   * Examples:
   * {command: "go", args: ["run", "main.go"]}
   * {command: "npm", args: ["run", "dev"]}
   * {command: "npm", args: ["run", "dev"], projectRoot: "path/to/project"}
   *
   * @param command The command to run
   * @param args The array of string args for the command to run. Eg: `["run", "dev"]`.
   */
  start_runtime(command: string, args: string[]): Promise<CallResult>;

  /**
   * Use this to kill an existing runtime that was started using the `start_runtime` tool
   */
  kill_runtime(): Promise<CallResult>;

  /**
   * Use this to restart an existing runtime that was started using the `start_runtime` tool
   */
  restart_runtime(): Promise<CallResult>;
}

