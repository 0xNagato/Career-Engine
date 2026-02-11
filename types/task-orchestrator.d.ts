// Generated on 2026-02-11T11:13:46.965Z by mcporter@0.0.0
// Server: task-orchestrator
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO docker run --rm -i --volume ~/Desktop/game-compare/storage/task-orchestrator:/app/data --env MCP_DEBUG=true --env DATABASE_PATH=/app/data/my-tasks.db --env LOG_LEVEL=DEBUG ghcr.io/jpicklyk/task-orchestrator:latest

import type { CallResult } from 'mcporter';

export interface TaskOrchestratorTools {
  /**
   * Creates a new task with the specified properties.
   * ## Purpose
   * Tasks are the primary work items in the system and can be organized into Features.
   * Each task has basic metadata (title, status, etc.) and can have Sections for detailed content.
   * ## Template Integration
   * RECOMMENDED: Apply templates at creation time using templateIds parameter for consistent
   * documentation structure. Use `list_templates` first to find appropriate templates.
   * Template application creates standardized sections automatically:
   * - Use single-item array for one template: ["template-uuid"]
   * - Use multiple templates for comprehensive coverage: ["uuid1", "uuid2"]
   * - Templates are applied in order, with later templates' sections appearing after earlier ones
   * ## Best Practices
   * - Use descriptive titles that clearly indicate the work to be done
   * - Write comprehensive summaries with acceptance criteria when helpful
   * - Set appropriate complexity ratings (1=trivial, 10=highly complex)
   * - Use consistent tagging conventions (e.g., "task-type-feature", "task-type-bug")
   * - Associate with features when the task is part of larger functionality
   * - Apply templates that match the work type (implementation, testing, documentation)
   * ## Entity Relationships
   * - Tasks can belong to Features (use featureId to establish relationship)
   * - Tasks can belong to Projects (use projectId for top-level organization)
   * - Use dependencies to link related tasks (see create_dependency tool)
   * ## Workflow Integration
   * Tasks integrate with the complete project management workflow:
   * 1. Start with get_overview to understand current work
   * 2. Create task with appropriate templates and metadata
   * 3. Use add_section or bulk_create_sections for additional content
   * 4. Update status as work progresses (pending → in_progress → completed)
   * 5. Create dependencies between related tasks
   * Example successful response:
   * {
   * "success": true,
   * "message": "Task created successfully with 2 template(s) applied, creating 6 section(s)",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Implement OAuth Authentication API",
   * "summary": "Create secure API endpoints for OAuth 2.0 authentication with JWT tokens",
   * "status": "pending",
   * "priority": "high",
   * "complexity": 8,
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T14:30:00Z",
   * "featureId": "661e8511-f30c-41d4-a716-557788990000",
   * "tags": ["task-type-feature", "oauth", "authentication", "api", "security"],
   * "appliedTemplates": [
   * {
   * "templateId": "technical-approach-uuid",
   * "sectionsCreated": 3
   * },
   * {
   * "templateId": "implementation-workflow-uuid",
   * "sectionsCreated": 3
   * }
   * ]
   * }
   * }
   * For task creation patterns and best practices, see: task-orchestrator://guidelines/task-management
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation (empty title/summary, invalid UUIDs)
   * - RESOURCE_NOT_FOUND: When specified featureId, projectId, or templateIds don't exist
   * - DATABASE_ERROR: When there's an issue storing the task or applying templates
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param title The title of the task (required)
   * @param summary Brief summary of the task content (required for task creation)
   * @param status? Task status. Valid values: 'pending', 'in-progress', 'completed', 'cancelled',
   *                'deferred'
   * @param priority? Task priority. Valid values: 'high', 'medium', 'low'
   * @param complexity? Task complexity on a scale from 1-10 (1=simplest, 10=most complex)
   * @param projectId? Optional UUID of the project this task belongs to (e.g.,
   *                   '550e8400-e29b-41d4-a716-446655440000')
   * @param featureId? Optional UUID of the feature this task belongs to (e.g.,
   *                   '550e8400-e29b-41d4-a716-446655440000')
   * @param tags? Comma-separated list of tags for categorization (e.g., 'api,backend,urgent')
   * @param templateIds? List of template IDs to apply. Use a single-item array for applying just one
   *                     template.
   */
  create_task(title: string, summary: string, status?: "pending" | "in_progress" | "completed" | "cancelled" | "deferred", priority?: "high" | "medium" | "low", complexity?: number): Promise<CallResult>;
  // optional (4): projectId, featureId, tags, templateIds

  /**
   * Updates an existing task with the specified properties.
   * ⚡ **EFFICIENCY TIP**: Only send fields you want to change! All fields except 'id' are optional.
   * Sending unchanged fields wastes 90%+ tokens. Example: To update status, send only {"id": "uuid",
   * "status": "completed"}
   * ## Purpose
   * Modifies specific fields of an existing task without affecting other properties.
   * Critical for task lifecycle management and maintaining accurate project state.
   * ## Common Update Patterns
   * **Status Progression** (typical workflow):
   * 1. `pending` → `in_progress` (when starting work)
   * 2. `in_progress` → `completed` (when finished)
   * 3. `pending` → `deferred` (when postponing)
   * 4. Any status → `cancelled` (when no longer needed)
   * **Priority Adjustments**:
   * - Increase to `high` when blockers are resolved or deadlines approach
   * - Decrease to `low` when other priorities take precedence
   * - Use `medium` as default for most standard work
   * **Complexity Refinement**:
   * - Increase complexity (1-10) as unknowns are discovered during implementation
   * - Decrease complexity when simpler solutions are found
   * - Update complexity to inform future estimation accuracy
   * ## Workflow Integration Best Practices
   * **Before Starting Work**:
   * ```json
   * {
   * "id": "task-uuid",
   * "status": "in_progress"
   * }
   * ```
   * **When Completing Work**:
   * ```json
   * {
   * "id": "task-uuid",
   * "status": "completed"
   * }
   * ```
   * **When Reassigning to Feature**:
   * ```json
   * {
   * "id": "orphaned-task-uuid",
   * "featureId": "feature-uuid"
   * }
   * ```
   * **When Requirements Change**:
   * ```json
   * {
   * "id": "task-uuid",
   * "title": "Updated Task Title",
   * "summary": "Updated comprehensive summary with new requirements",
   * "complexity": 8
   * }
   * ```
   * ## Efficient vs Inefficient Updates
   * ❌ **INEFFICIENT** (wastes ~500+ characters):
   * ```json
   * {
   * "id": "task-uuid",
   * "title": "Existing Title", // Unchanged - unnecessary
   * "summary": "Long existing summary...", // Unchanged - 500+ chars wasted
   * "status": "completed", // ✓ Only this changed
   * "priority": "medium", // Unchanged - unnecessary
   * "complexity": 5, // Unchanged - unnecessary
   * "tags": "tag1,tag2,tag3" // Unchanged - unnecessary
   * }
   * ```
   * ✅ **EFFICIENT** (uses ~30 characters):
   * ```json
   * {
   * "id": "task-uuid",
   * "status": "completed" // Only send what changed!
   * }
   * ```
   * **Token Savings**: 94% reduction by only sending changed fields!
   * ## Field Update Guidelines
   * **Partial Updates**: Only specify fields you want to change. Unspecified fields remain unchanged.
   * **Title Updates**: Keep titles concise but descriptive. Update when scope or focus changes.
   * **Summary Updates**: Update summaries when requirements change or acceptance criteria evolve.
   * **Tag Management**: Replace the entire tag set. To add a tag, include all existing tags plus the new
   * one.
   * **Feature Association**: Set featureId to associate task with a feature, or null to make orphaned.
   * ## Locking System Integration
   * This tool respects the locking system to prevent concurrent modifications.
   * Updates may be queued if the task is currently locked by another operation.
   * ## Error Handling
   * - RESOURCE_NOT_FOUND: Task with specified ID doesn't exist
   * - VALIDATION_ERROR: Invalid status, priority, complexity, or UUID format
   * - LOCK_ERROR: Task is currently locked by another operation
   * - DATABASE_ERROR: Issue persisting the update
   *
   * @param id The unique ID of the task to update
   * @param title? (optional) New title for the task
   * @param description? (optional) New detailed description of the task
   * @param status? (optional) New task status (pending, in-progress, completed, cancelled, deferred)
   * @param priority? (optional) New task priority (high, medium, low)
   * @param complexity? (optional) New task complexity on a scale from 1-10
   * @param featureId? (optional) New feature ID to associate this task with
   * @param tags? (optional) New comma-separated list of tags
   */
  update_task(id: string /* UUID */, title?: string, description?: string, status?: "pending" | "in_progress" | "completed" | "cancelled" | "deferred", priority?: "high" | "medium" | "low"): Promise<CallResult>;
  // optional (3): complexity, featureId, tags

  /**
   * Updates multiple tasks in a single operation.
   * ⚡ **EFFICIENCY**: This tool reduces token usage by 70-90% compared to individual updates!
   * ## Purpose
   * Efficiently update multiple tasks in a single API call with atomic transaction guarantees.
   * This tool is **CRITICAL for token optimization** when working with multiple tasks.
   * ## When to Use bulk_update_tasks
   * **ALWAYS PREFER** for multi-task operations:
   * - Sprint completion: Mark 10+ tasks as completed (86% token savings)
   * - Feature migration: Move tasks between features (78-91% savings)
   * - Priority adjustments: Bulk reprioritization (80-92% savings)
   * - Status updates: Bulk workflow transitions (70-90% savings)
   * **Performance Benefits**:
   * - Single network round-trip instead of N calls
   * - Atomic database transaction (all succeed or detailed failures)
   * - 70-90% token reduction for typical scenarios
   * - Consistent state across all task updates
   * ## Token Savings Examples
   * **Sprint Completion (10 tasks)**:
   * - Individual updates: ~2,500 tokens
   * - Bulk update: ~350 tokens
   * - **Savings: 86%** (2,150 tokens)
   * **Feature Reassignment (25 tasks)**:
   * - Individual updates: ~7,000 tokens
   * - Bulk update: ~650 tokens
   * - **Savings: 91%** (6,350 tokens)
   * **Priority Adjustment (50 tasks)**:
   * - Individual updates: ~12,500 tokens
   * - Bulk update: ~1,000 tokens
   * - **Savings: 92%** (11,500 tokens)
   * ## Partial Updates
   * ⚡ **CRITICAL**: Only send fields you're changing! Each task only needs `id` + changed fields.
   * ❌ **INEFFICIENT** (sends unchanged data):
   * ```json
   * {
   * "tasks": [
   * {
   * "id": "task-uuid",
   * "title": "Long unchanged title...",
   * "summary": "Long unchanged summary...",
   * "status": "completed",
   * "priority": "medium",
   * "complexity": 5,
   * "tags": "unchanged,tags"
   * }
   * ]
   * }
   * ```
   * ✅ **EFFICIENT** (only changed field):
   * ```json
   * {
   * "tasks": [
   * {"id": "task-uuid", "status": "completed"}
   * ]
   * }
   * ```
   * ## Common Use Cases
   * **1. Sprint Completion**:
   * ```json
   * {
   * "tasks": [
   * {"id": "task-1-uuid", "status": "completed"},
   * {"id": "task-2-uuid", "status": "completed"},
   * {"id": "task-3-uuid", "status": "completed"}
   * ]
   * }
   * ```
   * **2. Emergency Reprioritization**:
   * ```json
   * {
   * "tasks": [
   * {"id": "critical-1", "priority": "high", "status": "in_progress"},
   * {"id": "critical-2", "priority": "high"},
   * {"id": "normal-1", "priority": "low", "status": "deferred"}
   * ]
   * }
   * ```
   * **3. Feature Migration**:
   * ```json
   * {
   * "tasks": [
   * {"id": "task-a", "featureId": "new-feature-uuid"},
   * {"id": "task-b", "featureId": "new-feature-uuid"},
   * {"id": "task-c", "featureId": "new-feature-uuid"}
   * ]
   * }
   * ```
   * **4. Mixed Updates**:
   * ```json
   * {
   * "tasks": [
   * {"id": "task-1", "status": "in_progress", "priority": "high"},
   * {"id": "task-2", "complexity": 8},
   * {"id": "task-3", "tags": "urgent,backend"}
   * ]
   * }
   * ```
   * ## Parameters
   * | Parameter | Type | Required | Description |
   * |-----------|------|----------|-------------|
   * | tasks | array | Yes | Array of task update objects |
   * Each task object:
   * | Field | Type | Required | Description |
   * |-------|------|----------|-------------|
   * | id | UUID | Yes | Task identifier |
   * | title | string | No | New title |
   * | description | string | No | New summary/description |
   * | status | enum | No | New status (pending, in_progress, completed, cancelled, deferred) |
   * | priority | enum | No | New priority (high, medium, low) |
   * | complexity | integer | No | New complexity (1-10) |
   * | featureId | UUID | No | New feature association |
   * | tags | string | No | New comma-separated tags |
   * ## Response Format
   * ### Success Response
   * ```json
   * {
   * "success": true,
   * "message": "5 tasks updated successfully",
   * "data": {
   * "updated": 5,
   * "failed": 0,
   * "items": [
   * {
   * "id": "task-uuid",
   * "status": "completed",
   * "modifiedAt": "2025-10-12T18:45:00Z"
   * }
   * ]
   * }
   * }
   * ```
   * ### Partial Failure Response
   * ```json
   * {
   * "success": true,
   * "message": "3 tasks updated successfully, 1 failed",
   * "data": {
   * "updated": 3,
   * "failed": 1,
   * "items": [
   * {"id": "task-1", "status": "completed", "modifiedAt": "2025-10-12T18:45:00Z"}
   * ],
   * "failures": [
   * {
   * "index": 3,
   * "id": "bad-uuid",
   * "error": {
   * "code": "RESOURCE_NOT_FOUND",
   * "details": "Task not found: bad-uuid"
   * }
   * }
   * ]
   * }
   * }
   * ```
   * ## Validation Rules
   * 1. **Array**: At least one task required, maximum 100 tasks
   * 2. **Per Task**: `id` required, at least one update field
   * 3. **UUIDs**: Valid format for `id` and `featureId`
   * 4. **Enums**: Valid values for `status` and `priority`
   * 5. **Range**: `complexity` must be 1-10
   * ## Error Responses
   * - VALIDATION_ERROR (400): Invalid input format or values
   * - RESOURCE_NOT_FOUND (404): One or more tasks don't exist
   * - OPERATION_FAILED (500): All tasks failed to update
   * - INTERNAL_ERROR (500): Unexpected system error
   * ## Performance Notes
   * - **Network**: 1 round-trip vs N round-trips (80-99% reduction)
   * - **Database**: Single atomic transaction
   * - **Tokens**: 70-92% reduction vs individual updates
   * - **Response**: Minimal format (id, status, modifiedAt only)
   * ## Comparison with Individual Updates
   * | Scenario | Tasks | Individual | Bulk | Savings |
   * |----------|-------|------------|------|---------|
   * | Sprint completion | 10 | 2,500 tokens | 350 tokens | 86% |
   * | Feature migration | 25 | 7,000 tokens | 650 tokens | 91% |
   * | Priority adjustment | 50 | 12,500 tokens | 1,000 tokens | 92% |
   * ## Best Practices
   * 1. **Use for 2+ tasks**: Single task? Use `update_task` instead
   * 2. **Partial updates only**: Only send fields that changed
   * 3. **Batch related changes**: Group related updates (same status, same feature)
   * 4. **Check failures**: Review `failures` array for partial success
   * 5. **Limit batch size**: Keep under 100 tasks per request
   * ## Related Tools
   * - `update_task`: Update single task (use for 1 task)
   * - `bulk_create_sections`: Efficient section creation
   * - `bulk_update_sections`: Efficient section updates
   * - `get_overview`: Check current state before bulk updates
   *
   * @param tasks Array of tasks to update
   */
  bulk_update_tasks(tasks: string[]): Promise<CallResult>;

