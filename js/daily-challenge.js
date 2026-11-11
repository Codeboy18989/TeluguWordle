/**
 * daily-challenge.js
 * Decides "today's word" (and hint) so every player gets the same puzzle.
 *
 * Source of truth, in order:
 *   1. Firestore document dailyWords/{YYYY-MM-DD} set by the admin
 *      ({ word?, hint?, revealAt, updatedAt })
 *   2. If there is no document (or Firestore can't be reached), a word picked
 *      from the built-in target list using the date as a seed. Every player
 *      computes the same pick, so the puzzle is still shared.
 *
 * "Today" is the player's LOCAL date, so the word changes at local midnight.
 */

const DailyChallenge = (function() {
    const COLLECTION = 'dailyWords';
    const DEFAULT_TIMEOUT_MS = 4000;
    // Earliest timezone on Earth is UTC+14. A day's word becomes readable when
    // that day starts there, so no player ever waits for "their" midnight.
    const EARLIEST_TZ_OFFSET_HOURS = 14;

    /**
     * Local calendar date as YYYY-MM-DD (not UTC, unlike toISOString()).
     * @param {Date} [date]
     */
    function getDateKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /** The date key for the day before the given key. */
    function previousDateKey(dateKey) {
        const [y, m, d] = dateKey.split('-').map(Number);
        return getDateKey(new Date(y, m - 1, d - 1));
    }

    /**
     * When a day's word may be read by players (start of that day in UTC+14).
     * Stored on each document and enforced by Firestore security rules, so
     * nobody can peek at future words.
     */
    function revealAtFor(dateKey) {
        const [y, m, d] = dateKey.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d) - EARLIEST_TZ_OFFSET_HOURS * 60 * 60 * 1000);
    }

    /** Milliseconds until the player's next local midnight. */
    function msUntilNextDay(now = new Date()) {
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return next - now;
    }

    function isUsableWord(word) {
        if (!word || typeof word !== 'string') return false;
        const units = TeluguUtils.splitTeluguWord(TeluguUtils.normalizeTeluguText(word)).length;
        return units >= 2 && units <= 5;
    }

    function withTimeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
        ]);
    }

    function firestoreAvailable() {
        return typeof FirebaseDB !== 'undefined' && FirebaseDB.isInitialized && FirebaseDB.isInitialized();
    }

    /**
     * Read the admin-set entry for a date, or null if none / unreachable.
     * @returns {Promise<{word?: string, hint?: string}|null>}
     */
    async function fetchEntry(dateKey, timeoutMs = DEFAULT_TIMEOUT_MS) {
        if (!firestoreAvailable()) return null;
        try {
            const doc = await withTimeout(
                FirebaseDB.collections.dailyWords().doc(dateKey).get(),
                timeoutMs
            );
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.warn('Daily word: could not read Firestore, using fallback word.', error.message || error);
            return null;
        }
    }

    /**
     * Resolve the puzzle for a date (today by default).
     * @returns {Promise<{date: string, word: string, hint: string, source: string}>}
     */
    async function load({ date = getDateKey(), timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
        const entry = await fetchEntry(date, timeoutMs);
        const hint = entry && typeof entry.hint === 'string' ? entry.hint.trim() : '';

        if (entry && isUsableWord(entry.word)) {
            return {
                date,
                word: TeluguUtils.normalizeTeluguText(entry.word),
                hint,
                source: 'firestore'
            };
        }

        return {
            date,
            word: TeluguWordList.getWordOfDay(date),
            hint, // An admin may set just a hint for the automatic word
            source: 'auto'
        };
    }

    return {
        COLLECTION,
        getDateKey,
        previousDateKey,
        revealAtFor,
        msUntilNextDay,
        fetchEntry,
        load
    };
})();

window.DailyChallenge = DailyChallenge;
