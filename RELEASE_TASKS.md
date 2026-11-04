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
- [ ] R8 — Verify HACS custom-repository installation and upgrade in Home Assistant without loading duplicate resources.
- [ ] R9 — Post the reviewed announcement to the Home Assistant Community forum; collect initial feedback through GitHub Issues. Draft has the published beta links and immutable screenshot URLs; it has not been posted.
- [ ] R10 — After beta feedback, submit the repository for default-catalog inclusion. See `docs/CATALOG_SUBMISSION.md` for the submission draft and remaining gates.

Local preparation does not establish a successful hosted HACS validation, HACS installation, publication, or catalog acceptance. Update each task only after its corresponding evidence exists.

Published beta: **0.1.2** ([Forest Calendar branding release](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.1.2)). See `VALIDATION.md` for evidence and `CONTRIBUTING.md` for the draft-release process. Installation verification, announcement, and catalog submission remain open.

Branding update: option A (Forest Calendar) is the selected project icon, promoted from prototype commit `8fbd376`. Published version **0.1.2** packages its SVG/PNG assets and README branding for GitHub and HACS repository details. GitHub’s custom social preview is saved. Hosted CI/HACS validation and the tag-specific release workflow passed; downloaded release checksums and all 32 archive files match the tag. Current HACS/Marketplace browse lists use a generic Dashboard category symbol; see `assets/README.md` for the verified source limitation.

UI access recovered after the earlier `cgWindowNotFound` errors. Marketplace accepted the public repository through Add from link; installation and resource migration remain pending. No HA resources have been changed. Before replacing the development resource, preserve explicit household members, verify a single managed resource, then reload and check live events. Both v0.1.1 and v0.1.2 are now available for a public-release upgrade test; no upgrade result has been claimed.
