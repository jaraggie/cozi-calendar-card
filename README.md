# Cozi Family Calendar Card

An independent, read-only Home Assistant dashboard card for **one combined Cozi family calendar**. It turns attendee prefixes into configurable person colors and labels, so a shared appointment appears once with everyone involved.

![Month view with fictional family events](docs/images/month.png)

![Agenda view with fictional family events](docs/images/agenda.png)

This is an original community project, unaffiliated with Cozi or Home Assistant. It has no external JavaScript dependencies, build step, telemetry, or separate Cozi login. The card reads events from an existing Home Assistant calendar entity; it does not edit events or contact Cozi directly.

## Features

- Month and agenda views, with automatic agenda view on narrow cards.
- Configurable people, colors, and aliases: `Alex/Jordan: Library visit` becomes `Library visit` with two colored attendee labels.
- Family-wide events: `All: Family dinner` becomes `Family dinner` with a Family label.
- Person filters that retain shared appointments and family-wide events.
- Event details with participants, date/time, location, and description.
- HA time zone, all-day events, multi-day appointments, and daylight-saving handling.
- Visual configuration editor and YAML configuration.

Use the **combined family feed** rather than several individual feeds. Shared events already have a single entry in that feed. The card does not merge multiple calendar entities.

## Connect the family calendar

Skip this section if the combined calendar already works in Home Assistant.

