# Community announcement

Status: approved and published on 2026-11-05. [Public announcement](https://community.home-assistant.io/t/cozi-family-calendar-card-one-family-feed-with-attendee-colors-and-shared-events/1032624). The owner confirmed approval, and the agent verified the topic title, author, and Dashboards & Frontend category on the published page.

The submitted text below is preserved as posted. It described 0.2.0 as a beta at submission time; the same validated release was subsequently promoted to a regular release to address catalog maintainer feedback. Its tag and downloadable assets were unchanged.

Submitted category: Home Assistant Community → Share your Projects → [Dashboards & Frontend](https://community.home-assistant.io/c/projects/frontend/34).

Submitted title: **Cozi Family Calendar Card: one family feed with attendee colors and shared events**

---

I built an independent Home Assistant dashboard card for Cozi's combined family feed. The goal is a readable family calendar where a shared appointment appears once, with colored labels for everyone involved.

It includes:

- Month, two-week, and agenda views, including a narrow-screen agenda.
- Configurable names, aliases, and colors.
- Person filters that retain shared and family-wide appointments.
- Cleaned attendee prefixes and an event-details dialog.
- A visual editor and YAML options.
- Optional TV presentation with adjustable text, safe margins, compact controls, and browser fullscreen.
- Automatic paging of overflowing days so a wall display can show appointments beyond “+ more.” Rotate today only or all overflowing days, with configurable timing and interaction pauses.
- URL presentation parameters and a parameterized Android/Silk launcher example for HA scripts.

The card reads an existing HA calendar entity. Add Cozi's **All** shared calendar through HA's Remote Calendar integration, then choose that entity and configure your members. It does not ask for a Cozi login, edit appointments, send telemetry, or contact Cozi directly.

This is an original MIT-licensed community project, unaffiliated with Cozi or Home Assistant. The current release is a beta, and feedback on different feed formats, screen sizes, and time zones would be useful.

**Repository:** https://github.com/jaraggie/cozi-calendar-card

**Beta release:** https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.2.0

**Installation:** [README](https://github.com/jaraggie/cozi-calendar-card#install). Use a custom Dashboard repository in HACS, or Add from link in Home Assistant Marketplace. Enable pre-releases if the beta is not offered. The card is not yet in the default catalog. The v0.2.0 Marketplace upgrade was verified on HA Core 2026.11.0 / Frontend 20261028.4, and TV fullscreen and all-days event rotation were checked on a physical Fire TV. Broader beta feedback is welcome.

![Month view — fictional events](https://raw.githubusercontent.com/jaraggie/cozi-calendar-card/v0.1.1/docs/images/month.png)

![Agenda view — fictional events](https://raw.githubusercontent.com/jaraggie/cozi-calendar-card/v0.1.1/docs/images/agenda.png)

Please report bugs in the repository's Issues tab with HA/card versions and a fictional example that reproduces the issue. Keep calendar subscription URLs, tokens, and private event details out of posts and issue attachments.
