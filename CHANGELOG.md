# Changelog

All notable changes to Hoardr are recorded here. Versioning is `MAJOR.MINOR.PATCH`
with the release date; the same list drives the in-app **What's New** panel
(Profile → "What's new"). Newest first.

## [1.9.1] · 2026-10-31

### Added
- Export scope. `exportPDF` and `exportInsuranceSchedule` now take a list of collection ids; the PDF chooser has a checkbox list ("All collections" plus one row per collection with its item count) defaulting to `selectedCollectionId`. Inside each export the collection, group and item arrays are filtered once at the top and everything downstream reads from those, so summary tables, totals, item numbering and the unvalued count all follow the scope. An empty list is treated as unscoped, so a full export is unchanged. Filenames carry the scope.
- Category fields in the catalogue. A third detail line generated from `CAT_FIELDS` and `item.catFieldVals`, wrapped to two lines at 150mm. Covers all 33 categories and any added later. None of this data appeared in the catalogue before.
- Quantity on the catalogue detail line when `qtyOf(item) > 1`.
- "Include what you paid and estimated values" tick box on the catalogue export, on by default. The catalogue is described in the UI as good for showing off, and share pages already treat values and prices as opt-in.
- `.well-known/assetlinks.json` and `.nojekyll` added to the publish allowlist. Both files had existed since June but `.gitignore` is an allowlist and neither was in it, so neither had ever been published; `hoardrapp.com/.well-known/assetlinks.json` returned 404. Without it a Trusted Web Activity shows a browser address bar over the app. Android package id set to `com.hoardrapp.android`.
- `/app/*.before*`, `*.bak` and `*.orig` re-ignored. `!/app/` had been sweeping the `index.html.before.*` safety copies into the published site.

### Changed
- Catalogue prices are labelled "Estimated value" and "Bought for" instead of a bare gold figure with a terse "Paid:" beneath.
- Catalogue cost now uses `_itemCost()`, which adds postage and honours the diecast total-cost field, so the catalogue and the insurance schedule can no longer state different costs for the same item.
- Catalogue detail truncations raised now the text column is wider: names 52 to 64 characters, detail lines 95 to 125, descriptions 110 to 140.

### Fixed
- An item with a purchase price but no estimated value printed no pricing at all in the catalogue, because the purchase price was nested inside the `if(item.value)` test.
- Catalogue photos: photo one was a thumbnail beside the text while photos two onward were a separate gallery below the whole text block, so a two-photo item was twice the height of a one-photo item with the right of the row empty. All photos now sit on one square 34mm grid, two across, at one origin, and the text column starts at a fixed x for every row. Items with no photo get a placeholder tile so the grid stays regular. A two-photo row drops from 78mm to 40mm.
- Tiles were 40x34 landscape while the photos are portrait phone shots, so each was fitted by height and left floating as a narrow strip in a wide frame. Square tiles suit both orientations.

## [1.9.0] · 2026-10-30

### Added
- 18 new categories, taking the built-in list to 33: Art Prints, Autographs, Board Games, Bottle Caps, Building Bricks, Cassettes, Fountain Pens, Keychains, Minerals & Crystals, Mining Vehicles, Movie Memorabilia, Pin Badges, Pocket Knives, Pokemon Cards, Retro Games, Sneakers, Sports Memorabilia, Vintage Cameras. `BUILTIN_CATS`, the `catEmoji()` map and all three category `<option>` lists are generated from one order table so they cannot drift. Mining Vehicles is wired as a Diecast sub-type: `CAT_FIELDS['Mining Vehicles'] = CAT_FIELDS['Diecast']`, and the mining catalogue autocomplete fires for it too.
- Persistent export progress bar (`#expProg`, `expProgShow` / `expProgSet` / `expProgHide`). Replaces `showToast`, which hid itself after 2.5s and read as nothing happening. Determinate, counts photos during the prefetch and items during layout, estimates time remaining, and a 90s watchdog hides it so a failed export cannot strand it.
- Value over time graph filter on the dashboard: All, 3M, 6M, 1Y (`_trendRange`, `_rangeCut`, `_trendBlock`, `_setTrendRange`).
- Multi-select dropdown control for category fields (`type:'multiselect'`, `_mselToggle` / `_mselCommit` / `_mselSync`), used by train livery colours. The panel is in flow rather than absolutely positioned, which is what stopped the list clipping partway down.
- Searchable group picker modal replacing the `prompt()` in `bulkMove()`, so all groups are reachable rather than the ~22 that fitted in a browser prompt.

