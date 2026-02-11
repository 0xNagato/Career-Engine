// Generated on 2026-02-11T11:17:44.821Z by mcporter@0.0.0
// Server: advanced-reasoning
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO node ~/advanced-reasoning-mcp/build/index.js

import type { CallResult } from 'mcporter';

export interface AdvancedReasoningTools {
  /**
   * Advanced cognitive reasoning tool that builds on sequential thinking with meta-cognition, hypothesis
   * testing, and integrated memory.
   * Key Features:
   * - Meta-cognitive assessment and confidence tracking
   * - Hypothesis formulation and testing capabilities
   * - Integrated graph-based memory system
   * - Dynamic reasoning quality evaluation
   * - Session-based context management
   * - Evidence tracking and validation
   * Enhanced Parameters:
   * - thought: Your reasoning step (required)
   * - thoughtNumber/totalThoughts: Sequential tracking (required)
   * - nextThoughtNeeded: Continue flag (required)
   * - confidence: Self-assessment 0.0-1.0 (default: 0.5)
   * - reasoning_quality: 'low'|'medium'|'high' (default: 'medium')
   * - meta_thought: Reflection on your reasoning process
   * - hypothesis: Current working hypothesis
   * - test_plan: How to validate the hypothesis
   * - test_result: Outcome of testing
   * - evidence: Supporting/contradicting evidence
   * - session_id: Link to reasoning session
   * - goal: Overall objective
   * - progress: 0.0-1.0 completion estimate
   * Branching (inherited from sequential thinking):
   * - isRevision/revisesThought: Revise previous thoughts
   * - branchFromThought/branchId: Explore alternatives
   * Use this tool for complex reasoning that benefits from:
   * - Self-reflection and confidence tracking
   * - Systematic hypothesis development
   * - Memory of previous insights
   * - Quality assessment of reasoning
   *
   * @param thought Your current reasoning step
   * @param nextThoughtNeeded Whether another thought step is needed
   * @param thoughtNumber Current thought number
   * @param totalThoughts Estimated total thoughts needed
   * @param confidence? Confidence in this reasoning step (0.0-1.0)
   * @param reasoning_quality? Assessment of reasoning quality
   * @param meta_thought? Meta-cognitive reflection on your reasoning process
   * @param goal? Overall goal or objective
   * @param progress? Progress toward goal (0.0-1.0)
   * @param hypothesis? Current working hypothesis
   * @param test_plan? Plan for testing the hypothesis
   * @param test_result? Result of hypothesis testing
   * @param evidence? Evidence for/against hypothesis
   * @param session_id? Reasoning session identifier
   * @param builds_on? Previous thoughts this builds on
   * @param challenges? Ideas this challenges or contradicts
   * @param isRevision? Whether this revises previous thinking
   * @param revisesThought? Which thought is being reconsidered
   * @param branchFromThought? Branching point thought number
   * @param branchId? Branch identifier
   * @param needsMoreThoughts? If more thoughts are needed
   */
  advanced_reasoning(thought: string, nextThoughtNeeded: boolean, thoughtNumber: number, totalThoughts: number, confidence?: number): Promise<CallResult>;
  // optional (16): reasoning_quality, meta_thought, goal, progress, hypothesis, ...

  /**
   * Query the integrated memory system to find related insights, hypotheses, and evidence.
   * Useful for:
   * - Finding similar problems solved before
   * - Retrieving relevant hypotheses and evidence
   * - Understanding connections between ideas
   * - Building on previous reasoning sessions
   * Parameters:
   * - session_id: The reasoning session to query within (required)
   * - query: What to search for in memory (required)
   * Returns related memories with confidence scores and connection information.
   *
   * @param session_id Reasoning session identifier
   * @param query What to search for in memory
   */
  query_reasoning_memory(session_id: string, query: string): Promise<CallResult>;

  /**
   * Create a new named memory library for organized knowledge storage.
   * Enables you to create separate, named memory libraries for different projects, domains, or contexts.
   * Library names must contain only letters, numbers, underscores, and hyphens.
   * Parameters:
   * - library_name: Name for the new library (required)
   * Returns success status and message.
   *
   * @param library_name Name for the new memory library
   */
  create_memory_library(library_name: string): Promise<CallResult>;

  /**
   * List all available memory libraries with metadata.
   * Shows all existing memory libraries with information about:
   * - Library name
   * - Number of memory nodes
   * - Last modified date
   * Returns organized, searchable library information.
   */
  list_memory_libraries(): Promise<CallResult>;

  /**
   * Switch to a different memory library.
   * Allows you to switch between different memory libraries for different contexts or projects.
   * Current session state is saved before switching.
   * Parameters:
   * - library_name: Name of the library to switch to (required)
   * Returns success status and message.
   *
   * @param library_name Name of the library to switch to
   */
  switch_memory_library(library_name: string): Promise<CallResult>;

  /**
   * Get information about the currently active memory library.
   * Shows current library name, number of nodes, sessions, and other metadata.
   * Returns current library information.
   */
  get_current_library_info(): Promise<CallResult>;

  /**
   * Create a new system JSON file for storing coherent detailed searchable data or instructions and
   * workflows for any domain or action.
   * Parameters:
   * - name: Name for the system JSON file (required) - alphanumeric, underscore, hyphen only
   * - domain: Domain or category for the data (required)
   * - description: Description of what this system JSON contains (required)
   * - data: The structured data to store (required) - can be any JSON-serializable object
   * - tags: Optional array of tags for searchability
   * Returns success status and confirmation message.
   *
   * @param name Name for the system JSON file (alphanumeric, underscore, hyphen only)
   * @param domain Domain or category for the data
   * @param description Description of what this system JSON contains
   * @param data The structured data to store
   * @param tags? Optional array of tags for searchability
   */
  create_system_json(name: string, domain: string, description: string, data: unknown, tags?: string[]): Promise<CallResult>;

  /**
   * Retrieve a system JSON file by name.
   * Parameters:
   * - name: Name of the system JSON file to retrieve (required)
   * Returns the complete system JSON data including metadata and content.
   *
   * @param name Name of the system JSON file to retrieve
   */
  get_system_json(name: string): Promise<CallResult>;

  /**
   * Search through system JSON files by query.
   * Parameters:
   * - query: Search query to find matching system JSON files (required)
   * Returns matching files with relevance scores.
   *
   * @param query Search query to find matching system JSON files
   */
  search_system_json(query: string): Promise<CallResult>;

  /**
   * List all available system JSON files.
   * Returns list of all system JSON files with their names, domains, and descriptions.
   */
  list_system_json(): Promise<CallResult>;
}

