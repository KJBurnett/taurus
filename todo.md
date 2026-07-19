# Future Bug-Fix Backlog

Every item below must preserve existing `gemini_folders_data` records in both
`chrome.storage.local` and `chrome.storage.sync`. Do not change the storage key
or require users to recreate folders, aliases, or chat assignments.

## P0 — Prevent lost or misleading writes

- [ ] **Eliminate stored-data markup injection and title corruption.**
  Folder names and chat aliases are inserted into `innerHTML`, including
  attribute values (`src/content.js:354-357, 448-463, 509-518, 755-765,
  789-794`). Quotes can truncate edit-dialog values and permanently overwrite a
  title on confirmation; malicious imported data can inject markup into the
  Gemini page. Use DOM properties (`textContent`, `value`, and `title`) or
  context-appropriate escaping. Existing names must render and round-trip
  byte-for-byte.

- [ ] **Make sync-write failures observable and restore the persisted UI state.**
  `Storage.set()` resolves its Promise even when `chrome.runtime.lastError` is
  set, masking a failed write (`src/utils/storage.js`). Each caller then treats
  the unsaved data as successful, so edits disappear after a reload. Propagate
  an actionable failure (or explicitly reload the last saved state) and ensure
  all mutation callers preserve the user's existing data on quota and other
  storage errors. Retain local data if migration cannot finish.

- [ ] **Serialize or conflict-check storage mutations.**
  Folder and chat mutations all follow an independent read-modify-write cycle
  (`src/utils/storage.js:147-238`). Concurrent actions, including edits in two
  Gemini tabs, can each read the same old document and the final write discards
  the other action. Add a legacy-safe write queue or optimistic conflict retry;
  existing folder IDs, names, colors, aliases, and assignments must merge
  without being overwritten.

## P1 — Keep legacy data and imports usable

- [ ] **Complete local-to-sync migration only after a confirmed sync write.**
  Failed migration writes are currently treated as successful, then retried on
  every load because the local copy remains (`src/utils/storage.js:57-65,
  120-139`). Keep the legacy local copy until sync persistence is confirmed,
  surface a durable migration failure, and avoid repeated silent attempts.
  Migration must never erase the only readable copy of a user's folders.

- [ ] **Accept legacy chat records that contain an ID but no URL.**
  Import skips such chats (`src/content.js:716-718`) even though the extension
  already reconstructs canonical Gemini URLs from an ID when loading storage
  (`src/utils/storage.js:71-82`). Hydrate missing URLs during import and tell
  users how many malformed records were skipped instead of claiming the import
  completed without skipped records (`src/content.js:680`). Preserve the
  current merge behavior for duplicate folders and chats.

- [ ] **Preserve imported folder colors.**
  Newly created folders in `mergeImportedData()` copy a name and chats but drop
  `impFolder.color` (`src/content.js:704-711`). Validate known colors and retain
  them; treat absent colors as the existing default so older backups continue
  to import unchanged.

## P1 — Prevent extension breakage

- [ ] **Bound sidebar discovery so the rest of initialization still runs.**
  `waitForElement()` never settles if Gemini changes or omits the sidebar
  selector (`src/utils/dom.js`). Consequently `init()` remains blocked at
  `await this.injectSidebar()` and never starts header injection, URL tracking,
  storage listeners, or recovery checks (`src/content.js:39-51, 132-178`).
  Add a disconnected timeout/retry path that lets independent features start
  and retries sidebar injection without retaining unused `MutationObserver`
  instances or document event listeners.

## Regression coverage required for every fix

- Add tests for failed `chrome.storage.sync.set`, simultaneous mutations, and
  migration failure/success using both pre-existing local and sync data.
- Add import fixtures for ID-only chats, missing colors, quoted names, aliases,
  and current-format backups.
- Verify that an existing saved dataset can be loaded, edited, exported,
  imported, and reloaded without changing its folder/chat membership or aliases.
