# AGENTS.md

> **Codex control file** · VS Code “Research OS” fork
> Last updated: **08 Jul 2025**

---

## 1 · Mission ❯  *One-liner for the agent*

Transform this repo into a **privacy-first research IDE** by:

1. **Pruning** unneeded VS Code layers & built-in extensions.
2. **Adding** the Research-OS modules (Knowledge Graph, Agent System, Canvas View, etc.).
3. Shipping a runnable MVP (CLI & packaged app) with **zero human prompts**.

---

## 2 · Project Map ❯  *High-level folder roles*

```
core/                 # Forked VS Code-OSS source
  ├─ vscode-oss/      # Upstream + patches
  ├─ extension-host/  # Custom sandbox runtime
  └─ ui-framework/    # Shared React/TS components
modules/              # Feature slices (added below)
  ├─ knowledge-graph/
  ├─ agent-system/
  ├─ file-manager/
  └─ canvas-view/
integrations/         # Bridges → CopilotChat, local-LLMs, Zotero …
extensions/           # Built-in vs community bundles
config/               # JSON/YAML defaults → privacy, theming
scripts/              # Dev/CI helpers
```

---

## 3 · Environment ❯  *Setup once, reuse everywhere*

| Tool           | Version | Install cmd                                                  |
| -------------- | ------- | ------------------------------------------------------------ |
| **Node.js**    | 20 LTS  | `fnm install 20`                                             |
| **Yarn**       | 4.2     | `corepack enable && corepack prepare yarn@stable --activate` |
| **PNPM**       | 9       | `npm i -g pnpm`                                              |
| **Python**     | 3.11    | `pyenv install 3.11.8`                                       |
| **Playwright** | latest  | `pnpm exec playwright install`                               |

### 3.1 Setup script

```bash
scripts/setup.sh
├─ pnpm install --filter "..."          # monorepo deps
├─ pnpm build vscode-oss                # patch & compile core
└─ pnpm run postinstall                 # link binaries, git hooks
```

*Abort the job* if `setup.sh` takes >150 s ➜ request maintainer input.

---

## 4 · Build & Test

| Action                        | Command                      |
| ----------------------------- | ---------------------------- |
| **Dev watch**                 | `pnpm dev` (electron reload) |
| **Headless tests**            | `pnpm test`                  |
| **End-to-end**                | `pnpm e2e` (Playwright)      |
| **Package (Win/macOS/Linux)** | `pnpm build:desktop`         |

*Fail the pipeline* if tests <95 % pass rate or coverage <85 %.

---

## 5 · Coding Conventions

* TypeScript strict mode, ES2022 modules.
* Functional React + hooks; no class components.
* ESLint + Prettier → Airbnb TS config.
* **Logger** → `src/lib/logger.ts`; never `console.log`.
* Respect the **Privacy Layer**: NO calls leaving `localhost` unless `process.env.ALLOW_NET` is `true`.

---

## 6 · Extension Policy

### 6.1 Keep ONLY these built-ins

```
- vscode.git
- vscode.markdown-language-features
- vscode.emmet
- vscode.search-result
- vscode.debug
```

### 6.2 Tasks

| Task ID                    | Goal                                               |
| -------------------------- | -------------------------------------------------- |
| `prune_default_extensions` | Remove every `/extensions/**` not in list 6.1      |
| `add_pdf_viewer`           | Bundle modified `vscode-pdf` with annotation hooks |
| `add_canvas_view`          | Register WebView panel → modules/canvas-view       |
| `wire_local_llm`           | Expose `localhost:11434` ↔ Agent System            |

Run tasks **in order**; each must leave repo in green-test state.

---

## 7 · Smart Agents

```jsonc
{
  "summarizer": {
    "model": "o4-mini",
    "triggers": ["*.pdf", "*.html"],
    "actions": ["generate-summary", "extract-key-points"]
  },
  "connection-finder": {
    "model": "local-embedding",
    "background": true,
    "actions": ["find-related-docs", "suggest-readings"]
  }
}
```

*Store runtime config* in `modules/agent-system/agents.json`.

---

## 8 · Do **NOT**

* Touch `/scripts/release/**` without explicit maintainer comment.
* Add new npm deps >1 MB unpacked without pre-approval.
* Commit secrets, telemetry, or tracker code.
* Edit files under `extensions/generated/**` (auto-build).

---

## 9 · Interaction Guidelines for Codex

* Assume **non-interactive** execution; request human input only on build failure.
* If diff >500 lines in any file, open a PR titled `large-patch/<task-name>` and halt.
* Prefer applying **patch sets** (`git apply -`) over ad-hoc file rewrites.
* Always run `pnpm lint && pnpm test` before proposing a merge.

---

## 10 · CI / CD hooks (GitHub Actions)

* Workflow file ➜ `.github/workflows/build.yml`.
* Jobs: **setup → lint → test → build-artifact**.
* On `main` success: upload desktop bundle to *GitHub Releases* (draft).

---

## 11 · Forward Plan

