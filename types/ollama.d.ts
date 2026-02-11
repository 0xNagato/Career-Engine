// Generated on 2026-02-11T11:17:50.307Z by mcporter@0.0.0
// Server: ollama
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO npx -y ollama-mcp

import type { CallResult } from 'mcporter';

export interface OllamaTools {
  /**
   * Chat with a model using conversation messages. Supports system messages, multi-turn conversations,
   * tool calling, and generation options.
   *
   * @param model Name of the model to use
   * @param messages Array of chat messages
   * @param tools? Tools that the model can call (optional). Provide as JSON array of tool objects.
   * @param options? Generation options (optional). Provide as JSON object with settings like
   *                 temperature, top_p, etc.
   */
  ollama_chat(model: string, messages: string[], tools?: string, options?: string, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Copy a model. Creates a duplicate of an existing model with a new name.
   *
   * @param source Name of the source model
   * @param destination Name for the copied model
   */
  ollama_copy(source: string, destination: string, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Create a new model with structured parameters. Allows customization of model behavior, system
   * prompts, and templates.
   *
   * @param model Name for the new model
   * @param from Base model to derive from (e.g., llama2, llama3)
   * @param system? System prompt for the model
   * @param template? Prompt template to use
   * @param license? License for the model
   */
  ollama_create(model: string, from: string, system?: string, template?: string, license?: string): Promise<CallResult>;
  // optional (1): format

  /**
   * Delete a model from local storage. Removes the model and frees up disk space.
   *
   * @param model Name of the model to delete
   */
  ollama_delete(model: string, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Generate embeddings for text input. Returns numerical vector representations.
   *
   * @param model Name of the model to use
   * @param input Text input. For batch processing, provide a JSON-encoded array of strings, e.g.,
   *              ["text1", "text2"]
   */
  ollama_embed(model: string, input: string, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Generate completion from a prompt. Simpler than chat, useful for single-turn completions.
   *
   * @param model Name of the model to use
   * @param prompt The prompt to generate from
   * @param options? Generation options (optional). Provide as JSON object with settings like
   *                 temperature, top_p, etc.
   */
  ollama_generate(model: string, prompt: string, options?: string, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * List all available Ollama models installed locally. Returns model names, sizes, and modification
   * dates.
   *
   * @param format? Output format (default: json)
   */
  ollama_list(format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * List running models. Shows which models are currently loaded in memory.
   */
  ollama_ps(format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Pull a model from the Ollama registry. Downloads the model to make it available locally.
   *
   * @param model Name of the model to pull
   * @param insecure? Allow insecure connections
   */
  ollama_pull(model: string, insecure?: boolean, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Push a model to the Ollama registry. Uploads a local model to make it available remotely.
   *
   * @param model Name of the model to push
   * @param insecure? Allow insecure connections
   */
  ollama_push(model: string, insecure?: boolean, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Show detailed information about a specific model including modelfile, parameters, and architecture
   * details.
   *
   * @param model Name of the model to show
   * @param format? Output format (default: json)
   */
  ollama_show(model: string, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Fetch a web page by URL using Ollama's web fetch API. Returns the page title, content, and links.
   * Requires OLLAMA_API_KEY environment variable.
   *
   * @param url The URL to fetch
   */
  ollama_web_fetch(url: string, format?: "json" | "markdown"): Promise<CallResult>;

  /**
   * Perform a web search using Ollama's web search API. Augments models with latest information to
   * reduce hallucinations. Requires OLLAMA_API_KEY environment variable.
   *
   * @param query The search query string
   * @param max_results? Maximum number of results to return (1-10, default 5)
   */
  ollama_web_search(query: string, max_results?: number, format?: "json" | "markdown"): Promise<CallResult>;
}

