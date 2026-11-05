# Community release tasks

Target: a generic, independently maintained Cozi Family Calendar Card, ready for a public GitHub repository and HACS custom-repository installation.

## Preparation

- [x] Preserve the installed household version and configuration outside the release directory (`../.local/cozi-calendar-card/`).
- [x] R1 — Remove household-specific runtime defaults and calendar selection; add regression coverage. Owner: runtime agent.
- [x] R2 — Add HACS manifest, CI, release packaging, license, and contributor templates. Owner: packaging agent.
- [x] R3 — Write generic installation/configuration documentation, changelog, and community announcement draft. Owner: documentation agent.
- [x] R4 — Add screenshots using fictional events. Owner: coordinator.
- [x] R5 — Review combined changes, run tests, inspect the release archive for personal data, and record evidence. Owner: coordinator.

## Distribution

- [x] R6 — Create the public GitHub repository with description, topics, and Issues enabled; confirm the publishing account. Published repository: https://github.com/jaraggie/cozi-calendar-card (owner: jaraggie). Private vulnerability reporting is enabled.
- [x] R7 — Run hosted CI/HACS validation and publish a versioned GitHub release containing the JavaScript resource. [v0.1.1 community beta](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.1.1) is published with JavaScript, source ZIP, and checksums. [Candidate CI](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41916931766) and [tag-specific release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41917089425) passed with no ignored HACS checks. All three downloaded assets were verified against checksums and the tag.
- [x] R8 — User confirmed Marketplace installation of **0.1.1**, upgrade notification, successful upgrade to **0.1.3**, and removal of the old manual resource from Resources on 2026-11-04. HA/frontend build versions were not supplied; see `VALIDATION.md` for the evidence scope.
- [x] R9 — Publish the owner-reviewed announcement to the Home Assistant Community forum. Moderation approved on 2026-11-05; the [public topic](https://community.home-assistant.io/t/cozi-family-calendar-card-one-family-feed-with-attendee-colors-and-shared-events/1032624) is verified. See `docs/COMMUNITY_ANNOUNCEMENT.md`.
- [x] R10 — Submit the repository for default-catalog inclusion. Submitted [hacs/default #13407](https://github.com/hacs/default/pull/13407) from the owner's personal fork with one sorted plugin addition and maintainer edits enabled. Catalog review/acceptance remains external and pending; see `docs/CATALOG_SUBMISSION.md`.

Local preparation does not establish a successful hosted HACS validation, HACS installation, publication, or catalog acceptance. Update each task only after its corresponding evidence exists.

Published regular release: **0.2.0** ([TV presentation and event rotation](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.2.0)). Promoted from beta at the catalog maintainer's request, with owner approval, without changing the validated tag or assets. See `VALIDATION.md` for evidence and `CONTRIBUTING.md` for the draft-release process. The earlier user-confirmed upgrade path was **0.1.1 → 0.1.3**. The announcement is public; catalog submission #13407 remains subject to maintainer review.

External follow-up:

- [x] Confirm forum moderation approval and record the public topic URL.
- [ ] Collect community feedback through GitHub Issues.
- [ ] Resolve catalog maintainer feedback and confirm merge/inclusion after the catalog scan. Submission alone is not acceptance.

Branding update: option A (Forest Calendar) is the selected project icon, promoted from prototype commit `8fbd376`. Published version **0.1.2** packages its SVG/PNG assets and README branding for GitHub and HACS repository details. GitHub’s custom social preview is saved. Hosted CI/HACS validation and the tag-specific release workflow passed; downloaded release checksums and all 32 archive files match the tag. Current HACS/Marketplace browse lists use a generic Dashboard category symbol; see `assets/README.md` for the verified source limitation.

UI access recovered after the earlier `cgWindowNotFound` errors. Marketplace accepted the public repository through Add from link. The user subsequently confirmed installation of 0.1.1, receipt of an upgrade notification, successful upgrade to 0.1.3, and removal of the old manual resource from Resources. This completes the user-run installation/upgrade task; the agent did not independently inspect the final resource list.

Marketplace image display is verified: v0.1.3 uses absolute pinned image URLs because the HA Markdown sanitizer stripped relative sources. After Refresh information, the live repository page displays the project icon and both screenshots. Hosted CI/HACS validation and release checks pass; downloaded assets match the tag. Repository-page rendering was directly verified; installation and upgrade success were subsequently reported by the user. R8 is complete based on the user-confirmed upgrade path and removal of the old manual resource.


## TV presentation release 0.2.0

- [x] Optional TV presentation, two-week grid, configurable title/filter/footer, fill-window mode, text size, and safe margin.
- [x] Allowlisted URL overrides and a parameterized Android/Silk launcher example.
- [x] Syntax, 29 automated tests, package/privacy checks, browser layout checks, and live-timer overflow rotation checks.
- [x] Local HA candidate install and script-driven native fullscreen verified on a physical Fire TV; user approved 11px text and four events per day.
- [x] Publish the candidate through the tag-specific draft release workflow; verify downloaded assets before publishing the beta. [CI/HACS](https://github.com/jaraggie/cozi-calendar-card/actions/runs/42026972788) and [release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/42027109404) passed. All 37 ZIP files and the standalone JavaScript match the tag.
- [x] Upgrade through Marketplace to v0.2.0 and remove the temporary candidate resource entry. The Resources page now contains one managed JavaScript module; the served source reports 0.2.0. Relaunched the physical Fire TV and verified fullscreen, grid bounds, and first/later event pages across all four overflowing days. See `VALIDATION.md` for build versions and limits.

- [x] Automatic overflow paging with today/all/off scope and configurable interval; user selected all overflowing days every 12 seconds. Browser fixture tests and physical-TV later-page evidence recorded in VALIDATION.md.
