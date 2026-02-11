// Generated on 2026-02-11T11:17:46.471Z by mcporter@0.0.0
// Server: antigravity-browser
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO node ~/Desktop/game-compare/mcp-servers/antigravity-browser/server.js

import type { CallResult } from 'mcporter';

export interface AntigravityBrowserTools {
  /**
   * Launch a new browser instance
   *
   * @param url? Initial URL to navigate to
   */
  launch_browser(url?: string, headless?: boolean): Promise<CallResult>;

  /**
   * Take a screenshot of the current page
   *
   * @param name? Filename for the screenshot
   */
  take_screenshot(name?: string): Promise<CallResult>;

  /**
   * Click an element on the page
   *
   * @param selector CSS selector of the element
   */
  click_element(selector: string): Promise<CallResult>;

  /**
   * Get the text content of the current page
   */
  get_content(): Promise<CallResult>;
}

