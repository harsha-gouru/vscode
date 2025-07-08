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

### EOF
