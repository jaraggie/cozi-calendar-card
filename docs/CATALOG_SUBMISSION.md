# Default-catalog submission

Submitted on 2026-11-05: [hacs/default #13407](https://github.com/hacs/default/pull/13407). This requests inclusion; it does not establish catalog acceptance. Version 0.2.0 is now a full, non-prerelease release.

Repository entry: `jaraggie/cozi-calendar-card`, added in alphabetical order to the JSON list in [`hacs/default/plugin`](https://github.com/hacs/default/blob/master/plugin). Submitted from the owner's personal fork, branch `add-cozi-calendar-card`, with maintainer edits enabled. The verified diff contains one addition and no deletions in one file.

## Evidence available

- Public repository, MIT license, README screenshots, description, topics, and Issues.
- HACS plugin action configured without an `ignore` input.
- Passing [0.2.0 candidate validation](https://github.com/jaraggie/cozi-calendar-card/actions/runs/42026972788).
- Passing [0.2.0 tag-specific release workflow](https://github.com/jaraggie/cozi-calendar-card/actions/runs/42027109404).
- Published [v0.2.0](https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.2.0), created after validation, with verified assets; promoted from beta to a regular release on 2026-11-05 without changing its tag or assets.
- Direct Marketplace upgrade and physical Fire TV fullscreen/rotation verification on HA Core 2026.11.0 / Frontend 20261028.4; see `../VALIDATION.md`.
- Hassfest does not apply: this is a dashboard plugin, not an integration.

## Submission checklist

- [x] User confirmed custom-repository installation, upgrade notification, successful upgrade **0.1.1 → 0.1.3**, and removal of the old manual resource on 2026-11-04. HA/frontend build versions were not supplied; this is user-reported evidence.
- [x] User requested submission of the current tested beta; its pre-release status is disclosed in the PR.
- [x] Refresh the official checklist, verify all statements against current evidence, and submit the repository entry.
- [x] Address the maintainer's request for a full release: v0.2.0 is no longer a prerelease and is returned by GitHub's latest-release endpoint. The release asset IDs, hashes, sizes, and tag are unchanged. README installation guidance no longer requires beta opt-in.
- [ ] Catalog maintainers review and merge the submission; inclusion follows their scheduled scan.

The initial [#13404](https://github.com/hacs/default/pull/13404) was closed by the checklist bot because six items were checked. The [bot source](https://github.com/hacs/bot/blob/main/src/plugins/pull_request.opened.default.ts) requires exactly five checked items for a dashboard plugin and six for an integration. The replacement preserves the template's unchecked integration-only hassfest item and explains why it does not apply. Do not add a sixth checked N/A item.

Requirements checked against the [catalog guide](https://contributors.home-assistant.io/marketplace/guides/catalog/), [general publishing requirements](https://hacs.dev/docs/publish/start/), [dashboard requirements](https://hacs.dev/docs/publish/plugin/), and live [PR template](https://github.com/hacs/default/blob/master/.github/PULL_REQUEST_TEMPLATE.md). No individual reviews were requested.

Maintainer feedback on 2026-11-05: publish a full non-prerelease release so default-store users can install without opting into beta versions. The owner approved promoting the tested 0.2.0, updating installation guidance, marking the PR ready, and replying. This promotion changes distribution metadata and notes; it does not claim additional endurance or phone testing.
