# Design replication kit

Reusable Codex prompts and skills based on the four React design projects in this workspace. Each project has a detailed replication brief and an installable-style Agent Skill (`SKILL.md`). `prompts/universal-design-replication.md` is a standalone, deliberately granular prompt for applying the same design fidelity to a different product or app.

## Contents

- `prompts/burrow.md` and `skills/burrow/SKILL.md`
- `prompts/nexora.md` and `skills/nexora/SKILL.md`
- `prompts/obsidian-audio.md` and `skills/obsidian-audio/SKILL.md`
- `prompts/soi-mangalyaan-x.md` and `skills/soi-mangalyaan-x/SKILL.md`
- `prompts/universal-design-replication.md`

## Use in Codex

Copy the applicable skill directory into a project's `.agents/skills/<skill-name>/` directory (or another configured Codex skills directory), then invoke it by name. Alternatively, paste the matching prompt into a task. These documents describe the designs as implemented in the workspace; they are replication guides, not instructions to overwrite a new project's product requirements. Keep the original project's functional purpose and content where they differ.

## Evidence and scope

These briefs were derived from project source, styles, assets/components, package manifests and READMEs in `burrow`, `nexora`, `ecommerce-experience` and `soi-mangalyaan-x`. The projects are not all production services: their stated demo / concept limitations remain part of the guidance. Use existing files as the authority if they change.

## Git

This folder contains only Markdown prompts, skills and this README. Its `.gitignore` excludes common OS/editor files, local environment secrets and generated build/dependency output. To publish it as its own GitHub repository, initialize Git in this folder, commit these files, then add the repository remote and push. The parent workspace currently has no `.git` directory, so it is not already a Git repository.
