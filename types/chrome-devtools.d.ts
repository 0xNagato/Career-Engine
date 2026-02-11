// Generated on 2026-02-11T11:12:38.089Z by mcporter@0.0.0
// Server: chrome-devtools
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO npx -y chrome-devtools-mcp@latest

import type { CallResult } from 'mcporter';

export interface ChromeDevtoolsTools {
  /**
   * Clicks on the provided element
   *
   * @param uid The uid of an element on the page from the page content snapshot
   * @param dblClick? Set to true for double clicks. Default is false.
   * @param includeSnapshot? Whether to include a snapshot in the response. Default is false.
   */
  click(uid: string, dblClick?: boolean, includeSnapshot?: boolean): Promise<CallResult>;

  /**
   * Closes the page by its index. The last open page cannot be closed.
   *
   * @param pageId The ID of the page to close. Call list_pages to list pages.
   */
  close_page(pageId: number): Promise<CallResult>;

  /**
   * Drag an element onto another element
   *
   * @param from_uid The uid of the element to drag
   * @param to_uid The uid of the element to drop into
   * @param includeSnapshot? Whether to include a snapshot in the response. Default is false.
   */
  drag(from_uid: string, to_uid: string, includeSnapshot?: boolean): Promise<CallResult>;

  /**
   * Emulates various features on the selected page.
   *
   * @param networkConditions? Throttle network. Set to "No emulation" to disable. If omitted, conditions
   *                           remain unchanged.
   * @param cpuThrottlingRate? Represents the CPU slowdown factor. Set the rate to 1 to disable
   *                           throttling. If omitted, throttling remains unchanged.
   * @param geolocation? Geolocation to emulate. Set to null to clear the geolocation override.
   * @param userAgent? User agent to emulate. Set to null to clear the user agent override.
   * @param colorScheme? Emulate the dark or the light mode. Set to "auto" to reset to the default.
   * @param viewport? Viewport to emulate. Set to null to reset to the default viewport.
   */
  emulate(networkConditions?: "No emulation" | "Offline" | "Slow 3G" | "Fast 3G" | "Slow 4G" | "Fast 4G", cpuThrottlingRate?: number, geolocation?: unknown, userAgent?: string, colorScheme?: "dark" | "light" | "auto"): Promise<CallResult>;
  // optional (1): viewport

  /**
   * Evaluate a JavaScript function inside the currently selected page. Returns the response as JSON,
   * so returned values have to be JSON-serializable.
   *
   * @param function A JavaScript function declaration to be executed by the tool in the currently
   *                 selected page.
   *                 Example without arguments: `() => {
   *                 return document.title
   *                 }` or `async () => {
   *                 return await fetch("example.com")
   *                 }`.
   *                 Example with arguments: `(el) => {
   *                 return el.innerText;
   *                 }`
   * @param args? An optional list of arguments to pass to the function.
   */
  evaluate_script(function: string, args?: string[]): Promise<CallResult>;

  /**
   * Type text into a input, text area or select an option from a <select> element.
   *
   * @param uid The uid of an element on the page from the page content snapshot
   * @param value The value to fill in
   * @param includeSnapshot? Whether to include a snapshot in the response. Default is false.
   */
  fill(uid: string, value: string, includeSnapshot?: boolean): Promise<CallResult>;

  /**
   * Fill out multiple form elements at once
   *
   * @param elements Elements from snapshot to fill out.
   * @param includeSnapshot? Whether to include a snapshot in the response. Default is false.
   */
  fill_form(elements: string[], includeSnapshot?: boolean): Promise<CallResult>;

  /**
   * Gets a console message by its ID. You can get all messages by calling list_console_messages.
   *
   * @param msgid The msgid of a console message on the page from the listed console messages
   */
  get_console_message(msgid: number): Promise<CallResult>;

  /**
   * Gets a network request by an optional reqid, if omitted returns the currently selected request in
   * the DevTools Network panel.
   *
   * @param reqid? The reqid of the network request. If omitted returns the currently selected request in
   *               the DevTools Network panel.
   * @param requestFilePath? The absolute or relative path to save the request body to. If omitted, the
   *                         body is returned inline.
   * @param responseFilePath? The absolute or relative path to save the response body to. If omitted, the
   *                          body is returned inline.
   */
  get_network_request(reqid?: number, requestFilePath?: string, responseFilePath?: string): Promise<CallResult>;

