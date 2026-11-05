# Validation

Evidence is separated by scope. Public release checks do not establish that the repository has been accepted into the HACS catalog.

## Development baseline — 2026-11-04

The initial implementation passed `npm run check` and 17 automated tests with no third-party packages. Tests covered attendee parsing, aliases, unknown prefixes, conservative deduplication, filters, canceled/malformed events, all-day and midnight boundaries, daylight-saving transitions, naive timestamps in HA's zone, month grids, configuration validation, and stale asynchronous responses.

A local browser preview with fictional events was checked in Chrome and Safari:

- Month grid and narrow agenda render with attendee colors.
- Light/dark theme, title wrapping, and shared attendee labels render.
- A person filter preserves individual, shared, and family-wide events.
- Event details show participants, date/time, location, and description.
- Escape closes the modal and restores event focus.
- Simulated API failure retains loaded events; recovery clears the error.
- Editing the title in the visual editor updates the card.
- HTML-looking event text displays literally.

The browser checks above are development evidence, not a clean HACS installation test. A physical phone has not been tested; narrow-screen checks used a local browser.

## Community release preparation — 2026-11-04

Candidate **0.1.1** passes `npm run package`: JavaScript syntax, **19 tests with 0 failures**, release structure/version checks, screenshot presence, and bounded text privacy checks. Additional regression cases cover empty public member defaults and unambiguous generic calendar discovery.

- Reviewed the runtime, examples, documentation, templates, and release configuration for household-specific names, addresses, entities, paths, and private feed URLs. Public examples and images use fictional data. The previous development ZIP is excluded from the public tree.
- Captured and visually inspected the current Safari month view and 390px-wide dark agenda. Documentation images crop browser chrome and surrounding whitespace; the agenda image shows the first day.
- Confirmed the current generic demo's Alex filter retains individual, shared, and family events. Opened a shared event and verified all three attendee names and its date/time. Escape closed it and restored focus to the event.
- Reviewed CI and draft-release workflow configuration. Candidate tag/version checks operate on the selected tag; remote HACS validation uses HACS's own event/release selection and alone does not certify candidate assets.
- Built a source archive from an explicit public-file allowlist, checked ZIP integrity and checksums, and verified reproducible output. The release JavaScript matches the source.

The MIT license, HACS manifest, contribution/issue templates, changelog, and announcement draft are prepared. The public repository is at https://github.com/jaraggie/cozi-calendar-card. No announcement or catalog submission has been created. The installed household dashboard has not been updated by this release preparation.

## Published beta — 2026-11-04

- [v0.1.1 community beta](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.1.1) is published as a GitHub pre-release at commit `1c772a45fbc2d6d9f65b4af3fe7630ab1feae639`.
- [Candidate CI](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41916931766) and the [tag-scoped release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41917089425) succeeded. Syntax checks, 19 tests, release hygiene, HACS validation, packaging, and draft creation passed without ignored HACS checks.
- Downloaded the workflow-generated JavaScript, source ZIP, and `SHA256SUMS` before publishing. Both hashes match the checksum file. ZIP integrity passed and all **26 archived files** match the tagged Git contents exactly.
- Published JavaScript: 35,634 bytes; SHA-256 `1d78f9387754359244e069e9b3357341912bc65c76e75a87cc275d737e408abc`.
- The GitHub repository is public, has description/topics/Issues configured, and private vulnerability reporting enabled. Source upload used the GitHub Git Data API after Git HTTPS uploads stalled; the resulting remote tree and local checkout were verified to match.

## Checks still required before broad release

- Installation and upgrade **0.1.1 → 0.1.3**, including removal of the old manual resource, are user-confirmed; see the installation evidence below. Exact HA/frontend build versions and individual card-picker/reload/live-event assertions were not separately recorded.
- Recheck on a physical phone and with another household's configured names and feed formatting.

Track progress in [`RELEASE_TASKS.md`](RELEASE_TASKS.md). Record the tested HA/frontend versions and release tag with each installation result.

The target HA instance exposes the built-in Marketplace. After recovering from the earlier `cgWindowNotFound` UI access failures, Add from link accepted the public repository. At that stage, repository registration alone did not establish a successful installation. The later user-run installation and upgrade results are recorded below.

## Selected icon — 2026-11-04

The user selected the dark green Forest Calendar concept. The production assets contain only that choice; the R monogram and comparison UI remain on the prototype branch. The 512px and 128px PNGs were rendered from the original SVG and have transparent corners. The icon and 1280px × 640px social preview were visually inspected. Local `npm run package` passes for 0.1.2, including 19 tests and release hygiene checks. Calendar behavior is unchanged.

HACS and Marketplace source inspection confirms that dashboard-plugin browse icons are category symbols, while repository details render the README. The README now starts with the selected icon. This does not claim a customized browse-list icon or completed HACS installation. See the primary-source links in `assets/README.md`.

## Published branding beta — 2026-11-04

