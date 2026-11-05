# Parameterized TV launcher

For an already-paired Android Debug Bridge media player and an installed Silk browser, create a Home Assistant script with the YAML below. Replace the example entity and dashboard URL. Keep the calendar subscription URL in HA's calendar integration; the launcher needs only the dashboard URL.

The script defaults to the two-week TV presentation. Calls can supply fields to choose another presentation. Card presentation is controlled through URL parameters. The optional browser_fullscreen step locates the card's named Browser fullscreen control in the Android UI hierarchy and taps its center; this provides a browser gesture to hide Silk's toolbar. It does not change Android security or sleep settings. The script waits for page loading and makes at most three attempts, stopping when the control has been clicked. The control may not be available in every browser; fill-window layout remains available when native fullscreen is unsupported.

```yaml
alias: TV - Show family calendar
description: Turn on the TV and open the Cozi calendar with configurable TV presentation.
icon: mdi:calendar
mode: restart
fields:
  display_mode:
    name: Display mode
    default: tv
    selector:
      select:
        options: [tv, standard]
  calendar_view:
    name: Calendar view
    default: fortnight
    selector:
      select:
        options: [fortnight, month, agenda]
  screen_mode:
    name: Screen layout
    default: fill
    selector:
      select:
        options: [fill, normal]
  show_filters:
    name: Show attendee filters
    default: false
    selector:
      boolean: {}
  show_header:
    name: Show card title and calendar name
    default: false
    selector:
      boolean: {}
  show_footer:
    name: Show calendar footer
    default: false
    selector:
      boolean: {}
  auto_scroll:
    name: Automatically rotate overflowing event lists
    default: all
    selector:
      select:
        options: [today, all, "off"]
  scroll_seconds:
    name: Seconds per event page
    default: 12
    selector:
      number:
        min: 5
        max: 300
        mode: box
  event_font_size:
    name: Event text size (CSS pixels)
    default: 11
    selector:
      number:
        min: 9
        max: 22
        mode: box
  safe_area:
    name: TV safe margin (CSS pixels)
    default: 12
    selector:
      number:
        min: 0
        max: 64
        mode: box
  browser_fullscreen:
    name: Hide Silk toolbar with browser fullscreen
    default: true
    selector:
      boolean: {}
  events_per_day:
    name: Maximum events per day
    default: 4
    selector:
      number:
        min: 1
        max: 20
        mode: box
sequence:
  - action: media_player.turn_on
    target:
      entity_id: media_player.example_tv
  - delay:
      seconds: 3
  - action: androidtv.adb_command
    target:
      entity_id: media_player.example_tv
    data:
      command: >-
        am start -a android.intent.action.VIEW
        -d 'https://homeassistant.example/lovelace/family?cozi_display={{ display_mode | default("tv") | urlencode }}&cozi_view={{ calendar_view | default("fortnight") | urlencode }}&cozi_screen={{ screen_mode | default("fill") | urlencode }}&cozi_filters={{ show_filters | default(false) | int }}&cozi_header={{ show_header | default(false) | int }}&cozi_footer={{ show_footer | default(false) | int }}&cozi_max_events={{ events_per_day | default(4) | int }}&cozi_font_size={{ event_font_size | default(11) | int }}&cozi_safe_area={{ safe_area | default(12) | int }}&cozi_scroll={{ auto_scroll | default("all") | urlencode }}&cozi_scroll_seconds={{ scroll_seconds | default(12) | int }}'
        -p com.amazon.cloud9
  - if:
      - condition: template
        value_template: "{{ browser_fullscreen | default(true) | bool }}"
    then:
      - repeat:
          sequence:
            - delay:
                seconds: 3
            - action: androidtv.adb_command
              target:
                entity_id: media_player.example_tv
              response_variable: cozi_fullscreen_attempt
              data:
                command: "uiautomator dump /sdcard/cozi-calendar-launch.xml >/dev/null 2>&1; bounds=$(sed 's/></>\\n</g' /sdcard/cozi-calendar-launch.xml | grep 'text=\"Browser fullscreen\"' | head -n 1 | sed -n 's/.*bounds=\"\\[\\([0-9]*\\),\\([0-9]*\\)\\]\\[\\([0-9]*\\),\\([0-9]*\\)\\]\".*/\\1 \\2 \\3 \\4/p'); set -- $bounds; if [ \"$#\" -eq 4 ]; then input tap \"$((($1+$3)/2))\" \"$((($2+$4)/2))\"; echo 'Cozi browser fullscreen clicked'; else echo 'Cozi browser fullscreen control not found'; fi; rm -f /sdcard/cozi-calendar-launch.xml"
          until:
            - condition: template
              value_template: "{{ 'Cozi browser fullscreen clicked' in (cozi_fullscreen_attempt | string) or repeat.index >= 3 }}"
```

Call the saved script with its own entity ID (example):

```yaml
action: script.tv_show_family_calendar
data:
  display_mode: tv
  calendar_view: fortnight
  screen_mode: fill
  show_filters: false
  show_header: false
  show_footer: false
  events_per_day: 4
  event_font_size: 11
  auto_scroll: all
  scroll_seconds: 12
  safe_area: 12
  browser_fullscreen: true
```

The same script can launch `calendar_view: month` or `agenda`. Selecting `display_mode: standard`, `screen_mode: normal`, and enabling the header, filters, and footer and setting `browser_fullscreen: false` restores the standard presentation for that browser (exit any existing native fullscreen session with Back/Escape). Calls that omit fields use the template defaults. Enumerated URL values are checked by the card. No HA credentials or Cozi feed URL belong in these commands.

See [HA script fields](https://www.home-assistant.io/integrations/script/#fields), [Android Debug Bridge actions](https://www.home-assistant.io/integrations/androidtv/#adb-command), and [Panel view](https://www.home-assistant.io/dashboards/panel/).
