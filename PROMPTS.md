# Agent Prompts

## Code Formatting

**Always format code changes with Prettier after making edits.**

After modifying any code files, run Prettier to ensure consistent formatting:

```bash
cd frontend && npm run format
```

Or if you're in the root directory:

```bash
cd frontend && npm run format
```

This ensures all code follows the project's formatting standards and maintains consistency across the codebase.

### When to Format

- After editing TypeScript files (`.ts`, `.tsx`)
- After editing JavaScript files (`.js`, `.jsx`)
- After editing Vue files (`.vue`)
- After editing JSON, CSS, or other Prettier-supported files
- Before completing a task that involved code changes

### Note

The project uses Prettier with ESLint integration (`eslint-config-prettier`). Formatting is handled by Prettier, while linting is handled by ESLint.
