# 🔧 DEVELOPER & VS CODE AGENT SPEC

## Doctrine-First Development Contract (Anti-Collapse)

---

## 1. Scope

This specification governs **how the Guru codebase is developed**, including:

* Human developers
* VS Code agents
* AI coding assistants
* Refactoring tools
* Automation scripts

It does **not** describe end-user behavior.
It describes **developer behavior**.

---

## 2. Core Principle (Non-Negotiable)

> **No code change is valid unless its intent is first written in documentation.**

This rule exists to prevent:

* AI-driven code drift
* vibe coding collapse
* undocumented architectural mutation
* silent behavior changes

---

## 3. Documentation Is the Authority

### 3.1 Source of Truth

* Markdown (`.md`) files are the **authoritative definition** of the system.
* Code exists to **implement documents**, not the other way around.

If code and documentation disagree:

> **Documentation wins. Code is wrong.**

---

## 4. Mandatory Order of Work

All developers and agents must follow this order **strictly**:

```
1. Identify change intent
2. Update or create relevant .md spec
3. Record rationale in changelog
4. Commit documentation
5. Implement code to match documentation
6. UI dynamically reflects documentation
```

### Forbidden:

* Writing code first
* “Fixing” behavior without updating docs
* Letting an agent refactor freely
* Post-hoc documentation

---

## 5. Changelog Discipline

### 5.1 Required for Every Change

Each change must include:

* what changed
* why it changed
* what invariant it preserves

No changelog = invalid change.

### 5.2 Changelog Lives With Docs

* Changelogs must live alongside the relevant `.md`
* Not hidden in commit messages only

---

## 6. VS Code Agent Constraints

Any AI agent operating in VS Code must obey:

* Read documentation **before** suggesting changes
* Refuse to implement behavior not specified in docs
* Prefer modifying docs over modifying code
* Surface uncertainty instead of guessing intent
* Never “optimize” undocumented behavior

Agents are **implementers**, not designers.

---

## 7. Anti-Vibe-Coding Rules

The following are explicitly prohibited:

* Generating features from conversation context alone
* Auto-completing architecture decisions
* Refactoring without documented intent
* “This seems better” changes
* Silent API or behavior changes

Violation = architectural failure, not productivity.

---

## 8. UI–Documentation Coupling

The UI is intentionally designed to:

* dynamically read `.md` files
* expose system behavior visibly
* prevent hidden logic

Any UI change that does not reflect documentation changes is invalid.

---

## 9. Stability & Longevity Rule

> **The system must remain understandable without conversation history.**

This ensures:

* new developers can onboard
* agents do not hallucinate intent
* long-term maintenance is possible
* the system survives model changes

---

## 10. Review & Merge Gate

A change **must not be merged** if:

* Documentation was not updated
* Changelog is missing
* The intent is not explicit
* The change relies on “AI intuition”

This applies equally to humans and agents.

---

## 11. Portability Clause

This spec is **project-agnostic** and should be reused for:

* mentor systems
* agent platforms
* orchestration frameworks
* long-lived AI products

Any project adopting this spec inherits:

* architectural stability
* explainability
* resistance to AI-induced collapse

---

## 12. Canonical Rule (Write This Everywhere)

> **If it is not written, it is not allowed.
> If it is written, it must be enforced.**

---

## END OF DEVELOPER SPEC

---

### Why this matters (short, practical)

You already discovered the hard truth:

* AI systems collapse **during development**, not at runtime
* Collapse happens when **agents outpace doctrine**
* Documentation-first reverses that failure mode

What you’ve built — MD-driven UI + strict changelogs — is exactly the correct defense.

This spec simply **formalizes what you’re already doing**, so:

* other developers don’t break it
* VS Code agents don’t drift
* future projects start strong
