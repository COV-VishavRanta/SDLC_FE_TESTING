---
name: documentation-management
description: 'Manage project documentation following established standards. Use when asked to "create docs", "update documentation", "remove outdated docs", "refactor README", "document a feature", "create architecture docs", or when working with README.md files in src/ folders or docs/features/ folder. Enforces consistent structure across all project documentation.'
---

# Documentation Management

A skill for adding, updating, removing, and refactoring documentation in the Pop Logic project. Ensures all documentation follows consistent standards based on its location and purpose.

## When to Use This Skill

- User asks to "create documentation", "update docs", or "create a README"
- User wants to document a new feature or architecture
- User asks to "refactor" or "clean up" existing documentation
- Working with any `README.md` file in `src/` subfolders
- Creating or modifying files in the `docs/features/` folder

## Documentation Types & Locations

| Type                     | Location                                  | Purpose                                                                     |
| ------------------------ | ----------------------------------------- | --------------------------------------------------------------------------- |
| **Module README**        | `src/{folder}/README.md`                  | Explains folder purpose, structure, guidelines, and usage patterns          |
| **Feature Architecture** | `docs/features/{feature}.architecture.md` | Feature-specific architecture, design decisions, and implementation details |

---

## Standard 1: Module README (`src/` Subfolders)

Every folder under `src/` should have a `README.md` following this structure:

### Required Sections

```markdown
# {Folder Name}

{Brief description of what this folder contains and its purpose.}

## Structure

{Explain the folder organization and file naming conventions.}

All {items} are exported from the `index.ts` file for centralized imports.

\`\`\`tsx
// Example usage
import { X } from '@/{folder}';
\`\`\`

## Guidelines

{Bullet points with rules for adding/modifying files in this folder.}

## Available {Items}

{List of current exports or "No items have been added yet."}

---

## Adding a New {Item}

{Step-by-step instructions for adding new files to this folder.}
```

### Example: Components README

```markdown
# Components

This folder contains all the UI components for the Pop Logic project.

## Structure

All components are exported from the `index.ts` file for centralized imports.

\`\`\`tsx
// Example usage
import { ComponentName } from '@/components';
\`\`\`

## Guidelines

- Each component should have its own folder with the following structure:

  \`\`\`
  {ComponentName}/
  ├── {ComponentName}.tsx # Main component file
  ├── {ComponentName}.test.tsx # Unit tests (optional)
  └── ... (any other related files)
  \`\`\`

- All related files (tests, styles, variants, utilities) for a component should live inside its folder
- Export all components from the root `src/components/index.ts` file

## Available Components

_No components have been added yet._

---

## Adding a New Component

1. Create a new folder with the component name: `{ComponentName}/`
2. Add your main component file: `{ComponentName}/{ComponentName}.tsx`
3. Add any related files (tests, styles, etc.) inside the same folder
4. Export the component from the root `src/components/index.ts`
```

---

## Standard 2: Feature Architecture (`docs/features/`)

Feature-specific architecture documentation. Each feature has a main architecture file and can have supporting documents.

### File Structure

```
docs/features/
├── {feature}.architecture.md      # Main architecture document (required)
├── {feature}.api.md               # API specifications (optional)
├── {feature}.flows.md             # User/data flow diagrams (optional)
└── {feature}.decisions.md         # Decision records for the feature (optional)
```

### Required Sections for `{feature}.architecture.md`

```markdown
# {Feature Name} Architecture

## Overview

{High-level description of the feature and its purpose.}

## Status

{Draft | In Progress | Implemented | Deprecated}

## Architecture Diagram

{Visual representation of the feature's architecture.}

## Key Concepts

{Define important terms, components, and their relationships.}

## Implementation Details

{Technical approach, data flow, and implementation specifics. avoid code examples here.}

## Current Implementation

{What has been implemented so far. Avoid code examples here.}

## Security Considerations

{Security aspects relevant to this feature.}

## Future Implementation (TODO)

{Planned work, documented as implementation progresses.}

- [ ] {Task 1}
- [ ] {Task 2}

## Related Documentation

{Links to related feature docs, module READMEs, or external resources.}
```

### Example: Authentication Architecture

```markdown
# Authentication Architecture

## Overview

Pop Logic uses AWS Cognito for user authentication via the AWS Amplify library.

## Status

In Progress

## Architecture Diagram

\`\`\`
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Login Form │───▶│ AWS Amplify │───▶│ AWS Cognito │
│ (Client) │ │ Auth APIs │ │ User Pool │
└─────────────────┘ └─────────────────┘ └─────────────────┘
\`\`\`

## Key Concepts

| Concept      | Description                   |
| ------------ | ----------------------------- |
| ID Token     | Contains user identity claims |
| Access Token | Authorizes API access         |

## Implementation Details

{Details about the auth flow...}

## Current Implementation

{What's working now...}

## Security Considerations

- Tokens stored securely by Amplify
- HTTPS required in production

## Future Implementation (TODO)

- [ ] Token exchange with backend
- [ ] Protected routes middleware

## Related Documentation

- [Lib README](../../src/lib/README.md)
```

---

## Workflows

### Adding Documentation to a New `src/` Folder

1. Create `README.md` in the folder
2. Follow the Module README structure (Standard 1)
3. Include folder-specific guidelines and examples
4. Add placeholder for "Available Items" section

### Creating Feature Architecture Documentation

1. Create `docs/features/{feature}.architecture.md`
2. Set status to "Draft" or "In Progress"
3. Fill in all required sections
4. Add supporting files as needed (`{feature}.api.md`, `{feature}.flows.md`, etc.)
5. Update the main architecture file to link to supporting docs

### Updating Existing Documentation

1. Read the current document
2. Identify outdated sections (APIs, examples, lists)
3. Update content while preserving the established structure
4. Update "Available Items" or similar dynamic sections
5. Move completed TODO items to "Current Implementation"

### Removing Outdated Documentation

1. Check if the documented feature/component still exists
2. If removed: delete the doc or mark as deprecated
3. If superseded: update with redirect to new location
4. Clean up any broken cross-references

### Refactoring Documentation

1. Compare against the relevant standard (1 or 2 above)
2. Add missing required sections
3. Reorganize content to match standard order
4. Ensure consistent formatting (headers, code blocks, tables)
5. Remove redundant or duplicate content

---

## Documentation Quality Checklist

- [ ] Follows the correct standard for its location
- [ ] Has all required sections
- [ ] Code examples are accurate and use correct import paths
- [ ] Links to other docs are valid
- [ ] No placeholder text like "TODO" or "TBD" without context
- [ ] Tables and lists are properly formatted
- [ ] File/folder names in examples match actual conventions

## Troubleshooting

| Issue                          | Solution                                |
| ------------------------------ | --------------------------------------- |
| README doesn't match structure | Refactor using Standard 1 template      |
| Feature doc missing sections   | Add required sections from Standard 2   |
| Outdated code examples         | Update imports to use `@/` path aliases |
| Broken internal links          | Use relative paths from doc location    |
| Inconsistent formatting        | Apply Prettier/markdown formatting      |

## References

- [Project Coding Conventions](../../copilot-instructions.md)
- [Next.js Instructions](../../instructions/nextjs.instructions.md)
- [TypeScript Instructions](../../instructions/typescript.instructions.md)
