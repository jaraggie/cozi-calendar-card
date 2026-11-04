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

- Clean HACS custom-repository installation, resource registration, frontend reload, and card-picker discovery.
- Upgrade between two releases with no duplicate manual resource loaded.
- Recheck on a physical phone and with another household's configured names and feed formatting.

Track progress in [`RELEASE_TASKS.md`](RELEASE_TASKS.md). Record the tested HA/frontend versions and release tag with each installation result.

The target HA instance exposes the built-in Marketplace. After recovering from the earlier `cgWindowNotFound` UI access failures, Add from link accepted the public repository. No Marketplace installation or resource migration has been performed yet; repository registration alone does not establish a successful installation.

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

The exact source/target card versions, HA/frontend versions, resource list, and post-upgrade live-event checks were not provided in that report. Do not assume the target was v0.1.3 solely because it is the latest published beta. The remaining R8 evidence audit is to record the versions and confirm that only the managed resource is registered, with the old manual resource removed.