### Changed
- Catalogue PDF photo tiles enlarged from 30x26mm (thumbnail) and 32x30mm (gallery) to a single 40x34mm tile. All photo placement now reads one `TILE_W / TILE_H / TILE_GAP / TILE_X` declared once per export, so the thumbnail and gallery geometry cannot diverge again.
- Train fields: "Loco Type" renamed to "Rolling Stock Type" with Passenger, Freight and Military added; `TRAIN_COLOURS` expanded to 45 liveries; Pullman added to `TRAIN_RAILWAYS`.
- Smart Import destination pickers now open on "Select collection" and "Select group" placeholders instead of "New collection", and `smartImportApply` blocks until both are chosen.
- Category filter in the collections view is now a `<select>` plus an Edit category button, rather than a row of chips.
- This feature is called "Insurance schedule" everywhere. The Pro gate said "insurance appraisal", which contradicted the document's own disclaimer that it is not an appraisal. `exportInsuranceReport` renamed to `exportInsuranceSchedule`.

### Fixed
- Exports were taking ~15 minutes on a 2,887 item collection. Two causes: the insurance schedule prefetched every photo of every item when it only ever draws `photos[0]`, and the fetch pool was `CONC = 8` against HTTP/2 Storage. Now prefetches only the photos it prints and runs 24 in parallel. Measured on the same collection: 2,064 photos in about 60s, 2,887 items laid out in about 30s.
- PDF photos were stretched to fill their box. `addImage` scales to exactly the width and height given, so portrait photos were visibly squashed, worst in the catalogue gallery. New `pdfFitImage` helper reads the real pixel dimensions via `getImageProperties`, scales to fit and centres the remainder. Applied to the catalogue thumbnail, the catalogue gallery and the insurance schedule photo grid.
- Catalogue gallery tiles sat 2mm right of and 2mm wider than the thumbnail above them (`M+3` at 32x30 vs `M+1` at 30x26), so an item's photos never lined up. Both now share one origin and one size.
- Gallery rows reserved 38mm of height for a 30mm tile, wasting 8mm per row. The reservation now follows the tile height.
- Insurance schedule printed `$0.00` for items with no estimated value, because `fmtMoney` does `(Number(n)||0).toFixed(2)`. In a document an insurer reads, zero asserts the item is worthless while blank means not yet valued. Unvalued items now print an em dash, with a line under the summary giving the count and confirming they add nothing to the totals. The totals themselves were always correct.
- Dashboard total cost showed $0 from a `parseFloat` returning NaN and poisoning the sum; it now uses `_itemCost(i)`.
- Share pages published the local part of the owner's email address. Now falls back to the display name, or "A collector".
- The AI usage counter did not move until a reload. All nine `aiAssist` call sites go through an `_aiFn()` wrapper that refreshes the quota and re-renders afterwards.

## [1.8.0] · 2026-10-17

### Added
- Guided setup: creating a collection opens the group step, then the first item, instead of leaving the user on an empty screen.
- Add to home screen from Profile, under Get the app.
- Stamp condition grades (Used, Fine Used, Mint unhinged and others) and further categories including trading cards, coins and comics.

### Fixed
- Saving no longer stalls on a photo it cannot read, and the same photo can be added again without being skipped.

## [1.7.0] · 2026-09-15

### Added
- AI credit top-ups (Pro only). A one-off A$2.99 pack of 50 extra AI actions that never expire and are drawn on automatically once the monthly allowance runs out. Offered when a Pro member hits their monthly cap and from Profile > Hoardr Pro (Buy AI credits). Stored as a wallet in users/{uid}.aiCredits (server-only writes). Server pieces: consumeQuota now falls through to the wallet when the month is exhausted; createCheckoutSession supports plan "topup" in Stripe payment mode, gated to Pro subscribers/owners; the webhook adds the purchased credits on checkout.session.completed for a top-up. Live one-time Stripe price price_1UFl4V3SowKeLXaYqAZgA84O. Needs the functions redeployed (createCheckoutSession, stripeWebhook, aiAssist) plus deploy.bat for the site.

## [1.6.0] · 2026-09-15

### Added
- In-app feedback. Profile now has a "Send feedback" button under Help and contact that opens a short form (Bug / Idea / Other plus a message). Submissions go through a new App Check + auth gated callable `submitFeedback` that writes to a top-level `feedback` collection via the Admin SDK (uid, email, type, message, appVersion, userAgent, createdAt). No Firestore rules change needed since there is no client-writable feedback path; read submissions in the Firebase console. Needs the function deployed: `npx -y firebase-tools deploy --only functions:submitFeedback` (may need the Cloud Run allow-public-access flip on first deploy).

## [1.5.1] · 2026-09-14

### Fixed
- Fixed a setup issue where some accounts were given a sample "Locomotive & Train Collection" the user did not add. Cause was leftover developer scaffolding (seedTrainCollection) auto-run on first load in both the signed-in and local paths. All three auto-seed calls and the seed function itself have been removed, so new accounts start empty. A one-time owner-only admin function then cleared the sample collection from the accounts that had received it (matching only items on the seed date, so real user-created collections were never affected); that admin function has since been removed too.

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
