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

The target HA instance exposes the built-in Marketplace and its Add from link dialog. Before installing the public card, the UI automation connection failed with `cgWindowNotFound` for both HA and Safari, including after reconnect/reset attempts. No Marketplace installation or resource migration has been performed yet. This is a UI access failure, not a failed card installation.
