/**
 * Crew Job Board — Google Apps Script backend
 * Ridgeway Aluminum · Railings
 *
 * What it does:
 *  - Reads the "Ridgeway Schedule" Google Calendar and turns each event into a site card
 *    (blue = Install, red = Measure, green = Fab, pink = Pickup/Delivery, purple/orange = Other,
 *    grey "Away" events are skipped).
 *  - Keeps the jobsite list, crew list and everything you type on a card (crew, leave-offs,
 *    to-dos, measures, notes) in one file in your Google Drive.
 *  - The crew app (GitHub Pages) reads from here. Only someone with the PIN can save.
 *
 * Setup: see README in the repo. Deploy as a Web app → Execute as: Me → Who has access: Anyone.
 */

// ===== Settings you can change =====
const ADMIN_PIN = '5742';                      // manager PIN (tap the app logo 5 times to enter it)
const CALENDAR_ID = 'm.lieuwen@gmail.com';     // the Ridgeway Schedule calendar (shared with matt@ridgewayaluminum.com)
const CALENDAR_NAME = 'Ridgeway Schedule';     // used if the ID can't be opened
const DATA_FILE_NAME = 'Crew Job Board - data.json';
const NOTIFY_EMAIL = 'matt@ridgewayaluminum.com';  // time-off requests are emailed here
const APP_URL = 'https://mlieuwen-code.github.io/crew-board/';
const DAYS_BACK = 7;                           // calendar days to read before this week's Monday
const DAYS_AHEAD = 42;                         // and how far ahead
// ===================================