  /**
   * Retrieves a task by its ID with options for including relationships.
   * ## Purpose
   * Fetches a complete task by its UUID with options to include related entities like
   * sections, subtasks, dependencies, and feature information for context. This tool allows
   * getting detailed information about a specific task when its ID is known.
   * Note: Tasks store their detailed content in separate Section entities for efficiency.
   * To retrieve the complete task with all content blocks, make sure to set includeSections=true.
   * Otherwise, you'll only receive the basic task metadata and summary.
   * ## Parameters
   * | Parameter | Type | Required | Default | Description |
   * |-----------|------|----------|---------|-------------|
   * | id | UUID string | Yes | - | The unique ID of the task to retrieve (e.g.,
   * '550e8400-e29b-41d4-a716-446655440000') |
   * | includeSubtasks | boolean | No | false | Whether to include subtasks in the response (experimental
   * feature) |
   * | includeDependencies | boolean | No | false | Whether to include dependency information (incoming
   * and outgoing dependencies with counts) |
   * | includeFeature | boolean | No | false | Whether to include feature information if the task belongs
   * to a feature |
   * | includeSections | boolean | No | false | Whether to include sections (detailed content blocks)
   * that contain the full content of the task. Set to true when you need the complete task context
   * beyond the basic summary. |
   * | summaryView | boolean | No | false | Whether to return a summarized view for context efficiency
   * (truncates text fields) |
   * ## Response Format
   * ### Success Response
   * ```json
   * {
   * "success": true,
   * "message": "Task retrieved successfully",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Implement API",
   * "summary": "Create REST API endpoints for data access",
   * "status": "in-progress",
   * "priority": "high",
   * "complexity": 7,
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T15:45:00Z",
   * "featureId": "661e8511-f30c-41d4-a716-557788990000",
   * "tags": ["api", "backend"],
   * "feature": {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "name": "REST API Implementation",
   * "status": "in-development"
   * },
   * "sections": [
   * {
   * "id": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Requirements",
   * "content": "The API should support CRUD operations...",
   * "contentFormat": "markdown",
   * "ordinal": 0
   * }
   * ]
   * }
   * }
   * ```
   * ## Error Responses
   * - RESOURCE_NOT_FOUND (404): When no task exists with the specified ID
   * ```json
   * {
   * "success": false,
   * "message": "Task not found",
   * "error": {
   * "code": "RESOURCE_NOT_FOUND",
   * "details": "No task exists with ID 550e8400-e29b-41d4-a716-446655440000"
   * }
   * }
   * ```
   * - VALIDATION_ERROR (400): When the provided ID is not a valid UUID
   * ```json
   * {
   * "success": false,
   * "message": "Invalid input",
   * "error": {
   * "code": "VALIDATION_ERROR",
   * "details": "Invalid task ID format. Must be a valid UUID."
   * }
   * }
   * ```
   * - DATABASE_ERROR (500): When there's an issue retrieving data from the database
   * - INTERNAL_ERROR (500): For unexpected system errors during execution
   * ## Usage Examples
   * 1. Get basic task information:
   * ```json
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000"
   * }
   * ```
   * 2. Get task with all relationships:
   * ```json
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "includeFeature": true,
   * "includeSections": true,
   * "includeSubtasks": true,
   * "includeDependencies": true
   * }
   * ```
   * 3. Get summarized task information (for context efficiency):
   * ```json
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "summaryView": true
   * }
   * ```
   *
   * @param id The unique ID (UUID) of the task to retrieve (e.g.,
   *           '550e8400-e29b-41d4-a716-446655440000')
   * @param includeSubtasks? Whether to include subtasks in the response (experimental feature)
   * @param includeDependencies? Whether to include dependency information (incoming and outgoing
   *                             dependencies with counts)
   * @param includeFeature? Whether to include feature information in the response if the task belongs to
   *                        a feature
   * @param includeSections? Whether to include sections (detailed content blocks) in the response
   * @param summaryView? Whether to return a summarized view for context efficiency (truncates text
   *                     fields)
   */
  get_task(id: string, includeSubtasks?: boolean, includeDependencies?: boolean, includeFeature?: boolean, includeSections?: boolean): Promise<CallResult>;
  // optional (1): summaryView

  /**
   * Deletes a task by its ID
   *
   * @param id The unique ID of the task to delete
   * @param hardDelete? Whether to permanently delete the task (true) or soft delete it (false)
   * @param cascade? Whether to also delete subtasks
   * @param force? Whether to delete even if other tasks depend on this one. When true, breaks dependency
   *               chains and deletes all associated dependencies.
   * @param deleteSections? Whether to also delete associated sections
   */
  delete_task(id: string /* UUID */, hardDelete?: boolean, cascade?: boolean, force?: boolean, deleteSections?: boolean): Promise<CallResult>;

  /**
   * Searches for tasks based on various criteria.
   * ## Purpose
   * Provides flexible task discovery and filtering capabilities for project management,
   * work planning, and task analysis. Essential for finding specific tasks or analyzing
   * work patterns across the project.
   * ## Search Strategy Guidelines
   * **Start Broad, Narrow Down**:
   * 1. Begin with no parameters to see all tasks
   * 2. Add status filter to focus on specific work states
   * 3. Add priority filter for urgency-based searches
   * 4. Use tag filters for domain-specific searches
   * 5. Combine multiple filters for precise targeting
   * **Common Search Patterns**:
   * **Finding Work to Do**:
   * ```json
   * {
   * "status": "pending",
   * "priority": "high",
   * "sortBy": "priority",
   * "sortDirection": "desc"
   * }
   * ```
   * **Reviewing In-Progress Work**:
   * ```json
   * {
   * "status": "in-progress",
   * "sortBy": "modifiedAt",
   * "sortDirection": "desc"
   * }
   * ```
   * **Finding Feature-Specific Tasks**:
   * ```json
   * {
   * "featureId": "feature-uuid",
   * "sortBy": "complexity",
   * "sortDirection": "asc"
   * }
   * ```
   * **Tag-Based Searches** (using consistent tagging conventions):
   * ```json
   * {
   * "tag": "task-type-bug",
   * "priority": "high"
   * }
   * ```
   * **Text-Based Discovery**:
   * ```json
   * {
   * "query": "authentication oauth",
   * "sortBy": "modifiedAt"
   * }
   * ```
   * ## Filter Combinations for Different Use Cases
   * **Sprint Planning**:
   * - Filter by status="pending" and priority="high" or "medium"
   * - Sort by complexity to group similar-sized work
   * - Use pagination to handle large backlogs
   * **Bug Triage**:
   * - Filter by tag="task-type-bug"
   * - Sort by priority and modifiedAt
   * - Review high priority bugs first
   * **Feature Development**:
   * - Filter by featureId to see all related tasks
   * - Sort by status to see progression
   * - Check complexity distribution for estimation
   * **Technical Debt Management**:
   * - Filter by tag="technical-debt" or tag="refactoring"
   * - Sort by complexity to tackle manageable items
   * - Combine with priority for impact assessment
   * ## Pagination Best Practices
   * **Default Behavior**: No parameters returns all tasks, newest first, 20 per page
   * **Efficiency Guidelines**:
   * - Use limit=5-10 for quick overviews
   * - Use limit=50-100 for comprehensive analysis
   * - Use offset for paging through large result sets
   * - Sort by modifiedAt for recent activity
   * - Sort by priority for work planning
   * - Sort by complexity for estimation analysis
   * ## Integration with Other Tools
   * **After Search Results**:
   * - Use `get_task` with includeSections=true for detailed task info
   * - Use `update_task` to modify status, priority, or assignments
   * - Use `create_dependency` to link related tasks found in search
   * - Use `get_feature` to understand feature context for tasks
   * **Complement get_overview**:
   * - get_overview: High-level project state and hierarchical view
   * - search_tasks: Detailed filtering and analysis of specific task subsets
   * ## Context Efficiency Features
   * **Lightweight Results**: Returns essential metadata without summary, full content, or sections
   * **Excluded Fields**: Summary field excluded from search results (use get_task to retrieve)
   * **Paginated Results**: Controls token usage for large datasets
   * **Flexible Sorting**: Enables different analytical perspectives
   * **Multiple Filters**: Precise targeting reduces noise
   * Example successful response:
   * {
   * "success": true,
   * "message": "Found 12 tasks",
   * "data": {
   * "items": [
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Implement OAuth Authentication API",
   * "status": "in-progress",
   * "priority": "high",
   * "complexity": 8,
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T15:45:00Z",
   * "featureId": "661e8511-f30c-41d4-a716-557788990000",
   * "tags": ["task-type-feature", "oauth", "authentication", "api", "security"]
   * }
   * ],
   * "pagination": {
   * "page": 1,
   * "pageSize": 20,
   * "totalItems": 12,
   * "totalPages": 1,
   * "hasNext": false,
   * "hasPrevious": false
   * }
   * }
   * }
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation (invalid status, priority, UUID)
   * - DATABASE_ERROR: When there's an issue searching for tasks
   * - INTERNAL_ERROR: For unexpected system errors
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param query? Text to search for in task titles and descriptions (searches both fields for partial
   *               matches)
   * @param status? Filter by task status. Valid values: 'pending', 'in-progress', 'completed',
   *                'cancelled', 'deferred'
   * @param priority? Filter by task priority. Valid values: 'high', 'medium', 'low'
   * @param featureId? Filter by feature ID (UUID) to get only tasks for a specific feature (e.g.,
   *                   '550e8400-e29b-41d4-a716-446655440000')
   * @param projectId? Filter by project ID (UUID) to get only tasks for a specific project (e.g.,
   *                   '550e8400-e29b-41d4-a716-446655440000')
   * @param tag? Filter by tag to find tasks containing this specific tag (case insensitive)
   * @param limit? Maximum number of results to return
   * @param offset? Number of results to skip (for pagination)
   * @param sortBy? Field to sort results by: 'createdAt', 'modifiedAt', 'priority', 'status', or
   *                'complexity'
   * @param sortDirection? Sort direction: 'asc' (ascending) or 'desc' (descending)
   */
  search_tasks(query?: string, status?: "pending" | "in-progress" | "completed" | "cancelled" | "deferred", priority?: "high" | "medium" | "low", featureId?: string, projectId?: string): Promise<CallResult>;
  // optional (5): tag, limit, offset, sortBy, sortDirection

