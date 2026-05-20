# Workspace Instructions (taurus-gemini-folders)

## Tool Preferences
- **Package Manager**: Use `yarn` for all package-related operations (adding, removing, running tests, etc.). Avoid `npm` unless specifically requested or if `yarn` is unavailable.

## Coding Style
- Follow the existing ES module patterns (`type: module` in `package.json`).
- Ensure all new features are accompanied by unit tests using Jest.

## Git Workflow
- **Primary Branch**: Always use `main`. This project does **not** use `master`.
- **Branch Naming**: Use the pattern `user/kjburnett/feature-task-name-here`.
- Prefer using the GitHub CLI (`gh`) for PR creation (if authenticated).
