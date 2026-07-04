/**
 * Live Out Loud waitlist backend.
 *
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet.
 * Every POST from the landing page becomes one row: timestamp, email.
 *
 * Setup:
 *   1. Create a new Google Sheet (e.g. "Live Out Loud Waitlist").
 *   2. Extensions -> Apps Script, delete the boilerplate, paste this file in.
 *   3. Deploy -> New deployment -> type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Copy the resulting .../exec URL and paste it into WAITLIST_SCRIPT_URL
 *      near the top of liveoutloudhero.html.
 *   5. Re-run Deploy -> Manage deployments -> pencil icon -> New version
 *      whenever you edit this script, or the live URL won't pick up changes.
 */

const SHEET_NAME = "Waitlist";

function doPost(e) {
  const sheet = getOrCreateSheet();

  let email = "";
  let joinedAt = new Date().toISOString();

  try {
    const body = JSON.parse(e.postData.contents);
    email = String(body.email || "").trim();
    if (body.joinedAt) joinedAt = body.joinedAt;
  } catch (err) {
    // Fall back to form-encoded params if the body wasn't JSON.
    email = String((e.parameter && e.parameter.email) || "").trim();
  }

  if (!email || email.indexOf("@") === -1) {
    return jsonResponse({ ok: false, error: "Invalid email" });
  }

  sheet.appendRow([new Date(joinedAt), email]);

  return jsonResponse({ ok: true });
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Joined At", "Email"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
