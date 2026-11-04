import test from "node:test";
import assert from "node:assert/strict";
import { normalizeConfig, parseCoziTitle, normalizeEvents, eventsOnDay, filterEvents, monthDays,
  addDays, dateKeyAt, zonedEpoch, CoziCalendarCard, DEFAULT_MEMBERS } from "../cozi-calendar-card.js";

const zone = "America/Chicago";
const members = [
  { name: "Alex", aliases: ["Lex"], color: "#4267d5" },
  { name: "Morgan", aliases: [], color: "#ad7100" },
  { name: "Jordan", aliases: [], color: "#d54e45" },
  { name: "Riley", aliases: [], color: "#8355b7" },
  { name: "Casey", aliases: [], color: "#b84788" },
  { name: "Taylor", aliases: [], color: "#16806d" },
  { name: "Sam", aliases: [], color: "#227da5" },
];
const config = normalizeConfig({ entity: "calendar.example", members });
const raw = (summary, start = "2026-11-04T08:30:00-06:00", end = "2026-11-04T09:30:00-06:00", extra = {}) => ({ summary, start, end, ...extra });

test("Cozi personal names and aliases become canonical people without changing title colons", () => {
  const result = parseCoziTitle("Lex: Pickup: north entrance", config.members);
  assert.equal(result.title, "Pickup: north entrance");
  assert.equal(result.attendees[0].name, "Alex");
});
test("All prefixes become family events; shared prefixes retain every attendee", () => {
  assert.equal(parseCoziTitle("All: Family dinner", config.members).family, true);
  const result = parseCoziTitle("Casey/Taylor/Pat/Jordan: Example activity", config.members);
  assert.deepEqual(result.attendees.map((a) => a.name), ["Casey", "Taylor", "Pat", "Jordan"]);
  assert.equal(result.title, "Example activity");
});
test("Unknown colon prefixes, URLs, and times remain intact", () => {
  for (const title of ["Project: Launch", "https://example.com", "8:30 reminder", "Jordan:", "Weather: rain", "Jordan/not-a-name123: Example"]) {
    assert.equal(parseCoziTitle(title, config.members).title, title);
    assert.equal(parseCoziTitle(title, config.members).recognized, false);
  }
});
test("Name matching is case insensitive and repeated aliases do not create shared copies", () => {
  assert.equal(parseCoziTitle("  jOrDaN : Example", config.members).attendees[0].id, "jordan");
  assert.equal(parseCoziTitle("Lex/Alex: Example", config.members).attendees.length, 1);
});
test("Only known prefixes are stripped, and configuration can retain all prefixes", () => {
  const c = normalizeConfig({ strip_prefix: false, members });
  const result = normalizeEvents([raw("Jordan: Example")], c, zone).events[0];
  assert.equal(result.displayTitle, "Jordan: Example");
  assert.equal(result.attendees[0].name, "Jordan");
});
test("One shared event remains one event with a shared color and all its people", () => {
  const { events } = normalizeEvents([raw("Sam/Morgan: Example")], config, zone);
  assert.equal(events.length, 1);
  assert.equal(events[0].attendees.length, 2);
  assert.equal(events[0].color, config.shared_color);
});
test("Exact delivery duplicates collapse, but distinct appointments and recurring occurrences survive", () => {
  const a = raw("All: Example", undefined, undefined, { uid: "one" });
  const b = { ...a, uid: "two" };
  const recurring = { ...a, start: "2026-11-05T08:30:00-06:00", end: "2026-11-05T09:30:00-06:00" };
  assert.equal(normalizeEvents([a, { ...a }, b, recurring], config, zone).events.length, 3);
  assert.equal(normalizeEvents([a, a], normalizeConfig({ deduplicate_events: false }), zone).events.length, 2);
});
test("All-day dates remain civil dates, with exclusive end and multi-day coverage", () => {
  const e = normalizeEvents([raw("All: Example trip", { date: "2026-11-20" }, { date: "2026-11-23" })], config, zone).events;
  assert.equal(e[0].allDay, true);
  for (const day of ["2026-11-20", "2026-11-21", "2026-11-22"]) assert.equal(eventsOnDay(e, day, zone).length, 1);
  assert.equal(eventsOnDay(e, "2026-11-23", zone).length, 0);
});
test("Timed midnight ends do not leak into the next day; zero-duration events still display", () => {
  const events = normalizeEvents([
    raw("Jordan: Overnight", "2026-11-04T23:00:00-06:00", "2026-11-05T00:00:00-06:00"),
    raw("Riley: Instant", "2026-11-05T08:00:00-06:00", "2026-11-05T08:00:00-06:00"),
  ], config, zone).events;
  assert.equal(eventsOnDay(events, "2026-11-05", zone).length, 1);
  assert.equal(eventsOnDay(events, "2026-11-05", zone)[0].displayTitle, "Instant");
});
test("Chicago DST date boundaries produce 25-hour and 23-hour days", () => {
  assert.equal((zonedEpoch("2026-11-02",0,0,0,zone)-zonedEpoch("2026-11-01",0,0,0,zone))/3600000, 25);
  assert.equal((zonedEpoch("2026-03-09",0,0,0,zone)-zonedEpoch("2026-03-08",0,0,0,zone))/3600000, 23);
  assert.equal(dateKeyAt(Date.parse("2026-11-05T02:00:00Z"), zone), "2026-11-04");
});
test("Timezone-free timestamps use HA's time zone, not the host's time zone", () => {
  const event = normalizeEvents([raw("Jordan: Example", "2026-11-04T08:30:00", "2026-11-04T09:30:00")], config, zone).events[0];
  assert.equal(event.start, Date.parse("2026-11-04T08:30:00-06:00"));
});
test("Person filters include shared invitations and family events, while other people stay hidden", () => {
  const e = normalizeEvents([raw("Jordan: A"), raw("Riley: B"), raw("All: C"), raw("Jordan/Sam: D"), raw("Project: E")], config, zone).events;
  assert.deepEqual(new Set(filterEvents(e,new Set(["jordan"])).map((e)=>e.displayTitle)),new Set(["A","C","D"]));
  assert.deepEqual(filterEvents(e,new Set(["family"])).map((e)=>e.displayTitle),["C"]);
  assert.deepEqual(filterEvents(e,new Set(["unassigned"])).map((e)=>e.displayTitle),["Project: E"]);
});
test("Malformed and canceled events do not empty the calendar", () => {
  const result = normalizeEvents([raw("All: Good"), raw("Bad","2026-02-30","2026-03-01"), raw("Bad",{},{}), raw("Bad","2026-11-05","2026-11-04"), raw("Canceled",undefined,undefined,{status:"cancelled"})], config, zone);
  assert.equal(result.events.length, 1);
  assert.equal(result.skipped, 3);
});
test("Month cells remain a six-week civil calendar across month and year boundaries", () => {
  const sunday = monthDays("2026-11-04",0), monday = monthDays("2026-11-04",1);
  assert.equal(sunday.length,42); assert.equal(sunday[0],"2026-11-01"); assert.equal(sunday.at(-1),"2026-12-12");
  assert.equal(monday[0],"2026-10-26");
  assert.equal(addDays("2026-12-31",1),"2027-01-01");
});
test("Configuration rejects ambiguous aliases and invalid colors before rendering", () => {
  assert.throws(()=>normalizeConfig({members:[{name:"Jordan",color:"red"}]}));
  assert.throws(()=>normalizeConfig({members:[{name:"A",aliases:["B"],color:"#112233"},{name:"B",color:"#223344"}]}));
  assert.throws(()=>normalizeConfig({refresh_minutes:0}));
  assert.throws(()=>normalizeConfig({time_zone:"Not/AZone"}));
});
test("Out-of-order calendar responses cannot replace a more recently requested date range", async () => {
  const pending=[];
  const card=Object.create(CoziCalendarCard.prototype);
  Object.assign(card,{_config:config,_anchor:"2026-11-04",_view:"agenda",_userView:true,_requestId:0,_events:[],_render(){},isConnected:true,
    _hass:{config:{time_zone:zone},callApi(_method,path){return new Promise((resolve)=>pending.push({resolve,path}));}}});
  const first=card._load(); card._anchor="2026-12-04"; const second=card._load();
  pending[0].resolve([raw("All: Old")]); await first;
  assert.equal(card._events.length,0); assert.equal(card._loading,true);
  pending[1].resolve([raw("All: New","2026-12-04","2026-12-05")]); await second;
  assert.equal(card._events[0].displayTitle,"New"); assert.equal(card._loading,false);
  assert.match(pending[1].path,/calendars\/calendar.example\?start=/);
});
test("Disconnected cards ignore pending responses", async () => {
  let resolve;
  const card=Object.create(CoziCalendarCard.prototype);
  Object.assign(card,{_config:config,_anchor:"2026-11-04",_view:"agenda",_userView:true,_requestId:0,_events:[],_render(){},isConnected:true,
    _hass:{config:{time_zone:zone},callApi(){return new Promise((r)=>resolve=r);}}});
  const promise=card._load(); card.isConnected=false;card.disconnectedCallback();resolve([raw("All: Old")]);await promise;
  assert.equal(card._events.length,0);assert.equal(card._pendingKey,null);
});