1. **Phase 0** (🎯 *this job*): prune built-ins + ship MVP modules.
2. **Phase 1**: knowledge-graph visualiser + enhanced file explorer.
3. **Phase 2**: cloud sync & collaboration (optional).

---
# ChatGPT Codex Autonomous Agent Documentation

## Overview
This document provides comprehensive instructions for setting up ChatGPT Codex to work autonomously on the Research VS Code project with minimal human intervention.

## Current Status (July 2025)
- **Codex Availability**: Available to ChatGPT Plus users as of June 3, 2025
- **Model**: Powered by codex-1 (fine-tuned version of OpenAI o3)
- **Access**: Through ChatGPT sidebar interface and Codex CLI

## ChatGPT Plus Limits & Capabilities

### Message Limits (As of July 2025)
- **GPT-4o**: ~150 messages per 3 hours
- **o3 model**: 100 messages per week (doubled from 50 in April 2025)
- **o4-mini-high**: 100 messages per day (for coding tasks)
- **Codex Tasks**: Generous preview period, then rate-limited

### Codex Specific Features
- **Parallel Task Execution**: Multiple agents can work simultaneously
- **Cloud Sandbox**: Each task runs in isolated environment
- **Repository Integration**: Direct GitHub connection
- **Internet Access**: Enabled for research during task execution
- **Task Duration**: 1-30 minutes depending on complexity

## Agent Configuration

### Primary Research VSCode Agent
```yaml
name: "Research-VSCode-Builder"
type: "autonomous-codex-agent"
model: "codex-1"
capabilities:
  - repository_management
  - code_generation
  - dependency_resolution
  - documentation_writing
  - testing_automation
  - architecture_design

tasks:
  setup_project:
    description: "Initialize Research VSCode project structure"
    subtasks:
      - "Create project directory structure as specified"
      - "Set up TypeScript/JavaScript configuration"
      - "Initialize package.json with required dependencies"
      - "Create base VS Code extension structure"
    
  integrate_vscode_oss:
    description: "Integrate Code-OSS into the project"
    subtasks:
      - "Clone Code-OSS repository"
      - "Strip unnecessary features for performance"
      - "Modify UI for research-focused interface"
      - "Create custom activity bar items"
    
  implement_core_features:
    description: "Build core research features"
    subtasks:
      - "Implement enhanced file explorer with card/timeline views"
      - "Create PDF viewer with annotation capabilities"
      - "Build knowledge graph visualization module"
      - "Develop agent system architecture"
      - "Create privacy layer for local-first approach"
    
  integrate_tools:
    description: "Integrate open-source research tools"
    subtasks:
      - "Add Zotero connector for citations"
      - "Integrate Draw.io for diagramming"
      - "Add Jupyter notebook support"
      - "Implement Hypothesis web annotation"
      - "Create unified UI theme system"
```

### Supporting Agents

#### Code Quality Agent
```yaml
name: "Code-Quality-Enforcer"
triggers:
  - on_commit
  - on_pull_request
tasks:
  - "Run ESLint/Prettier on all code"
  - "Execute unit tests"
  - "Check TypeScript types"
  - "Validate module boundaries"
  - "Generate code coverage reports"
```

#### Documentation Agent
```yaml
name: "Documentation-Generator"
triggers:
  - on_feature_complete
  - on_api_change
tasks:
  - "Generate API documentation"
  - "Update README files"
  - "Create user guides"
  - "Document configuration options"
  - "Generate architecture diagrams"
```

#### Performance Monitor Agent
```yaml
name: "Performance-Optimizer"
schedule: "daily"
tasks:
  - "Profile application startup time"
  - "Analyze bundle sizes"
  - "Check memory usage patterns"
  - "Identify performance bottlenecks"
  - "Suggest optimization strategies"
```

## Autonomous Workflow Instructions

### Phase 1: Project Setup (Week 1)
```markdown
INSTRUCTION SET FOR CODEX:

1. Initialize the research-vscode repository with the following structure:
   ```
   research-vscode/
   ├── core/
   │   ├── vscode-oss/
   │   ├── extension-host/
   │   └── ui-framework/
   ├── modules/
   │   ├── knowledge-graph/
   │   ├── agent-system/
   │   ├── file-manager/
   │   └── canvas-view/
   ├── integrations/
   │   ├── copilot-bridge/
   │   ├── llm-connectors/
   │   └── tool-adapters/
   └── config/
   ```

2. Set up development environment:
   - Node.js 20.x configuration
   - TypeScript 5.x with strict mode
   - Webpack configuration for modular builds
   - Jest for testing framework

3. Create base extension manifest with research-focused capabilities
```