const COLOR_TYPE = { '9': 'install', '11': 'measure', '10': 'fab', '4': 'pickup', '3': 'other', '6': 'other' };
const SEED = {"crew": [{"id": "c1", "name": "Matt"}, {"id": "c2", "name": "Joel"}, {"id": "c3", "name": "Dave"}, {"id": "c4", "name": "Jim"}, {"id": "c5", "name": "Ian"}, {"id": "c6", "name": "Chris"}], "jobs": [{"id": "j1", "name": "Aria", "address": "2151 McCallum Road, Abbotsford, BC", "contact": "Mic \u00b7 604-316-3443", "access": "", "notes": "", "builder": "Diverse"}, {"id": "j3", "name": "Astoria", "address": "7042 204 Street, Langley, BC", "contact": "", "access": "", "notes": "", "builder": "Apcon"}, {"id": "j4", "name": "Sage", "address": "34365 Gladys Avenue, Abbotsford, BC", "contact": "Sean \u00b7 778-549-8370", "access": "", "notes": "", "builder": "Diverse"}, {"id": "j5", "name": "Wright", "address": "2751 Montrose Avenue, Abbotsford, BC", "contact": "Trevor \u00b7 604-781-6312", "access": "", "notes": "", "builder": "Rail District"}, {"id": "j6", "name": "Colton", "address": "8539 201B Street, Langley, BC", "contact": "Mike \u00b7 778-387-4448", "access": "", "notes": "", "builder": "Tannin"}, {"id": "j7", "name": "Caleb", "address": "32027 Peardonville Road, Abbotsford, BC", "contact": "Kevin \u00b7 604-799-1772", "access": "", "notes": "", "builder": "Whitetail"}, {"id": "j9", "name": "Montgomery", "address": "33281 2nd Avenue, Mission, BC", "contact": "Mark \u00b7 604-835-1662", "access": "", "notes": "", "builder": "Reddale"}, {"id": "j10", "name": "Elijah", "address": "20644 Eastleigh Crescent, Langley, BC", "contact": "Tony \u00b7 778-598-5212", "access": "", "notes": "", "builder": "Whitetail"}, {"id": "j11", "name": "Florence", "address": "20145 Fraser Highway, Langley, BC", "contact": "Travis \u00b7 604-834-4245", "access": "", "notes": "", "builder": "Whitetail"}, {"id": "j12", "name": "KKAP", "address": "44810 Oakridge Road, Chilliwack, BC V2P 0K5", "contact": "Dan \u00b7 604-703-6661", "access": "", "notes": "", "builder": "Westbow"}, {"id": "j14", "name": "Andmar", "address": "46187\u201346195 Thomas Road, Sardis (Chilliwack), BC", "contact": "Brandon \u00b7 604-345-2120", "access": "", "notes": "", "builder": "Tribrink"}, {"id": "j15", "name": "Baycrest", "address": "3546 Monson Crescent, Coquitlam, BC", "contact": "Rod \u00b7 604-720-2782", "access": "", "notes": "", "builder": "Infinity"}, {"id": "j16", "name": "Horn Street", "address": "2930 Horn Street, Abbotsford, BC", "contact": "Stan \u00b7 604-968-7741", "access": "", "notes": "", "builder": "Vanmar"}, {"id": "j17", "name": "Edge", "address": "9559 134A Street, Surrey, BC", "contact": "Kyle \u00b7 778-887-5370", "access": "", "notes": "", "builder": "Adera"}, {"id": "j18", "name": "Latimer", "address": "20088 86 Ave, Langley Twp, BC V2Y 2B9", "contact": "Aiden \u00b7 604-562-7124", "access": "", "notes": "", "builder": "Vesta"}, {"id": "j19", "name": "Terra Gardens", "address": "15258 102A Avenue, Surrey, BC", "contact": "", "access": "", "notes": "", "builder": "CPM"}, {"id": "jruelf0v", "name": "Little Mountain", "builder": "Karvin", "address": "47250\u201347280 Valerie Place, Chilliwack, BC V2P 0K4", "contact": "Josiah \u00b7 604-997-3605", "access": "", "notes": ""}, {"id": "jbqsdl9h", "name": "Rivercrest", "builder": "Black Maple", "address": "20147 52 Ave, Langley, BC V3A 6R7", "contact": "Derek \u00b7 778-347-3511", "access": "", "notes": ""}, {"id": "jyl4e1cv", "name": "Firehall", "builder": "Caliber", "address": "20230 72B Avenue, Langley, BC", "contact": "Miciah \u00b7 604-309-4745", "access": "", "notes": ""}, {"id": "jw92jifv", "name": "Greystone", "builder": "Caliber", "address": "1918 Harbour Street, Port Coquitlam, BC", "contact": "Matt \u00b7 672-985-0070", "access": "", "notes": ""}, {"id": "j14hdp9l", "name": "Alder Inn", "builder": "Caliber", "address": "27214 Fraser Hwy, Langley, BC", "contact": "", "access": "", "notes": ""}, {"id": "jw0cobz4", "name": "Matsqui", "builder": "Caliber", "address": "33495 & 33509 Matsqui Way, Abbotsford, BC", "contact": "", "access": "", "notes": ""}, {"id": "jayd63jp", "name": "Larner Landing", "builder": "Black Maple", "address": "13757 108 Ave, Surrey, BC", "contact": "", "access": "", "notes": ""}, {"id": "jsurrvcv", "name": "Emrose", "builder": "Stonepeak", "address": "9563 Woodbine Street, Chilliwack, BC", "contact": "", "access": "", "notes": ""}, {"id": "j1tx3gih", "name": "Acres Row", "builder": "Wesmont", "address": "18588 75 Avenue, Surrey, BC", "contact": "Joel \u00b7 778-809-3304", "access": "", "notes": ""}, {"id": "jeufenuv", "name": "53A", "builder": "RKDI", "address": "20142 53A Ave, Langley, BC", "contact": "Joel \u00b7 778-242-2795", "access": "", "notes": ""}], "days": {}, "weeks": {}};

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'board';
  try {
    if (action === 'board') return json_({ ok: true, state: boardWithCalendar_() });
    if (action === 'ping') return json_({ ok: true });
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch (x) { return json_({ ok: false, error: 'bad request' }); }
  try {
    if (body.action === 'checkPin') return json_({ ok: String(body.pin) === String(ADMIN_PIN) });
    if (body.action === 'requestOff') return withLock_(() => {
      const r = body.request || {};
      const name = String(r.name || '').trim().slice(0, 60), from = String(r.from || ''), to = String(r.to || r.from || '');
      if (!name || !/^\d{4}-\d\d-\d\d$/.test(from) || !/^\d{4}-\d\d-\d\d$/.test(to) || to < from) return json_({ ok: false, error: 'Fill in your name and the dates' });
      const st = readState_();
      const item = { id: Utilities.getUuid().slice(0, 8), name: name, from: from, to: to, note: String(r.note || '').slice(0, 300), status: 'pending', created: Date.now() };
      st.timeOff.push(item); writeState_(st);
      try { emailRequest_(item); } catch (err) { console.warn('email failed: ' + err); }
      return json_({ ok: true });
    });
    if (body.action === 'listOff') {
      if (String(body.pin) !== String(ADMIN_PIN)) return json_({ ok: false, error: 'wrong pin' });
      return json_({ ok: true, timeOff: readState_().timeOff });
    }
    if (body.action === 'offStatus') {
      if (String(body.pin) !== String(ADMIN_PIN)) return json_({ ok: false, error: 'wrong pin' });
      return withLock_(() => {
        const st = readState_();
        const x = st.timeOff.find(t => t.id === body.id);
        if (!x) return json_({ ok: false, error: 'not found' });
        let calNote = '';
        if (body.status === 'approved') {
          x.status = 'approved'; x.decided = Date.now();
          if (!x.calEventId) { try { x.calEventId = addAwayEvent_(x); } catch (err) { calNote = String(err && err.message || err); } }
        } else {
          if (x.calEventId) { try { removeAwayEvent_(x.calEventId); x.calEventId = ''; } catch (err) { calNote = String(err && err.message || err); } }
          if (body.status === 'delete') st.timeOff = st.timeOff.filter(t => t.id !== body.id);
          else { x.status = 'declined'; x.decided = Date.now(); }
        }
        writeState_(st);
        return json_({ ok: true, timeOff: st.timeOff, calNote: calNote });
      });
    }
    if (body.action === 'save') {
      if (String(body.pin) !== String(ADMIN_PIN)) return json_({ ok: false, error: 'wrong pin' });
      const lock = LockService.getScriptLock();
      lock.waitLock(20000);
      try {
        const st = body.state || {};
        st.timeOff = readState_().timeOff;   // time-off requests are only changed by their own actions
        delete st.calAway; delete st.calError;
        st.updatedAt = Date.now();
        writeState_(st);
        return json_({ ok: true, updatedAt: st.updatedAt });
      } finally { lock.releaseLock(); }
    }
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

/* ---------- storage (one JSON file in your Drive) ---------- */
function dataFile_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('DATA_FILE_ID');
  if (id) { try { return DriveApp.getFileById(id); } catch (x) {} }
  const found = DriveApp.getFilesByName(DATA_FILE_NAME);
  const f = found.hasNext() ? found.next() : DriveApp.createFile(DATA_FILE_NAME, JSON.stringify(SEED), 'application/json');
  props.setProperty('DATA_FILE_ID', f.getId());
  return f;
}
function readState_() {
  const st = JSON.parse(dataFile_().getBlob().getDataAsString() || '{}');
  st.crew = st.crew || []; st.jobs = st.jobs || []; st.days = st.days || {}; st.weeks = st.weeks || {}; st.timeOff = st.timeOff || [];
  return st;
}
function writeState_(st) { dataFile_().setContent(JSON.stringify(st)); }

/* ---------- calendar ---------- */
function calendar_() {
  let cal = null;
  try { cal = CalendarApp.getCalendarById(CALENDAR_ID); } catch (x) {}
  if (!cal) { try { cal = CalendarApp.subscribeToCalendar(CALENDAR_ID, { hidden: true }); } catch (x) {} }
  if (!cal) { const named = CalendarApp.getCalendarsByName(CALENDAR_NAME); if (named.length) cal = named[0]; }
  if (!cal) throw new Error('Can\'t open the Ridgeway Schedule calendar from this Google account');
  return cal;
}
function boardWithCalendar_() {
  const st = readState_();
  const tz = Session.getScriptTimeZone();
  const today = new Date();
  const mon = new Date(today); mon.setDate(today.getDate() - ((today.getDay() + 6) % 7)); mon.setHours(0, 0, 0, 0);
  const from = new Date(mon); from.setDate(from.getDate() - DAYS_BACK);
  const to = new Date(mon); to.setDate(to.getDate() + DAYS_AHEAD);
  const fmt = d => Utilities.formatDate(d, tz, 'yyyy-MM-dd');
  try {
    const events = calendar_().getEvents(from, to).map(ev => {
      const allDay = ev.isAllDayEvent();
      return {
        id: ev.getId(),
        summary: ev.getTitle(),
        colorId: String(ev.getColor() || ''),
        start: allDay ? { date: fmt(ev.getAllDayStartDate()) } : { dateTime: Utilities.formatDate(ev.getStartTime(), tz, "yyyy-MM-dd'T'HH:mm") },
        end: allDay ? { date: fmt(ev.getAllDayEndDate()) } : {}
      };
    });
    applyCalendar_(st, events, fmt(from), fmt(to));
    const booked = {}; st.timeOff.forEach(t => { if (t.calEventId) booked[t.calEventId] = 1; });
    st.calAway = events.filter(ev => ev.colorId === '8' && ev.summary && !booked[ev.id]).map(ev => {
      const f = ev.start.date || ev.start.dateTime.slice(0, 10);
      const t = ev.end.date ? addDays_(ev.end.date, -1) : f;
      return { title: ev.summary.trim(), from: f, to: t < f ? f : t };
    });
    st.calSync = Date.now();
  } catch (err) {
    st.calError = String(err && err.message || err);
  }
  st.timeOff = st.timeOff.filter(t => t.status === 'approved').map(t => ({ name: t.name, from: t.from, to: t.to, status: 'approved' }));
  return st;
}

/* same matching rules the board uses: jobsite name in the event title, or a builder with only one job */
function wordIn_(t, w) { return new RegExp('(^|[^a-z0-9])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(t); }
function matchJob_(st, title) {
  const t = title.toLowerCase(); let best = null;
  st.jobs.forEach(j => {
    // the jobsite name, plus any other names it goes by on the calendar ("Vara" for Vara Apartments)
    [j.name].concat(String(j.aka || '').split(',')).forEach(x => { const n = String(x || '').trim().toLowerCase(); if (n && wordIn_(t, n) && (!best || n.length > best.n.length)) best = { j: j, n: n }; });
  });
  if (best) best = best.j;
  if (best) return best;
  const hits = st.jobs.filter(j => { const b = (j.builder || '').toLowerCase(); return b && wordIn_(t, b); });
  return hits.length === 1 ? hits[0] : null;
}
function addDays_(k, n) { const p = k.split('-'); const d = new Date(+p[0], +p[1] - 1, +p[2] + n); return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function weekday_(k) { const p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).getDay(); }
function eventDays_(ev) {
  const out = [], s = ev.start || {}, e = ev.end || {};
  if (s.date) { let k = s.date; const end = e.date || addDays_(k, 1); while (k < end) { const w = weekday_(k); if (w !== 0 && w !== 6) out.push(k); k = addDays_(k, 1); } }
  else if (s.dateTime) out.push(s.dateTime.slice(0, 10));
  return out;
}
function newItem_() { return { id: Utilities.getUuid().slice(0, 8), jobId: '', type: 'install', start: '', area: '', crew: [], lead: '', leaveOff: '', tasks: '', measure: '', bring: '', notes: '' }; }
function applyCalendar_(st, events, from, to) {
  const keep = {}, have = {};
  Object.keys(st.days).forEach(k => { if (k < from || k >= to) return; (st.days[k].items || []).forEach(it => { if (it.calId) have[it.calId] = it; }); });
  events.forEach(ev => {
    if (ev.colorId === '8') return;
    const title = (ev.summary || '').trim(); if (!title) return;
    eventDays_(ev).forEach(k => {
      if (k < from || k >= to) return;
      const cid = ev.id + '@' + k; let it = have[cid];
      const j = matchJob_(st, title), type = COLOR_TYPE[ev.colorId] || 'other';
      if (!it) { it = newItem_(); it.calId = cid; if (!st.days[k]) st.days[k] = { note: '', items: [] }; st.days[k].items.push(it); have[cid] = it; }
      it.jobId = j ? j.id : ''; it.jobName = j ? '' : title; it.type = type; it.calTitle = title;
      if (ev.start && ev.start.dateTime && !it.start) { const hm = ev.start.dateTime.slice(11, 16).split(':'); let h = +hm[0]; it.start = ((h + 11) % 12 + 1) + ':' + hm[1] + (h < 12 ? ' a.m.' : ' p.m.'); }
      keep[cid] = 1;
    });
  });
  Object.keys(st.days).forEach(k => {
    if (k < from || k >= to) return;
    st.days[k].items = (st.days[k].items || []).filter(it => !it.calId || keep[it.calId]);
    if (!st.days[k].items.length && !st.days[k].note) delete st.days[k];
  });
}

/* approved time off goes on the Ridgeway Schedule as a grey all-day AWAY event */
function ymdDate_(k) { const p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function addAwayEvent_(x) {
  const ev = calendar_().createAllDayEvent('AWAY - ' + x.name, ymdDate_(x.from), ymdDate_(addDays_(x.to, 1)), { description: (x.note ? x.note + '\n' : '') + 'Booked through the Crew Job Board' });
  ev.setColor('8');
  return ev.getId();
}
function removeAwayEvent_(id) {
  const ev = calendar_().getEventById(id);
  if (ev) ev.deleteEvent();
}
function emailRequest_(x) {
  const fmtD = k => Utilities.formatDate(ymdDate_(k), Session.getScriptTimeZone(), 'EEE MMM d');
  const when = x.from === x.to ? fmtD(x.from) : fmtD(x.from) + ' – ' + fmtD(x.to);
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    name: 'Crew Board',
    subject: 'Time off request: ' + x.name + ' · ' + when,
    htmlBody: '<p><b>' + x.name + '</b> has asked for time off.</p>' +
      '<p><b>When:</b> ' + when + '<br><b>Reason:</b> ' + (x.note ? x.note.replace(/</g, '&lt;') : '—') + '</p>' +
      '<p><a href="' + APP_URL + '#off">Open the Time Off tab</a> (tap the logo 5 times to unlock) to approve or decline.</p>'
  });
}
function withLock_(fn) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** Run this once from the editor to grant calendar + Drive access and check everything works. */
function testSetup() {
  const st = boardWithCalendar_();
  const n = Object.keys(st.days).reduce((a, k) => a + st.days[k].items.length, 0);
  Logger.log('Calendar: ' + calendar_().getName() + ' · ' + n + ' site cards · ' + st.jobs.length + ' jobsites' + (st.calError ? ' · ERROR ' + st.calError : ''));
}
