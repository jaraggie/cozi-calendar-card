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
- [ ] R7 — Run hosted CI/HACS validation and publish a versioned GitHub release containing the JavaScript resource.
  - Hosted [Validate run](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41916218800) passed tests and HACS with no ignored checks. Release publication is in progress.
- [ ] R8 — Verify HACS custom-repository installation and upgrade in Home Assistant without loading duplicate resources.
- [ ] R9 — Post the reviewed announcement to the Home Assistant Community forum; collect initial feedback through GitHub Issues.
- [ ] R10 — After beta feedback, submit the repository for default-catalog inclusion.

Local preparation does not establish a successful hosted HACS validation, HACS installation, publication, or catalog acceptance. Update each task only after its corresponding evidence exists.

Prepared candidate: **0.1.1**. See `VALIDATION.md` for local evidence and `CONTRIBUTING.md` for the draft-release process. Release publication, installation verification, announcement, and catalog submission remain open.

Distribution work started: GitHub CLI is authorized, the public source is uploaded, and hosted validation passes. The first beta release is in progress. Installation testing is awaiting restoration of UI access after `cgWindowNotFound` errors; no HA resources have been changed.
