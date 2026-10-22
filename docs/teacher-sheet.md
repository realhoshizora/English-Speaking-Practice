# Track students' progress in a Google Sheet

Each time a student finishes an activity (speaking, listening or vocabulary), the app adds one row to your Google Sheet: time, student name, activity, scenario, score, details and their current streak (days in a row they reached their daily goal). Voice and typed answers are never sent.

Setup takes about 5 minutes and is free.

## 1. Create the sheet and script

1. Go to [sheets.new](https://sheets.new) and name the spreadsheet, e.g. "ESP progress".
2. Menu **Extensions → Apps Script**. Delete everything in `Code.gs` and paste this:

```js
// Receives one finished activity from English Speaking Coach and appends it to the "Log" tab.
function doPost(e) {
  var r = JSON.parse(e.postData.contents);
  var clip = function (v, n) { return String(v == null ? '' : v).slice(0, n); };
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Log') || ss.insertSheet('Log');
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (sh.getLastRow() === 0) sh.appendRow(['Time', 'Student', 'Activity', 'Scenario', 'Score (%)', 'Details', 'ID', 'Streak (days)']);
    var id = clip(r.id, 40);
    // Skip a row that was already received (the app may retry after a network error).
    if (id && sh.getRange('G:G').createTextFinder(id).matchEntireCell(true).findNext()) return ContentService.createTextOutput('dup');
    var score = r.score === '' || r.score == null ? '' : Number(r.score);
    sh.appendRow([new Date(r.date), clip(r.student, 60), clip(r.type, 40), clip(r.scenario, 80), score, clip(r.detail, 120), id, Number(r.streak) || 0]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
```

3. Click **Save** (disk icon).

## 2. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. Click **Deploy**, then **Authorize access** and allow it with your Google account. Google may warn that the app isn't verified; click **Advanced → Go to (project name)**. This is your own script.
5. Copy the **Web app URL** (it ends in `/exec`).

## 3. Connect the app (Render)

1. Open your static site on Render → **Environment**.
2. Add a variable: key `VITE_TEACHER_SHEET_URL`, value: the URL you copied.
3. Save, then **Manual Deploy → Deploy latest commit**. The URL is built into the site, so it only takes effect after a new deploy.

For local testing, put the same line in a `.env` file at the project root and restart `npm run dev`.

## 4. Students

Each student opens **Settings → Gửi tiến độ cho giáo viên**, types their name once and taps **Lưu**. Home shows a reminder until they do. Activities finished before entering the name are sent as soon as the name is saved; activities finished offline are sent when the device is back online.

## 5. Daily summary (optional)

Add a second tab named "Daily" and put this in cell A1 (use `Log!A:H`):

```
=QUERY(Log!A:H, "select toDate(A), B, count(C), avg(E), max(H) where B is not null group by toDate(A), B order by toDate(A) desc label toDate(A) 'Day', count(C) 'Activities', avg(E) 'Average score (%)', max(H) 'Streak'", 1)
```

It shows, per day and per student, how many activities they did, their average score and their streak.

## Limits

- There is no login. The name is whatever the student types, so a student could type someone else's name.
- The web app URL is inside the site's code, so anyone who digs for it could add rows. For a small class this is fine; if it ever matters, make a new deployment (new URL) and update Render.
- If you change the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
