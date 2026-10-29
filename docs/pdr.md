# Product Requirements Document (PRD): Anime and Manga Tracker

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

| #  | Measure                                                     | Target                                                                   | How we check it  git add docs/prd.md                                                                             |
|----|-------------------------------------------------------------|--------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| S1 | A new user finds a title and adds it to My Library          | At least 4 out of 5 users complete the task successfully                 | Ask 5 users to find a title and confirm that it appears in My Library                         |
| S2 | A user updates a title’s status or episode/chapter progress | At least 4 out of 5 users complete the task without help                 | Ask 5 users to update an entry and observe whether they succeed                               |
| S3 | A user finds titles by filtering My Library                 | At least 4 out of 5 users correctly find titles with the selected status | Give 5 users a library with mixed statuses and ask them to find titles with a selected status |


## 4. Scope: MVP, vertical slice, and not building

**MVP** is the smallest set of stories that makes *this* product useful. It always includes the
account baseline (sign in with GitHub and Google, update profile, delete account) **plus** the
stories specific to your product.

- **MVP stories:** PRD-1, PRD-2, PRD-3, PRD-4, PRD-5, PRD-6, and PRD-7
  (listed in section 5).
- **Vertical slice:** PRD-4 — a signed-in user opens an anime or manga title, adds it to their
  personal library with a tracking status, and sees the new entry in My Library. This story will
  be implemented end to end and tested with Playwright.
- **Not building (this term):** Anime streaming or manga reading, direct messaging or social
  feeds, synchronization with external tracking accounts, and AI-generated recommendations.

## 5. User stories and acceptance criteria

One row per MVP story. Each GitHub issue links to its story ID (`PRD-3`) and each story has at
least one acceptance criterion in **Given / When / Then** form that someone outside the team could
test.

| ID | Story | Acceptance criteria |
|---|---|---|
| PRD-1 | As a user, I want to sign in with GitHub or Google so that I can access my personal library. | **Given** I am signed out, **when** I successfully authenticate with GitHub or Google, **then** my account is created or retrieved and I am taken to my library. |
| PRD-2 | As a user, I want to manage my profile and account so that I control my personal information. | **Given** I am signed in, **when** I update my profile, **then** the updated information is saved and displayed. **Given** I confirm account deletion, **when** the deletion completes, **then** my account and associated library entries are removed and I am signed out. |
| PRD-3 | As a user, I want to search the title catalog so that I can find anime or manga I want to track. | **Given** matching titles exist, **when** I search by title and optionally select anime or manga, **then** the matching titles and their media types are displayed. |
| PRD-4 | As a user, I want to add a title to my library so that I can begin tracking it. | **Given** I am signed in and the title is not already in my library, **when** I add it with a tracking status, **then** a library entry is created with progress set to zero and the title appears in My Library. |
| PRD-5 | As a user, I want to update a library entry so that my status, episode or chapter progress, and rating remain accurate. | **Given** a title is in my library, **when** I submit valid progress, status, or rating changes, **then** the changes are saved and displayed. Progress greater than the title's total episodes or chapters is rejected with an explanation. |
| PRD-6 | As a user, I want to filter my library so that I can quickly find titles with a particular status. | **Given** my library contains titles with different statuses, **when** I select a status filter, **then** only entries with that status are displayed. |
| PRD-7 | As an administrator, I want to manage title records so that incorrect catalog information can be corrected or removed. | **Given** I have the administrator role, **when** I update or remove a title, **then** the catalog reflects the change. **Given** I am not an administrator, **when** I attempt the same operation, **then** the request is rejected with a 403 response. |

---

### Change log

| Date | PR | What changed and why |
|---|---|---|
| `<date>` | `#<n>` | Initial version |
