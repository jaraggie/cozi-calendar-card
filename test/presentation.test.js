import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeConfig,presentationConfig,CoziCalendarCard} from '../cozi-calendar-card.js';

test('TV defaults are opt-in, independently configurable, and validated',()=>{
  const standard=normalizeConfig();
  assert.equal(standard.display_mode,'standard');assert.equal(standard.initial_view,'month');
  assert.equal(standard.show_header,true);assert.equal(standard.show_filters,true);assert.equal(standard.show_footer,true);
  const tv=normalizeConfig({display_mode:'tv'});
  assert.equal(tv.initial_view,'fortnight');assert.equal(tv.max_events_per_day,3);
  assert.equal(tv.show_header,false);assert.equal(tv.show_filters,false);assert.equal(tv.show_footer,false);
  assert.equal(tv.screen_mode,'normal');
  assert.equal(normalizeConfig({display_mode:'tv',show_filters:true}).show_filters,true);
  for(const input of [{display_mode:'invalid'},{screen_mode:'invalid'},{show_filters:'false'},{tv_safe_area:65},{tv_font_size:23}])assert.throws(()=>normalizeConfig(input));
});
test('Launcher URL overrides only allowlisted presentation options without mutating stored config',()=>{
  const saved={entity:'calendar.example',initial_view:'month',members:[{name:'Alex',color:'#123456'}]};
  const config=presentationConfig(saved,'?cozi_display=tv&cozi_view=fortnight&cozi_screen=fill&cozi_font_size=11&cozi_safe_area=12&cozi_max_events=3&cozi_filters=0&cozi_header=1&cozi_footer=0&entity=calendar.other&members=Someone');
  assert.equal(config.display_mode,'tv');assert.equal(config.initial_view,'fortnight');assert.equal(config.screen_mode,'fill');
  assert.equal(config.tv_font_size,11);assert.equal(config.tv_safe_area,12);assert.equal(config.max_events_per_day,3);assert.equal(config.show_filters,false);assert.equal(config.show_header,true);assert.equal(config.show_footer,false);
  assert.equal(config.entity,'calendar.example');assert.equal(config.members,saved.members);
  assert.equal(saved.initial_view,'month');assert.equal(saved.display_mode,undefined);
  assert.deepEqual(presentationConfig(saved,'?cozi_view=bad&cozi_screen=bad&cozi_filters=no'),saved);
});
function card(input={},anchor='2026-12-31'){
  const instance=Object.create(CoziCalendarCard.prototype);
  Object.assign(instance,{_config:normalizeConfig({display_mode:'tv',...input}),_anchor:anchor,_view:'fortnight',_render(){},_load(){}});
  return instance;
}
function click(instance,action){instance._click({target:{closest:()=>({dataset:{action}})}});}
test('Two-week grid spans 14 civil dates at configured week start across years and DST',()=>{
  const instance=card();let range=instance._range();
  assert.equal(range.days.length,14);assert.equal(range.start,'2026-12-27');assert.equal(range.end,'2027-01-10');
  instance._config.start_of_week=1;range=instance._range();
  assert.equal(range.start,'2026-12-28');assert.equal(range.end,'2027-01-11');
  instance._anchor='2026-11-01';assert.equal(instance._range().days.length,14);
});
test('Two-week navigation moves 14 days, stays in grid on TV, and can return to Today',()=>{
  const instance=card();instance._compact=true;
  assert.equal(instance._effectiveView(),'fortnight');
  click(instance,'next');assert.equal(instance._anchor,'2027-01-14');assert.equal(instance._followToday,false);
  click(instance,'previous');assert.equal(instance._anchor,'2026-12-31');
  click(instance,'today');assert.equal(instance._followToday,true);
  click(instance,'fullscreen');assert.equal(instance._fillWindow,true);
  click(instance,'fullscreen');assert.equal(instance._fillWindow,false);
  click(instance,'filters');assert.equal(instance._filtersOpen,true);
});


test('TV layout sizes to the visible viewport when browser chrome reduces the page height',()=>{
  const originalHeight=globalThis.innerHeight, originalViewport=globalThis.visualViewport;
  const properties=new Map(), instance=card({tv_safe_area:12});
  instance.style={setProperty:(name,value)=>properties.set(name,value)};
  try {
    globalThis.innerHeight=540;globalThis.visualViewport={height:480};
    instance._updateViewport();
    assert.equal(properties.get('--cozi-window-height'),'480px');
    assert.equal(properties.get('--cozi-safe-area'),'12px');
    globalThis.visualViewport.height=540;instance._updateViewport();
    assert.equal(properties.get('--cozi-window-height'),'540px');
  } finally {
    if(originalHeight===undefined)delete globalThis.innerHeight;else globalThis.innerHeight=originalHeight;
    if(originalViewport===undefined)delete globalThis.visualViewport;else globalThis.visualViewport=originalViewport;
  }
});
