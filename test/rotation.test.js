import test from 'node:test';
import assert from 'node:assert/strict';
import {CoziCalendarCard,normalizeConfig,presentationConfig} from '../cozi-calendar-card.js';
const today='2026-11-05', tomorrow='2026-11-06';
const events=Array.from({length:10},(_,i)=>({id:`event-${i}`,displayTitle:`Appointment ${i+1}`}));
function card(config={}){const c=Object.create(CoziCalendarCard.prototype);Object.assign(c,{_config:normalizeConfig({display_mode:'tv',max_events_per_day:4,tv_auto_scroll:'today',...config}),_rotationPages:new Map(),_view:'fortnight',_userView:true});return c;}
test('Today rotation exposes every appointment, including a partial final page, and wraps',()=>{
 const c=card(),seen=new Set();
 for(let page=0;page<3;page++){const w=c._dayWindow(events,today,today,page>0);assert.ok(w.events.length<=4);w.events.forEach(e=>seen.add(e.id));}
 assert.equal(seen.size,10);assert.equal(c._dayWindow(events,today,today,true).start,0);
});
test('Today-only, all-days, disabled, and standard modes scope rotation correctly',()=>{
 const c=card();assert.equal(c._dayWindow(events,tomorrow,today,true).start,0);
 c._config.tv_auto_scroll='all';c._dayWindow(events,tomorrow,today);assert.equal(c._dayWindow(events,tomorrow,today,true).start,4);
 c._config.tv_auto_scroll='off';assert.equal(c._dayWindow(events,today,today,true).rotating,false);
 c._config.tv_auto_scroll='all';c._config.display_mode='standard';assert.equal(c._dayWindow(events,today,today,true).start,0);
});
test('Refresh with the same events retains progress; changed lists, filters and midnight reset it',()=>{
 const c=card();c._dayWindow(events,today,today);assert.equal(c._dayWindow(events,today,today,true).start,4);
 assert.equal(c._dayWindow(events.map(e=>({...e})),today,today).start,4);
 assert.equal(c._dayWindow(events.slice(0,5),today,today).start,0);
 c._dayWindow(events,today,today,true);assert.equal(c._dayWindow(events,tomorrow,tomorrow).start,0);
});
test('Rotation settings validate and allow only supported launcher overrides',()=>{
 assert.equal(normalizeConfig().tv_auto_scroll,'off');assert.equal(normalizeConfig().tv_scroll_seconds,12);
 for(const x of [{tv_auto_scroll:'yes'},{tv_scroll_seconds:4},{tv_scroll_seconds:301},{tv_scroll_seconds:5.5}])assert.throws(()=>normalizeConfig(x));
 const c=presentationConfig({},'?cozi_scroll=today&cozi_scroll_seconds=15');assert.equal(c.tv_auto_scroll,'today');assert.equal(c.tv_scroll_seconds,15);
 assert.deepEqual(presentationConfig({},'?cozi_scroll=invalid&cozi_scroll_seconds=0'),{});
});

test('Timer tick updates overflow cells only and pauses during interaction or disconnect',()=>{
 const originalNow=Date.now;
 try{
  Date.now=()=>Date.parse(`${today}T12:00:00Z`);
  const c=card();c.isConnected=true;c._hass={config:{time_zone:'UTC'}};c._selected=new Set();
  c._events=[...events.map((e,i)=>({...e,start:Date.parse(`${today}T08:00:00Z`)+i*60000,end:Date.parse(`${today}T09:00:00Z`)})),
   ...events.map(e=>({...e,id:`future-${e.id}`,start:Date.parse(`${tomorrow}T08:00:00Z`),end:Date.parse(`${tomorrow}T09:00:00Z`)}))];
  const cells=[today,tomorrow].map(day=>({dataset:{day},list:{innerHTML:'initial'},more:{textContent:'initial'},querySelector(s){return s==='.day-events'?this.list:this.more;}}));
  c.shadowRoot={activeElement:null,querySelectorAll:()=>cells};c._eventButton=e=>e.id;
  c._dayWindow(c._events.slice(0,10),today,today);
  c._rotateEvents();assert.equal(cells[0].list.innerHTML,'event-4event-5event-6event-7');assert.equal(cells[0].more.textContent,'↻ 5–8 / 10');assert.equal(cells[1].list.innerHTML,'initial');
  const previous=cells[0].list.innerHTML;
  for(const field of ['_detail','_filtersOpen']){c[field]=true;c._rotateEvents();assert.equal(cells[0].list.innerHTML,previous);c[field]=false;}
  c._rotationPauseUntil=Date.now()+1000;c._rotateEvents();assert.equal(cells[0].list.innerHTML,previous);c._rotationPauseUntil=0;
  c.shadowRoot.activeElement={closest:()=>cells[0]};c._rotateEvents();assert.equal(cells[0].list.innerHTML,previous);c.shadowRoot.activeElement=null;
  c.isConnected=false;c._rotateEvents();assert.equal(cells[0].list.innerHTML,previous);
 }finally{Date.now=originalNow;}
});