  /**
   * Retrieves a lightweight, token-efficient overview of tasks and features.
   * ## Purpose
   * This tool provides a hierarchical project overview optimized for context efficiency.
   * Essential for understanding current work state and making informed task planning decisions.
   * ## Usage Guidance
   * **RECOMMENDED WORKFLOW START**: Always begin work sessions with get_overview to:
   * - Understand current project state and priorities
   * - Identify in-progress tasks that need attention
   * - Plan new work based on existing features and tasks
   * - Locate orphaned tasks that might need feature association
   * ## Data Organization
   * - **Features**: Top-level functionality groupings with their associated tasks
   * - **Orphaned Tasks**: Tasks not associated with any feature (may need organization)
   * - **Hierarchical View**: Tasks organized under their parent features for clear context
   * - **Essential Metadata**: Status, priority, complexity without full content for efficiency
   * ## Context Efficiency Features
   * - Configurable summary length (0-200 chars) to control token usage
   * - Essential metadata only (no full task content or sections)
   * - Hierarchical organization reduces cognitive overhead
   * - Count summaries provide quick project metrics
   * ## Integration with Other Tools
   * Use this overview to inform decisions for:
   * - `create_task`: Understand existing work before creating new tasks
   * - `create_feature`: Identify orphaned tasks that could be grouped
   * - `update_task`: Find tasks that need status updates
   * - `search_tasks`: Narrow down specific searches based on overview insights
   * ## Best Practices
   * - Run get_overview at the start of work sessions
   * - Use summaryLength=0 when you only need structure and metadata
   * - Use summaryLength=100-200 when you need content context
   * - Pay attention to orphaned tasks - they may need feature association
   * - Monitor task status distribution across features
   * Example response:
   * {
   * "success": true,
   * "message": "Task overview retrieved successfully",
   * "data": {
   * "features": [
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "name": "User Authentication",
   * "status": "in-development",
   * "summary": "Implements secure user authentication mechanisms with OAuth 2.0 and JWT tokens...",
   * "tasks": [
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Implement OAuth Authentication API",
   * "summary": "Create secure authentication flow with OAuth 2.0 protocol and JWT token management...",
   * "status": "in-progress",
   * "priority": "high",
   * "complexity": 8,
   * "tags": "task-type-feature, oauth, authentication, api"
   * }
   * ]
   * }
   * ],
   * "orphanedTasks": [
   * {
   * "id": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Setup CI/CD Pipeline",
   * "summary": "Configure automated build and deployment pipeline using GitHub Actions...",
   * "status": "pending",
   * "priority": "medium",
   * "complexity": 6,
   * "tags": "task-type-infrastructure, ci-cd, automation"
   * }
   * ],
   * "counts": {
   * "features": 5,
   * "tasks": 23,
   * "orphanedTasks": 7
   * }
   * }
   * }
   *
   * @param summaryLength? Maximum length of task/feature summaries (0 to exclude summaries)
   */
  get_overview(summaryLength?: number): Promise<CallResult>;

  /**
   * Transforms a task into markdown format with YAML frontmatter.
   * This tool retrieves a task and all its sections, then renders them as a markdown document
   * with YAML frontmatter containing task metadata. The output is suitable for:
   * - File export and documentation generation
   * - Systems that can render markdown directly
   * - Version control and diff-friendly storage
   * - Human-readable task archives
   * The markdown output includes:
   * - YAML frontmatter with task metadata (id, title, status, priority, complexity, tags, dates)
   * - Task summary as the first content paragraph
   * - All sections rendered according to their content format (markdown, code, JSON, plain text)
   * For inspecting task details in structured JSON format, use get_task instead.
   *
   * @param id The unique ID (UUID) of the task to transform to markdown (e.g.,
   *           '550e8400-e29b-41d4-a716-446655440000')
   */
  task_to_markdown(id: string): Promise<CallResult>;

  /**
   * Creates a new task dependency with validation for task existence, cycle detection, and duplicate
   * prevention.
   * Dependencies represent relationships between tasks that can affect execution planning and workflow
   * management.
   * This tool ensures data integrity by validating all aspects before creation.
   * Example successful response:
   * {
   * "success": true,
   * "message": "Dependency created successfully",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "fromTaskId": "661e8511-f30c-41d4-a716-557788990000",
   * "toTaskId": "772f9622-g41d-52e5-b827-668899101111",
   * "type": "BLOCKS",
   * "createdAt": "2025-05-10T14:30:00Z"
   * }
   * }
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation
   * - RESOURCE_NOT_FOUND: When one or both tasks don't exist
   * - CONFLICT_ERROR: When the dependency would create a cycle or already exists
   * - DATABASE_ERROR: When there's an issue storing the dependency
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param fromTaskId ID of the source task (the task that creates the dependency)
   * @param toTaskId ID of the target task (the task that is affected by the dependency)
   * @param type? Type of dependency: 'BLOCKS' (source blocks target), 'IS_BLOCKED_BY' (source is blocked
   *              by target), or 'RELATES_TO' (general relationship)
   */
  create_dependency(fromTaskId: string /* UUID */, toTaskId: string /* UUID */, type?: "BLOCKS" | "IS_BLOCKED_BY" | "RELATES_TO"): Promise<CallResult>;

  /**
   * Retrieves all dependencies for a specific task with filtering options and dependency chain
   * information.
   * This tool provides comprehensive dependency information for a task, allowing you to understand
   * how a task relates to other tasks in the system. It supports filtering by dependency type
   * and direction for focused queries.
   * Example successful response:
   * {
   * "success": true,
   * "message": "Dependencies retrieved successfully",
   * "data": {
   * "taskId": "550e8400-e29b-41d4-a716-446655440000",
   * "dependencies": {
   * "incoming": [
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "fromTaskId": "772f9622-g41d-52e5-b827-668899101111",
   * "toTaskId": "550e8400-e29b-41d4-a716-446655440000",
   * "type": "BLOCKS",
   * "createdAt": "2025-05-10T14:30:00Z"
   * }
   * ],
   * "outgoing": [
   * {
   * "id": "883f0733-h52e-63f6-c938-779900212222",
   * "fromTaskId": "550e8400-e29b-41d4-a716-446655440000",
   * "toTaskId": "994f1844-i63f-74g7-d049-8800a1323333",
   * "type": "BLOCKS",
   * "createdAt": "2025-05-10T15:00:00Z"
   * }
   * ]
   * },
   * "counts": {
   * "total": 2,
   * "incoming": 1,
   * "outgoing": 1,
   * "byType": {
   * "BLOCKS": 2,
   * "IS_BLOCKED_BY": 0,
   * "RELATES_TO": 0
   * }
   * }
   * }
   * }
   * Common error responses:
   * - RESOURCE_NOT_FOUND: When the specified task doesn't exist
   * - VALIDATION_ERROR: When provided parameters fail validation
   * - DATABASE_ERROR: When there's an issue retrieving dependencies
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param taskId ID of the task to retrieve dependencies for
   * @param direction? Filter by dependency direction: 'incoming' (dependencies pointing to this task),
   *                   'outgoing' (dependencies from this task), or 'all' (both directions)
   * @param type? Filter by dependency type: 'BLOCKS', 'IS_BLOCKED_BY', 'RELATES_TO', or 'all' for all
   *              types
   * @param includeTaskInfo? Whether to include basic task information (title, status) for related tasks
   */
  get_task_dependencies(taskId: string /* UUID */, direction?: "incoming" | "outgoing" | "all", type?: "BLOCKS" | "IS_BLOCKED_BY" | "RELATES_TO" | "all", includeTaskInfo?: boolean): Promise<CallResult>;

  /**
   * Deletes task dependencies by dependency ID or by task relationship criteria.
   * This tool provides flexible dependency deletion capabilities. You can delete dependencies:
   * - By specific dependency ID (most precise)
   * - By task relationship (fromTaskId and toTaskId with optional type filter)
   * - All dependencies for a specific task (using deleteAll parameter)
   * Example successful response:
   * {
   * "success": true,
   * "message": "Dependency deleted successfully",
   * "data": {
   * "deletedCount": 1,
   * "deletedDependencies": [
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "fromTaskId": "661e8511-f30c-41d4-a716-557788990000",
   * "toTaskId": "772f9622-g41d-52e5-b827-668899101111",
   * "type": "BLOCKS"
   * }
   * ]
   * }
   * }
   * Common error responses:
   * - RESOURCE_NOT_FOUND: When the specified dependency doesn't exist
   * - VALIDATION_ERROR: When provided parameters fail validation
   * - DATABASE_ERROR: When there's an issue deleting the dependency
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param id? ID of the specific dependency to delete (mutually exclusive with task relationship
   *            parameters)
   * @param fromTaskId? ID of the source task (used with toTaskId for relationship-based deletion)
   * @param toTaskId? ID of the target task (used with fromTaskId for relationship-based deletion)
   * @param type? Filter by dependency type when using task relationship deletion (optional)
   * @param deleteAll? When used with fromTaskId OR toTaskId (not both), deletes all dependencies for
   *                   that task
   */
  delete_dependency(id?: string /* UUID */, fromTaskId?: string /* UUID */, toTaskId?: string /* UUID */, type?: "BLOCKS" | "IS_BLOCKED_BY" | "RELATES_TO", deleteAll?: boolean): Promise<CallResult>;

  /**
   * Create a new feature with required and optional fields.
   * ## Purpose
   * Features provide higher-level organization for related tasks, representing coherent
   * functionality or project components. They bridge the gap between individual tasks
   * and overall project goals.
   * ## Feature vs Task Decision Guide
   * **Create a Feature when**:
   * - Work involves multiple related tasks (3+ tasks)
   * - Functionality represents a user-facing feature or system component
   * - Work has distinct phases (planning, development, testing, deployment)
   * - Multiple developers or skill sets are involved
   * - Work has independent business value or can be delivered as a unit
   * **Use Direct Tasks when**:
   * - Work is a single, focused implementation
   * - Maintenance, bug fixes, or small enhancements
   * - Infrastructure or tooling improvements
   * - Work doesn't logically group with other tasks
   * ## Template Integration Strategy
   * **RECOMMENDED**: Apply templates at creation for consistent documentation structure.
   * **Feature-Level Templates** (use `list_templates` with targetEntityType="FEATURE"):
   * - Context & Background: Project context and business requirements
   * - Requirements Specification: Detailed functional and non-functional requirements
   * - Technical Approach: High-level architecture and technical strategy
   * **Template Combinations for Features**:
   * - **Planning Phase**: Context & Background + Requirements Specification
   * - **Technical Phase**: Requirements Specification + Technical Approach
   * - **Comprehensive**: All three templates for complex features
   * ## Feature Lifecycle Management
   * **Status Progression**:
   * 1. `planning` - Requirements gathering, design, scope definition
   * 2. `in-development` - Active implementation across multiple tasks
   * 3. `completed` - All associated tasks completed, feature delivered
   * 4. `archived` - Feature complete and no longer under active development
   * **Priority Guidelines**:
   * - `high`: Core functionality, user-facing features, business critical
   * - `medium`: Important enhancements, internal tools, performance improvements
   * - `low`: Nice-to-have features, experimental functionality
   * ## Organizing Tasks Under Features
   * **After creating a feature**, use the featureId in `create_task` to associate tasks:
   * ```json
   * {
   * "title": "Implement OAuth Login",
   * "summary": "Create OAuth authentication endpoints",
   * "featureId": "feature-uuid-here",
   * "templateIds": ["task-template-uuid"]
   * }
   * ```
   * **Task Organization Patterns**:
   * - **Frontend + Backend**: Separate tasks for UI and API implementation
   * - **By Component**: Database, API, UI, Tests as separate tasks
   * - **By Phase**: Research, Implementation, Testing, Documentation
   * - **By Complexity**: Break large features into manageable task chunks
   * ## Integration with Project Hierarchy
   * **Project → Features → Tasks** hierarchy:
   * - Use projectId to associate feature with a project
   * - Features group related functionality within a project
   * - Tasks represent specific implementation work within features
   * ## Best Practices
   * **Naming Conventions**:
   * - Use noun phrases describing functionality: "User Authentication", "Payment Processing"
   * - Avoid implementation details in names: "OAuth Integration" not "Implement OAuth"
   * - Be specific enough to distinguish from other features
   * **Summary Guidelines**:
   * - Include business value and user impact
   * - Mention key technical components or integrations
   * - Define success criteria or completion indicators
   * - Keep scope clear and bounded
   * **Tagging Strategy**:
   * - Include functional area: "authentication", "payments", "reporting"
   * - Add technical stack: "frontend", "backend", "database", "api"
   * - Mark business importance: "core", "enhancement", "experimental"
   * - Include user-facing impact: "user-experience", "admin-tools", "internal"
   * Example successful response:
   * {
   * "success": true,
   * "message": "Feature created successfully with 2 template(s) applied, creating 5 section(s)",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "name": "User Authentication System",
   * "summary": "Complete user authentication system with OAuth 2.0, JWT tokens, and social login
   * integration. Provides secure user registration, login, password reset, and session management.",
   * "status": "planning",
   * "priority": "high",
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T14:30:00Z",
   * "tags": ["core", "authentication", "security", "user-experience", "oauth"],
   * "appliedTemplates": [
   * {
   * "templateId": "context-background-uuid",
   * "sectionsCreated": 2
   * },
   * {
   * "templateId": "requirements-spec-uuid",
   * "sectionsCreated": 3
   * }
   * ]
   * }
   * }
   * For feature creation patterns and best practices, see:
   * task-orchestrator://guidelines/task-management
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation (empty name/summary)
   * - RESOURCE_NOT_FOUND: When specified projectId or templateIds don't exist
   * - DATABASE_ERROR: When there's an issue storing the feature or applying templates
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param name Required feature name (e.g., 'User Authentication', 'Data Export')
   * @param summary Required feature summary describing its purpose and scope
   * @param status? Feature status. Valid values: 'planning', 'in-development', 'completed', 'archived'
   * @param priority? Priority level. Valid values: 'high', 'medium', 'low'
   * @param projectId? Optional UUID of the project this feature belongs to (e.g.,
   *                   '550e8400-e29b-41d4-a716-446655440000')
   * @param tags? Comma-separated list of tags for categorization (e.g., 'frontend,ui,critical')
   * @param templateIds? List of template IDs to apply. Use a single-item array for applying just one
   *                     template.
   */
  create_feature(name: string, summary: string, status?: "planning" | "in-development" | "completed" | "archived", priority?: "high" | "medium" | "low", projectId?: string): Promise<CallResult>;
  // optional (2): tags, templateIds