### Phase 2: Core Integration (Week 2-3)
```markdown
INSTRUCTION SET FOR CODEX:

1. Code-OSS Integration:
   - Clone microsoft/vscode repository
   - Extract only essential components:
     - Monaco Editor
     - Extension API
     - File system abstractions
     - Theme system
   - Remove unnecessary features:
     - Telemetry
     - Microsoft-specific integrations
     - Unused language servers

2. Custom UI Implementation:
   - Replace activity bar with research-focused items
   - Implement card-based file explorer
   - Add timeline view for research progress
   - Create split-panel layout system

3. Privacy Layer:
   - Implement local-first storage using SQLite
   - Create encryption layer for sensitive data
   - Build offline mode capabilities
   - Add privacy settings interface
```

### Phase 3: Feature Development (Week 4-6)
```markdown
INSTRUCTION SET FOR CODEX:

1. PDF Management System:
   - Integrate PDF.js for rendering
   - Build annotation layer with persistence
   - Create text extraction pipeline
   - Implement citation detection

2. Knowledge Graph:
   - Use D3.js for visualization
   - Implement node/edge data model
   - Create automatic relationship detection
   - Build interactive navigation

3. Agent System:
   - Create agent runtime environment
   - Implement message passing system
   - Build agent marketplace structure
   - Create sandboxing for untrusted agents

4. LLM Integration:
   - Build abstraction layer for multiple LLMs
   - Implement local Ollama connector
   - Create OpenAI API bridge (optional)
   - Build conversation management system
```

### Phase 4: Tool Integration (Week 7-8)
```markdown
INSTRUCTION SET FOR CODEX:

1. Research Tool Adapters:
   - Zotero: Bibliography management
   - Obsidian: Note-taking features
   - Draw.io: Diagram editor
   - Jupyter: Computational notebooks

2. Unified Interface:
   - Create consistent theme system
   - Build tool switching mechanism
   - Implement shared toolbar
   - Create unified search across tools
```

## Prompting Strategies for Autonomous Operation

### Initial Setup Prompt
```
You are building a research-focused VS Code fork called Research VSCode. This is a self-hosted, privacy-first application that integrates multiple open-source tools into a unified research environment.

Key requirements:
1. Performance: Optimize for speed and minimal resource usage
2. Privacy: All data stays local by default, optional sync
3. Modularity: Each feature should be independently loadable
4. Extensibility: Support for custom agents and extensions

Begin by setting up the project structure and core build system. Focus on creating a solid foundation that other features can build upon.
```

### Continuous Development Prompt
```
Continue developing Research VSCode. Check the current project state, identify incomplete features, and work on the next priority item. Follow these principles:

1. Write clean, well-documented code
2. Create tests for all new features
3. Ensure backward compatibility
4. Optimize for performance
5. Maintain privacy-first approach

If you encounter blockers, document them and move to the next task.
```

### Quality Assurance Prompt
```
Review the Research VSCode codebase for:
1. Code quality issues
2. Performance bottlenecks
3. Security vulnerabilities
4. Missing documentation
5. Incomplete features

Fix any issues found and create a report of changes made.
```

## Error Recovery & Monitoring

### Common Issues & Solutions

1. **Rate Limit Reached**
   - Switch to different model (o4-mini for simpler tasks)
   - Queue tasks for later execution
   - Use batching for similar operations

2. **Complex Tasks Timing Out**
   - Break into smaller subtasks
   - Use checkpoint system
   - Implement progressive enhancement

3. **Integration Conflicts**
   - Use dependency isolation
   - Implement adapter pattern
   - Create compatibility layers

## Best Practices for Autonomous Operation

1. **Task Decomposition**
   - Break large features into <30 min tasks
   - Create clear success criteria
   - Use iterative development

2. **Testing Strategy**
   - Write tests before implementation
   - Use TDD for critical features
   - Automate regression testing

3. **Documentation**
   - Generate docs as code is written
   - Keep README files updated
   - Create user guides automatically

4. **Performance Monitoring**
   - Profile after each major feature
   - Track bundle sizes
   - Monitor memory usage

## Progress Tracking

### Metrics to Monitor
- Lines of code written
- Test coverage percentage
- Build time
- Bundle size
- Number of features completed
- Documentation coverage

### Reporting Template
```markdown
## Daily Progress Report

### Completed Tasks
- [x] Task 1 description
- [x] Task 2 description

### In Progress
- [ ] Current task (X% complete)

### Blockers
- Issue description and attempted solutions

### Next Steps
- Planned tasks for tomorrow

### Metrics
- Code written: X lines
- Tests added: X
- Coverage: X%
- Build time: Xs
```

## API Integration for Monitoring

For programmatic monitoring, you can use the OpenAI API directly:

```bash
# Set up API key
export OPENAI_API_KEY="your-api-key"

# Monitor usage
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Conclusion

This autonomous agent setup allows ChatGPT Codex to work independently on building the Research VSCode project. With proper task decomposition and clear instructions, the system can make significant progress with minimal human intervention.

Remember to:
- Check progress daily
- Refine prompts based on results
- Monitor usage to stay within limits
- Review and test generated code
- Maintain security best practices

The generous preview period for Plus users provides ample opportunity to build the MVP. After that, consider the usage patterns to determine if additional API credits are needed.
### EOF