1. In Cozi, open **Settings → Shared Cozi Calendars**, enable sharing for **All** family members, and use **View or Send Cozi URL → Copy Cozi URL**. See [Cozi's sharing instructions](https://www.cozi.com/using-cozi-with-other-calendars/).
2. In HA, open **Settings → Devices & services → Add Integration → Remote Calendar**. Enter a calendar name and the copied calendar URL; keep HTTPS certificate verification enabled. See [Remote Calendar setup](https://www.home-assistant.io/integrations/remote_calendar/).
3. Confirm the calendar displays events in HA's Calendar page. Find its `calendar.*` entity ID for the card configuration. The examples below use the fictional `calendar.family_cozi`; replace it with your own entity.

Keep the subscription URL private. Enter it only in the calendar integration, never in the card, screenshots, public issues, or repository files. There is no need to share a Cozi password or an HA access token with this project.

## Install

### HACS custom repository

Install this project as a custom Dashboard repository. Default-catalog acceptance is a separate process; this README does not imply it has happened.

[Open this repository in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=jaraggie&repository=cozi-calendar-card&category=plugin) · [GitHub releases](https://github.com/jaraggie/cozi-calendar-card/releases)

1. In HACS, open the three-dot menu and choose **Custom repositories**.
2. Paste `https://github.com/jaraggie/cozi-calendar-card` and choose **Dashboard** as the type.
3. Add the repository, open **Cozi Family Calendar Card**, and download the desired release.
4. Reload the HA frontend. If dashboard resources are managed in YAML, add the module resource shown by the installer.
5. Add the **Cozi Family Calendar** card to a dashboard and select the combined calendar entity.

These steps follow [HACS custom repository instructions](https://hacs.dev/docs/faq/custom_repositories/). Do not load both the manual and HACS copies of this card at the same time. When migrating, remove the old manual resource entry so the custom element is registered only once.

### Manual installation

1. Download `cozi-calendar-card.js` from a release and copy it to `/config/www/cozi-calendar-card.js`. Create `www` if needed. Only this JavaScript file is required on HA.
2. Open your dashboard's **Resources** settings (enable Advanced Mode in your HA profile if needed).
3. Add `/local/cozi-calendar-card.js?v=0.1.1` as a **JavaScript module**. For YAML-managed resources, use:

   ```yaml
   resources:
     - url: /local/cozi-calendar-card.js?v=0.1.1
       type: module
   ```

4. Reload the HA frontend, edit a dashboard, and add **Cozi Family Calendar**.
5. Select your combined `calendar.*` entity. Add each person and any aliases exactly as they appear in the feed, choose colors, and save.
6. Reload again and check an individual, a shared, and an `All:` event.

See HA's [custom card guide](https://contributors.home-assistant.io/frontend/custom-ui/card/) for resources. This card is used on a dashboard; it does not replace HA's built-in sidebar Calendar page.

## Configure

Start with your combined calendar entity and add your members:

```yaml
type: custom:cozi-calendar-card
entity: calendar.family_cozi
title: Family calendar
members:
  - name: Alex
    aliases: [Al]
    color: "#4267d5"
  - name: Jordan
    color: "#ad7100"
  - name: Sam
    color: "#16806d"
```

The names and entity above are fictional. With no configured members, family-wide prefixes are recognized and other titles stay intact; the card prompts you to add people. The card picker selects a uniquely identifiable Cozi family calendar when possible and leaves ambiguous selections for you to choose. See [`example.yaml`](example.yaml) for more options and [`dashboard.yaml`](dashboard.yaml) for a full-width Panel dashboard. Configure your members explicitly; the public card does not assume a household roster.

The visual editor handles the entity, title, starting view, agenda range, members, aliases, colors, and title/label options. Other options are available in YAML.

| Option | Default | Meaning |
| --- | --- | --- |
| `entity` | Empty | Combined family `calendar.*` entity |
| `title` | Family calendar | Card heading |
| `members` | Empty list | List of `name`, six-digit hex `color`, and optional `aliases` list |
| `initial_view` | `month` | `month` or `agenda`; narrow cards start in agenda |
| `days_to_show` | `7` | Agenda range, 1–90 days |
| `max_events_per_day` | `4` | Month entries before “more,” 1–20; tap a date or “more” for its agenda |
| `start_of_week` | `0` | Sunday = 0, Monday = 1, through Saturday = 6 |
| `strip_prefix` | `true` | Remove recognized attendee prefixes from displayed titles |
| `show_attendees` | `true` | Show participant names and colored dots |
| `show_empty_days` | `false` | Include days without events in agenda |
| `family_color` | `#427f73` | Color for All/Family/Everyone events |
| `shared_color` | `#71618f` | Color for shared or unassigned events |
| `refresh_minutes` | `5` | Re-read HA's event API, 1–1440 minutes |
| `deduplicate_events` | `true` | Suppress identical repeated API entries |
| `time_zone` | HA time zone | Optional IANA time zone override |
| `language` | HA language | Optional Intl locale, e.g. `en-US` |
| `hour24` | Browser locale default | Set `true` for 24-hour or `false` for 12-hour times |

All colors use `#RRGGBB`. Names and aliases must be unique; All, Family, and Everyone are reserved family labels. Filters and the selected date/view are temporary and reset when the card is recreated.

Recognized name separators are slash, comma, ampersand, and `and`. An unknown prefix such as `Project: Launch` stays intact. If a shared prefix contains both a configured member and an unconfigured person, the unknown name is retained with a neutral color. An entirely unknown person's single-name prefix remains in the title until that person is configured.

Shared events use the shared border color and each attendee's own label color. Identical duplicate API entries are collapsed conservatively; separately identified appointments are kept.

### Refresh behavior

Reload and `refresh_minutes` read events already available to HA. They do not force the calendar integration to fetch the subscription again. Remote Calendar normally checks the source every 24 hours; its official documentation explains how to configure a different polling interval. [Remote Calendar data updates](https://www.home-assistant.io/integrations/remote_calendar/#data-updates)

## Development and preview

```sh
npm run check
npm test
python3 -m http.server 8765 --bind 127.0.0.1
```

Open <http://127.0.0.1:8765/demo.html>. The demo uses fictional events, a mock HA API, and controls for dark theme, narrow width, API errors, and the editor. It does not connect to HA or Cozi. Stop the server with Ctrl+C.

Use `demo.html?stress=1` to include HTML-looking event text for escaping checks. Documentation captures use `?showcase=1` (month, two visible events per day) and `?showcase=1&narrow=1&dark=1` (390px-wide dark agenda). The screenshots above are cropped browser captures of those fictional previews; the agenda capture shows the first day.

The JavaScript source is the deployable resource. After a manual update, replace the file, increment the resource URL's `?v=` value, and reload the frontend. A clean HACS installation and upgrade check is part of the release checklist.

See [`VALIDATION.md`](VALIDATION.md) for evidence and limits, [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidance, and [`CHANGELOG.md`](CHANGELOG.md) for release notes. Report problems through the published repository's Issues tab with versions, sanitized configuration, and fictional reproductions. Never attach a private feed URL or an unredacted family calendar.

## License

[MIT](LICENSE). Cozi is a trademark of its respective owner. This community card is not an official Cozi product.