  /**
   * If a browser dialog was opened, use this command to handle it
   *
   * @param action Whether to dismiss or accept the dialog
   * @param promptText? Optional prompt text to enter into the dialog.
   */
  handle_dialog(action: "accept" | "dismiss", promptText?: string): Promise<CallResult>;

  /**
   * Hover over the provided element
   *
   * @param uid The uid of an element on the page from the page content snapshot
   * @param includeSnapshot? Whether to include a snapshot in the response. Default is false.
   */
  hover(uid: string, includeSnapshot?: boolean): Promise<CallResult>;

  /**
   * List all console messages for the currently selected page since the last navigation.
   *
   * @param pageSize? Maximum number of messages to return. When omitted, returns all requests.
   * @param pageIdx? Page number to return (0-based). When omitted, returns the first page.
   * @param types? Filter messages to only return messages of the specified resource types. When omitted
   *               or empty, returns all messages.
   * @param includePreservedMessages? Set to true to return the preserved messages over the last 3
   *                                  navigations.
   */
  list_console_messages(pageSize?: number, pageIdx?: number, types?: "log" | "debug" | "info" | "error" | "warn" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd" | "verbose" | "issue", includePreservedMessages?: boolean): Promise<CallResult>;

  /**
   * List all requests for the currently selected page since the last navigation.
   *
   * @param pageSize? Maximum number of requests to return. When omitted, returns all requests.
   * @param pageIdx? Page number to return (0-based). When omitted, returns the first page.
   * @param resourceTypes? Filter requests to only return requests of the specified resource types. When
   *                       omitted or empty, returns all requests.
   * @param includePreservedRequests? Set to true to return the preserved requests over the last 3
   *                                  navigations.
   */
  list_network_requests(pageSize?: number, pageIdx?: number, resourceTypes?: "document" | "stylesheet" | "image" | "media" | "font" | "script" | "texttrack" | "xhr" | "fetch" | "prefetch" | "eventsource" | "websocket" | "manifest" | "signedexchange" | "ping" | "cspviolationreport" | "preflight" | "fedcm" | "other", includePreservedRequests?: boolean): Promise<CallResult>;

  /**
   * Get a list of pages open in the browser.
   */
  list_pages(): Promise<CallResult>;

  /**
   * Navigates the currently selected page to a URL.
   *
   * @param type? Navigate the page by URL, back or forward in history, or reload.
   * @param url? Target URL (only type=url)
   * @param ignoreCache? Whether to ignore cache on reload.
   * @param handleBeforeUnload? Whether to auto accept or beforeunload dialogs triggered by this
   *                            navigation. Default is accept.
   * @param initScript? A JavaScript script to be executed on each new document before any other scripts
   *                    for the next navigation.
   * @param timeout? Maximum wait time in milliseconds. If set to 0, the default timeout will be used.
   */
  navigate_page(type?: "url" | "back" | "forward" | "reload", url?: string, ignoreCache?: boolean, handleBeforeUnload?: "accept" | "decline", initScript?: string): Promise<CallResult>;
  // optional (1): timeout

  /**
   * Creates a new page
   *
   * @param url URL to load in a new page.
   * @param background? Whether to open the page in the background without bringing it to the front.
   *                    Default is false (foreground).
   * @param timeout? Maximum wait time in milliseconds. If set to 0, the default timeout will be used.
   */
  new_page(url: string, background?: boolean, timeout?: number): Promise<CallResult>;

  /**
   * Provides more detailed information on a specific Performance Insight of an insight set that was
   * highlighted in the results of a trace recording.
   *
   * @param insightSetId The id for the specific insight set. Only use the ids given in the "Available
   *                     insight sets" list.
   * @param insightName The name of the Insight you want more information on. For example:
   *                    "DocumentLatency" or "LCPBreakdown"
   */
  performance_analyze_insight(insightSetId: string, insightName: string): Promise<CallResult>;

  /**
   * Starts a performance trace recording on the selected page. This can be used to look for performance
   * problems and insights to improve the performance of the page. It will also report Core Web Vital
   * (CWV) scores for the page.
   *
   * @param reload Determines if, once tracing has started, the current selected page should be
   *               automatically reloaded. Navigate the page to the right URL using the navigate_page
   *               tool BEFORE starting the trace if reload or autoStop is set to true.
   * @param autoStop Determines if the trace recording should be automatically stopped.
   * @param filePath? The absolute file path, or a file path relative to the current working directory,
   *                  to save the raw trace data. For example, trace.json.gz (compressed) or trace.json
   *                  (uncompressed).
   */
  performance_start_trace(reload: boolean, autoStop: boolean, filePath?: string): Promise<CallResult>;

  /**
   * Stops the active performance trace recording on the selected page.
   *
   * @param filePath? The absolute file path, or a file path relative to the current working directory,
   *                  to save the raw trace data. For example, trace.json.gz (compressed) or trace.json
   *                  (uncompressed).
   */
  performance_stop_trace(filePath?: string): Promise<CallResult>;

  /**
   * Press a key or key combination. Use this when other input methods like fill() cannot be used (e.g.,
   * keyboard shortcuts, navigation keys, or special key combinations).
   *
   * @param key A key or a combination (e.g., "Enter", "Control+A", "Control++", "Control+Shift+R").
   *            Modifiers: Control, Shift, Alt, Meta
   * @param includeSnapshot? Whether to include a snapshot in the response. Default is false.
   */
  press_key(key: string, includeSnapshot?: boolean): Promise<CallResult>;

  /**
   * Resizes the selected page's window so that the page has specified dimension
   *
   * @param width Page width
   * @param height Page height
   */
  resize_page(width: number, height: number): Promise<CallResult>;

  /**
   * Select a page as a context for future tool calls.
   *
   * @param pageId The ID of the page to select. Call list_pages to get available pages.
   * @param bringToFront? Whether to focus the page and bring it to the top.
   */
  select_page(pageId: number, bringToFront?: boolean): Promise<CallResult>;

  /**
   * Take a screenshot of the page or element.
   *
   * @param format? Type of format to save the screenshot as. Default is "png"
   * @param quality? Compression quality for JPEG and WebP formats (0-100). Higher values mean better
   *                 quality but larger file sizes. Ignored for PNG format.
   * @param uid? The uid of an element on the page from the page content snapshot. If omitted takes a
   *             pages screenshot.
   * @param fullPage? If set to true takes a screenshot of the full page instead of the currently visible
   *                  viewport. Incompatible with uid.
   * @param filePath? The absolute path, or a path relative to the current working directory, to save the
   *                  screenshot to instead of attaching it to the response.
   */
  take_screenshot(format?: "png" | "jpeg" | "webp", quality?: number, uid?: string, fullPage?: boolean, filePath?: string): Promise<CallResult>;

  /**
   * Take a text snapshot of the currently selected page based on the a11y tree. The snapshot lists page
   * elements along with a unique
   * identifier (uid). Always use the latest snapshot. Prefer taking a snapshot over taking a screenshot.
   * The snapshot indicates the element selected
   * in the DevTools Elements panel (if any).
   *
   * @param verbose? Whether to include all possible information available in the full a11y tree. Default
   *                 is false.
   * @param filePath? The absolute path, or a path relative to the current working directory, to save the
   *                  snapshot to instead of attaching it to the response.
   */
  take_snapshot(verbose?: boolean, filePath?: string): Promise<CallResult>;

  /**
   * Upload a file through a provided element.
   *
   * @param uid The uid of the file input element or an element that will open file chooser on the page
   *            from the page content snapshot
   * @param filePath The local path of the file to upload
   * @param includeSnapshot? Whether to include a snapshot in the response. Default is false.
   */
  upload_file(uid: string, filePath: string, includeSnapshot?: boolean): Promise<CallResult>;

  /**
   * Wait for the specified text to appear on the selected page.
   *
   * @param text Text to appear on the page
   * @param timeout? Maximum wait time in milliseconds. If set to 0, the default timeout will be used.
   */
  wait_for(text: string, timeout?: number): Promise<CallResult>;
}

