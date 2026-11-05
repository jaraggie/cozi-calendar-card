![Cozi Family Calendar Card icon](https://raw.githubusercontent.com/jaraggie/cozi-calendar-card/v0.1.2/assets/icon-128.png)

# Cozi Family Calendar Card

An independent, read-only Home Assistant dashboard card for **one combined Cozi family calendar**. It turns attendee prefixes into configurable person colors and labels, so a shared appointment appears once with everyone involved.

![Month view with fictional family events](https://raw.githubusercontent.com/jaraggie/cozi-calendar-card/v0.1.2/docs/images/month.png)

![Agenda view with fictional family events](https://raw.githubusercontent.com/jaraggie/cozi-calendar-card/v0.1.2/docs/images/agenda.png)

This is an original community project, unaffiliated with Cozi or Home Assistant. It has no external JavaScript dependencies, build step, telemetry, or separate Cozi login. The card reads events from an existing Home Assistant calendar entity; it does not edit events or contact Cozi directly.

## Features

- Month, two-week, and agenda views, with automatic agenda view on narrow standard cards.
- Optional TV presentation with automatic overflow paging and script-controlled layout.
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

The initial community release is a beta. Enable pre-releases for this repository if the beta version is not offered. On Home Assistant versions with the built-in **Marketplace**, open **Settings → Marketplace → Add from link**, enter the repository URL below, and follow the prompts. Older installations use HACS as described below.

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
3. Add `/local/cozi-calendar-card.js?v=0.2.0` as a **JavaScript module**. For YAML-managed resources, use:

   ```yaml
   resources:
     - url: /local/cozi-calendar-card.js?v=0.2.0
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

The names and entity above are fictional. With no configured members, family-wide prefixes are recognized and other titles stay intact; the card prompts you to add people. The card picker selects a uniquely identifiable Cozi family calendar when possible and leaves ambiguous selections for you to choose. See [`example.yaml`](https://github.com/jaraggie/cozi-calendar-card/blob/main/example.yaml) for more options and [`dashboard.yaml`](https://github.com/jaraggie/cozi-calendar-card/blob/main/dashboard.yaml) for a full-width Panel dashboard. Configure your members explicitly; the public card does not assume a household roster.

The visual editor handles the entity, title, starting view, agenda range, members, aliases, colors, and title/label options. Other options are available in YAML.

| Option | Default | Meaning |
| --- | --- | --- |
| `entity` | Empty | Combined family `calendar.*` entity |
| `title` | Family calendar | Card heading |
| `members` | Empty list | List of `name`, six-digit hex `color`, and optional `aliases` list |
| `initial_view` | `month` (`fortnight` in TV mode) | `month`, `fortnight`, or `agenda`; standard narrow cards start in agenda |
| `display_mode` | `standard` | `standard` or `tv`; TV uses larger events and compact controls |
| `tv_auto_scroll` | `"off"` | Rotate overflow pages in TV grids: `"off"`, `today`, or `all` |
| `tv_scroll_seconds` | `12` | Seconds per event page, 5–300 |
| `tv_font_size` | `13` | TV event title size, 9–22 CSS pixels |
| `tv_safe_area` | `12` in TV mode | Window-fill safe margin, 0–64 CSS pixels |
| `screen_mode` | `normal` | `normal` or `fill`; fill covers the browser content area in a single-card dashboard |
| `show_header` | `true` (`false` in TV mode) | Show the card title and calendar name |
| `show_filters` | `true` (`false` in TV mode) | Show attendee filters initially; People can reveal them |
| `show_footer` | `true` (`false` in TV mode) | Show loaded time and time zone |
| `days_to_show` | `7` | Agenda range, 1–90 days |
| `max_events_per_day` | `4` (`3` in TV mode) | Grid entries before “more,” 1–20; tap a date or “more” for its agenda |
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

### TV display and launcher scripts

Use a single-card Panel view and add these options to the existing calendar card (keep your entity and members):

```yaml
display_mode: tv
initial_view: fortnight
screen_mode: fill
show_header: false
show_filters: false
show_footer: false
max_events_per_day: 4
tv_font_size: 11
tv_safe_area: 12
tv_auto_scroll: today
tv_scroll_seconds: 12
```

A launcher can override presentation per browser without editing the shared dashboard:

```text
/lovelace/family?cozi_display=tv&cozi_view=fortnight&cozi_screen=fill&cozi_header=0&cozi_filters=0&cozi_footer=0&cozi_max_events=4&cozi_font_size=11&cozi_safe_area=12&cozi_scroll=today&cozi_scroll_seconds=12
```

| URL parameter | Allowed values | YAML option |
| --- | --- | --- |
| `cozi_display` | `standard`, `tv` | `display_mode` |
| `cozi_view` | `month`, `fortnight`, `agenda` | `initial_view` |
| `cozi_screen` | `normal`, `fill` | `screen_mode` |
| `cozi_header` | `0`, `1` | `show_header` |
| `cozi_filters` | `0`, `1` | `show_filters` |
| `cozi_footer` | `0`, `1` | `show_footer` |
| `cozi_scroll` | `off`, `today`, `all` | `tv_auto_scroll` |
| `cozi_scroll_seconds` | `5`–`300` | `tv_scroll_seconds` |
| `cozi_font_size` | `9`–`22` | `tv_font_size` |
| `cozi_safe_area` | `0`–`64` | `tv_safe_area` |
| `cozi_max_events` | `1`–`20` | `max_events_per_day` |

URL values take precedence on card creation; invalid values are ignored. Entity, members, and credentials cannot be changed through these parameters. Use a full URL in an Android VIEW intent, enclose it in single quotes so `&` stays inside the URL, and restrict the intent to the installed browser. A parameterized example is in [TV launcher configuration](https://github.com/jaraggie/cozi-calendar-card/blob/main/docs/TV_LAUNCHER.md).

Fill mode covers Home Assistant's navigation. The separate Browser fullscreen button requests native fullscreen and requires a click or key gesture; the example ADB launcher can activate this control after loading. Its selector finds the named control rather than assuming screen coordinates. Browser support varies. The fill-window button exits fill mode; browser Back/Escape exits native fullscreen. The safe margin accommodates TV overscan. TV mode follows the current week on automatic refresh until you navigate to another date; Today resumes following the current date. TV grid events use colored attendee dots beside the time; names remain in the accessible event label and event details. People reveals the name/color legend and filters. Event details and People filters remain available. Large event limits, visible headers/filters, or an unusually short viewport can require scrolling.

### Automatic TV event rotation

`tv_auto_scroll: today` advances only today's overflowing list in groups of `max_events_per_day`; `all` advances every overflowing day. A counter such as `↻ 5–6 / 6` identifies the visible range, then loops back to the first page. All-day and shared appointments participate normally. Other days retain the interactive “+ more” behavior in today-only mode.

The grid stays still, and only event lists change. The timer does not fetch calendar data. Opening event details or People, focusing a day/event, or hiding the browser tab pauses rotation. Other interaction pauses it for 30 seconds. Filters, date navigation, and changed event lists reset to the first page; an unchanged calendar refresh retains progress. Agenda view already displays all events and does not rotate. Quote `"off"` in YAML to disable rotation. Existing cards default to off; the TV launcher example defaults to all overflowing days at 12-second intervals.

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

See [`VALIDATION.md`](https://github.com/jaraggie/cozi-calendar-card/blob/main/VALIDATION.md) for evidence and limits, [`CONTRIBUTING.md`](https://github.com/jaraggie/cozi-calendar-card/blob/main/CONTRIBUTING.md) for contribution guidance, and [`CHANGELOG.md`](https://github.com/jaraggie/cozi-calendar-card/blob/main/CHANGELOG.md) for release notes. Report problems through the published repository's Issues tab with versions, sanitized configuration, and fictional reproductions. Never attach a private feed URL or an unredacted family calendar.

## License

[MIT](https://github.com/jaraggie/cozi-calendar-card/blob/main/LICENSE). Cozi is a trademark of its respective owner. This community card is not an official Cozi product.

## Project icon

The dark green **Forest Calendar** is this project's original icon. [SVG](https://github.com/jaraggie/cozi-calendar-card/blob/main/assets/icon.svg) · [512px PNG](https://github.com/jaraggie/cozi-calendar-card/blob/main/assets/icon.png). See [branding notes](https://github.com/jaraggie/cozi-calendar-card/blob/main/assets/README.md) for usage and HACS visibility. The README icon is shown on GitHub and on repository detail pages that render it.

HACS and Home Assistant Marketplace currently use a generic Dashboard category symbol in browse lists for dashboard plugins. Their per-integration brand images do not apply to this card, and `hacs.json` has no supported dashboard icon field. The selected icon is therefore included prominently in this README.