  /**
   * Update an existing feature's properties.
   * ⚡ **EFFICIENCY TIP**: Only send fields you want to change! All fields except 'id' are optional.
   * Sending unchanged fields wastes 90%+ tokens. Example: To update status, send only {"id": "uuid",
   * "status": "in-development"}
   * ## Efficient vs Inefficient Updates
   * ❌ **INEFFICIENT** (wastes ~400+ characters):
   * ```json
   * {
   * "id": "feature-uuid",
   * "name": "Existing Feature Name", // Unchanged - unnecessary
   * "summary": "Long existing summary...", // Unchanged - 400+ chars wasted
   * "status": "in-development", // ✓ Only this changed
   * "priority": "high", // Unchanged - unnecessary
   * "tags": "tag1,tag2,tag3" // Unchanged - unnecessary
   * }
   * ```
   * ✅ **EFFICIENT** (uses ~40 characters):
   * ```json
   * {
   * "id": "feature-uuid",
   * "status": "in-development" // Only send what changed!
   * }
   * ```
   * **Token Savings**: 90% reduction by only sending changed fields!
   * ## Partial Updates
   * Only specify fields you want to change. Unspecified fields remain unchanged.
   * This tool supports partial updates for all fields except 'id' (which is required).
   *
   * @param id The unique ID of the feature to update
   * @param name? (optional) New feature name
   * @param summary? (optional) New feature summary
   * @param status? (optional) New status (planning, in-development, completed, archived)
   * @param priority? (optional) New priority level (high, medium, low)
   * @param projectId? (optional) New project ID (UUID) to associate this feature with
   * @param tags? (optional) New comma-separated list of tags
   */
  update_feature(id: string, name?: string, summary?: string, status?: string, priority?: string): Promise<CallResult>;
  // optional (2): projectId, tags

  /**
   * Retrieves a feature by its ID with options for including relationships.
   * ## Purpose
   * Fetches a complete feature by its UUID with options to include related entities like
   * tasks and task statistics. This tool allows getting detailed information about a specific
   * feature when its ID is known.
   * Note: Features store their detailed content in separate Section entities for efficiency.
   * To retrieve the complete feature with all content blocks, make sure to set includeSections=true.
   * Otherwise, you'll only receive the basic feature metadata and summary.
   * ## Parameters
   * | Parameter | Type | Required | Default | Description |
   * | id | UUID string | Yes | - | The unique ID of the feature to retrieve (e.g.,
   * '550e8400-e29b-41d4-a716-446655440000') |
   * | includeTasks | boolean | No | false | Whether to include basic task information in the response.
   * Set to true when you need to see all tasks associated with this feature. |
   * | maxTaskCount | integer | No | 10 | Maximum number of tasks to include (1-100) |
   * | includeTaskCounts | boolean | No | false | Whether to include task statistics grouped by status |
   * | includeTaskDependencies | boolean | No | false | Whether to include dependency information for
   * tasks when includeTasks is true |
   * | includeSections | boolean | No | false | Whether to include sections (detailed content blocks)
   * that contain the full content of the feature. Set to true when you need the complete feature context
   * beyond the basic summary. |
   * | summaryView | boolean | No | false | Whether to return a summarized view for context efficiency
   * (truncates text fields) |
   * | maxsummaryLength | integer | No | 500 | Maximum length for summary before truncation when in
   * summary view |
   * ## Response Format
   * ### Success Response
   * ```json
   * {
   * "success": true,
   * "message": "Feature retrieved successfully",
   * "data": {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "name": "REST API Implementation",
   * "summary": "Implement the core REST API endpoints...",
   * "status": "in-development",
   * "priority": "high",
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T15:45:00Z",
   * "tags": ["api", "backend"],
   * "taskCounts": {
   * "total": 15,
   * "byStatus": {
   * "pending": 5,
   * "in-progress": 8,
   * "completed": 2
   * }
   * },
   * "sections": [
   * {
   * "id": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Requirements",
   * "content": "The API should support CRUD operations...",
   * "contentFormat": "markdown",
   * "ordinal": 0
   * }
   * ],
   * "tasks": {
   * "items": [
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Implement User API",
   * "status": "in-progress",
   * "priority": "high",
   * "complexity": 7,
   * "dependencies": {
   * "counts": {
   * "total": 3,
   * "incoming": 1,
   * "outgoing": 2
   * }
   * }
   * },
   * // More tasks...
   * ],
   * "total": 15,
   * "included": 10,
   * "hasMore": true,
   * "dependencyStatistics": {
   * "totalDependencies": 25,
   * "totalIncomingDependencies": 12,
   * "totalOutgoingDependencies": 13,
   * "tasksWithDependencies": 8
   * }
   * }
   * }
   * }
   * ```
   * ## Error Responses
   * - RESOURCE_NOT_FOUND (404): When no feature exists with the specified ID
   * - VALIDATION_ERROR (400): When the provided ID is not a valid UUID
   * - DATABASE_ERROR (500): When there's an issue retrieving data from the database
   * - INTERNAL_ERROR (500): For unexpected system errors during execution
   * ## Usage Examples
   * 1. Get basic feature information:
   * ```json
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000"
   * }
   * ```
   * 2. Get feature with tasks and counts:
   * ```json
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "includeTasks": true,
   * "includeTaskCounts": true
   * }
   * ```
   * 3. Get feature with sections (detailed content):
   * ```json
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "includeSections": true
   * }
   * ```
   * 4. Get complete feature with all relationships:
   * ```json
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "includeTasks": true,
   * "includeTaskCounts": true,
   * "includeSections": true
   * }
   * ```
   * 5. Get feature with tasks and their dependency information:
   * ```json
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "includeTasks": true,
   * "includeTaskDependencies": true
   * }
   * ```
   * 6. Get summarized feature information (for context efficiency):
   * ```json
   * {
   * "id": "661e8511-f30c-41d4-a716-557788990000",
   * "summaryView": true
   * }
   * ```
   *
   * @param id The unique ID of the feature to retrieve
   * @param includeTasks? Whether to include basic task information in the response. Set to true when you
   *                      need to see all tasks associated with this feature.
   * @param includeTaskCounts? Whether to include task statistics grouped by status. Useful for getting a
   *                           quick overview of task progress.
   * @param includeSections? Whether to include sections (detailed content blocks) that contain the full
   *                         content of the feature.
   * @param maxTaskCount? Maximum number of tasks to include
   * @param summaryView? Whether to return a summarized view for context efficiency
   * @param includeTaskDependencies? Whether to include dependency information for tasks when
   *                                 includeTasks is true
   * @param maxsummaryLength? Maximum length for summary (truncates if longer)
   */
  get_feature(id: string, includeTasks?: boolean, includeTaskCounts?: boolean, includeSections?: boolean, maxTaskCount?: number): Promise<CallResult>;
  // optional (3): summaryView, includeTaskDependencies, maxsummaryLength

  /**
   * Remove a feature and its associated tasks
   *
   * @param id The unique ID of the feature to delete
   * @param hardDelete? Whether to completely remove the feature from the database
   * @param cascade? Whether to delete tasks associated with this feature
   * @param force? Whether to force deletion even with active tasks
   */
  delete_feature(id: string, hardDelete?: boolean, cascade?: boolean, force?: boolean): Promise<CallResult>;

  /**
   * Find features matching specified criteria
   *
   * @param query? Text to search for in feature names and descriptions
   * @param status? Filter by feature status (planning, in-development, completed, archived)
   * @param priority? Filter by priority (high, medium, low)
   * @param tag? Filter by tag (features containing this tag)
   * @param projectId? Filter by project ID (UUID) to get only features for a specific project
   * @param createdAfter? Filter by creation date after this ISO-8601 date (e.g., 2025-05-10T14:30:00Z)
   * @param createdBefore? Filter by creation date before this ISO-8601 date (e.g., 2025-05-10T14:30:00Z)
   * @param sortBy? Sort results by this field (createdAt, modifiedAt, name, status, priority)
   * @param sortDirection? Sort direction (asc, desc)
   * @param limit? Maximum number of results to return
   * @param offset? Number of results to skip (for pagination)
   */
  search_features(query?: string, status?: string, priority?: string, tag?: string, projectId?: string): Promise<CallResult>;
  // optional (6): createdAfter, createdBefore, sortBy, sortDirection, limit, ...

  /**
   * Transforms a feature into markdown format with YAML frontmatter.
   * This tool retrieves a feature and all its sections, then renders them as a markdown document
   * with YAML frontmatter containing feature metadata. The output is suitable for:
   * - File export and documentation generation
   * - Systems that can render markdown directly
   * - Version control and diff-friendly storage
   * - Human-readable feature archives
   * The markdown output includes:
   * - YAML frontmatter with feature metadata (id, name, status, priority, tags, dates)
   * - Feature summary as the first content paragraph
   * - All sections rendered according to their content format (markdown, code, JSON, plain text)
   * For inspecting feature details in structured JSON format, use get_feature instead.
   *
   * @param id The unique ID (UUID) of the feature to transform to markdown (e.g.,
   *           '550e8400-e29b-41d4-a716-446655440000')
   */
  feature_to_markdown(id: string): Promise<CallResult>;

  /**
   * Implement the CreateProjectTool MCP tool for creating new projects. Define parameter schema and
   * validation for all required and optional fields (name, summary, status, tags). Implement tool
   * execution logic to create and persist project entities.
   * This tool creates a new Project entity in the MCP Task Orchestrator system. Projects are top-level
   * organizational containers that can group related features and tasks together. Each project requires
   * a name and summary, and can optionally include status information and tags for categorization.
   * Projects provide a higher level of organization above features, allowing you to manage work across
   * multiple features and their related tasks.
   * Example successful response:
   * {
   * "success": true,
   * "message": "Project created successfully",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "name": "Mobile App Redesign",
   * "summary": "Complete redesign of the mobile application with improved UI/UX",
   * "status": "planning",
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T14:30:00Z",
   * "tags": ["mobile", "ui", "2025-roadmap"]
   * },
   * "error": null,
   * "metadata": {
   * "timestamp": "2025-05-10T14:30:00Z"
   * }
   * }
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation
   * - DATABASE_ERROR: When there's an issue storing the project
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param name Project name (e.g., 'Mobile App Redesign', 'Backend API')
   * @param summary Project description explaining its purpose and scope
   * @param status? Project status. Valid values: 'planning', 'in-development', 'completed', 'archived'
   * @param tags? Comma-separated list of tags for categorization (e.g., 'frontend,mobile,2025-roadmap')
   */
  create_project(name: string, summary: string, status?: "planning" | "in-development" | "completed" | "archived", tags?: string): Promise<CallResult>;

  /**
   * Retrieves a project by its ID with options for including relationships.
   * This tool provides detailed access to a specific project with options to include related entities
   * like
   * features, tasks, and sections. Projects are top-level organizational containers that group related
   * work together.
   * The tool supports progressive loading of details to optimize context usage, allowing you to request
   * only the
   * information you need. For large projects, you can limit the number of related entities returned.
   *
   * @param id The unique ID (UUID) of the project to retrieve
   * @param includeFeatures? Whether to include basic feature information in the response
   * @param includeTasks? Whether to include basic task information in the response
   * @param includeSections? Whether to include sections (detailed content blocks) in the response
   * @param maxFeatureCount? Maximum number of features to include (1-100)
   * @param maxTaskCount? Maximum number of tasks to include (1-100)
   * @param summaryView? Whether to return a summarized view for context efficiency
   */
  get_project(id: string, includeFeatures?: boolean, includeTasks?: boolean, includeSections?: boolean, maxFeatureCount?: number): Promise<CallResult>;
  // optional (2): maxTaskCount, summaryView

