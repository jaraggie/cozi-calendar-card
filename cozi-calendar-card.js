/* Cozi Family Calendar Card — independent community implementation. No external dependencies. */
export const VERSION = "0.1.1";
// People are explicit configuration: never assume a household or infer names from arbitrary titles.
export const DEFAULT_MEMBERS = Object.freeze([]);
const key = (s) => String(s).normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("en");
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const HEX = /^#[\da-f]{6}$/iu;
const formatterCache = new Map();
function formatter(zone) {
  if (!formatterCache.has(zone)) formatterCache.set(zone, new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }));
  return formatterCache.get(zone);
}
function partsAt(epoch, zone) {
  return Object.fromEntries(formatter(zone).formatToParts(new Date(epoch))
    .filter((p) => p.type !== "literal").map((p) => [p.type, Number(p.value)]));
}
export function validDateKey(value) {
  if (!DATE.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
export function addDays(value, days) {
  if (!validDateKey(value)) throw new Error("Invalid calendar date");
  const d = new Date(`${value}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function dateKeyAt(epoch, zone) {
  const p = partsAt(epoch, zone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}
export function zonedEpoch(day, hour = 0, minute = 0, second = 0, zone = "UTC") {
  if (!validDateKey(day)) throw new Error("Invalid calendar date");
  const [y, m, d] = day.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d, hour, minute, second);
  let guess = target;
  for (let i = 0; i < 5; i++) {
    const p = partsAt(guess, zone);
    const delta = target - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    if (delta === 0) return guess;
    guess += delta;
  }
  throw new Error("Date does not exist in the selected time zone");
}
export function normalizeConfig(input = {}) {
  if (input.entity && !/^calendar\.[a-z0-9_]+$/u.test(input.entity)) throw new Error("Choose a calendar entity.");
  if (input.members != null && !Array.isArray(input.members)) throw new Error("members must be a list of people.");
  const members = (input.members ?? DEFAULT_MEMBERS).map((m) => {
    if (!m || typeof m.name !== "string" || !m.name.trim()) throw new Error("Each member needs a name.");
    if (!HEX.test(m.color)) throw new Error(`Use a six-digit hex color for ${m.name}.`);
    if (m.aliases != null && (!Array.isArray(m.aliases) || m.aliases.some((a) => typeof a !== "string" || !a.trim()))) {
      throw new Error("Member aliases must be a list of names.");
    }
    return { name: m.name.trim(), id: key(m.name), aliases: (m.aliases ?? []).map((a) => a.trim()), color: m.color };
  });
  const used = new Set();
  for (const m of members) for (const name of [m.name, ...m.aliases]) {
    if (["all", "family", "everyone"].includes(key(name))) throw new Error("All, Family, and Everyone are reserved family labels.");
    if (used.has(key(name))) throw new Error(`Repeated member name or alias: ${name}`);
    used.add(key(name));
  }
  const view = input.initial_view ?? "month";
  if (!["month", "agenda"].includes(view)) throw new Error("initial_view must be month or agenda.");
  const start = input.start_of_week ?? 0;
  if (!Number.isInteger(start) || start < 0 || start > 6) throw new Error("start_of_week must be 0–6.");
  for (const [name, fallback, min, max] of [["days_to_show", 7, 1, 90], ["max_events_per_day", 4, 1, 20], ["refresh_minutes", 5, 1, 1440]]) {
    const value = input[name] ?? fallback;
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be ${min}–${max}.`);
  }
  for (const name of ["family_color", "shared_color"]) if (input[name] && !HEX.test(input[name])) throw new Error(`${name} needs a six-digit hex color.`);
  if (input.time_zone) formatter(input.time_zone).format(new Date());
  return { ...input, title: input.title ?? "Family calendar", entity: input.entity ?? "", members,
    initial_view: view, start_of_week: start, days_to_show: input.days_to_show ?? 7,
    max_events_per_day: input.max_events_per_day ?? 4, refresh_minutes: input.refresh_minutes ?? 5,
    family_color: input.family_color ?? "#427f73", shared_color: input.shared_color ?? "#71618f",
    strip_prefix: input.strip_prefix !== false, show_attendees: input.show_attendees !== false,
    deduplicate_events: input.deduplicate_events !== false };
}
export function parseCoziTitle(summary, members = DEFAULT_MEMBERS) {
  const raw = typeof summary === "string" ? summary : "Untitled event";
  const colon = raw.indexOf(":");
  if (colon <= 0 || colon > 120 || !raw.slice(colon + 1).trim()) return { title: raw, attendees: [], family: false, recognized: false };
  const prefix = raw.slice(0, colon).trim();
  if (["all", "family", "everyone"].includes(key(prefix))) return { title: raw.slice(colon + 1).trim(), attendees: [], family: true, recognized: true };
  const lookup = new Map();
  for (const m of members) for (const n of [m.name, ...(m.aliases ?? [])]) lookup.set(key(n), { ...m, id: key(m.name) });
  const names = prefix.split(/\s*(?:\/|&|,|\band\b)\s*/iu);
  const known = names.some((n) => lookup.has(key(n)));
  const plausible = names.every((n) => n.length > 0 && n.length <= 40 && /^[\p{L}\p{M} .’'\-]+$/u.test(n));
  if (!known || !plausible) return { title: raw, attendees: [], family: false, recognized: false };
  // Keep an unconfigured attendee (e.g. Pat) when a shared prefix also names a known member.
  const attendees = [...new Map(names.map((n) => {
    const member = lookup.get(key(n)) ?? { name: n.trim(), id: `unknown:${key(n)}`, color: "#6b7280", aliases: [] };
    return [member.id, member];
  })).values()];
  return { title: raw.slice(colon + 1).trim(), attendees, family: false, recognized: true };
}
function dateValue(value) {
  if (typeof value === "string") return value;
  return value?.dateTime ?? value?.date;
}
function parseTime(value, zone) {
  if (typeof value !== "string") throw new Error("Missing date");
  if (validDateKey(value)) return { epoch: zonedEpoch(value, 0, 0, 0, zone), day: value, allDay: true };
  const naive = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/u.exec(value);
  if (naive) {
    const [, day, h, m, s = "0"] = naive;
    if (+h > 23 || +m > 59 || +s > 59) throw new Error("Invalid time");
    return { epoch: zonedEpoch(day, +h, +m, +s, zone), day, allDay: false };
  }
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:?\d{2})$/iu.test(value) || !validDateKey(value.slice(0, 10))) throw new Error("Invalid timestamp");
  const epoch = Date.parse(value);
  if (!Number.isFinite(epoch)) throw new Error("Invalid timestamp");
  return { epoch, day: dateKeyAt(epoch, zone), allDay: false };
}
export function normalizeEvents(raw, config, zone) {
  if (!Array.isArray(raw)) throw new Error("Calendar response is not a list of events.");
  const events = [], seen = new Set();
  let skipped = 0;
  for (const event of raw) {
    try {
      if (!event || ["cancelled", "canceled"].includes(event.status)) continue;
      const start = parseTime(dateValue(event.start), zone);
      const end = event.end ? parseTime(dateValue(event.end), zone) : { ...start, epoch: start.allDay ? zonedEpoch(addDays(start.day, 1), 0, 0, 0, zone) : start.epoch };
      if (end.epoch < start.epoch || (start.allDay && end.epoch === start.epoch)) throw new Error("Invalid end");
      const parsed = parseCoziTitle(event.summary, config.members);
      const signature = JSON.stringify([event.uid || null, event.recurrence_id || null, event.summary,
        start.epoch, end.epoch, event.location ?? "", event.description ?? ""]);
      if (config.deduplicate_events && seen.has(signature)) continue;
      seen.add(signature);
      const color = parsed.family ? config.family_color : parsed.attendees.length === 1 ? parsed.attendees[0].color : config.shared_color;
      events.push({ id: signature, rawTitle: String(event.summary ?? "Untitled event"), ...parsed,
        displayTitle: config.strip_prefix ? parsed.title : String(event.summary ?? "Untitled event"),
        start: start.epoch, end: end.epoch, startDay: start.day, allDay: start.allDay,
        location: String(event.location ?? ""), description: String(event.description ?? ""), color,
        status: event.status ?? "confirmed" });
    } catch { skipped++; }
  }
  events.sort((a,b) => a.start - b.start || Number(b.allDay) - Number(a.allDay) || a.displayTitle.localeCompare(b.displayTitle));
  return { events, skipped };
}
export function eventsOnDay(events, day, zone) {
  const start = zonedEpoch(day, 0, 0, 0, zone), end = zonedEpoch(addDays(day, 1), 0, 0, 0, zone);
  return events.filter((e) => e.end === e.start ? e.start >= start && e.start < end : e.start < end && e.end > start)
    .sort((a,b) => Number(b.allDay) - Number(a.allDay) || a.start - b.start || a.displayTitle.localeCompare(b.displayTitle));
}
export function filterEvents(events, selected) {
  if (!selected.size) return events;
  return events.filter((e) => (e.family && (selected.has("family") || [...selected].some((s) => s !== "unassigned"))) ||
    (!e.recognized && selected.has("unassigned")) || e.attendees.some((a) => selected.has(a.id)));
}
export function monthDays(anchor, weekStart = 0) {
  const first = `${anchor.slice(0, 7)}-01`;
  const weekday = new Date(`${first}T12:00:00Z`).getUTCDay();
  const begin = addDays(first, -((weekday - weekStart + 7) % 7));
  return Array.from({ length: 42 }, (_, i) => addDays(begin, i));
}
function shiftMonth(day, direction) {
  const d = new Date(`${day.slice(0,7)}-01T12:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + direction);
  return d.toISOString().slice(0,10);
}
const esc = (value) => String(value ?? "").replace(/[&<>"']/gu, (s) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[s]));
const Base = globalThis.HTMLElement ?? class {};

export class CoziCalendarCard extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._events = []; this._selected = new Set(); this._requestId = 0; this._compact = false;
    this.shadowRoot.addEventListener("click", (e) => this._click(e));
    this.shadowRoot.addEventListener("cancel", (event) => { event.preventDefault(); this._closeDetail(); }, true);
  }
  static getConfigElement() { return document.createElement("cozi-calendar-card-editor"); }
  static getStubConfig(hass) {
    const calendars = Object.values(hass?.states ?? {}).filter((s) => s.entity_id.startsWith("calendar."));
    const cozi = calendars.filter((s) => /cozi/iu.test(`${s.entity_id} ${s.attributes?.friendly_name ?? ""}`));
    const family = cozi.filter((s) => /family/iu.test(`${s.entity_id} ${s.attributes?.friendly_name ?? ""}`));
    // A unique family feed takes precedence. Ambiguous choices stay explicit in the editor.
    const selected = family.length === 1 ? family[0] : family.length === 0 && cozi.length === 1 ? cozi[0] : null;
    return { entity: selected?.entity_id ?? "", title: "Family calendar", members: [] };
  }
  setConfig(input) {
    this._config = normalizeConfig(input); this._view = this._config.initial_view; this._userView = false;
    this._anchor = null; this._events = []; this._detail = null; this._selected = new Set();
    this._loadedKey = null; this._pendingKey = null; this._requestId++; this._error = "";
    this._loading = false; this._updated = null; this._skipped = 0;
    this._render(); this._startTimer(); this._load();
  }
  set hass(value) {
    const old = this._hass; this._hass = value;
    if (!this._config) return;
    const zone = this._zone();
    if (this._lastZone && this._lastZone !== zone) { this._loadedKey = null; this._pendingKey = null; this._requestId++; }
    this._lastZone = zone;
    if (!this._anchor) this._anchor = dateKeyAt(Date.now(), zone);
    if (!old || old.config?.time_zone !== value.config?.time_zone || old.locale !== value.locale) this._render();
    if (!this._loadedKey) this._load();
  }
  connectedCallback() {
    this._observer = new ResizeObserver((entries) => {
      const compact = entries[0].contentRect.width < 620;
      if (compact !== this._compact) { this._compact = compact; this._render(); this._load(); }
    });
    this._observer.observe(this); this._startTimer(); this._load();
  }
  disconnectedCallback() {
    clearInterval(this._timer); this._observer?.disconnect(); this._requestId++; this._pendingKey = null; this._loading = false;
  }
  getCardSize() { return this._effectiveView() === "month" ? 12 : 8; }
  getGridOptions() { return { columns: "full", rows: "auto", min_columns: 6 }; }
  _zone() { return this._config?.time_zone ?? this._hass?.config?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone; }
  _locale() { return this._config?.language ?? this._hass?.locale?.language ?? "en-US"; }
  _effectiveView() { return !this._userView && this._compact ? "agenda" : this._view ?? "month"; }
  _startTimer() {
    clearInterval(this._timer);
    if (this.isConnected && this._config) this._timer = setInterval(() => { this._render(); this._load(true); }, this._config.refresh_minutes * 60000);
  }
  _range() {
    if (this._effectiveView() === "month") {
      const days = monthDays(this._anchor, this._config.start_of_week);
      return { days, start: days[0], end: addDays(days.at(-1), 1) };
    }
    const days = Array.from({ length: this._config.days_to_show }, (_, i) => addDays(this._anchor, i));
    return { days, start: days[0], end: addDays(days.at(-1), 1) };
  }
  async _load(force = false) {
    if (!this.isConnected || !this._hass || !this._config || !this._anchor || !this._config.entity) return;
    const range = this._range(), zone = this._zone();
    const requestKey = `${this._config.entity}|${zone}|${range.start}|${range.end}`;
    if (this._pendingKey === requestKey || (!force && this._loadedKey === requestKey)) return;
    const id = ++this._requestId; this._pendingKey = requestKey; this._loading = true; this._error = "";
    if (this._loadedKey !== requestKey) this._events = [];
    this._render();
    try {
      const params = new URLSearchParams({ start: new Date(zonedEpoch(range.start,0,0,0,zone)).toISOString(), end: new Date(zonedEpoch(range.end,0,0,0,zone)).toISOString() });
      const result = await this._hass.callApi("GET", `calendars/${encodeURIComponent(this._config.entity)}?${params}`);
      if (id !== this._requestId || !this.isConnected) return;
      const normalized = normalizeEvents(result, this._config, zone);
      this._events = normalized.events; this._skipped = normalized.skipped; this._loadedKey = requestKey; this._updated = Date.now();
    } catch {
      if (id !== this._requestId || !this.isConnected) return;
      this._error = "Could not load this calendar. Check the entity and connection, then retry.";
    } finally {
      if (id === this._requestId) { this._loading = false; this._pendingKey = null; this._render(); }
    }
  }
  _dayLabel(day, options) { return new Intl.DateTimeFormat(this._locale(), { timeZone: "UTC", ...options }).format(new Date(`${day}T12:00:00Z`)); }
  _time(epoch) { return new Intl.DateTimeFormat(this._locale(), { timeZone: this._zone(), hour: "numeric", minute: "2-digit", hour12: this._config.hour24 == null ? undefined : !this._config.hour24 }).format(new Date(epoch)); }
  _timeFor(event, day) {
    if (event.allDay) return "All day";
    if (event.startDay < day) return "Continues";
    return this._time(event.start);
  }
  _detailDate(event) {
    const start = this._dayLabel(event.startDay, {dateStyle:"full"});
    if (event.allDay) {
      const last = addDays(dateKeyAt(event.end, this._zone()), -1);
      return `${start} · All day${last > event.startDay ? ` · Through ${this._dayLabel(last, {dateStyle:"full"})}` : ""}`;
    }
    const last = dateKeyAt(event.end, this._zone());
    return `${start} · ${this._time(event.start)} – ${last !== event.startDay ? `${this._dayLabel(last, {dateStyle:"full"})} · ` : ""}${this._time(event.end)}`;
  }
  _closeDetail() {
    this._detail = null; this._render();
    [...this.shadowRoot.querySelectorAll('[data-action="event"]')].find((button) => button.dataset.index === this._detailFocus)?.focus({preventScroll:true});
  }
  _attendees(event) {
    if (!this._config.show_attendees) return "";
    const names = event.family ? [{ name: "Family", color: this._config.family_color }] : event.attendees;
    return names.map((m) => `<span class="attendee"><i style="background:${m.color}"></i>${esc(m.name)}</span>`).join("");
  }
  _eventButton(event, day, month = false) {
    const idx = this._events.indexOf(event);
    return `<button class="event ${month ? "month-event" : "agenda-event"} ${event.allDay ? "all-day" : ""}" data-action="event" data-index="${idx}" style="--event-color:${event.color}" aria-label="${esc(`${event.displayTitle}, ${this._timeFor(event,day)}, ${event.family ? "Family" : event.attendees.map((a)=>a.name).join(", ")}`)}">
      <span class="event-time">${esc(this._timeFor(event,day))}</span><span class="event-body"><span class="event-title">${esc(event.displayTitle)}</span><span class="attendees">${this._attendees(event)}</span></span></button>`;
  }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._anchor) this._anchor = dateKeyAt(Date.now(), this._zone());
    const focus = this.shadowRoot.activeElement?.dataset?.focus;
    const today = dateKeyAt(Date.now(), this._zone()), view = this._effectiveView(), range = this._range();
    const visible = filterEvents(this._events, this._selected);
    const unknown = [...new Map(this._events.flatMap((e)=>e.attendees).filter((a)=>a.id.startsWith("unknown:")).map((a)=>[a.id,a])).values()];
    const filters = [{ id: "family", name: "Family", color: this._config.family_color }, ...this._config.members, ...unknown];
    if (this._events.some((e)=>!e.recognized)) filters.push({id:"unassigned",name:"Other",color:this._config.shared_color});
    const heading = view === "month" ? this._dayLabel(this._anchor,{month:"long",year:"numeric"}) : `${this._dayLabel(range.start,{month:"short",day:"numeric"})} – ${this._dayLabel(addDays(range.end,-1),{month:"short",day:"numeric",year:"numeric"})}`;
    let body = "";
    if (!this._config.entity) body = '<div class="notice">Choose your combined Cozi calendar in the card settings.</div>';
    else if (view === "month") {
      const headings = Array.from({length:7},(_,i)=>this._dayLabel(addDays("2026-11-01",(i+this._config.start_of_week)%7),{weekday:"short"}));
      body = `<div class="month-scroll"><table class="month"><caption class="sr-only">${esc(heading)}</caption><thead><tr>${headings.map((d)=>`<th scope="col">${esc(d)}</th>`).join("")}</tr></thead><tbody>`;
      for (let week=0;week<6;week++) {
        body += "<tr>";
        for (const day of range.days.slice(week*7,week*7+7)) {
          const events = eventsOnDay(visible,day,this._zone()), max = this._config.max_events_per_day;
          body += `<td class="${day.slice(0,7)!==this._anchor.slice(0,7)?"outside":""} ${day===today?"today":""}"><button class="day-number" data-action="day" data-day="${day}" aria-label="${esc(this._dayLabel(day,{dateStyle:"full"}))}" ${day===today?'aria-current="date"':""}>${Number(day.slice(-2))}</button><div class="day-events">${events.slice(0,max).map((e)=>this._eventButton(e,day,true)).join("")}</div>${events.length>max?`<button class="more" data-action="day" data-day="${day}">+${events.length-max} more</button>`:""}</td>`;
        }
        body += "</tr>";
      }
      body += "</tbody></table></div>";
    } else {
      body = `<div class="agenda">${range.days.map((day)=>{
        const events=eventsOnDay(visible,day,this._zone());
        if (!events.length && !this._config.show_empty_days) return "";
        return `<section class="agenda-day"><h3 class="${day===today?"today-heading":""}">${day===today?"Today · ":""}${esc(this._dayLabel(day,{weekday:"long",month:"short",day:"numeric"}))}</h3>${events.length?events.map((e)=>this._eventButton(e,day)).join(""):'<p class="empty-day">No events</p>'}</section>`;
      }).join("") || '<p class="notice">No events match these filters in this date range.</p>'}</div>`;
    }
    const detail = this._detail;
    this.shadowRoot.innerHTML = `<style>${STYLES}</style><ha-card><header><div><h2>${esc(this._config.title)}</h2><span class="subtitle">${esc(this._hass.states?.[this._config.entity]?.attributes?.friendly_name ?? "Cozi family calendar")}</span></div><button class="icon-button" data-action="refresh" data-focus="refresh" aria-label="Reload calendar events" ${this._loading?"disabled":""}>↻</button></header>
      <nav class="toolbar" aria-label="Calendar controls"><div class="date-controls"><button data-action="previous" data-focus="previous" aria-label="Previous ${view=== "month"?"month":"date range"}">‹</button><button data-action="today" data-focus="today">Today</button><button data-action="next" data-focus="next" aria-label="Next ${view=== "month"?"month":"date range"}">›</button></div><h3>${esc(heading)}</h3><div class="view-controls"><button data-action="month" data-focus="month" aria-pressed="${view==="month"}">Month</button><button data-action="agenda" data-focus="agenda" aria-pressed="${view==="agenda"}">Agenda</button></div></nav>
      <div class="filters" aria-label="Filter by attendee"><button class="filter" data-action="filter" data-member="" data-focus="filter-all" aria-pressed="${!this._selected.size}">Everyone</button>${filters.map((m)=>`<button class="filter" data-action="filter" data-member="${esc(m.id)}" data-focus="filter-${esc(m.id)}" aria-pressed="${this._selected.has(m.id)}"><i style="background:${m.color}"></i>${esc(m.name)}</button>`).join("")}</div>
      ${this._config.entity && !this._config.members.length?'<div class="notice">Add your people and aliases in the card settings to enable attendee colors and person filters. Family events are recognized automatically.</div>':""}
      <div role="status" class="status">${this._loading?"Loading calendar…":this._error?esc(this._error):this._skipped?`${this._skipped} invalid event(s) could not be displayed.`:""}</div>${body}
      <footer>${this._updated?`Loaded ${esc(this._time(this._updated))} · `:""}${esc(this._zone())}${this._selected.size?" · Family events remain visible with person filters":""}</footer>
      ${detail?`<dialog aria-labelledby="cozi-detail-title"><div class="dialog-head"><h2 id="cozi-detail-title">${esc(detail.displayTitle)}</h2><button data-action="close" aria-label="Close event details">×</button></div><div class="attendees">${this._attendees(detail)}</div><p>${esc(this._detailDate(detail))}</p>${detail.location?`<p><strong>Location</strong><br>${esc(detail.location)}</p>`:""}${detail.description?`<p class="description">${esc(detail.description)}</p>`:""}${detail.status==="tentative"?"<p>Tentative</p>":""}<button data-action="close">Close</button></dialog>`:""}</ha-card>`;
    const dialog = this.shadowRoot.querySelector("dialog");
    if (dialog && this.isConnected) dialog.showModal();
    if (focus && !dialog) [...this.shadowRoot.querySelectorAll("[data-focus]")].find((n)=>n.dataset.focus===focus)?.focus({preventScroll:true});
  }
  _click(event) {
    const button = event.target.closest("button[data-action]"); if (!button) return;
    const action = button.dataset.action;
    if (action === "event") { this._detailFocus=button.dataset.index; this._detail=this._events[Number(button.dataset.index)]; this._render(); return; }
    if (action === "close") { this._closeDetail(); return; }
    if (action === "filter") {
      const member=button.dataset.member;
      if (!member) this._selected.clear(); else if (this._selected.has(member)) this._selected.delete(member); else this._selected.add(member);
      this._render(); return;
    }
    if (action === "refresh") { this._load(true); return; }
    if (action === "day") { this._anchor=button.dataset.day; this._view="agenda"; this._userView=true; }
    if (["month","agenda"].includes(action)) { this._view=action; this._userView=true; }
    if (action === "today") this._anchor=dateKeyAt(Date.now(),this._zone());
    if (["previous","next"].includes(action)) {
      const dir=action === "previous"?-1:1;
      this._anchor=this._effectiveView() === "month"?shiftMonth(this._anchor,dir):addDays(this._anchor,dir*this._config.days_to_show);
    }
    this._detail=null; this._render(); this._load();
  }
}

const STYLES = `
:host{display:block;container-type:inline-size;--cozi-text:var(--primary-text-color,#202b33);--cozi-muted:var(--secondary-text-color,#60717d);--cozi-line:var(--divider-color,#dce3e8);--cozi-bg:var(--card-background-color,#fff);--cozi-accent:var(--primary-color,#087e91);color:var(--cozi-text);font-family:var(--primary-font-family,system-ui,sans-serif)}
*{box-sizing:border-box}ha-card{display:block;background:var(--cozi-bg);border-radius:var(--ha-card-border-radius,16px);overflow:hidden;border:1px solid var(--cozi-line)}h2,h3,p{margin:0}header{display:flex;align-items:center;justify-content:space-between;padding:22px 24px 16px}h2{font-size:23px;font-weight:650;line-height:1.25}.subtitle{font-size:12px;color:var(--cozi-muted);display:block;margin-top:5px}button{font:inherit;color:inherit;cursor:pointer;background:transparent;border:1px solid transparent;border-radius:8px;min-height:36px;padding:7px 11px}button:hover{background:color-mix(in srgb,var(--cozi-accent) 9%,transparent)}button:focus-visible{outline:3px solid var(--cozi-accent);outline-offset:1px}button:disabled{opacity:.5;cursor:wait}.icon-button{font-size:25px}.toolbar{display:flex;align-items:center;gap:12px;justify-content:space-between;padding:0 20px 14px;flex-wrap:wrap}.toolbar h3{font-size:19px;font-weight:600}.date-controls,.view-controls{display:flex;align-items:center;gap:3px}.date-controls button:first-child,.date-controls button:last-child{font-size:24px;line-height:1}.view-controls{background:color-mix(in srgb,var(--cozi-accent) 6%,transparent);padding:3px;border-radius:10px}.view-controls [aria-pressed=true]{background:var(--cozi-accent);color:var(--cozi-bg)}.filters{display:flex;flex-wrap:wrap;gap:6px;padding:0 22px 13px}.filter{border-color:var(--cozi-line);border-radius:22px;font-size:12px;min-height:30px;display:inline-flex;align-items:center;gap:6px}.filter[aria-pressed=true]{border-color:var(--cozi-accent);box-shadow:inset 0 0 0 1px var(--cozi-accent);background:color-mix(in srgb,var(--cozi-accent) 10%,transparent)}i{display:inline-block;border-radius:50%;width:8px;height:8px;flex-shrink:0}.status{padding:0 24px;font-size:13px;color:var(--cozi-muted)}.status:not(:empty){padding-bottom:12px}.month{width:100%;border-collapse:collapse;table-layout:fixed}.month th{font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--cozi-muted);padding:10px 2px;border-top:1px solid var(--cozi-line);border-bottom:1px solid var(--cozi-line)}.month td{height:128px;vertical-align:top;border-bottom:1px solid var(--cozi-line);border-right:1px solid var(--cozi-line);padding:4px;overflow-wrap:anywhere}.month td:last-child{border-right:0}.month tr:last-child td{border-bottom:0}.day-number{font-size:12px;border-radius:50%;width:29px;height:29px;min-height:29px;padding:0;display:block;margin:0 0 4px auto}.today .day-number{background:var(--cozi-accent);color:var(--cozi-bg)}.outside{background:color-mix(in srgb,var(--cozi-text) 3%,transparent)}.outside .day-number{color:var(--cozi-muted)}.event{display:flex;text-align:left;border-left:3px solid var(--event-color);width:100%;border-radius:5px;line-height:1.35}.event:hover{background:color-mix(in srgb,var(--event-color) 13%,transparent)}.month-event{font-size:11px;padding:4px;min-height:0;gap:4px;margin-bottom:3px;background:color-mix(in srgb,var(--event-color) 7%,transparent);display:block}.month-event .event-time{font-size:10px;color:var(--cozi-muted);display:block}.event-body{min-width:0;display:block}.event-title{font-weight:600;display:block}.month-event .event-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.attendees{display:flex;gap:3px 8px;flex-wrap:wrap;margin-top:3px}.attendee{font-size:10px;display:inline-flex;align-items:center;gap:4px;color:var(--cozi-muted);font-weight:400}.month-event .attendees{gap:2px 5px}.all-day{background:color-mix(in srgb,var(--event-color) 16%,transparent)}.more{font-size:11px;min-height:22px;padding:3px 4px;color:var(--cozi-accent)}.agenda{padding:2px 22px 15px}.agenda-day{padding:12px 0}.agenda-day+section{border-top:1px solid var(--cozi-line)}.agenda-day h3{font-size:13px;margin-bottom:11px;color:var(--cozi-muted);font-weight:650}.agenda-day .today-heading{color:var(--cozi-accent)}.agenda-event{padding:10px;gap:12px;margin-bottom:7px}.agenda-event .event-time{font-size:12px;min-width:80px;padding-top:2px;color:var(--cozi-muted)}.agenda-event .event-title{font-size:14px}.agenda-event .attendee{font-size:11px}.notice{padding:25px;color:var(--cozi-muted);font-size:14px}.empty-day{font-size:12px;color:var(--cozi-muted)}footer{border-top:1px solid var(--cozi-line);padding:10px 23px;color:var(--cozi-muted);font-size:10px}dialog{color:var(--cozi-text);background:var(--cozi-bg);border:1px solid var(--cozi-line);border-radius:16px;padding:24px;width:min(480px,90vw);max-height:85vh;overflow:auto;box-shadow:0 15px 60px #0005}dialog::backdrop{background:#0006}.dialog-head{display:flex;justify-content:space-between;gap:16px;align-items:start}.dialog-head h2{font-size:21px}.dialog-head button{font-size:24px}dialog p{font-size:14px;line-height:1.55;margin:14px 0;overflow-wrap:anywhere}.description{white-space:pre-wrap}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}@container(max-width:600px){header{padding:18px 15px 14px}.toolbar{padding:0 12px 12px;gap:9px}.toolbar h3{font-size:15px;order:-1;flex-basis:100%}.filters{padding:0 14px 12px}.agenda{padding:0 14px 12px}.agenda-event .event-time{min-width:65px;font-size:11px}.month td{padding:2px;height:110px}.month-event .attendees{display:none}.month-event{font-size:10px}.month th{font-size:9px}}
`;

class CoziCalendarCardEditor extends Base {
  constructor() {
    super(); this.attachShadow({mode:"open"});
    this.shadowRoot.addEventListener("change",(e)=>this._change(e));
    this.shadowRoot.addEventListener("click",(e)=>{
      if(e.target.dataset.action === "add") {
        const used = new Set(this._config.members.flatMap((m)=>[m.name,...(m.aliases??[])]).map(key));
        let name = "New member", number = 2;
        while (used.has(key(name))) name = `New member ${number++}`;
        const colors = ["#4267d5", "#ad7100", "#d54e45", "#8355b7", "#b84788", "#16806d", "#227da5"];
        this._config.members.push({name,aliases:[],color:colors[this._config.members.length % colors.length]});this._emit();this._render();
      }
      if(e.target.dataset.action === "remove") {this._config.members.splice(Number(e.target.dataset.index),1);this._emit();this._render();}
    });
  }
  setConfig(config) { this._config=structuredClone({...config,members:config.members??DEFAULT_MEMBERS}); this._render(); }
  set hass(hass) { const first=!this._hass;this._hass=hass;if(first)this._render(); }
  _emit() {this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:structuredClone(this._config)},bubbles:true,composed:true}));}
  _change(e) {
    const input=e.target, field=input.dataset.field;if(!field)return;
    if(input.dataset.index!=null){const m=this._config.members[Number(input.dataset.index)];m[field]=field==="aliases"?input.value.split(",").map((s)=>s.trim()).filter(Boolean):input.value;}
    else this._config[field]=input.type==="checkbox"?input.checked:input.type==="number"?Number(input.value):input.value;
    this._emit();
  }
  _render() {
    if(!this._config)return;const c=this._config;
    const calendars=Object.values(this._hass?.states??{}).filter((s)=>s.entity_id.startsWith("calendar."));
    const options=[...new Set(["",c.entity??"",...calendars.map((s)=>s.entity_id)])];
    this.shadowRoot.innerHTML=`<style>:host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}label{display:block;margin:12px 0;font:inherit;font-size:13px}input,select{display:block;width:100%;padding:10px;margin-top:5px;border-radius:6px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color,white);color:inherit;font:inherit}fieldset{border:1px solid var(--divider-color,#ccc);border-radius:8px;margin:14px 0;padding:10px}legend{font-size:13px}.member{display:grid;grid-template-columns:1fr 1fr 55px 36px;gap:8px;align-items:end}.member input{min-width:0}input[type=color]{padding:3px;height:40px}input[type=checkbox]{display:inline-block;width:auto}button{font:inherit;padding:8px;cursor:pointer;color:inherit;background:transparent;border:1px solid var(--divider-color,#ccc);border-radius:6px}p{font-size:12px;color:var(--secondary-text-color)}.member label{font-size:11px}</style>
      <label>Family calendar<select data-field="entity">${options.map((id)=>`<option value="${esc(id)}" ${c.entity===id?"selected":""}>${esc(id?calendars.find((s)=>s.entity_id===id)?.attributes?.friendly_name??id:"Choose a calendar")}</option>`).join("")}</select></label>
      <label>Title<input data-field="title" value="${esc(c.title??"Family calendar")}"></label>
      <label>Starting view<select data-field="initial_view"><option value="month" ${c.initial_view!=="agenda"?"selected":""}>Month (agenda on narrow screens)</option><option value="agenda" ${c.initial_view==="agenda"?"selected":""}>Agenda</option></select></label>
      <label>Agenda days<input type="number" min="1" max="90" data-field="days_to_show" value="${esc(c.days_to_show??7)}"></label>
      <fieldset><legend>People and colors</legend><p>Aliases are comma-separated. These names identify Cozi's attendee prefix.</p>${c.members.map((m,i)=>`<div class="member"><label>Name<input data-field="name" data-index="${i}" value="${esc(m.name)}"></label><label>Aliases<input data-field="aliases" data-index="${i}" value="${esc((m.aliases??[]).join(", "))}"></label><label>Color<input type="color" data-field="color" data-index="${i}" value="${esc(m.color)}"></label><button data-action="remove" data-index="${i}" aria-label="Remove ${esc(m.name)}">×</button></div>`).join("")}<button data-action="add">Add person</button></fieldset>
      <label><input type="checkbox" data-field="strip_prefix" ${c.strip_prefix!==false?"checked":""}> Remove recognized attendee prefixes from titles</label><label><input type="checkbox" data-field="show_attendees" ${c.show_attendees!==false?"checked":""}> Show attendee labels below titles</label>`;
  }
}
if (globalThis.customElements) {
  if (!customElements.get("cozi-calendar-card")) customElements.define("cozi-calendar-card",CoziCalendarCard);
  if (!customElements.get("cozi-calendar-card-editor")) customElements.define("cozi-calendar-card-editor",CoziCalendarCardEditor);
  window.customCards=window.customCards??[];
  if(!window.customCards.some((c)=>c.type==="cozi-calendar-card"))window.customCards.push({type:"cozi-calendar-card",name:"Cozi Family Calendar",description:"One family feed, readable titles, person colors, and shared events shown once.",preview:true});
}
