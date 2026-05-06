# Contributing to DevToolKit

We're excited that you're interested in contributing to DevToolKit! Here are a few guidelines to help you get started.

## How to Contribute

### 1. Adding a New Tool
1. Add the tool definition in `src/types.ts` with a unique ID, name, description, and category.
2. Implement the logic in the appropriate component (`FormatterTool.tsx`, `ConverterTool.tsx`, etc.).
3. If it's a new category, ensure the `ToolCategory` type is updated.

### 2. Styling Improvements
- Use Tailwind CSS utility classes.
- Ensure colors match the existing themes (Slate/Indigo/Black).
- Verify responsive behavior on both Desktop and Mobile.

### 3. Reporting Bugs
- Use GitHub Issues to report bugs.
- Include steps to reproduce and your environment details (browser, OS).

## Pull Request Process
1. Create a new branch for your feature or fix.
2. Ensure `npm run lint` passes without errors.
3. Submit the PR with a clear description of the changes.

Thank you for helping make DevToolKit better!
