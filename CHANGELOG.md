# Changelog

## Unreleased

- Lead installation instructions with HACS/Marketplace search following default-catalog approval; retain custom repositories as a fallback.

## 0.2.0 — 2026-11-05

- Optional TV display mode with adjustable event text, compact navigation, safe margins, and a two-week view.
- Automatic paging of today's overflowing events or all overflowing days, with configurable dwell time, range counters, and interaction pauses. Existing cards default to off; the example TV launcher enables all-days rotation at 12-second intervals.
- Configure title, initial attendee-filter visibility, footer, and fill-window layout in YAML or the visual editor.
- Allowlisted URL presentation parameters let launcher scripts select TV settings without changing the shared dashboard configuration.
- Fill-window layout covers HA navigation without requiring browser fullscreen permission. Exit it with the toolbar button.
- Separate browser fullscreen control and a parameterized Android/Silk launcher example.
- TV displays following Today roll to the current week during automatic refresh; manually browsed dates remain selected.

## 0.1.3 — 2026-11-04

- Fix missing Marketplace README images with absolute URLs to pinned, published icon and screenshot assets. Relative image URLs were stripped by the HA Markdown sanitizer before Marketplace could resolve them.
- Use absolute GitHub URLs for README document links affected by the same sanitizer behavior.
- Update release hygiene checks to require pinned repository image URLs. Calendar behavior and configuration are unchanged.

## 0.1.2 — 2026-11-04

- Adopt the selected Forest Calendar icon in dark green and ivory.
- Add original SVG, transparent 512px/128px PNGs, and a GitHub social preview.
- Show the icon at the top of the README for GitHub and HACS/Marketplace repository details.
- Document the generic browse-list icon limitation for dashboard plugins.
- Calendar behavior and configuration are unchanged.

## 0.1.1 — 2026-11-04

First community beta. Version 0.1.0 was a development build and is not a public release.

- Read one combined Cozi family calendar through Home Assistant's calendar event API.
- Show month and agenda views, configurable attendees, aliases, person colors, and shared/family labels.
- Filter individual, shared, family-wide, and unassigned events without duplicating a shared appointment for every attendee.
- Show plain-text event details and handle all-day, multi-day, and time-zone boundaries.
- Provide a visual configuration editor and a fictional local demo.
- Package a standalone JavaScript module for manual and HACS custom-repository installation.
- Use generic configuration rather than assuming a household roster.

Hosted validation, HACS installation/upgrade, and publication are tracked separately in the release task list.