- [v0.1.2 Forest Calendar branding](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.1.2) is published as a pre-release at commit `fd16e103ef42fb0c89da8a5d4b98a1bdd55f49b9`.
- [Hosted CI and HACS validation](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41922444562) and the [tag-specific release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41922895565) passed with no ignored HACS checks.
- Downloaded the draft assets before publishing: checksums match; ZIP integrity passes; all **32 archived files** and the standalone JavaScript exactly match the tag.
- Published JavaScript: 35,634 bytes; SHA-256 `22647b72f0b86905feba6bdaad4c189721394fa0ce5864e06ffad7f6f5b00b44`. Source ZIP SHA-256: `983a47d8dc5c6427a9374eff51489c94904b83225b67d8d5c32a36d3360427dc`.
- The README displays the selected icon. The GitHub social preview was uploaded, visually inspected, and confirmed by `usesCustomOpenGraphImage: true`.
- No claim is made of a custom HACS browse-list icon, Marketplace installation, or upgrade verification.


## Marketplace README image fix — 2026-11-04

The live repository page showed revision `500d4f2`, broken screenshot placeholders, and document links ending at the revision directory. Executed the instance's deployed Markdown worker in a temporary Node VM harness: all three relative image paths became `<img src ...>` before Marketplace's repository URL resolver ran. This reproduced the missing-source failure. After changing the README to absolute HTTPS URLs pinned to existing v0.1.2 image assets, the same worker preserves all three image sources. README document links now use absolute GitHub URLs as well.

Candidate v0.1.3 passes `npm run package` (19 tests, release hygiene, packaging). The release guard now requires pinned raw GitHub image URLs belonging to this repository and corresponding local asset files. Calendar behavior and configuration are unchanged. The repository fix was published at commit `a59789f9b8d1a883b132bda3217783ff01462c02`. On the live Marketplace page, Menu → Refresh information replaced cached revision `500d4f2` with `a59789f`; the Forest Calendar icon, month screenshot, and dark agenda screenshot were visually confirmed. The example/dashboard links retain their full filenames. All three pinned image URLs return HTTP 200 with PNG content identical to the repository assets, without authentication. [Hosted CI/HACS validation](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41926745730) and the [v0.1.3 release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41926944416) passed. [v0.1.3 beta](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.1.3) is published. The downloaded checksums, standalone JavaScript, and all 32 ZIP files were verified against the tag before publishing. JavaScript SHA-256: `a1953782d1f176456243ebfb6100ba201093a9bacf498f56f505488223302902`. This verifies repository-page rendering, not installation or upgrade.


## User-reported installation and upgrade — 2026-11-04

The user reported: “I installed and then successfully was notified to upgrade, and just upgraded successfully.” This confirms the installation, update-notification, and upgrade workflow from the user's test. It is distinct from the agent's direct repository-page and automated checks.

The user then explicitly confirmed the tested card upgrade path as **0.1.1 → 0.1.3** and confirmed that the old manual resource was removed from Resources. R8 is complete based on these user-reported results.

HA/frontend build versions were not supplied. The agent did not independently inspect the final resource list or separately verify post-upgrade live events; those details must not be inferred from the reported successful upgrade.


## TV presentation candidate 0.2.0 — 2026-11-04

This is an **unreleased local candidate**, not a published Marketplace upgrade. The installed release file was preserved; one resource entry was temporarily pointed to a separate candidate file for testing. Private instance addresses, script IDs, and rollback details are stored outside the public repository.

- JavaScript syntax, **24 automated tests**, release structure, and bounded privacy checks pass. New tests cover opt-in TV defaults, allowlisted launcher parameters, civil two-week ranges across year/DST boundaries, navigation, and visible-viewport sizing when browser chrome reduces available height.
- The fictional Safari harness initially caught overflow with three events at 960 × 540, then caught the toolbar-visible 960 × 480 case. The final 11px/four-event layout passes the 960 × 480 fit check: 14 cells, card starts at 0,0, grid bottom at 468px, safe margin retained, and no card scrolling. The 960 × 540 and 1280 × 720 presets also fit. Opening People temporarily adds a filter row and may require scrolling.
- Verified People opens/collapses; an Alex filter retains family breakfast and the shared community-garden appointment. Restoring Everyone returns all events. A plain-URL standard preview retains the title, calendar name, month view, and attendee filters.
- On the physical Toshiba Fire TV, the user identified clipping and the Silk toolbar. ADB UI inspection measured a 120px native toolbar and confirmed clipped bottom-row controls. Added visible-viewport sizing, an adjustable safe margin, compact attendee dots, configurable event text size, and a separate browser-native fullscreen control.
- ADB activation of the named Browser fullscreen control succeeds on this TV. The parameterized launch script was saved and run with 11px text, four events per day, and automatic fullscreen. Its first selector attempt reported the control was not yet available; the second reported a successful click. Subsequent device UI inspection shows a full-display WebView from 0,0 to 1920,1080, no Silk toolbar node, and a calendar grid ending at y=1054.
- The user confirmed: **“Looks good—keep this size and detail.”** This is physical display feedback, in addition to the UI-geometry evidence. TV standby/reboot persistence of native browser fullscreen was not tested as part of this layout change.

