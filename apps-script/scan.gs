
/* TEMP: scan cut sheets for each jobsite's rail type (INPUT B8) and colour (INPUT B6). Remove after use. */
function scanRailSetups() {
  const JOBS = {"Aria":["Aria"],"Astoria":["Astoria"],"Sage":["Sage"],"Wright":["Wright"],"Colton":["Colton"],"Caleb":["Caleb"],
    "Montgomery":["Montgomery"],"Elijah":["Elijah"],"Florence":["Florence"],"KKAP":["KKAP"],"Andmar":["Andmar","AndMar"],
    "Baycrest":["Baycrest","Versant"],"Horn Street":["Horn"],"Edge":["Edge"],"Latimer":["Latimer"],"Terra Gardens":["Terra Garden"],
    "Little Mountain":["Little Mountain"],"Rivercrest":["Rivercrest"],"Firehall":["Firehall"],"Greystone":["Greystone"],
    "Alder Inn":["Alder"],"Matsqui":["Matsqui"],"Larner Landing":["Larner"],"Emrose":["Emrose"],"Acres Row":["Acres Row"],
    "53A":["53A"],"Aura":["Aura"],"Sycamore":["Sycamore"],"Vara Apartments":["Vara"],"Maple View":["Maple View","Mapleview"]};
  const SINCE = new Date('2025-06-01');
  const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const t0 = Date.now(), out = {};
  const word = (s, w) => new RegExp('(^|[^a-z0-9])' + w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(s.toLowerCase());
  Object.keys(JOBS).forEach(job => {
    if (Date.now() - t0 > 300000) { out[job] = { skipped: 'time' }; return; }
    const files = {};
    JOBS[job].forEach(term => {
      const q = term.replace(/'/g, "\\'");
      const fit = DriveApp.searchFolders("title contains '" + q + "' and trashed = false");
      let nf = 0;
      while (fit.hasNext() && nf < 25) {
        const f = fit.next(); if (!word(f.getName(), term)) continue; nf++;
        collect_(f, files, 0, SINCE, XLSX);
      }
      const xit = DriveApp.searchFiles("title contains '" + q + "' and mimeType = '" + XLSX + "' and trashed = false");
      while (xit.hasNext()) { const x = xit.next(); if (x.getLastUpdated() >= SINCE) files[x.getId()] = x; }
    });
    const list = Object.keys(files).map(k => files[k]).sort((a, b) => b.getLastUpdated() - a.getLastUpdated());
    const combos = {}, seen = [];
    let read = 0;
    for (let i = 0; i < list.length && read < 8; i++) {
      if (Date.now() - t0 > 320000) break;
      const r = readInput_(list[i]); if (!r) continue; read++;
      seen.push([list[i].getName(), Utilities.formatDate(list[i].getLastUpdated(), 'America/Vancouver', 'yyyy-MM-dd'), r.b6, r.b8, r.kind]);
      const k = (r.b8 || '') + ' | ' + (r.b6 || ''); combos[k] = (combos[k] || 0) + 1;
    }
    out[job] = { files: list.length, combos: combos, seen: seen };
  });
  Logger.log('SCANRESULT ' + JSON.stringify(out));
}
function collect_(folder, files, depth, since, mime) {
  if (depth > 4) return;
  const it = folder.getFilesByType(mime);
  while (it.hasNext()) { const x = it.next(); if (x.getLastUpdated() >= since) files[x.getId()] = x; }
  const sub = folder.getFolders();
  while (sub.hasNext()) collect_(sub.next(), files, depth + 1, since, mime);
}
function readInput_(file) {
  try {
    const parts = Utilities.unzip(file.getBlob().setContentType('application/zip'));
    const by = {}; parts.forEach(p => by[p.getName()] = p);
    const wb = by['xl/workbook.xml'] && by['xl/workbook.xml'].getDataAsString(); if (!wb) return null;
    const m = wb.match(/<sheet [^>]*name="(INPUT|POSTS)"[^>]*r:id="([^"]+)"/) || wb.match(/<sheet [^>]*r:id="([^"]+)"[^>]*name="(INPUT|POSTS)"/);
    if (!m) return null;
    const rid = /^rId/.test(m[2]) ? m[2] : m[1];
    const rels = by['xl/_rels/workbook.xml.rels'].getDataAsString();
    const tm = rels.match(new RegExp('<Relationship [^>]*Id="' + rid + '"[^>]*Target="([^"]+)"')) || rels.match(new RegExp('<Relationship [^>]*Target="([^"]+)"[^>]*Id="' + rid + '"'));
    if (!tm) return null;
    const path = 'xl/' + tm[1].replace(/^\/?xl\//, '');
    const sx = by[path].getDataAsString();
    let ss = null;
    const cell = ref => {
      const c = sx.match(new RegExp('<c r="' + ref + '"([^>]*?)(?:/>|>([\\s\\S]*?)</c>)')); if (!c || !c[2]) return '';
      const v = (c[2].match(/<v>([\s\S]*?)<\/v>/) || [])[1], t = (c[1].match(/t="([^"]+)"/) || [])[1];
      if (t === 's') {
        if (!ss) ss = (by['xl/sharedStrings.xml'] ? by['xl/sharedStrings.xml'].getDataAsString() : '').split(/<si>/).slice(1).map(s => (s.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []).map(x => x.replace(/<[^>]+>/g, '')).join(''));
        return ss[+v] || '';
      }
      if (t === 'inlineStr') return (c[2].match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1] || '';
      return v || '';
    };
    const a1 = cell('A1');
    return { b6: cell('B6'), b8: cell('B8'), kind: /FENCE/i.test(a1) ? 'fence' : (m[1] === 'POSTS' || m[2] === 'POSTS') ? 'posts' : '' };
  } catch (e) { return null; }
}
