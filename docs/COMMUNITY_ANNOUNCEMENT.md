# Community announcement draft

Status: draft only. The beta is published, but installation/upgrade testing and the forum post are still pending. Review and update the installation result before posting. This file is not evidence of a public announcement.

Suggested forum category: Home Assistant Community → Share your Projects → [Dashboards & Frontend](https://community.home-assistant.io/c/projects/frontend/34).

Suggested title: **Cozi Family Calendar Card: one family feed with attendee colors and shared events**

---

I built an independent Home Assistant dashboard card for Cozi's combined family feed. The goal is a readable family calendar where a shared appointment appears once, with colored labels for everyone involved.

It includes:

- Month and agenda views, including a narrow-screen agenda.
- Configurable names, aliases, and colors.
- Person filters that retain shared and family-wide appointments.
- Cleaned attendee prefixes and an event-details dialog.
- A visual editor and YAML options.

The card reads an existing HA calendar entity. Add Cozi's **All** shared calendar through HA's Remote Calendar integration, then choose that entity and configure your members. It does not ask for a Cozi login, edit appointments, send telemetry, or contact Cozi directly.

This is an original MIT-licensed community project, unaffiliated with Cozi or Home Assistant. The first release is a beta, and feedback on different feed formats, screen sizes, and time zones would be useful.

**Repository:** https://github.com/jaraggie/cozi-calendar-card

**Beta release:** https://github.com/jaraggie/cozi-calendar-card/releases/tag/v0.1.1

**Installation:** [README](https://github.com/jaraggie/cozi-calendar-card#install). Use a custom Dashboard repository in HACS, or Add from link in Home Assistant Marketplace. Enable pre-releases if the beta is not offered. The card is not yet in the default catalog. Installation and upgrade testing are still being completed for this initial beta.

![Month view — fictional events](https://raw.githubusercontent.com/jaraggie/cozi-calendar-card/v0.1.1/docs/images/month.png)

![Agenda view — fictional events](https://raw.githubusercontent.com/jaraggie/cozi-calendar-card/v0.1.1/docs/images/agenda.png)

Please report bugs in the repository's Issues tab with HA/card versions and a fictional example that reproduces the issue. Keep calendar subscription URLs, tokens, and private event details out of posts and issue attachments.