  /**
   * Updates an existing project's properties.
   * ⚡ **EFFICIENCY TIP**: Only send fields you want to change! All fields except 'id' are optional.
   * Sending unchanged fields wastes 90%+ tokens. Example: To update status, send only {"id": "uuid",
   * "status": "in-development"}
   * ## Efficient vs Inefficient Updates
   * ❌ **INEFFICIENT** (wastes ~400+ characters):
   * ```json
   * {
   * "id": "project-uuid",
   * "name": "Existing Project Name", // Unchanged - unnecessary
   * "summary": "Long existing summary...", // Unchanged - 400+ chars wasted
   * "status": "in-development", // ✓ Only this changed
   * "tags": "tag1,tag2,tag3" // Unchanged - unnecessary
   * }
   * ```
   * ✅ **EFFICIENT** (uses ~40 characters):
   * ```json
   * {
   * "id": "project-uuid",
   * "status": "in-development" // Only send what changed!
   * }
   * ```
   * **Token Savings**: 90% reduction by only sending changed fields!
   * ## Partial Updates
   * This tool modifies properties of an existing project. It supports partial updates, meaning you only
   * need to specify
   * the fields you want to change. Any fields not included in the request will retain their current
   * values.
   * Projects are top-level organizational containers that group related features and tasks together.
   * Updating a project
   * allows you to change its name, summary, status, or tags without affecting its relationships with
   * features and tasks.
   * Example successful response:
   * {
   * "success": true,
   * "message": "Project updated successfully",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "name": "Mobile App Redesign 2.0",
   * "summary": "Updated project scope with additional accessibility features",
   * "status": "in-development",
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-15T16:20:00Z",
   * "tags": ["mobile", "ui", "accessibility", "2025-roadmap"]
   * },
   * "error": null,
   * "metadata": {
   * "timestamp": "2025-05-15T16:20:00Z"
   * }
   * }
   * Common error responses:
   * - RESOURCE_NOT_FOUND: When no project exists with the specified ID
   * - VALIDATION_ERROR: When parameters fail validation (e.g., empty name)
   * - DATABASE_ERROR: When there's an issue storing the updated project
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param id The unique ID of the project to update
   * @param name? (optional) New project name
   * @param summary? (optional) New project summary describing its purpose and scope
   * @param status? (optional) New project status. Valid values: 'planning', 'in-development',
   *                'completed', 'archived'
   * @param tags? (optional) New comma-separated list of tags for categorization
   */
  update_project(id: string, name?: string, summary?: string, status?: "planning" | "in-development" | "completed" | "archived", tags?: string): Promise<CallResult>;

  /**
   * Remove a project and its associated features/tasks
   *
   * @param id The unique ID of the project to delete
   * @param hardDelete? Whether to permanently remove the project from the database
   * @param cascade? Whether to delete all features and tasks associated with this project
   * @param force? Whether to force deletion even with active features or tasks
   */
  delete_project(id: string, hardDelete?: boolean, cascade?: boolean, force?: boolean): Promise<CallResult>;

  /**
   * Find projects matching specified criteria
   *
   * @param query? Text to search for in project names and summaries
   * @param status? Filter by project status (planning, in-development, completed, archived)
   * @param tag? Filter by tag (projects containing this tag)
   * @param createdAfter? Filter by creation date after this ISO-8601 date (e.g., 2025-05-10T14:30:00Z)
   * @param createdBefore? Filter by creation date before this ISO-8601 date (e.g., 2025-05-10T14:30:00Z)
   * @param sortBy? Sort results by this field (createdAt, modifiedAt, name, status)
   * @param sortDirection? Sort direction (asc, desc)
   * @param limit? Maximum number of results to return
   * @param offset? Number of results to skip (for pagination)
   */
  search_projects(query?: string, status?: string, tag?: string, createdAfter?: string, createdBefore?: string): Promise<CallResult>;
  // optional (4): sortBy, sortDirection, limit, offset

  /**
   * Transforms a project into markdown format with YAML frontmatter.
   * This tool retrieves a project and all its sections, then renders them as a markdown document
   * with YAML frontmatter containing project metadata. The output is suitable for:
   * - File export and documentation generation
   * - Systems that can render markdown directly
   * - Version control and diff-friendly storage
   * - Human-readable project archives
   * The markdown output includes:
   * - YAML frontmatter with project metadata (id, name, status, tags, dates)
   * - Project summary as the first content paragraph
   * - All sections rendered according to their content format (markdown, code, JSON, plain text)
   * For inspecting project details in structured JSON format, use get_project instead.
   *
   * @param id The unique ID (UUID) of the project to transform to markdown (e.g.,
   *           '550e8400-e29b-41d4-a716-446655440000')
   */
  project_to_markdown(id: string): Promise<CallResult>;

  /**
   * Adds a section to a task, feature, or project.
   * ## Purpose
   * Sections store detailed content for tasks, features, and projects in a structured way.
   * Instead of storing all content directly in the entities, sections allow for
   * organized content blocks with specific formats and purposes. This approach
   * optimizes context efficiency by keeping core entities lightweight.
   * ## Usage Guidelines
   * **EFFICIENCY RECOMMENDATION**: For adding multiple sections at once, prefer using
   * `bulk_create_sections` instead of multiple `add_section` calls. This is especially
   * important for:
   * - Creating initial section sets for new tasks/features
   * - Adding sections with shorter content (reduces network overhead)
   * - Template-like section creation scenarios
   * **WHEN TO USE add_section**:
   * - Adding a single section with substantial content
   * - Adding sections incrementally during task development
   * - Creating sections that require careful individual validation
   * ## Content Organization Strategy
   * **Common Section Types** (use these title patterns for consistency):
   * - **Requirements**: What needs to be accomplished, acceptance criteria
   * - **Implementation Notes**: Technical approach, architecture decisions
   * - **Testing Strategy**: Testing approach, coverage requirements
   * - **Reference Information**: External links, documentation, resources
   * - **Dependencies**: Prerequisites, related tasks, blocking issues
   * - **Architecture**: Design patterns, system integration points
   * **Ordinal Sequencing Best Practices**:
   * - Start with ordinal 0 for the first section
   * - Use increments of 1 for logical ordering
   * - Leave gaps (0, 10, 20) when you anticipate inserting sections later
   * - Requirements typically come first (ordinal 0)
   * - Implementation details in the middle (ordinal 1-5)
   * - Testing and validation toward the end (ordinal 6+)
   * **Content Format Selection**:
   * - **MARKDOWN**: Default for documentation, requirements, notes (rich formatting)
   * - **PLAIN_TEXT**: Simple text without formatting needs
   * - **JSON**: Structured data, configuration, API specifications
   * - **CODE**: Source code examples, implementation snippets
   * **Writing Markdown Content**:
   * **CRITICAL - Section Title Handling**:
   * - The `title` field becomes the section heading (rendered as ## H2 in markdown output)
   * - **DO NOT** duplicate the section title as a heading in the `content` field
   * - Content should start directly with the information, NOT with another heading
   * - For subsections within content, use ### (H3) or lower headings
   * **Markdown Formatting**:
   * - Use subsection headings: `### Subsection` (H3 or lower, never H2)
   * - Use lists: `- Item` or `1. Numbered`
   * - Use emphasis: `**bold**` or `*italic*`
   * - Use code: \`inline\` or \`\`\`kotlin code block\`\`\`
   * - Use links: `[text](url)`
   * **Example - WRONG (❌ Creates Duplicate Headings)**:
   * ```markdown
   * ## Requirements
   * - **Must** support OAuth 2.0
   * ```
   * *Problem: Title field "Requirements" + content heading "## Requirements" = duplicate*
   * **Example - CORRECT (✅ No Duplicate)**:
   * ```markdown
   * - **Must** support OAuth 2.0
   * - **Should** handle token refresh automatically
   * - See [OAuth spec](https://oauth.net/2/)
   * ```
   * *Correct: Title field "Requirements" provides the heading, content starts directly*
   * **Example - With Subsections (✅ Also Correct)**:
   * ```markdown
   * ### Current Behavior
   * The system currently...
   * ### Proposed Changes
   * - Change 1...
   * - Change 2...
   * ```
   * *Correct: Uses H3 for subsections, not H2*
   * ## Integration with Workflow
   * **Template Integration**: When using templates, they create standard sections automatically.
   * Use add_section to supplement template-created sections with project-specific content.
   * **Progressive Detail**: Start with high-level sections (Requirements, Architecture)
   * and add implementation details as the task progresses.
   * ## Parameters
   * | Parameter | Type | Required | Default | Description |
   * |-----------|------|----------|---------|-------------|
   * | entityType | string | Yes | - | Type of entity to attach this section to: 'PROJECT', 'TASK', or
   * 'FEATURE' |
   * | entityId | UUID string | Yes | - | ID of the project, task, or feature to add the section to
   * (e.g., '550e8400-e29b-41d4-a716-446655440000') |
   * | title | string | Yes | - | Section title (e.g., 'Requirements', 'Implementation Notes', 'Testing
   * Plan') |
   * | usageDescription | string | Yes | - | Description of how this section should be used by AI models
   * or users |
   * | content | string | Yes | - | The actual content of the section in the specified format |
   * | contentFormat | string | No | "MARKDOWN" | Format of the content: 'MARKDOWN', 'PLAIN_TEXT',
   * 'JSON', or 'CODE' |
   * | ordinal | integer | Yes | - | Order position (0-based). Lower numbers appear first when ordered. |
   * | tags | string | No | - | Comma-separated list of tags for categorization (e.g.,
   * 'documentation,frontend,api') |
   * ## Response Format
   * ### Success Response
   * ```json
   * {
   * "success": true,
   * "message": "Section added successfully",
   * "data": {
   * "section": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "entityType": "TASK",
   * "entityId": "661f9511-f30c-52e5-b827-557766551111",
   * "title": "Implementation Steps",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 1,
   * "createdAt": "2025-05-10T14:30:00Z"
   * }
   * }
   * }
   * ```
   * ## Error Responses
   * - RESOURCE_NOT_FOUND (404): When the specified task or feature doesn't exist
   * ```json
   * {
   * "success": false,
   * "message": "The specified task was not found",
   * "error": {
   * "code": "RESOURCE_NOT_FOUND"
   * }
   * }
   * ```
   * - VALIDATION_ERROR (400): When provided parameters fail validation
   * ```json
   * {
   * "success": false,
   * "message": "Title is required",
   * "error": {
   * "code": "VALIDATION_ERROR"
   * }
   * }
   * ```
   * - DATABASE_ERROR (500): When there's an issue storing the section in the database
   * - INTERNAL_ERROR (500): For unexpected system errors during execution
   * ## Usage Examples
   * 1. Add a requirements section to a task:
   * ```json
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Requirements",
   * "usageDescription": "Key requirements that the implementation must satisfy",
   * "content": "1. Must support OAuth2 authentication\\n2. Should handle token refresh\\n3. Needs rate
   * limiting",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 0,
   * "tags": "requirements,security,api"
   * }
   * ```
   * 2. Add implementation notes to a feature:
   * ```json
   * {
   * "entityType": "FEATURE",
   * "entityId": "661e8511-f30c-41d4-a716-557788990000",
   * "title": "Implementation Notes",
   * "usageDescription": "Technical details on implementation approach",
   * "content": "Use the AuthLib 2.0 library for OAuth implementation...",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 1,
   * "tags": "implementation,technical"
   * }
   * ```
   * 3. Add overview documentation to a project:
   * ```json
   * {
   * "entityType": "PROJECT",
   * "entityId": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Project Overview",
   * "usageDescription": "High-level overview of the project",
   * "content": "This project aims to create a scalable infrastructure...",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 0,
   * "tags": "overview,documentation"
   * }
   * ```
   * 3. Add structured data as JSON:
   * ```json
   * {
   * "entityType": "FEATURE",
   * "entityId": "661e8511-f30c-41d4-a716-557788990000",
   * "title": "API Endpoints",
   * "usageDescription": "Definition of REST API endpoints",
   * "content": "{\\"endpoints\\": [{\\"path\\": \\"/api/auth\\", \\"method\\": \\"POST\\"}]}",
   * "contentFormat": "JSON",
   * "ordinal": 0
   * }
   * ```
   * 4. Add code sample:
   * ```json
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Authentication Handler",
   * "usageDescription": "Code for handling OAuth authentication",
   * "content": "fun authenticateUser(credentials: Credentials): Result<User> {\n // Implementation\n}",
   * "contentFormat": "CODE",
   * "ordinal": 2
   * }
   * ```
   * ## Common Section Types
   * While you can create sections with any title, common section types include:
   * - Requirements: Task or feature requirements (what needs to be done)
   * - Implementation Notes: Technical details on how to implement
   * - Testing Strategy: How to test the implementation
   * - Reference Information: External links and resources
   * - Architecture: Design and architecture details
   * - Dependencies: Dependencies on other components
   * ## Related Tools
   * - `get_sections`: Retrieve sections for a task or feature
   * - `update_section`: Modify an existing section
   * - `delete_section`: Remove a section
   * - `bulk_create_sections`: Create multiple sections at once (recommended when adding multiple
   * sections)
   * ## Efficiency Note
   * For efficiency and better performance, when you need to add multiple sections to the
   * same entity, use the `bulk_create_sections` tool instead. This reduces the number of
   * database operations and network calls, resulting in faster execution, especially when
   * dealing with multiple sections with shorter content.
   *
   * @param entityType Type of entity to attach this section to: 'PROJECT', 'TASK', or 'FEATURE'
   * @param entityId ID (UUID) of the project, task, or feature to add the section to (e.g.,
   *                 '550e8400-e29b-41d4-a716-446655440000')
   * @param title Section title (e.g., 'Requirements', 'Implementation Notes', 'Testing Plan')
   * @param usageDescription Description of how this section should be used by AI models or users
   * @param content The actual content of the section in the specified format
   * @param contentFormat? Format of the content: 'MARKDOWN' for formatted text, 'PLAIN_TEXT' for
   *                       unformatted text, 'JSON' for data, 'CODE' for source code
   * @param ordinal Order position (0-based). Lower numbers appear first when ordered.
   * @param tags? Comma-separated list of tags for categorization (e.g., 'documentation,frontend,api')
   */
  add_section(entityType: "PROJECT" | "FEATURE" | "TASK" | "TEMPLATE" | "SECTION", entityId: string, title: string, usageDescription: string, content: string, ordinal: number): Promise<CallResult>;
  // optional (2): contentFormat, tags

