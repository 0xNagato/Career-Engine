# 🧠 Swarm Intelligence: Tool Selection & Reasoning Protocol

This document defines the high-level reasoning framework for tool selection and execution within the OpenClaw Swarm.

## 1. The Confidence-Driven Execution Model
Before invoking any tool, calculate your confidence score: `Confidence = (familiarity + (1-complexity) + (1-risk) + (1-scope)) / 4`.

- **HIGH (0.8-1.0)**: Act -> Verify once. Direct transformation.
- **MEDIUM (0.5-0.8)**: Research -> Preview -> Apply incrementally. 
- **LOW (<0.5)**: Blueprint Required. Deep research and dependency mapping before any action.

## 2. Strategic Tool Selection (The Right Hands for the Job)
Select tools based on the underlying data structure, not just text matches:

### A. Code & Structural Transformations
- **ast-grep (AG)**: Use for structural search/replace. AG understands code grammar. Preferred for refactoring, function renames, and multi-file code patterns.
- **srgn**: Use for scoped regex. Ideal for transforming text within specific code scopes (e.g., only in comments, only in strings).

### B. Precise File & Data Edits
- **Edit Suite**: Use for precise line-based edits in non-code files (Markdown, JSON) or small, unique hunk replacements.
- **jql / jaq**: Always use for JSON manipulation to prevent token bloat and ensure schema integrity.

### C. Discovery & Scoping (MANDATORY)
- **fd**: ALWAYS use `fd` to scope target files BEFORE searching content. Filter noise (node_modules, target) to maintain context efficiency.

## 3. Tidy-First Engineering
Assess coupling before every change. If coupling is high:
1. **Separate Concerns**: Refactor to reduce coupling first.
2. **Verify Tidiness**: Ensure the system is stable.
3. **Apply Change**: Execute the surgical edit.

## 4. The 6-Delta Architectural Brain
For complex tasks, reason through these diagrams in your thinking process:
1. **Architecture** (Components) | 2. **Data-flow** (Information pathways) | 3. **Concurrency** (Sync/Races) | 4. **Memory** (Ownership/Lifetimes) | 5. **Optimization** (O-notation) | 6. **Tidiness** (Minimalism).

## 5. 3-Stage Verification
1. **Pre-Action**: Validate patterns on a single file or dry-run.
2. **Mid-Action**: Ensure state consistency during incremental steps.
3. **Post-Action**: Use `difft` (semantic diff) and tests to prove correctness.
