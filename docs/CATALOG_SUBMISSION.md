# Default-catalog submission draft

Not submitted. The user has confirmed installation, upgrade notification, successful upgrade **0.1.1 → 0.1.3**, and removal of the old manual resource. Gather beta feedback before opening the pull request. Re-read the current [publishing requirements](https://hacs.dev/docs/publish/start/) and [submission template](https://github.com/hacs/default/blob/master/.github/PULL_REQUEST_TEMPLATE.md) when submitting.

Repository entry: `jaraggie/cozi-calendar-card`, added in alphabetical order to the JSON list in [`hacs/default/plugin`](https://github.com/hacs/default/blob/master/plugin). Submit from the owner's personal fork with maintainer edits enabled.

## Evidence available

- Public repository, MIT license, README screenshots, description, topics, and Issues.
- HACS plugin action configured without an `ignore` input.
- Passing [candidate validation](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41916931766).
- Passing [tag-specific release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/41917089425).
- Published [v0.1.1 beta](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.1.1), created after validation, with verified assets.
- Hassfest does not apply: this is a dashboard plugin, not an integration.

## Remaining gates

- [x] User confirmed custom-repository installation, upgrade notification, successful upgrade **0.1.1 → 0.1.3**, and removal of the old manual resource on 2026-11-04. HA/frontend build versions were not supplied; this is user-reported evidence.
- [ ] Resolve beta feedback and decide which regular release to submit; replace the beta link with that release if applicable.
- [ ] Refresh the official checklist, verify all statements against current evidence, and submit the repository entry.

Suggested PR description: Add Cozi Family Calendar Card, an independent read-only dashboard plugin for one combined Cozi family feed, configurable attendee colors/aliases, shared-event labels, and person filters. Link the qualifying release and a passing HACS run. Do not check installation or release claims that have not been verified.