Use the [parameterized launcher example](https://github.com/jaraggie/cozi-calendar-card/blob/main/docs/TV_LAUNCHER.md). Card YAML/visual-editor options and per-browser URL parameters are documented in the README. No HACS release, GitHub publication, or catalog submission was performed for this candidate.


## TV overflow rotation — 2026-11-05

Added optional automatic paging for TV month/two-week grids with `tv_auto_scroll` (`"off"`, `today`, `all`) and `tv_scroll_seconds` (5–300 seconds). The same options are available in the visual editor, URL overrides, and launcher fields. Existing cards retain off; the TV launcher now defaults to all overflowing days at 12 seconds, following the user's selection.

- **29 automated tests pass.** New cases cover complete cycles including partial final pages, today/all/off/standard scoping, progress across unchanged refreshes, list/date resets, configuration validation, and timer behavior while interacting or disconnected.
- A real browser timer harness at 960 × 540 passed today-only rotation: all **7/7** current-day fixture events appeared, unselected days remained unchanged, the grid fit, and API-call count stayed unchanged. All-days mode also passed, including **9/9** events on an overflowing future day. These checks use fictional events and actual five-second intervals in the test harness; the deployed script uses twelve seconds.
- Installed a separate candidate resource and updated the existing TV script. Read-only Android UI inspection showed today's **5–6 / 6** counter and the formerly hidden appointments. The browser remained fullscreen with WebView 0,0–1920,1080 and grid ending at y=1054.
- The user selected **all overflowing days at 12 seconds**, and that choice was saved as the script default and launched. A subsequent physical-device read showed later-page range counters on four separate days, with the same fullscreen/grid bounds and no native toolbar. This does not claim a multi-day unattended endurance test.

The timer updates only overflowing day lists, never refetches the event API, and pauses for details, filters, focused events/days, recent interaction, or hidden documents. This was tested as a local candidate before the release recorded below.

## Published TV beta and managed upgrade — 2026-11-05

- [v0.2.0 TV presentation and event rotation beta](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.2.0) is published as a pre-release at commit `c3d8e382656b8b1cab1e18ed7ec995029f4441ca`.
- Local `npm run package` passed with **29 tests**, syntax, release structure/version, bounded privacy checks, and packaging. Final review also corrected the README's URL-parameter table.
- [Candidate CI/HACS](https://github.com/jaraggie/cozi-calendar-card/actions/runs/42026972788), [tag CI/HACS](https://github.com/jaraggie/cozi-calendar-card/actions/runs/42027109376), and the [tag-specific draft release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/42027109404) passed without ignored checks.
- Downloaded all three draft assets before publication. Checksums and ZIP integrity pass; all **37 archived files** and the standalone JavaScript exactly match the tag. JavaScript SHA-256: `7c2021278a43773c5a7e1d8fc2f0b1937824d780b60c681d6505af6e3719fb2d`. Source ZIP SHA-256: `390437477fa7ef8d37685a6274720e2441f794dd6459d84997e213636e34f914`.
- Test instance: Home Assistant OS, **Core 2026.11.0**, **Frontend 20261028.4**, Supervisor 2026.10.5, OS 18.4, as displayed in About.
- Marketplace initially showed installed revision `6a052fc`. After Refresh information and enabling pre-releases, its update dialog offered **v0.2.0**. The upgrade completed and displayed installed/latest **v0.2.0**. This directly verifies the managed revision-to-tag update path; it does not replace the earlier user-reported 0.1.1 → 0.1.3 evidence.
- Marketplace added its managed resource during upgrade. Removed the temporary local test registration and refreshed the frontend. The Resources page then showed exactly one JavaScript module, under the managed community path with the v0.2.0 cache key. Opening that URL shows `VERSION = "0.2.0"`. The normal dashboard renders its title, month controls, and loaded-time footer without a card error.

- Relaunched the physical Toshiba Fire TV through the existing parameterized script after the resource migration. Android UI inspection shows a full-display WebView at 0,0–1920,1080, no native Silk toolbar node, and the two-week grid at 26,138–1894,1054. First-page counters `1–4 / 6` and `1–4 / 5` subsequently advanced to `5–6 / 6` on three days and `5–5 / 5` on the fourth. This confirms all-days rotation and the fitted layout after the managed upgrade. The script retains 11px event text, four events per page, and a twelve-second interval.

No new user visual approval was requested for this unchanged candidate layout; the earlier physical-TV approval remains the visual-feedback evidence. Multi-day unattended operation and browser fullscreen persistence after standby/reboot remain untested. Announcement and default-catalog submission remain separate open tasks.
