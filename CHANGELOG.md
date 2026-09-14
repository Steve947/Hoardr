# Changelog

All notable changes to Hoardr are recorded here. Versioning is `MAJOR.MINOR.PATCH`
with the release date; the same list drives the in-app **What's New** panel
(Profile → "What's new"). Newest first.

## [1.5.0] · 2026-09-14

### Changed
- Add and edit item is now a single scrolling form instead of five tabs. The photo comes first, with the "AI fill from photo" button beside it, then the essentials (name, category, group, short description), then optional sections (condition and measurements, notes and history, acquisition, custom fields) that stay collapsed until you open them. When the AI fills a field inside a collapsed section, that section opens so nothing is applied out of sight.
- Creating a group while adding an item is easier: a New button sits next to the group picker and the new group is selected automatically. The group field is clearly marked optional so a new item saves quickly.

### Fixed
- AI photo reading no longer fails on large iPad or phone photos. Each image is downscaled in the browser (longest edge 1536px, re-encoded as JPEG) before it is sent to the AI, which keeps it under the size limit and also makes each AI photo call faster. Applies to both "AI fill from photo" and Smart Import from an image, and falls back to the original image if resizing ever fails.

## [1.4.3] · 2026-09-13

### Added
- Terms of Use page (terms.html), linked in the app under Profile, Help and contact, and added to the publish allowlist.
- Sign up agreement: creating an account now requires ticking a box to agree to the Terms of Use and Privacy Policy. A "By continuing" notice covers the Google path, and each new account's acceptance (version plus timestamp) is recorded in its settings.
- Agreement on updates: if the Terms of Use or Privacy Policy version changes, existing users are asked to review and agree again the next time they open the app (the app compares the acceptance version stored in the user's settings against the current one, and fails open on a read error so no one is locked out).

### Changed
- Privacy Policy updated to version 1.1: added Stripe and Google Gemini as subprocessors.
- Free tier plumbing (dormant until go live): item cap set to 200 and collections to 5; the caps and the Pro gates (duplicate item, catalogue PDF, insurance) now open the upgrade flow instead of a "coming soon" message; the export split is inverted so raw Excel export is free while the catalogue PDF is Pro; Smart Import now warns and offers Upgrade or "import the first N that fit" when an import would exceed the free room.
- Sidebar collection names are now fully readable; the per row action buttons appear on hover and stay visible on mobile.

## [1.4.2] — 2026-09-09

### Added
- **Find in mining catalogue (Diecast).** A search box at the top of the Diecast details autofills the maker, vehicle make, model, scale and year from a curated reference catalogue of mining and construction models. Start typing a model (e.g. 797F, Komatsu 930E, Liebherr T282) and pick it; every field stays editable.
- **AI grounding (in limited testing).** The AI value estimate and photo identify now pull matching entries from the same reference catalogue and pass them to the model as grounding facts, so it pins the exact release (maker, scale, edition) and finds better sold comparables. Best-effort: if the catalogue is unreachable the AI call still runs. Requires the published `mining-catalog.json` (ships with the site) and a redeploy of the `aiAssist` function.

### Changed
- Sidebar collection names are now fully readable; each row's action buttons stay hidden until you hover (and remain visible on mobile).

## [1.4.1] — 2026-09-04

### Added (in limited testing)
- **AI value estimate.** An "✨ AI estimate" button on the item editor's Estimated Value field asks the AI for a current secondary-market value, based on real comparable sales and listings it finds via web search. Returns a low/typical/high range in your currency plus a confidence level, a short rationale, the comparables and the sources. Review it, then optionally apply the typical figure to the Value field — nothing is saved until you save the item. Owner-only while AI is in alpha; counts against the same monthly AI quota.

## [1.4.0] — 2026-09-03

### Changed
- Tidied up the toolbar — Export, Import and Backup are now grouped into clear menus on desktop, and the mobile menu is organised into labelled sections (Create / Export / Import / Backup / Account).

### Added (in limited testing)
- New AI helpers are being trialled and will roll out gradually: tidying up an item's notes, cataloguing an item from a photo, and a smarter Import that can read a spreadsheet, document, or a photo/pasted list.

## [1.3.1] — 2026-09-02

### Changed
- The global **Share** button (`shareCollection()`, in the ⋯/More menu and header) now opens the public-page
  share modal for the whole collection (`kind:'all'` → `buildAllSnapshot()`, grouped by collection + an
  "Other items" section for ungrouped) instead of a native `navigator.share` text summary. Same whitelist
  sanitiser, value/price toggles, and Update/Revoke as the rest of sharing.

## [1.3.0] — 2026-09-01

### Added
- **Single- and multi-item sharing.** Besides whole collections, you can now share one item (🔗 Share in
  the item view) or a hand-picked set (Select → pick items → 🔗 Share in the bulk toolbar). Builds a
  `type:'items'` snapshot; `share.html` renders it as a flat gallery. Same whitelist sanitiser and
  value/price toggles; `sourceItemIds` stored so the link's **Update** re-snapshots the current items.
  Shares are keyed by `subjectKey` (`col:<id>` or `items:<sortedIds>`) so each subject lists its own links.
  No security-rule change — item shares live in the same owner-scoped `shares/{id}` collection.

## [1.2.0] — 2026-09-01

### Added
- **Public collection share pages.** A 🔗 button on each collection publishes a sanitised,
  read-only snapshot to `shares/{id}`, viewable by anyone with the link at `share.html?id=...`
  — no login required. The page carries a "Start your own free collection" call-to-action (growth loop).
- **Per-share privacy toggles.** Estimated value and purchase price are OFF by default, each
  independently toggleable. Sensitive fields (seller, provenance, insurance, notes, history,
  certificate numbers, purchase source) are never written to the public snapshot — the sanitiser
  is a whitelist, so new item fields can't accidentally leak.
- **Full-image zoom.** Tap any photo — in the item detail view or on a public share page — to
  open a full-screen viewer with smooth pinch / scroll-wheel zoom, drag-to-pan, double-tap to reset,
  and swipe / arrow-key navigation between an item's photos. Shared one engine across `index.html`
  and `share.html`.
- **Link control.** Links never expire by default (optional 7/30/90-day expiry); owner can
  **Update** (re-snapshot) or **Revoke** (delete) any link anytime. Expiry + revoke enforced in
  Firestore security rules, not just the UI.

### Fixed
- App updates now appear on a normal reload — the service worker revalidates the page against
  the server instead of serving a stale cached copy (cache bumped to `hoardr-v3`). Previously a
  hard-refresh was needed to see a new deploy.

### Notes
- Requires the Firestore rules to be deployed (`shares/{id}` public-read block) — deployed 1 Sep 2026.

## [1.1.0] — 2026-09-01

### Added
- **"Toby Jug" category** as a built-in, with its own 🏺 icon.
- **Persistent custom categories.** Categories you create are now saved to your
  profile and appear in every category dropdown — no more retyping them on each item.
  Any custom category already in use is absorbed automatically.
- **Per-category emojis.** Every category can carry its own icon, chosen from the
  shared icon picker or typed in. Icons show on cards, the detail view, filter chips
  and dropdowns.
- **Edit categories in place.** A ✏ pencil on each category filter chip opens an
  editor to rename a category, change its icon, or delete it — no need to create an
  item first. Built-in categories allow an icon change only (name fixed).
- **Choose where items go on delete.** Deleting a category now asks which category to
  move its items, groups and collections to, instead of forcing "Other".
- **What's New panel** and a date + version scheme shown in Profile.

### Notes
- Custom-category storage moved from plain names to `{name, emoji}` records; existing
  data migrates automatically on load.

<!-- Template for the next release:
## [1.2.0] — YYYY-MM-DD
### Added
### Changed
### Fixed
-->
