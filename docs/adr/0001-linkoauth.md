# ADR-0001: Link OAuth Providers by Verified Email

[Back to the Project 03 guide](README.md#design-and-documentation)

> An **architecture decision record (ADR)** captures one significant technical decision: the
> situation, what you chose, and what it costs. Write it when you make the decision, not afterward.
>
> Copy this file to `docs/adr/<NNNN>-<short-title>.md` in your team repo (for example
> `docs/adr/0002-web-token-storage.md`), numbering from `0001`. Keep it under one page.
> Once an ADR is **Accepted**, do not rewrite it. To change the decision, write a new ADR that
> supersedes it and update only the old one's **Status** line.

**Status:** Accepted  
**Date:** 2026-11-16  
**Deciders:** Team 6  
**Supersedes:** none  
**Related PR(s):** https://github.com/CST438-FA26-Team6/Project3-backend/pull/56

---

## Context

The original authentication implementation returned `409 Conflict` when the same verified email was used with another OAuth provider. During testing, the GitHub and Google accounts being used shared the same email, and logout was not implemented yet. Account linking was allowed as an optional alternative and avoids creating additional GitHub or Google accounts only for testing.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| Keep `409 Conflict` | Matches the required baseline | Requires additional provider accounts to easily test both sign-in flows |
| Link verified OAuth identities | Allows both providers to use the same user and avoids creating extra accounts just for testing | Adds optional account-linking logic |

## Decision

We will link GitHub and Google identities when they provide the same verified email instead of returning `409 Conflict`.

## Consequences

- **Good:** Both providers can use the same user, making authentication easier to test without creating additional GitHub or Google accounts.
- **Bad:** Adds account-linking logic beyond the required baseline.
- **Follow-up:** Test that verified identities are linked to the existing user without creating another user.