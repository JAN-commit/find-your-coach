# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Show/hide toggle for password fields on the login and signup pages.

### Changed
- Role-based view separation: coaches now see Dashboard, Requests, and Edit profile only. The "Available coaches" page is hidden from coaches and redirects to the dashboard.
- Tightened sidebar spacing around the navigation sections and user account box.

## [2.0.0] - 2026-09-13

### Added
- **Dashboard layout** for signed-in users with a sidebar nav (Coaches, Requests, Edit profile) and a user profile box.
- Guarded routes: `/CoachRegistration` and `/MessageRequest` now redirect to the login page when signed out.
- Login/signup pages redirect to the home page when already signed in.
- **Coach search bar** on the home page (searches name, headline, description, location).
- New coach profile fields: `headline`, `yearsExperience`, `location`, and `website`.
- Edit-profile mode: coaches returning to `/CoachRegistration` see their existing profile prefilled and can update it.
- New **logo** (chat bubble + check on a green tile) across the header, footer, auth pages, and favicon.

### Changed
- Authenticated view now feels like a personal dashboard instead of the public landing page.
- Coach cards and profile pages show the new fields (headline, experience, location, website).
- Bumped application version to `2.0.0` (SemVer).

## [1.0.0] - 2026-09-13

### Added
- Version badge in the site footer (`v1.0.0`), injected from `package.json` at build time.
- `CHANGELOG.md` for release versioning and history.

### Changed
- Complete UI/UX revamp:
  - Replaced the default daisyUI theme with a custom, minimal light design system
    (warm paper background, white surfaces, flat pine-green accent, Inter typeface).
  - Removed all gradients and template-style components.
  - Home page now has a clean hero section, toggle-chip filters, skeleton loaders,
    and refined empty/error states.
  - Coach cards redesigned with initials avatars, expertise tags, and flat actions.
  - Simplified the sticky header with a branded mark and a proper mobile menu.
  - Redesigned log in / sign up pages with inline validation and disabled/loading states.
  - Rebuilt the coach registration, coach details, contact modal, and message inbox to
    match the new design.
- Removed the unused `daisyui` dependency.
- Bumped application version from `0.0.0` to `1.0.0` (SemVer).

[Unreleased]: https://github.com/johnandreinicolas/find-your-coach/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/johnandreinicolas/find-your-coach/releases/tag/v2.0.0
[1.0.0]: https://github.com/johnandreinicolas/find-your-coach/releases/tag/v1.0.0