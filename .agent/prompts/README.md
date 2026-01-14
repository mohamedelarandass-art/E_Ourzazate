# Agent Prompts for Equipement Ouarzazate

This folder contains optimized prompts for use with **Claude Opus 4.5 (Thinking)** to ensure architecture-aligned development.

## Available Prompts

### 1. Development Prompt (`PROMPT-1-development.md`)

**When to Use**: At the START of a new conversation when you want to:
- Fix a bug
- Implement a new feature
- Optimize performance
- Refactor code
- Get a code review
- Make a design decision

**What It Does**:
- Forces the agent to read relevant `architecture.md` sections first
- Detects conflicts between requests and documented architecture
- Presents multiple options with clear recommendations
- Follows all documented patterns and conventions

**Usage**:
```
1. Copy the prompt content
2. Replace [YOUR TASK DESCRIPTION HERE] with your actual request
3. Paste into a new Claude conversation
```

---

### 2. Sync Architecture Prompt (`PROMPT-2-sync-architecture.md`)

**When to Use**: At the END of a development conversation when:
- You've completed a task
- Changes have been verified
- You want to update `architecture.md` to reflect the changes

**What It Does**:
- Summarizes all changes from the conversation
- Identifies which architecture sections need updates
- Shows proposed changes before making them
- Displays a diff summary after updating
- Manages version increments and changelog entries

**Usage**:
```
1. Complete your development task
2. Verify changes work correctly
3. Copy the prompt content
4. Paste into the SAME conversation
5. Confirm the summary and proposed updates
```

---

## Quick Reference

| Scenario | Use Prompt |
|----------|-----------|
| Starting new development task | Prompt 1 |
| Finished task, need to update docs | Prompt 2 |
| Just asking a quick question | Neither (ask directly) |
| Need to update only architecture.md | Prompt 2 only |

## Files

```
.agent/prompts/
├── README.md                      # This file
├── PROMPT-1-development.md        # Architecture-aware development
└── PROMPT-2-sync-architecture.md  # Architecture synchronization
```
