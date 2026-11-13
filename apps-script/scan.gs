
/* TEMP: scan cut sheets for each jobsite's rail type (INPUT B8) and colour (INPUT B6). Remove after use. */
function scanRailSetups() {
  const FOLDERS = {"Aria": ["1YktZoCt0Qdx1UDvrPKcF9qByPsWBjERK", "13zS-TtEkYx2qJqUnsvr3VtBM1yXUiPRH", "1_CK2f89frXG-P6WLRx8K-6QvMHLmSe7-", "1-Qpz4klF15OsgeUqiHa7mOeLiHE19XoN"], "Astoria": ["1yH1iU2GGYfl22jR2oXSQNcTiY41O9dzk", "1zmQ3xTAVymBxGjV7fV-8KdgSTuP6msk6", "1u1NEl_sGko-FuOx5sDe-AFS0ia0-1h-E"], "Sage": ["1b7y4w1ck7qtN55yuwOwGw7QG48UdonJJ", "12nVs7weuZ7d2cJF_-1pUvYQBzVLn8Pcc", "1ByP7bp9L-G25VD35bgHTrHD5GS4PrRn-", "1EDHQM1xk18x7EjBDMMhi79fnDMp5fLvL"], "Wright": ["1mlfTh_fALEzsQBP4FYd06LD3s-qedR2S", "17wSOE5mX3fDsUXOaHH9IbG-HE8z1xUTs", "1fs3bsw0Nm82LDEPRq3KoBdFKS54bOHk5"], "Colton": ["1eG94-gzDN-1KgzeiInhxPLcBfbcPgebK", "1X-BtNwjL-9gDIhMQV-qMDpGVwHNRfdso", "1bcbHm4Mn35Iq-DOsOInpJyPNKDoOOyX6"], "Caleb": ["1dF2KJ_vX__0EHS-wX72q9OhYh44gm7P3", "1Xwq41zlVAcRXq3qhvwBvT2kEzmT1xPpk", "1EQ85vZ863DnlQYf9OQag3Y1ARWGHlBbC"], "Montgomery": ["1U9p6ECsEUQY0PneaKxoZ2475-OihP3wZ", "1pPNUcscQpeiC48rC1fPM96Aj0riAC4ao", "1X0uKnBKHt4Ra17f0DKAAEoQKKfr8q13f"], "Elijah": ["1eZTrpmD9YB_g06F-pPmUV8P6_mtZCek8", "1hZYvHJ_IYJBq1W63Fj0bQuKTj3IDTLtk", "1ttJqP3TE7sIA-mJLlGSZ8XBPLj2WEnBd", "1CQnS9l6GNYpQ9XhJxCt0agbD21-3UE4n"], "Florence": ["1-L06gXBAEorgbtHOEg8TfSMSw43zpvgz", "1KlqcsQqxHUiZv89vIVeOafSDSCjTTQYd", "1P-Scl75NnYIHVDu4Ps2crUX6OUFSEHEI"], "KKAP": ["1WrZNPnUHHXVvWLvfHAyaiHc7rEADKmVV", "1y7hj41bhk7Y3gc7EitNu8DU9ygSl1gWR", "14-zgcpxuZCNHVDDmF6DeRBJLwFpKUDzE", "1YZdDgvvPCPl-YpbNvWap6OMQitxw9AC9"], "Andmar": ["1SUbLBAbvewnc4DxRBQ036XQY-dGzp0Er", "12lBzATcUq4M8D8fLYq0dv_HZS6ZzkPYx"], "Baycrest": ["1XRfcvjqe8uZZhg81JYrUrd6m_4byfRXQ", "1tnobLRSR-LqSKA1RSC2TjjHYCH36G9CK", "1O2M3Z9DICe5jW3eqh6EmDqVApXhqEeUZ"], "Horn Street": ["1ywLkO2brfR-ok2Bnu_mNXy-yMu7tGh0s", "1X-KX7oiOve1evuQVC_II4i65oyd_8Cib", "1iuSi8RpXgtvZgevl9TbO9xEMbtX71ht5"], "Edge": ["1XoT4vR5ApaN6NWrXQgwKcGC0BqT6F11c", "1p9A0y41EgKW1E1iGoctid9-J0vvKQDGt", "1VyYK4RgH4CYt3s9U_36hDosqXvMI-Chb"], "Latimer": ["1WdQ1hcKtU4jIflevTqnqHYKjbwM_i0SY", "1RqTv0fZ5VokxDZ2cmR1yGUv57MFxZ_F5"], "Terra Gardens": ["1WJCIjvUIsZSXsl9TGrfDVrIJm6ypS_IS", "19qZu8OA28g499bZ63Vv-XqlBjwST6K2q", "1Fgs0svKjujIyWnn9szD9keUZPFp1jyjs"], "Emrose": ["1FEvlhMq4m990TI-j9tTaDKs5zdoN01Ds", "1Ps9F39jr6dauiOwUp0eAs1FkBx4AmE5s"], "Acres Row": ["1BmToTvJ7Ag5B9zvj9q5XtCia4uyXjMf9", "1I4QwaYmvaflEg2fR4ZstbQSfJMKSId73", "1j2CH_seMrUzq7m_RkiJNK08lwvU_CHzJ"], "Larner Landing": ["1rTGuzwqzzFBMyT6_dakw4WYSXYwWwjtc", "1syOdUUHQMt2-CK0FU2udujlrzrJn_DKV", "1aVi92MSIjhqhClZx6-FtQTw32DCOmPQj"], "Greystone": ["1vgHPWHdAvHFXWSCoi_PYtMawUnJ1fhTL", "1Kli1WFB78hX47ksWl7rRRleHPI8Y-Zwk", "1O5zpEl0kUP7HxxmEN8bk9QNeFdsi99NG", "1tAnj1bk_qibY3ohcQl3sx3PLWABB4k9u"], "Sycamore": ["1k89l6Xa4q_7biyLiu6spToWPho6v_ApK", "1Fym6ny36q2p0ZxuTpDPmzDwvLlSQik6o"], "Firehall": ["1IeUkddCYKnVi_iokeH6oUM62bCkBLDnE", "1QgxJmVKu8SMkuUyZ3uIsc3IZdNtJm2GL", "14HtnlwUT3IqUaRElMif2nrGe8JjuG-zE", "1wtF9PpClJNMllvOIR5gy2M0jBoAmOpya"], "Aura": ["1N1UHM8tlDn0Kh_LxdVY2YLAz6JhuNZ9m", "1uxeb1J2HXwTVIUAfzp3qN-7E2ZdefFxe"], "53A": ["1hZQplEna9tIM3ZQcpegQ9LuxWZ8qJz5s", "1uYBte_kkG0hYvLDmLqpY8u-UlnCfNRrv", "18VcDTHhPPF9PFxy8k1Rt4p0oCXliTBLx"], "Maple View": ["13eQ4W8-re5Am9Xiqh0AGKh6ThEep04Wz", "1J9A9UM1LwE8aW83jcfT9l_6Awq9umkyK"], "Rivercrest": ["1d2Zhvs-g5OP5qZ05_by-dQxpkAAwuVCA", "1kVp6H5UKYbf2brRA_GFGcu16-Px_SlL8", "1cPwIttivcPV5zTf-tUtO7iqLLQi9KoNU"], "Alder Inn": ["1s1l_SJMYT8BTxP7UD8aHXAxcgOO-_d6y", "1Apa5bDr3udGWkTC0p-zSjdJRdYDDqO6k", "1vEeiRdojXolTkp_4RrvQoz_KdsDXh2dv"], "Matsqui": ["1ZIkno-5w_mLVCLKB4yrKBoQjQE6gdeje"]};
  const SKIP = PropertiesService.getScriptProperties().getProperty('scanDone') ? JSON.parse(PropertiesService.getScriptProperties().getProperty('scanDone')) : {};
  const SINCE = new Date('2025-01-01');
  const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const t0 = Date.now();
  Object.keys(FOLDERS).forEach(job => {
    if (SKIP[job] || Date.now() - t0 > 280000) return;
    const files = {};
    FOLDERS[job].forEach(id => { try { collect_(DriveApp.getFolderById(id), files, 0, SINCE, XLSX); } catch (e) {} });
    const list = Object.keys(files).map(k => files[k]).sort((a, b) => b.getLastUpdated() - a.getLastUpdated());
    const combos = {}, seen = [];
    let read = 0;
    for (let i = 0; i < list.length && read < 6; i++) {
      if (Date.now() - t0 > 320000) break;
      const r = readInput_(list[i]); if (!r || r.kind) continue; if (!r.b8 && !r.b6) continue; read++;
      seen.push([list[i].getName(), Utilities.formatDate(list[i].getLastUpdated(), 'America/Vancouver', 'yyyy-MM-dd'), r.b6, r.b8]);
      const k = (r.b8 || '') + ' | ' + (r.b6 || ''); combos[k] = (combos[k] || 0) + 1;
    }
    SKIP[job] = { files: list.length, combos: combos, seen: seen };
    PropertiesService.getScriptProperties().setProperty('scanDone', JSON.stringify(SKIP));
  });
  Logger.log('SCANRESULT ' + JSON.stringify(SKIP));
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
