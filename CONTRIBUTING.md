# Contributing

Use GitHub Issues for reproducible bugs and feature ideas, and pull requests for reviewed changes. Include the card and Home Assistant versions and use fictional event data. Never post a subscription URL, token, real appointment details, or an unredacted household screenshot.

The project is an independent dashboard card. Changes should preserve the single combined-feed model and read-only access through the current Home Assistant session.

## Development

Node.js 20 or newer is required for the dependency-free checks and tests. No `npm install` is needed.

```sh
npm run check
npm test
npm run release:check
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/demo.html` for fictional events. For UI changes, check month and narrow agenda layouts, light/dark themes, filtering, event details, and the visual editor. Add tests for behavior changes, including date boundaries when applicable. Update the changelog and relevant examples.

## Release preparation

1. Update the version in `package.json` and the JavaScript version constant, and add its changelog entry.
2. Run `npm run package`. It checks the source, runs tests and bounded release hygiene checks, then writes `release/cozi-calendar-card.js`, a deterministic source ZIP, and `SHA256SUMS`. Python 3 is required for ZIP packaging. Review the files and screenshots manually as well; automated scanning cannot establish that every event is fictional.
3. After creating the public repository, set a description and relevant topics, enable Issues and private vulnerability reporting, and run the Validate workflow. All HACS checks must pass without ignored checks. Local checks do not substitute for hosted HACS validation.
4. Create and push the corresponding existing tag, such as `v0.1.1`. Run **Prepare draft release** from that same tag ref, for example `gh workflow run release.yaml --ref v0.1.1 -f tag=v0.1.1`. It rejects a different dispatch ref, checks the candidate tag/version and tests, checks remote HACS repository compatibility, then creates a **draft** GitHub release with the JavaScript, source ZIP, and checksums. HACS chooses the remote revision by its own event/release rules; that step alone does not certify the candidate release assets. It does not publish on pushes or tags.
5. Review the draft, replace its full changelog with the relevant version notes, and publish only when ready. Do not attach private instance configuration. HACS installs `cozi-calendar-card.js`, not the source ZIP.
6. Verify HACS custom-repository install and an upgrade using the public release assets before announcing broad availability. A manual resource and HACS resource must not load the same card twice.

The release package is an explicit allowlist; local backup directories, archives, and credentials are excluded. Keep personal configuration outside this repository. The workflow has read-only permissions except for its isolated draft-release job, which needs `contents: write`.

Packaging and validation follow the official [dashboard publishing guide](https://contributors.home-assistant.io/marketplace/guides/dashboard/), [manifest reference](https://contributors.home-assistant.io/marketplace/reference/hacs-json/), and [HACS validation guide](https://contributors.home-assistant.io/marketplace/reference/validation/). Action updates are proposed monthly through Dependabot.
