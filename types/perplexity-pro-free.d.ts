// Generated on 2026-02-11T11:15:48.818Z by mcporter@0.0.0
// Server: perplexity-pro-free
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO uv --directory ~/perplexity-ai-PRO-FREE run mcp_server.py

import type { CallResult } from 'mcporter';

export interface PerplexityProFreeTools {
  /**
   * Search Perplexity AI using the Pro/Free library.
   * Args:
   * query: The search query.
   * mode: The mode to use ('auto', 'pro', 'reasoning', 'deep research').
   * model: Optional model for the mode (e.g., 'gpt-4o', 'claude 3.7 sonnet').
   */
  search_perplexity(query: string, mode?: string, model?: unknown): Promise<search_perplexityOutput>;

  /**
   * Create a new Perplexity account to renew Pro queries.
   * Args:
   * emailnator_cookies: Optional cookies for Emailnator if required.
   */
  create_perplexity_account(emailnator_cookies?: unknown): Promise<create_perplexity_accountOutput>;
}

