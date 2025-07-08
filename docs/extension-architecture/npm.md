# NPM support for VS Code

**Extension ID:** npm

Extension to add task support for npm scripts.

* **Entry Point:** `./out/npmMain`
* **Activation Events:** onTaskType:npm, onLanguage:json, workspaceContains:package.json
* **Contribution Points:** languages, views, commands, menus, configuration, jsonValidation, taskDefinitions, terminalQuickFixes
