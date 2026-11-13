# Crew Job Board

Ridgeway Aluminum field crew job list — what's happening at each site today and this week:
the site, address with a map link, site super with tap-to-call, what to do, what to measure,
and what to leave off for site access.

- **Crew link:** `https://mlieuwen-code.github.io/crew-board/` — view only, no login. Add it to the home screen like an app.
- **Manager link (Matt):** `https://mlieuwen-code.github.io/crew-board/?manager` — tap ✎ Edit and enter the PIN once per device.

The schedule comes straight from the **Ridgeway Schedule** Google Calendar every time the app opens
(blue = Install, red = Measure, green = Fab, pink = Pickup/Delivery, purple/orange = Other, grey "Away" skipped).
Calendar titles are matched to jobsites by name, or by builder when that builder has only one job.
Everything typed on a card (crew, leave-offs, to-dos, measures, notes) is kept in
`Crew Job Board - data.json` in Matt's Google Drive.

## Files
- `index.html` — the app (GitHub Pages). `API_URL` near the top points at the Apps Script web app.
- `apps-script/Code.gs`, `apps-script/appsscript.json` — the Google Apps Script backend.
- `manifest.webmanifest`, `sw.js`, icons — home-screen app + works with no signal (shows the last copy).

## Backend setup (once)
1. Signed in to matt@ridgewayaluminum.com (it has access to the **Ridgeway Schedule** calendar, ID `m.lieuwen@gmail.com`), go to script.google.com → **New project**, name it **Crew Job Board**.
2. Replace the contents of `Code.gs` with `apps-script/Code.gs` from this repo. Change `ADMIN_PIN` at the top.
3. Project Settings → tick **Show "appsscript.json" manifest file**, then replace it with `apps-script/appsscript.json`.
4. Pick `testSetup` in the function menu → **Run** → allow access. The log should say how many site cards it found.
5. **Deploy → New deployment → Web app** · Execute as: **Me** · Who has access: **Anyone** → Deploy → copy the URL ending in `/exec`.
6. Put that URL in `API_URL` in `index.html` (Claude can do this).

After changing `Code.gs` later: Deploy → Manage deployments → ✎ → Version: **New version** → Deploy (the URL stays the same).
