# Architecture Synchronization Prompt

> **Usage**: Copy this entire prompt and paste it at the END of a development conversation when you want Claude to update `architecture.md` to reflect the changes made during the session.

---

## PROMPT STARTS HERE ↓

```
## ARCHITECTURE SYNCHRONIZATION REQUEST

The development task is now complete. Please update `architecture.md` to reflect all changes made during this conversation.

### YOUR SYNCHRONIZATION WORKFLOW

#### Step 1: Summarize Changes Made
First, analyze our entire conversation and list ALL changes made:

**Changes Summary**
| # | Change Type | Description | Files Affected |
|---|-------------|-------------|----------------|
| 1 | [type] | [description] | [files] |
| 2 | [type] | [description] | [files] |
...

Please confirm this summary before proceeding with the update.

---

#### Step 2: Identify Sections to Update

Use this relevance matrix to determine which architecture.md sections need updates:

| Change Made | Sections to Update |
|-------------|-------------------|
| New file/folder created | **Project Structure** (directory tree) |
| New component added | **Frontend Architecture** → Component Hierarchy |
| New page route added | **Frontend Architecture** → Routing Structure |
| New API endpoint | **API Architecture** → Endpoint Specifications |
| API request/response format changed | **API Architecture** → Standard Response Format |
| Database field added/changed | **Database Architecture** → Prisma Schema |
| New database table/model | **Database Architecture** → ERD, Prisma Schema |
| New dependency added | **Technology Stack** table |
| New pattern introduced | **Code Standards & Patterns** |
| New CSS variable | **Frontend Architecture** → Design System |
| New environment variable | **Deployment & Infrastructure** → Environment Variables |
| New hook created | **Project Structure** → hooks folder |
| New utility function | **Project Structure** → lib folder |
| Bug fix revealing documentation gap | **Troubleshooting Guide** |
| Configuration change | **Deployment & Infrastructure** or **Technology Stack** |
| Security-related change | **Security Patterns** |
| Authentication change | **Authentication & Authorization** |
| Performance optimization | **Frontend/Backend Architecture** → Performance section |
| New integration | **Integration Points** |

---

#### Step 3: Determine Changelog Entry Need

Evaluate whether this change warrants a changelog entry:

| Change Size | Changelog Action |
|-------------|------------------|
| **Major** (new feature, breaking change, new subsystem) | Add to "Major Architectural Changes" with full description |
| **Medium** (new pattern, significant refactor, new integration) | Add brief entry to changelog |
| **Minor** (typo fix, small clarification, routine update) | Update section only, no changelog entry |

---

#### Step 4: Version Increment

Current version in architecture.md: Check line 4 for `**Version**: X.Y.Z`

Version increment rules:
- **Patch (X.Y.Z → X.Y.Z+1)**: Minor updates, clarifications, small additions
- **Minor (X.Y.Z → X.Y+1.0)**: New features documented, new sections added
- **Major (X.Y.Z → X+1.0.0)**: Breaking changes, major restructuring

For most updates, increment the **patch version**.

---

#### Step 5: Pre-Update Confirmation

Before making any changes, show me:

## Proposed Architecture Updates

**Version Change**: 1.0.0 → 1.0.1 (or appropriate)

**Sections to Update**:
1. [Section Name] - [What will change]
2. [Section Name] - [What will change]
...

**Changelog Entry** (if applicable):
```
#### **[Date]: [Brief Title]**
- [Change 1]
- [Change 2]
```

**Proceed with these updates?** (yes/no)

---

#### Step 6: Make the Updates

Once confirmed, update architecture.md with:
1. Version number increment (line 4)
2. Section updates (in order of appearance)
3. Changelog entry (if applicable)
4. Update "Last Updated" date (line 5)

---

#### Step 7: Show Diff Summary

After updating, provide a diff summary:

## Architecture Update Complete ✅

**Version**: 1.0.0 → 1.0.1
**Last Updated**: [New Date]

### Changes Made:

---

**Section: [Section Name]** (lines X-Y)

```diff
- [old content]
+ [new content]
```

---

**Section: [Section Name]** (lines X-Y)

[For large changes, use summary format:]
- Added [item] to [location]
- Updated [item] with [change]
- Removed [item] (reason: [why])

---

**Changelog Entry Added**:
```markdown
#### **2026-01-14: [Title]**
- [Entry]
```

---

### CONSISTENCY CHECKS

After updating, verify:
- [ ] Table of Contents still matches actual section headers
- [ ] No broken internal references
- [ ] Mermaid diagrams still render correctly (if modified)
- [ ] Code examples match current patterns
- [ ] File paths in examples are still valid

---

### CONSTRAINTS

1. ✅ Only update sections relevant to changes made
2. ✅ Maintain consistent formatting with existing sections
3. ✅ Use same markdown style (headers, tables, code blocks)
4. ✅ Keep content concise - this is reference documentation
5. ✅ Preserve existing content structure
6. ❌ Don't rewrite sections unnecessarily
7. ❌ Don't add speculative/future content (only document what exists)
8. ❌ Don't remove existing content unless explicitly wrong

---

Please begin with Step 1: Summarize all changes made in this conversation.
```

---

## PROMPT ENDS HERE ↑

---

## How to Use This Prompt

1. **Complete your development task** in the conversation
2. **Verify the changes work** (run build, test manually)
3. **Copy everything between "PROMPT STARTS HERE" and "PROMPT ENDS HERE"**
4. **Paste into the SAME conversation** where you made changes
5. **Review the summary** before confirming updates
6. **Review the diff** after updates are made

### Example Flow:

```
[Your development conversation happens...]
[Changes are made and verified...]

You: [Paste this prompt]

Claude: 
## Changes Summary
| # | Change Type | Description | Files Affected |
|---|-------------|-------------|----------------|
| 1 | New component | Added Badge component | src/components/ui/Badge/* |
| 2 | Updated barrel | Added Badge to ui exports | src/components/ui/index.ts |

Confirm?

You: yes

Claude:
## Proposed Architecture Updates

**Version Change**: 1.0.0 → 1.0.1

**Sections to Update**:
1. Project Structure - Add Badge to component tree
2. Frontend Architecture - Add Badge to UI Components diagram

Proceed?

You: yes

Claude:
## Architecture Update Complete ✅
[Shows diff summary...]
```

---

## Tips for Best Results

1. **Be specific in your development conversation** - The clearer your changes, the better the summary
2. **Confirm the summary is complete** - Add any missing changes before proceeding
3. **Review the diff** - Make sure nothing unexpected was changed
4. **Commit architecture.md separately** - Use commit message like `docs: update architecture for Badge component`