  /**
   * Retrieves sections for a task, feature, or project.
   * ## Purpose
   * Sections contain detailed content for tasks, features, and projects in a structured format.
   * Each section has a specific purpose, content format, and ordering position. This tool
   * allows retrieving all sections for a specified entity.
   * ## Parameters
   * | Parameter | Type | Required | Default | Description |
   * |-----------|------|----------|---------|-------------|
   * | entityType | string | Yes | - | Type of entity to retrieve sections for: 'PROJECT', 'TASK', or
   * 'FEATURE' |
   * | entityId | UUID string | Yes | - | ID of the entity to retrieve sections for (e.g.,
   * '550e8400-e29b-41d4-a716-446655440000') |
   * | includeContent | boolean | No | true | Whether to include section content. Set false to get only
   * metadata (saves 85-99% tokens) |
   * | sectionIds | array | No | all | Optional list of specific section IDs to retrieve. Allows
   * selective loading of sections |
   * ## Response Format
   * ### Success Response
   * ```json
   * {
   * "success": true,
   * "message": "Sections retrieved successfully",
   * "data": {
   * "sections": [
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Requirements",
   * "usageDescription": "Key requirements for this task",
   * "content": "1. Must support OAuth2\\n2. Handle token refresh\\n3. Implement rate limiting",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 0,
   * "tags": ["requirements", "security"],
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T14:30:00Z"
   * },
   * {
   * "id": "661f9511-f30c-52e5-b827-557766551111",
   * "title": "Implementation Notes",
   * "usageDescription": "Technical details and implementation guidance",
   * "content": "Use the AuthLib 2.0 library for OAuth implementation...",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 1,
   * "tags": ["implementation", "technical"],
   * "createdAt": "2025-05-10T14:35:00Z",
   * "modifiedAt": "2025-05-10T15:20:00Z"
   * }
   * ],
   * "entityType": "TASK",
   * "entityId": "772f9622-g41d-52e5-b827-668899101111",
   * "count": 2
   * }
   * }
   * ```
   * ### Empty Result Response
   * ```json
   * {
   * "success": true,
   * "message": "No sections found for task",
   * "data": {
   * "sections": [],
   * "entityType": "TASK",
   * "entityId": "772f9622-g41d-52e5-b827-668899101111",
   * "count": 0
   * }
   * }
   * ```
   * ## Error Responses
   * - RESOURCE_NOT_FOUND (404): When the specified task or feature doesn't exist
   * ```json
   * {
   * "success": false,
   * "message": "The specified task was not found",
   * "error": {
   * "code": "RESOURCE_NOT_FOUND"
   * }
   * }
   * ```
   * - VALIDATION_ERROR (400): When parameters fail validation
   * ```json
   * {
   * "success": false,
   * "message": "Invalid entity type: INVALID. Must be one of: TASK, FEATURE",
   * "error": {
   * "code": "VALIDATION_ERROR"
   * }
   * }
   * ```
   * - DATABASE_ERROR (500): When there's an issue retrieving sections from the database
   * - INTERNAL_ERROR (500): For unexpected system errors during execution
   * ## Usage Examples
   * 1. Get all sections with full content (default behavior):
   * ```json
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000"
   * }
   * ```
   * 2. Browse section structure without content (85-99% token savings):
   * ```json
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "includeContent": false
   * }
   * ```
   * Returns only: id, title, usageDescription, contentFormat, ordinal, tags
   * 3. Get specific sections by ID (selective loading):
   * ```json
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "sectionIds": ["section-id-1", "section-id-3"]
   * }
   * ```
   * 4. Two-step workflow - browse then fetch:
   * Step 1: Get section metadata
   * ```json
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "includeContent": false
   * }
   * ```
   * Step 2: Fetch specific sections with content
   * ```json
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "sectionIds": ["requirements-section-id", "testing-section-id"]
   * }
   * ```
   * ## Content Formats
   * Sections support multiple content formats:
   * - MARKDOWN: Formatted text with Markdown syntax (default)
   * - PLAIN_TEXT: Unformatted plain text
   * - JSON: Structured data in JSON format
   * - CODE: Source code and implementation details
   * ## Common Section Types
   * While you can create sections with any title, common section types include:
   * - Requirements: Task or feature requirements (what needs to be done)
   * - Implementation Notes: Technical details on how to implement
   * - Testing Strategy: How to test the implementation
   * - Reference Information: External links and resources
   * - Architecture: Design and architecture details
   * - Dependencies: Dependencies on other components
   *
   * @param entityType Type of entity to retrieve sections for: 'PROJECT', 'TASK', or 'FEATURE'
   * @param entityId ID of the entity to retrieve sections for (e.g.,
   *                 '550e8400-e29b-41d4-a716-446655440000')
   * @param includeContent? Whether to include section content. Set to false to retrieve only section
   *                        metadata (title, ordinal, format) without content, saving significant tokens.
   *                        Default: true
   * @param sectionIds? Optional list of specific section IDs to retrieve. If provided, only sections
   *                    with these IDs will be returned. Use with includeContent=false to first browse
   *                    available sections, then fetch specific ones.
   */
  get_sections(entityType: "PROJECT" | "FEATURE" | "TASK" | "TEMPLATE" | "SECTION", entityId: string /* UUID */, includeContent?: boolean, sectionIds?: string[]): Promise<CallResult>;

  /**
   * Updates an existing section by its ID.
   * ⚡ **EFFICIENCY TIP**: Only send fields you want to change! All fields except 'id' are optional.
   * For content-only changes, use 'update_section_text' (more efficient). Example: {"id": "uuid",
   * "title": "New Title"}
   * ## Efficient vs Inefficient Updates
   * ❌ **INEFFICIENT** (wastes ~300+ characters):
   * ```json
   * {
   * "id": "section-uuid",
   * "title": "Existing Title", // Unchanged - unnecessary
   * "usageDescription": "Existing description...", // Unchanged - unnecessary
   * "content": "Long existing content...", // Unchanged - 300+ chars wasted
   * "contentFormat": "MARKDOWN", // Unchanged - unnecessary
   * "ordinal": 0, // Unchanged - unnecessary
   * "tags": "tag1,tag2" // ✓ Only this changed
   * }
   * ```
   * ✅ **EFFICIENT** (uses ~40 characters):
   * ```json
   * {
   * "id": "section-uuid",
   * "tags": "tag1,tag2,tag3" // Only send what changed!
   * }
   * ```
   * **Token Savings**: 88% reduction by only sending changed fields!
   * ## Alternative Efficient Tools
   * - For content changes: Use `update_section_text` (90%+ more efficient)
   * - For metadata only: Use `update_section_metadata` (excludes content)
   * - For full replacement: Use this tool with selective fields
   *
   * @param id The unique ID of the section to update
   * @param title? (optional) New section title
   * @param usageDescription? (optional) New usage description for the section
   * @param content? (optional) New section content
   * @param contentFormat? (optional) New format of the content (MARKDOWN, PLAIN_TEXT, JSON, CODE)
   * @param ordinal? (optional) New display order position (0-based)
   * @param tags? (optional) Comma-separated list of new tags
   */
  update_section(id: string /* UUID */, title?: string, usageDescription?: string, content?: string, contentFormat?: "PLAIN_TEXT" | "MARKDOWN" | "JSON" | "CODE"): Promise<CallResult>;
  // optional (2): ordinal, tags

  /**
   * Deletes a section by its ID
   *
   * @param id The unique ID of the section to delete
   */
  delete_section(id: string /* UUID */): Promise<CallResult>;

  /**
   * Updates multiple sections in a single operation
   *
   * @param sections Array of sections to update
   */
  bulk_update_sections(sections: string[]): Promise<CallResult>;