test("Public defaults contain no assumed people, while explicit members retain aliases and colors", () => {
  assert.deepEqual(DEFAULT_MEMBERS, []);
  const empty = normalizeConfig({entity:"calendar.family"});
  assert.deepEqual(empty.members, []);
  assert.equal(parseCoziTitle("Alex: Appointment", empty.members).recognized, false);
  assert.equal(parseCoziTitle("All: Dinner", empty.members).family, true);
  assert.equal(parseCoziTitle("Lex: Pickup", config.members).attendees[0].name, "Alex");
  assert.equal(parseCoziTitle("Lex: Pickup", config.members).attendees[0].color, "#4267d5");
  assert.throws(()=>normalizeConfig({members:{name:"Alex"}}), /members must be a list/);
});

test("Card picker discovers unique Cozi family feeds without household-specific matching", () => {
  const state = (entity_id, friendly_name) => ({entity_id, attributes:{friendly_name}});
  const stub = (...states) => CoziCalendarCard.getStubConfig({states:Object.fromEntries(states.map((s)=>[s.entity_id,s]))});
  assert.equal(stub(state("calendar.cozi_alex","Alex Cozi"), state("calendar.household","Cozi Family")).entity,"calendar.household");
  assert.equal(stub(state("calendar.shared","Example Cozi")).entity,"calendar.shared");
  assert.equal(stub({entity_id:"calendar.cozi_family"}).entity,"calendar.cozi_family");
  assert.equal(stub(state("calendar.cozi_alex","Alex Cozi"),state("calendar.cozi_morgan","Morgan Cozi")).entity,"");
  assert.equal(stub(state("calendar.one","Cozi Family A"),state("calendar.two","Cozi Family B")).entity,"");
  assert.equal(stub(state("calendar.work","Work")).entity,"");
  assert.equal(stub().entity,"");
  const one=stub(state("calendar.cozi_family","Cozi Family"));
  one.members.push({name:"Example",color:"#112233"});
  assert.deepEqual(stub(state("calendar.cozi_family","Cozi Family")).members,[]);
});
