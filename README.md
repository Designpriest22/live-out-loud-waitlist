# Live Out Loud — Waitlist Landing Page

Single-file React (via CDN + Babel) landing page for the Live Out Loud Music
Festival waitlist, with a real backend wired up via Google Apps Script so
signups land in a Google Sheet you own.

## Files

- `liveoutloudhero.html` — the landing page. Open it directly or host it
  statically (GitHub Pages, Netlify, S3, etc.).
- `backend/AppsScript.gs` — the Google Apps Script backend that receives
  signups and appends them to a Sheet.

## One-time setup (5 minutes)

1. Create a new Google Sheet, e.g. "Live Out Loud Waitlist".
2. In the Sheet, go to **Extensions -> Apps Script**.
3. Delete the placeholder `Code.gs` contents and paste in the contents of
   `backend/AppsScript.gs` from this repo.
4. Click **Deploy -> New deployment**.
   - Select type: **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy** and authorize the script when prompted.
5. Copy the Web app URL it gives you (ends in `/exec`).
6. Open `liveoutloudhero.html`, find the line near the top:
   ```js
   const WAITLIST_SCRIPT_URL = "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec";
   ```
   and replace the placeholder URL with the one you copied.
7. Open (or re-deploy) `liveoutloudhero.html`. Submitting the form now appends
   a row `[Joined At, Email]` to the "Waitlist" sheet tab (auto-created on
   first signup).

Whenever you edit `AppsScript.gs` later, use **Deploy -> Manage deployments ->
edit (pencil) -> New version** — editing the script alone does not update the
already-published `/exec` URL.

## How it works

- The form still validates the email client-side before sending anything.
- On submit, the page POSTs `{ email, joinedAt }` as a `text/plain` JSON body
  to the Apps Script URL using `fetch(..., { mode: "no-cors" })`. This avoids
  a CORS preflight, which Apps Script web apps don't support — the tradeoff is
  the page can't read the response, so success is optimistic (it shows the
  "you're on the list" state once the request doesn't throw a network error).
- The live counter on the page is still a cosmetic local animation (per
  visitor), not a live read of the Sheet's row count. Wiring the counter to
  the real total would need a `doGet` endpoint on the same script returning
  the row count, polled on page load — ask if you want that added too.

## Exporting signups

Open the Google Sheet at any time — File -> Download -> CSV/Excel — or share
the Sheet with collaborators like any other Google Sheet.
