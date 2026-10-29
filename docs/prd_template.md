# Product Requirements Document (PRD): `<product name>`

[Back to the Project 03 guide](README.md)

> Copy this file to `docs/prd.md` in your team repo and replace everything in angle brackets.
> Keep it to **one page**. Commit it **before the group proposal presentation**; the commit date is checked.
> After the presentation, change it only through pull requests, so the history shows what changed and why.
> Your Final Submission is graded against this document.

**Team:** `team 6` · **Repo:** `https://github.com/CST438-FA26-Team6/Project3` · **Last updated:** `10/28/2026`

---

## 1. Users

Who is this for? Name **one** primary user type and describe them in one or two sentences.
"Everyone" and "students" are not user types; "a first-year student looking for a study group for
one specific course" is.

- **Primary user:** `An anime and manga fan who wants one place to track what they are currently watching or reading and what they have completed.`
- **Secondary user (optional):** `An administrator who manages user access.`

## 2. Problem

Two sentences: what the user struggles with today, and why existing options fall short.

`With thousands of anime already available and new manga constantly being released, it can be difficult for fans to keep track of what they are currently watching or reading and what they have completed. Existing trackers often emphasize community-based scores and can feel cluttered or difficult to use, rather than focusing on a user's own experience and personal tracking.`

## 3. Success measures

Three measurable signals that would show the product works. Each one needs a number and a way to
check it.

| # | Measure | Target | How we check it |
|---|---|---|---|
| S1 | `<e.g., a new user creates their first study session>` | `<under 2 minutes>` | `<timed during the onboarding test>` |
| S2 | | | |
| S3 | | | |

## 4. Scope: MVP, vertical slice, and not building

**MVP** is the smallest set of stories that makes *this* product useful. It always includes the
account baseline (sign in with GitHub and Google, update profile, delete account) **plus** the
stories specific to your product.

- **MVP stories:** `<PRD-1, PRD-2, ...>` (listed in section 5)
- **Vertical slice:** `<the one MVP story you will polish end to end and test with Playwright>`
- **Not building (this term):** `<at least three things a reader might expect that you are deliberately leaving out>`

## 5. User stories and acceptance criteria

One row per MVP story. Each GitHub issue links to its story ID (`PRD-3`) and each story has at
least one acceptance criterion in **Given / When / Then** form that someone outside the team could
test.

| ID | Story | Acceptance criteria |
|---|---|---|
| PRD-1 | As a `<user>`, I want to `<action>` so that `<benefit>`. | **Given** `<state>`, **when** `<action>`, **then** `<observable result>`. |
| PRD-2 | | |
| PRD-3 | | |

---

### Change log

| Date | PR | What changed and why |
|---|---|---|
| `<date>` | `#<n>` | Initial version |
