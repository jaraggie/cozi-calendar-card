# Forest Calendar branding

The user selected **option A, Forest Calendar**, on 2026-11-04. The familiar calendar silhouette and dark green tile are the project's chosen identity.

The primary comparison source is local prototype branch `prototype/cozi-icons`, commit `8fbd376`. Only the selected icon is promoted here; the R concept and prototype switcher remain off main.

- `icon.svg`: original vector master, no fonts or external resources.
- `icon.png`: 512 × 512 PNG with transparent corners.
- `icon-128.png`: 128 × 128 PNG used by the README.
- `social-preview.png`: 1280 × 640 GitHub link-preview image using the same icon.
- Colors: forest `#123F35`, ivory `#F5F3E9`, mint `#6B9A82`.

These original assets share the project's MIT license. They identify this independent community project and are not official Cozi or Home Assistant branding.

## HACS and Marketplace visibility

The README is rendered on repository detail pages, so its opening image supplies the project branding there. The current browse-list implementations use a generic category symbol for dashboard plugins. Brand-image lookups are limited to integrations; adding an `icon` field to `hacs.json` does not enable a custom dashboard listing icon.

Verified against the primary source:

- [HACS dashboard icon selection](https://github.com/hacs/frontend/blob/main/src/dashboards/hacs-dashboard.ts).
- [Marketplace repository icon selection](https://github.com/home-assistant/frontend/blob/dev/src/panels/marketplace/tools/repository-icon.ts).
- [Supported hacs.json keys](https://contributors.home-assistant.io/marketplace/reference/hacs-json/).

HACS default-catalog submission is a separate step from branding and remains tracked in `RELEASE_TASKS.md`.
