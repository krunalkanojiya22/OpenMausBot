// The announcements feed: announcements/announcements.json on main, kept by the shared remote-file store (remote-file.ts:
// the bundled copy, the disk cache and the hourly download, as the model manifest keeps its list).
import { join } from "node:path";

import { ANNOUNCEMENTS_URL, liveCards, parseAnnouncementFeed, type AnnouncementCard, type AnnouncementFeed } from "../../shared/announcements.ts";
import { DATA_DIR } from "../config.ts";
import {
  ANNOUNCEMENTS_DISABLE_ENV, REMOTE_FILE_FETCH_TIMEOUT_MS, REMOTE_FILE_FIRST_WAIT_MS, REMOTE_FILE_RETRY_MS, REMOTE_FILE_TTL_MS, RemoteJsonFile,
  type RemoteFileOptions,
} from "./remote-file.ts";

export { ANNOUNCEMENTS_DISABLE_ENV };
export const ANNOUNCEMENTS_TTL_MS = REMOTE_FILE_TTL_MS;
export const ANNOUNCEMENTS_RETRY_MS = REMOTE_FILE_RETRY_MS;
export const ANNOUNCEMENTS_FETCH_TIMEOUT_MS = REMOTE_FILE_FETCH_TIMEOUT_MS;
export const ANNOUNCEMENTS_MAX_BYTES = 64 * 1024;
export const ANNOUNCEMENTS_FIRST_WAIT_MS = REMOTE_FILE_FIRST_WAIT_MS;

export const BUNDLED_ANNOUNCEMENTS: AnnouncementFeed = { version: 1, updatedAt: new Date(0).toISOString(), cards: [] };

/** Under providers/, as the manifest's cache is, so backups and Move to Cloud leave it out. */
export function announcementsCachePath(dataDir: string): string {
  return join(dataDir, "providers", "announcements", "announcements.json");
}

export interface AnnouncementStoreOptions extends RemoteFileOptions {
  bundled?: AnnouncementFeed;
}

export class AnnouncementStore extends RemoteJsonFile<AnnouncementFeed> {
  constructor(options: AnnouncementStoreOptions) {
    super(options, {
      name: "announcements",
      url: ANNOUNCEMENTS_URL,
      cachePath: announcementsCachePath(options.dataDir),
      bundled: options.bundled ?? BUNDLED_ANNOUNCEMENTS,
      maxBytes: ANNOUNCEMENTS_MAX_BYTES,
      parse: (value, nowMs) => {
        const parsed = parseAnnouncementFeed(value, { nowMs });
        return parsed.ok ? { ok: true, value: parsed.feed, skipped: parsed.skipped } : parsed;
      },
      updatedAt: (feed) => feed.updatedAt,
    });
  }

  /** What a page is handed: nothing when switched off, else the cards whose time has not passed. */
  cards(): AnnouncementCard[] {
    return this.disabled ? [] : liveCards(this.current().cards, this.now);
  }

  /** A page's ask: the cards now, after waiting a moment for a first download only when nothing was ever fetched. */
  async cardsForPage(firstWaitMs = ANNOUNCEMENTS_FIRST_WAIT_MS): Promise<AnnouncementCard[]> {
    await this.ready(firstWaitMs);
    return this.cards();
  }
}

let store: AnnouncementStore | undefined;

export function announcementStore(): AnnouncementStore {
  return store ??= new AnnouncementStore({ dataDir: DATA_DIR });
}