  /**
   * Creates multiple sections in a single operation.
   * ## Purpose
   * This tool efficiently creates multiple sections for tasks, features, or projects in a single
   * operation.
   * PREFERRED over multiple `add_section` calls for efficiency and performance.
   * ## When to Use bulk_create_sections
   * **ALWAYS PREFER** for:
   * - Creating initial section sets for new tasks/features (3+ sections)
   * - Adding template-like section structures
   * - Sections with shorter content (< 500 characters each)
   * - Any scenario requiring multiple sections for the same entity
   * **Performance Benefits**:
   * - Single database transaction (atomic operation)
   * - Reduced network overhead (one API call vs multiple)
   * - Faster execution for multiple sections
   * - Better error handling (all succeed or fail together)
   * ## Common Section Creation Patterns
   * **Standard Task Documentation Set**:
   * ```json
   * {
   * "sections": [
   * {
   * "entityType": "TASK",
   * "entityId": "task-uuid",
   * "title": "Requirements",
   * "usageDescription": "Key requirements and acceptance criteria",
   * "content": "[List specific requirements and success criteria]",
   * "ordinal": 0,
   * "tags": "requirements,core"
   * },
   * {
   * "entityType": "TASK",
   * "entityId": "task-uuid",
   * "title": "Technical Approach",
   * "usageDescription": "Implementation strategy and architecture",
   * "content": "[Describe technical approach and key decisions]",
   * "ordinal": 1,
   * "tags": "technical,architecture"
   * },
   * {
   * "entityType": "TASK",
   * "entityId": "task-uuid",
   * "title": "Testing Strategy",
   * "usageDescription": "Testing approach and coverage requirements",
   * "content": "[Define testing strategy and success criteria]",
   * "ordinal": 2,
   * "tags": "testing,quality"
   * }
   * ]
   * }
   * ```
   * **Feature Planning Documentation**:
   * ```json
   * {
   * "sections": [
   * {
   * "entityType": "FEATURE",
   * "entityId": "feature-uuid",
   * "title": "Business Context",
   * "usageDescription": "Business value and user impact",
   * "content": "[Explain business need and user benefits]",
   * "ordinal": 0,
   * "tags": "business,context"
   * },
   * {
   * "entityType": "FEATURE",
   * "entityId": "feature-uuid",
   * "title": "Feature Specification",
   * "usageDescription": "Detailed feature requirements and behavior",
   * "content": "[Define feature scope and detailed requirements]",
   * "ordinal": 1,
   * "tags": "requirements,specification"
   * }
   * ]
   * }
   * ```
   * ## Section Organization Best Practices
   * **Ordinal Sequencing**:
   * - Start with ordinal 0 for the first section
   * - Use increments of 1 for tightly related sequences
   * - Leave gaps (0, 10, 20) when you might insert sections later
   * - Order logically: Context → Requirements → Implementation → Testing
   * **Content Format Selection**:
   * - **MARKDOWN**: Default for rich text, documentation, requirements
   * - **PLAIN_TEXT**: Simple text without formatting needs
   * - **JSON**: Structured data, API specs, configuration
   * - **CODE**: Implementation examples, code snippets
   * **Writing Markdown Content**:
   * **CRITICAL - Section Title Handling**:
   * - The `title` field becomes the section heading (rendered as ## H2 in markdown output)
   * - **DO NOT** duplicate the section title as a heading in the `content` field
   * - Content should start directly with the information, NOT with another heading
   * - For subsections within content, use ### (H3) or lower headings
   * **Markdown Formatting**:
   * - Use subsection headings: `### Subsection` (H3 or lower, never H2)
   * - Use lists: `- Item` or `1. Numbered`
   * - Use emphasis: `**bold**` or `*italic*`
   * - Use code: \`inline\` or \`\`\`kotlin code block\`\`\`
   * - Use links: `[text](url)`
   * **Example - WRONG (❌ Creates Duplicate Headings)**:
   * ```markdown
   * ## Requirements
   * - **Must** support OAuth 2.0
   * ```
   * *Problem: Title field "Requirements" + content heading "## Requirements" = duplicate*
   * **Example - CORRECT (✅ No Duplicate)**:
   * ```markdown
   * - **Must** support OAuth 2.0
   * - **Should** handle token refresh automatically
   * - See [OAuth spec](https://oauth.net/2/)
   * ```
   * *Correct: Title field "Requirements" provides the heading, content starts directly*
   * **Example - With Subsections (✅ Also Correct)**:
   * ```markdown
   * ### Current Behavior
   * The system currently...
   * ### Proposed Changes
   * - Change 1...
   * - Change 2...
   * ```
   * *Correct: Uses H3 for subsections, not H2*
   * **Tagging Strategy**:
   * - Use consistent tags across similar section types
   * - Include functional area: "requirements", "testing", "architecture"
   * - Add technical context: "api", "database", "frontend", "security"
   * - Mark importance: "core", "optional", "critical"
   * ## Integration with Templates
   * **Templates vs Manual Sections**:
   * - Templates provide standardized section structures automatically
   * - Use bulk_create_sections to supplement template sections with project-specific content
   * - Templates handle common patterns; bulk_create_sections handles custom needs
   * **Post-Template Enhancement**:
   * After applying templates, use bulk_create_sections to add:
   * - Project-specific context sections
   * - Additional technical details
   * - Custom workflow or process sections
   * - Domain-specific requirements or constraints
   * ## Parameters
   * | Parameter | Type | Required | Default | Description |
   * |-----------|------|----------|---------|-------------|
   * | sections | array | Yes | - | Array of section objects to create |
   * Each section object in the array must include:
   * | Field | Type | Required | Default | Description |
   * |-------|------|----------|---------|-------------|
   * | entityType | string | Yes | - | Type of entity: 'PROJECT', 'TASK', or 'FEATURE' |
   * | entityId | UUID string | Yes | - | ID of the project, task, or feature to add the section to |
   * | title | string | Yes | - | Section title (e.g., 'Requirements', 'Implementation Notes') |
   * | usageDescription | string | Yes | - | Description of how this section should be used |
   * | content | string | Yes | - | The actual content of the section |
   * | contentFormat | string | No | "MARKDOWN" | Format of the content: 'MARKDOWN', 'PLAIN_TEXT',
   * 'JSON', or 'CODE' |
   * | ordinal | integer | Yes | - | Order position (0-based). Lower numbers appear first. |
   * | tags | string | No | - | Comma-separated list of tags for categorization |
   * ## Response Format
   * ### Success Response (All Sections Created)
   * ```json
   * {
   * "success": true,
   * "message": "3 sections created successfully",
   * "data": {
   * "items": [
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "entityType": "task",
   * "entityId": "661f9511-f30c-52e5-b827-557766551111",
   * "title": "Requirements",
   * "contentFormat": "markdown",
   * "ordinal": 0,
   * "createdAt": "2025-05-10T14:30:00Z"
   * }
   * ],
   * "count": 3,
   * "failed": 0
   * }
   * }
   * ```
   * ## Error Responses
   * - VALIDATION_ERROR (400): When the input doesn't match the expected format or values are invalid
   * - OPERATION_FAILED (500): When all sections fail to create
   * - RESOURCE_NOT_FOUND (404): When an entity doesn't exist
   * ## Usage Examples
   * 1. Create multiple sections for a task:
   * ```json
   * {
   * "sections": [
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Requirements",
   * "usageDescription": "Key requirements for implementation",
   * "content": "1. Must support user authentication\n2. Should integrate with existing systems",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 0,
   * "tags": "requirements,core"
   * },
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Technical Approach",
   * "usageDescription": "Implementation strategy and technical details",
   * "content": "We'll use Spring Security for authentication and implement REST endpoints...",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 1,
   * "tags": "technical,implementation"
   * },
   * {
   * "entityType": "TASK",
   * "entityId": "550e8400-e29b-41d4-a716-446655440000",
   * "title": "Testing Strategy",
   * "usageDescription": "Test approach and coverage requirements",
   * "content": "Ensure 80% unit test coverage and implement integration tests for key flows",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 2,
   * "tags": "testing,quality"
   * }
   * ]
   * }
   * ```
   * 2. Create multiple sections for a project:
   * ```json
   * {
   * "sections": [
   * {
   * "entityType": "PROJECT",
   * "entityId": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Project Overview",
   * "usageDescription": "High-level description of the project",
   * "content": "This project aims to create a scalable infrastructure...",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 0,
   * "tags": "overview,documentation"
   * },
   * {
   * "entityType": "PROJECT",
   * "entityId": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Project Architecture",
   * "usageDescription": "Technical architecture details",
   * "content": "The project uses a modular architecture with the following components...",
   * "contentFormat": "MARKDOWN",
   * "ordinal": 1,
   * "tags": "architecture,technical"
   * }
   * ]
   * }
   * ```
   * ## Performance Benefits
   * Using `bulk_create_sections` instead of multiple calls to `add_section` offers significant
   * advantages:
   * 1. Reduced network overhead: Only one API call instead of multiple calls
   * 2. Improved transaction efficiency: Database operations are batched
   * 3. Faster execution: Creating multiple sections in parallel
   * 4. Atomic operations: All sections succeed or useful error information is provided
   * ## Common Section Combinations
   * Typical section combinations for tasks include:
   * 1. Requirements + Implementation Approach + Testing Strategy
   * 2. Problem Statement + Solution Design + Acceptance Criteria
   * 3. Context + Technical Details + References
   *
   * @param sections Array of sections to create
   */
  bulk_create_sections(sections: string[]): Promise<CallResult>;

  /**
   * Deletes multiple sections in a single operation
   *
   * @param ids Array of section IDs to delete
   * @param hardDelete? Whether to permanently delete the sections (true) or soft delete them (false)
   */
  bulk_delete_sections(ids: string[], hardDelete?: boolean): Promise<CallResult>;

  /**
   * Updates specific text within a section without requiring the entire content.
   * This tool allows changing portions of section content by providing the text to replace
   * and its replacement.
   * ## Context Efficiency Strategy
   * **PREFERRED** for targeted content updates in large sections:
   * - Only send the specific text segment to replace and its replacement
   * - Much more efficient than sending entire content for small changes
   * - Ideal for correcting typos, updating specific paragraphs, or modifying parts of documentation
   * - Significantly reduces token usage compared to full content updates
   * **When to Use**:
   * - Correcting typos in template-generated content
   * - Updating specific values or references within larger documentation
   * - Making incremental improvements to existing sections
   * - Modifying parts of sections without affecting the overall structure
   * **Usage Examples**:
   * - Fixing typos: `oldText: "straegy"` → `newText: "strategy"`
   * - Updating references: `oldText: "version 1.0"` → `newText: "version 2.0"`
   * - Modifying template placeholders: `oldText: "[Insert details here]"` → `newText: "Actual
   * implementation details"`
   * **Compared to Other Update Tools**:
   * - Use `update_section_text` for content changes (most efficient for partial updates)
   * - Use `update_section_metadata` for title, format, ordinal, or tag changes
   * - Use `update_section` for complete content replacement (less efficient)
   * Parameters:
   * - id (required): UUID of the section to update
   * - oldText (required): The text segment to be replaced (must match exactly)
   * - newText (required): The new text to replace the matched segment with
   * Validation Rules:
   * - Section must exist
   * - Old text must exist in the section content
   * - Both oldText and newText parameters must be provided
   *
   * @param id The unique ID of the section to update
   * @param oldText The text segment to be replaced (must match exactly)
   * @param newText The new text to replace the matched segment with
   */
  update_section_text(id: string /* UUID */, oldText: string, newText: string): Promise<CallResult>;

  /**
   * Updates a section's metadata (title, usage description, format, ordinal, tags)
   * without affecting its content.
   * This tool allows you to update specific metadata fields without having to provide
   * the entire section content, which is more efficient for context usage.
   * Parameters:
   * - id (required): UUID of the section to update
   * - title (optional): New section title
   * - usageDescription (optional): New usage description for the section
   * - contentFormat (optional): New format of the content
   * - ordinal (optional): New display order position (0-based)
   * - tags (optional): Comma-separated list of new tags
   * Validation Rules:
   * - Section must exist
   * - Parent template must not be protected
   * - Title must not be empty if provided
   * - Ordinal must be a non-negative integer
   *
   * @param id The unique ID of the section to update
   * @param title? New section title
   * @param usageDescription? New usage description for the section
   * @param contentFormat? New format of the content (MARKDOWN, PLAIN_TEXT, JSON, CODE)
   * @param ordinal? New display order position (0-based)
   * @param tags? Comma-separated list of new tags
   */
  update_section_metadata(id: string /* UUID */, title?: string, usageDescription?: string, contentFormat?: "PLAIN_TEXT" | "MARKDOWN" | "JSON" | "CODE", ordinal?: number): Promise<CallResult>;
  // optional (1): tags

  /**
   * Reorders sections within a template or other entity.
   * This tool changes the display order of sections by updating their ordinal values.
   * This is useful for reorganizing content without having to send the content itself,
   * which is more efficient for context usage.
   * Parameters:
   * - entityType (required): Type of entity (TEMPLATE, TASK, FEATURE)
   * - entityId (required): ID of the entity
   * - sectionOrder (required): New order of section IDs
   * Validation Rules:
   * - Entity must exist
   * - All sections must exist and belong to the entity
   * - All sections of the entity must be included
   *
   * @param entityType Type of entity (TEMPLATE, TASK, FEATURE)
   * @param entityId ID of the entity
   * @param sectionOrder Comma-separated list of section IDs in the desired order
   */
  reorder_sections(entityType: "TEMPLATE" | "TASK" | "FEATURE", entityId: string /* UUID */, sectionOrder: string): Promise<CallResult>;

  /**
   * Creates a new template with required and optional fields.
   * Templates provide reusable patterns for structuring task and feature documentation.
   * Each template has metadata and can contain multiple section definitions.
   * Example successful response:
   * {
   * "success": true,
   * "message": "Template created successfully",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "name": "User Authentication",
   * "description": "Implement secure user authentication system",
   * "targetEntityType": "TASK",
   * "isBuiltIn": false,
   * "isProtected": false,
   * "isEnabled": true,
   * "createdBy": "Claude",
   * "tags": ["security", "login", "user-management"],
   * "createdAt": "2025-05-10T14:30:00Z",
   * "modifiedAt": "2025-05-10T14:30:00Z"
   * }
   * }
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation
   * - CONFLICT_ERROR: When a template with the same name already exists
   * - DATABASE_ERROR: When there's an issue storing the template
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param name Required template name (e.g., 'User Authentication', 'Data Export')
   * @param description Required template description explaining its purpose and scope
   * @param targetEntityType Type of entity this template is for: 'TASK' or 'FEATURE'
   * @param isBuiltIn? Whether this is a built-in template (default: false)
   * @param isProtected? Whether this template is protected from modification (default: false)
   * @param isEnabled? Whether this template is enabled for use (default: true)
   * @param createdBy? Optional creator identifier (default: null)
   * @param tags? Comma-separated list of tags for categorization (e.g., 'frontend,ui,critical')
   */
  create_template(name: string, description: string, targetEntityType: "TASK" | "FEATURE", isBuiltIn?: boolean, isProtected?: boolean): Promise<CallResult>;
  // optional (3): isEnabled, createdBy, tags

  /**
   * Retrieve a complete template by ID with options for including sections
   *
   * @param id The unique ID of the template to retrieve
   * @param includeSections? Whether to include sections in the response
   */
  get_template(id: string /* UUID */, includeSections?: boolean): Promise<CallResult>;

