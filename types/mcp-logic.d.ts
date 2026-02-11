// Generated on 2026-02-11T11:17:45.868Z by mcporter@0.0.0
// Server: mcp-logic
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO uv --directory ~/mcp-logic run mcp_logic --prover-path ~/mcp-logic/ladr/bin

import type { CallResult } from 'mcporter';

export interface McpLogicTools {
  /**
   * Prove a logical statement using Prover9
   *
   * @param premises List of logical premises
   * @param conclusion Statement to prove
   */
  prove(premises: string[], conclusion: string): Promise<CallResult>;

  /**
   * Check if logical statements are well-formed with detailed syntax validation
   *
   * @param statements Logical statements to check
   */
  check-well-formed(statements: string[]): Promise<CallResult>;

  /**
   * Use Mace4 to find a finite model satisfying the given premises
   *
   * @param premises List of logical premises
   * @param domain_size? Optional: specific domain size to search (default: incrementally search 2-10)
   */
  find-model(premises: string[], domain_size?: number): Promise<CallResult>;

  /**
   * Use Mace4 to find a counterexample showing the conclusion doesn't follow from premises
   *
   * @param premises List of logical premises
   * @param conclusion Conclusion to disprove
   * @param domain_size? Optional: specific domain size to search
   */
  find-counterexample(premises: string[], conclusion: string, domain_size?: number): Promise<CallResult>;

  /**
   * Verify that a categorical diagram commutes by generating FOL premises and conclusion
   *
   * @param path_a List of morphism names in first path
   * @param path_b List of morphism names in second path
   * @param object_start Starting object
   * @param object_end Ending object
   * @param with_category_axioms? Include basic category theory axioms (default: true)
   */
  verify-commutativity(path_a: string[], path_b: string[], object_start: string, object_end: string, with_category_axioms?: boolean): Promise<CallResult>;

  /**
   * Get FOL axioms for category theory concepts (category, functor, natural transformation)
   *
   * @param concept Which concept's axioms to retrieve
   * @param functor_name? For functor axioms: name of the functor (default: F)
   */
  get-category-axioms(concept: "category" | "functor" | "natural-transformation" | "monoid" | "group", functor_name?: string): Promise<CallResult>;
}