  /**
   * Apply one or more templates to create sections for a task or feature.
   * ## Purpose
   * Templates provide standardized structure for task and feature documentation.
   * This tool applies templates to an entity, creating sections based on template section definitions.
   * ## Template Application Strategies
   * **Multiple Template Support**:
   * - Apply multiple templates in single operation using templateIds array
   * - Templates applied in array order (later templates' sections appear after earlier ones)
   * - Use single-item array for one template: ["template-uuid"]
   * - Use multiple templates for comprehensive coverage: ["uuid1", "uuid2", "uuid3"]
   * **Template Combination Patterns**:
   * The template system is organized into composable categories:
   * **AI Workflow Instructions** (process guidance):
   * - Local Git Branching Workflow, GitHub PR Workflow
   * - Task Implementation Workflow, Bug Investigation Workflow
   * **Documentation Properties** (information capture):
   * - Technical Approach, Requirements Specification, Context & Background
   * **Process & Quality** (standards and completion):
   * - Testing Strategy, Definition of Done
   * **Recommended Combinations**:
   * - **Development Task**: Technical Approach + Task Implementation Workflow + Testing Strategy
   * - **Bug Fix**: Bug Investigation Workflow + Technical Approach + Definition of Done
   * - **Feature Planning**: Requirements Specification + Context & Background + Testing Strategy
   * - **Complex Implementation**: Technical Approach + Local Git Branching + GitHub PR + Definition of
   * Done
   * ## Context Efficiency Techniques
   * **ALWAYS PREFER** direct creation with templates over separate operations:
   * ```
   * // EFFICIENT
   * create_task(title: "X", templateIds: ["Y"])
   * // LESS EFFICIENT
   * id = create_task(title: "X")
   * apply_template(entityId: id, templateIds: ["Y"])
   * ```
   * **Multiple Templates in One Call**:
   * ```
   * // EFFICIENT
   * apply_template(entityId: id, templateIds: ["A", "B", "C"])
   * // LESS EFFICIENT
   * apply_template(entityId: id, templateIds: ["A"])
   * apply_template(entityId: id, templateIds: ["B"])
   * apply_template(entityId: id, templateIds: ["C"])
   * ```
   * **Template Sequence Optimization**:
   * 1. Start with Context: Context & Background, Requirements Specification
   * 2. Add Technical Detail: Technical Approach for implementation guidance
   * 3. Include Process Guidance: Task Implementation, Bug Investigation workflows
   * 4. Add Git Workflow: Local Git Branching, GitHub PR workflows
   * 5. Ensure Quality: Testing Strategy, Definition of Done
   * You can apply one or more templates by providing a templateIds array parameter.
   * Use a single-item array for applying just one template.
   * Example successful response for a single template:
   * {
   * "success": true,
   * "message": "Template applied successfully, created 3 sections",
   * "data": {
   * "templateId": "550e8400-e29b-41d4-a716-446655440000",
   * "entityType": "TASK",
   * "entityId": "661e8511-f30c-41d4-a716-557788990000",
   * "sectionsCreated": 3,
   * "sections": [
   * {
   * "id": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Requirements",
   * "ordinal": 0
   * },
   * {
   * "id": "882f9733-h52e-63f6-c938-779900212222",
   * "title": "Implementation Notes",
   * "ordinal": 1
   * },
   * {
   * "id": "993f0844-i63f-74g7-d049-8800a1323333",
   * "title": "Testing Strategy",
   * "ordinal": 2
   * }
   * ]
   * }
   * }
   * Example successful response for multiple templates:
   * {
   * "success": true,
   * "message": "Applied 2 templates successfully, created 5 sections",
   * "data": {
   * "entityType": "TASK",
   * "entityId": "661e8511-f30c-41d4-a716-557788990000",
   * "totalSectionsCreated": 5,
   * "appliedTemplates": [
   * {
   * "templateId": "550e8400-e29b-41d4-a716-446655440000",
   * "sectionsCreated": 3,
   * "sections": [
   * {
   * "id": "772f9622-g41d-52e5-b827-668899101111",
   * "title": "Requirements",
   * "ordinal": 0
   * },
   * {
   * "id": "882f9733-h52e-63f6-c938-779900212222",
   * "title": "Implementation Notes",
   * "ordinal": 1
   * },
   * {
   * "id": "993f0844-i63f-74g7-d049-8800a1323333",
   * "title": "Testing Strategy",
   * "ordinal": 2
   * }
   * ]
   * },
   * {
   * "templateId": "661e8511-f30c-41d4-a716-557788990000",
   * "sectionsCreated": 2,
   * "sections": [
   * {
   * "id": "772f9622-g41d-52e5-b827-668899101112",
   * "title": "Design Documentation",
   * "ordinal": 3
   * },
   * {
   * "id": "882f9733-h52e-63f6-c938-779900212223",
   * "title": "Related Tasks",
   * "ordinal": 4
   * }
   * ]
   * }
   * ]
   * }
   * }
   * For template application patterns and strategies, see:
   * task-orchestrator://guidelines/template-strategy
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation
   * - RESOURCE_NOT_FOUND: When the template or entity doesn't exist
   * - DATABASE_ERROR: When there's an issue applying the template
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param templateIds List of template IDs to apply. Use a single-item array for applying just one
   *                    template.
   * @param entityType Type of entity (TASK or FEATURE)
   * @param entityId ID of the entity to apply the template to
   */
  apply_template(templateIds: string[], entityType: "TASK" | "FEATURE", entityId: string /* UUID */): Promise<CallResult>;

  /**
   * Retrieve a list of templates with optional filtering.
   * ## Purpose
   * CRITICAL for template-driven workflow: Always check available templates before creating
   * tasks or features to ensure consistent documentation structure and comprehensive coverage.
   * ## Template System Overview
   * The system provides focused, composable templates organized into categories:
   * **AI Workflow Instructions** (process guidance):
   * - Local Git Branching Workflow: Step-by-step git workflow with MCP tool integration
   * - GitHub PR Workflow: Complete PR creation and management process
   * - Task Implementation Workflow: Structured implementation approach
   * - Bug Investigation Workflow: Systematic bug analysis and resolution
   * **Documentation Properties** (information capture):
   * - Technical Approach: Architecture and implementation strategy
   * - Requirements Specification: Detailed requirements and acceptance criteria
   * - Context & Background: Project context and background information
   * **Process & Quality** (standards and completion):
   * - Testing Strategy: Comprehensive testing approach and coverage
   * - Definition of Done: Clear completion criteria and quality gates
   * ## Usage Patterns
   * **RECOMMENDED WORKFLOW**:
   * 1. Run `list_templates` with targetEntityType filter (TASK or FEATURE)
   * 2. Identify templates from multiple categories for comprehensive coverage
   * 3. Apply templates during create_task/create_feature using templateIds parameter
   * 4. Use template combinations: Workflow + Documentation + Quality
   * ## Template Selection Strategy
   * **For Implementation Tasks**:
   * - Technical Approach + Task Implementation Workflow + Testing Strategy
   * **For Bug Fixes**:
   * - Bug Investigation Workflow + Technical Approach + Definition of Done
   * **For Complex Features**:
   * - Requirements Specification + Technical Approach + Local Git Branching + Testing Strategy
   * **For Feature Planning**:
   * - Context & Background + Requirements Specification + Testing Strategy
   * ## Filtering Best Practices
   * - Filter by targetEntityType to match your creation needs (TASK vs FEATURE)
   * - Use isEnabled=true to only see available templates
   * - Filter by tags to find domain-specific templates ("authentication", "api", "testing")
   * - Built-in templates (isBuiltIn=true) provide proven workflow patterns
   * ## Context Efficiency
   * Templates are designed for modular composition rather than monolithic coverage:
   * - Small, focused templates (3-4 sections each) reduce cognitive overhead
   * - Composable design allows mixing based on specific needs
   * - Category-based organization helps with systematic selection
   * Example successful response:
   * {
   * "success": true,
   * "message": "Retrieved 8 templates",
   * "data": {
   * "templates": [
   * {
   * "id": "workflow-uuid-001",
   * "name": "Task Implementation Workflow",
   * "description": "Step-by-step implementation guidance with MCP tool integration",
   * "targetEntityType": "TASK",
   * "isBuiltIn": true,
   * "isProtected": true,
   * "isEnabled": true,
   * "tags": ["workflow", "implementation", "process"]
   * },
   * {
   * "id": "tech-uuid-002",
   * "name": "Technical Approach",
   * "description": "Architecture and implementation strategy documentation",
   * "targetEntityType": "TASK",
   * "isBuiltIn": true,
   * "isProtected": true,
   * "isEnabled": true,
   * "tags": ["technical", "architecture", "documentation"]
   * },
   * {
   * "id": "test-uuid-003",
   * "name": "Testing Strategy",
   * "description": "Comprehensive testing approach and coverage requirements",
   * "targetEntityType": "TASK",
   * "isBuiltIn": true,
   * "isProtected": true,
   * "isEnabled": true,
   * "tags": ["testing", "quality", "coverage"]
   * }
   * ],
   * "count": 8,
   * "filters": {
   * "targetEntityType": "TASK",
   * "isBuiltIn": "Any",
   * "isEnabled": "true",
   * "tags": "Any"
   * }
   * }
   * }
   * For template discovery patterns and selection strategies, see:
   * task-orchestrator://guidelines/template-strategy
   * Common error responses:
   * - VALIDATION_ERROR: When targetEntityType is not TASK or FEATURE
   * - DATABASE_ERROR: When there's an issue retrieving templates
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param targetEntityType? Filter by entity type (TASK or FEATURE)
   * @param isBuiltIn? Filter for built-in templates only
   * @param isEnabled? Filter for enabled templates only
   * @param tags? Filter by tags (comma-separated)
   */
  list_templates(targetEntityType?: "TASK" | "FEATURE", isBuiltIn?: boolean, isEnabled?: boolean, tags?: string): Promise<CallResult>;

  /**
   * Add a section to a template.
   * Templates define a structured documentation pattern with multiple sections.
   * This tool adds a section definition to a template, which will be created
   * when the template is applied to tasks or features.
   * Example successful response:
   * {
   * "success": true,
   * "message": "Template section added successfully",
   * "data": {
   * "id": "550e8400-e29b-41d4-a716-446655440000",
   * "templateId": "661e8511-f30c-41d4-a716-557788990000",
   * "title": "Implementation Steps",
   * "usageDescription": "Detailed steps to implement this task",
   * "contentSample": "1. First step\\n2. Second step\\n3. Third step",
   * "contentFormat": "markdown",
   * "ordinal": 1,
   * "isRequired": true,
   * "tags": ["implementation", "steps"]
   * }
   * }
   * Common error responses:
   * - VALIDATION_ERROR: When provided parameters fail validation
   * - RESOURCE_NOT_FOUND: When the template doesn't exist
   * - DATABASE_ERROR: When there's an issue storing the section
   * - INTERNAL_ERROR: For unexpected system errors
   *
   * @param templateId The unique ID of the template to add the section to
   * @param title Section title (e.g., 'Requirements', 'Implementation Notes', 'Testing Plan')
   * @param usageDescription Description of how this section should be used by AI models or users
   * @param contentSample Sample content that will be used when creating from the template
   * @param contentFormat? Format of the content
   * @param ordinal Order position (0-based). Lower numbers appear first when ordered.
   * @param isRequired? Whether this section is required when applying the template
   * @param tags? Comma-separated list of tags for categorization
   */
  add_template_section(templateId: string /* UUID */, title: string, usageDescription: string, contentSample: string, ordinal: number): Promise<CallResult>;
  // optional (3): contentFormat, isRequired, tags

  /**
   * Updates a template's metadata (name, description, tags, etc.)
   * without affecting its sections. Protected templates cannot be updated.
   * This tool allows you to update specific metadata fields without having to provide
   * the entire template content, which is more efficient for context usage.
   * Parameters:
   * - id (required): UUID of the template to update
   * - name (optional): New template name
   * - description (optional): New template description
   * - targetEntityType (optional): New target entity type (TASK, FEATURE)
   * - isEnabled (optional): Whether the template is enabled
   * - tags (optional): Comma-separated list of new tags
   * Validation Rules:
   * - Template must exist
   * - Protected templates cannot be updated
   * - Name must not be empty if provided
   * - No name conflict with existing templates
   *
   * @param id The unique ID of the template to update
   * @param name? New template name
   * @param description? New template description
   * @param targetEntityType? New target entity type (TASK, FEATURE)
   * @param isEnabled? Whether the template is enabled
   * @param tags? Comma-separated list of new tags
   */
  update_template_metadata(id: string /* UUID */, name?: string, description?: string, targetEntityType?: "TASK" | "FEATURE", isEnabled?: boolean): Promise<CallResult>;
  // optional (1): tags

  /**
   * Deletes a user-created template. Built-in templates cannot be deleted.
   * Parameters:
   * - id (required): UUID of the template to delete
   * - force (optional): Boolean flag to override protection, defaults to false
   * Validation Rules:
   * - Template must exist
   * - Built-in templates cannot be deleted
   * - If a user attempts to delete a built-in template, they will get back an error message
   * instructing them to use 'disable_template' instead
   * Example:
   * ```json
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000"
   * }
   * ```
   *
   * @param id The unique ID of the template to delete
   * @param force? Whether to override protection (use with caution)
   */
  delete_template(id: string /* UUID */, force?: boolean): Promise<CallResult>;

  /**
   * Enables a previously disabled template, making it available for use again.
   * Parameters:
   * - id (required): UUID of the template to enable
   * Validation Rules:
   * - Template must exist
   * Example:
   * ```json
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000"
   * }
   * ```
   *
   * @param id The unique ID of the template to enable
   */
  enable_template(id: string /* UUID */): Promise<CallResult>;

  /**
   * Disables a template including system templates. Disabled templates are not available for use.
   * Parameters:
   * - id (required): UUID of the template to disable
   * Validation Rules:
   * - Template must exist
   * Example:
   * ```json
   * {
   * "id": "550e8400-e29b-41d4-a716-446655440000"
   * }
   * ```
   *
   * @param id The unique ID of the template to disable
   */
  disable_template(id: string /* UUID */): Promise<CallResult>;
}

