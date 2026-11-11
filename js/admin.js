/**
 * admin.js
 * Admin panel functionality for Telugu Wordle
 *
 * Sign-in uses Firebase Authentication (Google). Only accounts listed in the
 * Firestore "admins" collection can change words; this is enforced by the
 * Firestore security rules (firestore.rules), not just by this page.
 */

(function() {
    // DOM Elements
    const loginPanel = document.getElementById('login-panel');
    const adminContainer = document.getElementById('admin-container');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginError = document.getElementById('login-error');
    const notAdminPanel = document.getElementById('not-admin-panel');
    const currentWordDisplay = document.getElementById('current-word');
    const currentWordMeta = document.getElementById('current-word-meta');
    const newWordInput = document.getElementById('new-word');
    const wordDateInput = document.getElementById('word-date');
    const hintInput = document.getElementById('hint-input');
    const setWordButton = document.getElementById('set-word-button');
    const deleteEntryButton = document.getElementById('delete-entry-button');
    const wordMessage = document.getElementById('word-message');
    const entryStatus = document.getElementById('entry-status');
    const wordHistory = document.getElementById('word-history');

    // Keys used by the old browser-only version (migrated to Firestore once)
    const LEGACY_DAILY_WORDS_KEY = 'telugu_wordle_daily_words';
    const LEGACY_HINT_KEY = 'telugu_wordle_hint';
    const LEGACY_AUTH_KEY = 'telugu_wordle_auth';
    const CUSTOM_WORDS_KEY = 'telugu_wordle_custom_words';

    let currentUser = null;

    // Initialize
    function init() {
        // Old password login is gone; clear its leftover flag
        localStorage.removeItem(LEGACY_AUTH_KEY);

        loginButton.addEventListener('click', handleLogin);
        logoutButton.addEventListener('click', handleLogout);
        document.getElementById('not-admin-logout').addEventListener('click', handleLogout);
        setWordButton.addEventListener('click', handleSaveEntry);
        deleteEntryButton.addEventListener('click', handleDeleteEntry);
        wordDateInput.addEventListener('change', loadSelectedEntry);
        document.getElementById('migrate-button').addEventListener('click', handleMigrateLegacy);
        document.getElementById('copy-uid-button').addEventListener('click', () => {
            navigator.clipboard.writeText(currentUser ? currentUser.uid : '');
            document.getElementById('copy-uid-button').textContent = 'Copied!';
        });

        // Word management listeners
        const addManualWordButton = document.getElementById('add-manual-word-button');
        const addBulkWordsButton = document.getElementById('add-bulk-words-button');
        const clearCustomWordsButton = document.getElementById('clear-custom-words-button');

        if (addManualWordButton) addManualWordButton.addEventListener('click', handleAddManualWord);
        if (addBulkWordsButton) addBulkWordsButton.addEventListener('click', handleAddBulkWords);
        if (clearCustomWordsButton) clearCustomWordsButton.addEventListener('click', handleClearCustomWords);

        // Default the date picker to tomorrow (local date)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        wordDateInput.value = DailyChallenge.getDateKey(tomorrow);

        if (!FirebaseDB.isInitialized() || !FirebaseDB.auth) {
            showLoginPanel('Firebase could not be loaded. Check your internet connection and refresh.');
            loginButton.disabled = true;
            return;
        }

        // React to sign-in / sign-out (also restores the session on reload)
        FirebaseDB.auth.onAuthStateChanged(handleAuthChange);
    }

    // ============================================================================
    // AUTHENTICATION (Firebase Auth + admins allowlist)
    // ============================================================================

    async function handleLogin() {
        loginError.textContent = '';
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await FirebaseDB.auth.signInWithPopup(provider);
        } catch (error) {
            console.error('Sign-in failed:', error);
            loginError.textContent = error.code === 'auth/popup-closed-by-user'
                ? 'Sign-in was cancelled.'
                : `Sign-in failed: ${error.message}`;
        }
    }

    function handleLogout() {
        FirebaseDB.auth.signOut();
    }

    async function handleAuthChange(user) {
        currentUser = user;
        if (!user) {
            showLoginPanel();
            return;
        }

        // Is this account in the admins allowlist?
        let isAdmin = false;
        try {
            const doc = await FirebaseDB.collections.admins().doc(user.uid).get();
            isAdmin = doc.exists;
        } catch (error) {
            console.warn('Admin check failed (are the security rules published?):', error);
        }

        if (isAdmin) {
            showAdminPanel();
        } else {
            showNotAdminPanel(user);
        }
    }

    function showLoginPanel(message = '') {
        loginPanel.style.display = 'block';
        adminContainer.style.display = 'none';
        notAdminPanel.style.display = 'none';
        loginError.textContent = message;
    }

    // Signed in, but not on the allowlist: show the UID so it can be added
    function showNotAdminPanel(user) {
        loginPanel.style.display = 'none';
        adminContainer.style.display = 'none';
        notAdminPanel.style.display = 'block';
        document.getElementById('not-admin-email').textContent = user.email || user.displayName || 'this account';
        document.getElementById('not-admin-uid').textContent = user.uid;
        document.getElementById('copy-uid-button').textContent = 'Copy UID';
    }

    function showAdminPanel() {
        loginPanel.style.display = 'none';
        notAdminPanel.style.display = 'none';
        adminContainer.style.display = 'block';
        document.getElementById('signed-in-as').textContent = currentUser.email || currentUser.displayName || '';

        loadCurrentWord();
        loadSelectedEntry();
        loadWordHistory();
        checkLegacyData();

        // Load word management data
        updateWordCounts();
        displayCustomWords();
    }

    // ============================================================================
    // DAILY WORD + HINT (stored in Firestore: dailyWords/{YYYY-MM-DD})
    // ============================================================================

    function dailyDoc(dateKey) {
        return FirebaseDB.collections.dailyWords().doc(dateKey);
    }

    function showMessage(element, text, isError) {
        element.textContent = text;
        element.className = isError ? 'error-message' : 'success-message';
    }

    function describeError(error) {
        if (error && error.code === 'permission-denied') {
            return 'Permission denied. Make sure the security rules from firestore.rules are published and your account is in the "admins" collection.';
        }
        return (error && error.message) || String(error);
    }

    // Today's puzzle, exactly as players will get it
    async function loadCurrentWord() {
        currentWordDisplay.textContent = 'Loading...';
        const puzzle = await DailyChallenge.load();
        const units = TeluguUtils.splitTeluguWord(puzzle.word).length;
        currentWordDisplay.textContent = `${puzzle.word} (${units} units)`;
        currentWordMeta.textContent =
            (puzzle.source === 'firestore' ? 'Scheduled by admin' : 'Picked automatically (nothing scheduled)') +
            ` · ${puzzle.date}` +
            (puzzle.hint ? ` · Hint: ${puzzle.hint}` : ' · No hint');
    }

    // Prefill the form with whatever is already saved for the chosen date
    async function loadSelectedEntry() {
        const dateKey = wordDateInput.value;
        wordMessage.textContent = '';
        if (!dateKey) return;

        entryStatus.textContent = 'Checking this date...';
        try {
            const doc = await dailyDoc(dateKey).get();
            const data = doc.exists ? doc.data() : null;
            newWordInput.value = (data && data.word) || '';
            hintInput.value = (data && data.hint) || '';
            deleteEntryButton.style.display = data ? 'inline-block' : 'none';
            entryStatus.textContent = data
                ? 'Something is already scheduled for this date. Editing it will replace it.'
                : `Nothing scheduled yet. Players will get the automatic word: ${TeluguWordList.getWordOfDay(dateKey)}`;
        } catch (error) {
            entryStatus.textContent = describeError(error);
        }
    }

    /**
     * Validate a word for use as a daily answer.
     * @returns {{ok: boolean, word?: string, units?: number, error?: string}}
     */
    function validateDailyWord(rawWord) {
        const word = TeluguUtils.normalizeTeluguText(rawWord);

        if (!TeluguWordList.isValidWord(word)) {
            return { ok: false, error: `"${rawWord}" is not in the word dictionary. Add it under Word Dictionary Management first, so players can type it as a guess.` };
        }

        const units = TeluguUtils.splitTeluguWord(word).length;
        if (units < 2 || units > 5) {
            return { ok: false, error: `Word must be 2-5 Telugu units in length (found ${units} units)` };
        }

        return { ok: true, word, units };
    }

    async function handleSaveEntry() {
        const dateKey = wordDateInput.value;
        const rawWord = newWordInput.value.trim();
        const hint = hintInput.value.trim();

        if (!dateKey) {
            showMessage(wordMessage, 'Please choose a date', true);
            return;
        }
        if (!rawWord && !hint) {
            showMessage(wordMessage, 'Enter a word, a hint, or both', true);
            return;
        }

        const entry = {
            revealAt: firebase.firestore.Timestamp.fromDate(DailyChallenge.revealAtFor(dateKey)),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentUser.uid
        };

        let summary;
        if (rawWord) {
            const result = validateDailyWord(rawWord);
            if (!result.ok) {
                showMessage(wordMessage, result.error, true);
                return;
            }
            entry.word = result.word;
            summary = `Word "${result.word}" (${result.units} units)`;
        } else {
            summary = `Hint for the automatic word "${TeluguWordList.getWordOfDay(dateKey)}"`;
        }
        if (hint) entry.hint = hint;

        showMessage(wordMessage, 'Saving...', false);
        try {
            await dailyDoc(dateKey).set(entry);
            showMessage(wordMessage, `${summary}${hint ? ' with hint' : ''} saved for ${dateKey}. Every player will get it.`, false);
            loadCurrentWord();
            loadSelectedEntry();
            loadWordHistory();
        } catch (error) {
            console.error('Error saving daily word:', error);
            showMessage(wordMessage, describeError(error), true);
        }
    }

    async function handleDeleteEntry() {
        const dateKey = wordDateInput.value;
        if (!dateKey || !confirm(`Remove the scheduled word/hint for ${dateKey}? Players will get the automatic word instead.`)) {
            return;
        }
        try {
            await dailyDoc(dateKey).delete();
            showMessage(wordMessage, `Removed the entry for ${dateKey}.`, false);
            loadCurrentWord();
            loadSelectedEntry();
            loadWordHistory();
        } catch (error) {
            showMessage(wordMessage, describeError(error), true);
        }
    }

    // Recent and upcoming entries, newest date first
    async function loadWordHistory() {
        wordHistory.textContent = 'Loading...';
        try {
            const snapshot = await FirebaseDB.collections.dailyWords()
                .orderBy(firebase.firestore.FieldPath.documentId(), 'desc')
                .limit(60)
                .get();

            if (snapshot.empty) {
                wordHistory.innerHTML = '<p>No words have been scheduled yet.</p>';
                return;
            }

            const today = DailyChallenge.getDateKey();
            const list = document.createElement('ul');
            snapshot.forEach(doc => {
                const data = doc.data();
                const item = document.createElement('li');
                const label = doc.id > today ? ' (upcoming)' : doc.id === today ? ' (today)' : '';
                const word = data.word || `${TeluguWordList.getWordOfDay(doc.id)} (auto)`;

                const date = document.createElement('strong');
                date.textContent = `${doc.id}${label}: `;
                item.appendChild(date);
                item.appendChild(document.createTextNode(word + (data.hint ? ` · 💡 ${data.hint}` : '')));
                item.style.cursor = 'pointer';
                item.title = 'Click to edit';
                item.addEventListener('click', () => {
                    wordDateInput.value = doc.id;
                    loadSelectedEntry();
                    wordDateInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
                list.appendChild(item);
            });
            wordHistory.innerHTML = '';
            wordHistory.appendChild(list);
        } catch (error) {
            wordHistory.textContent = describeError(error);
        }
    }

    // ============================================================================
    // ONE-TIME MIGRATION of words/hints saved by the old browser-only admin page
    // ============================================================================

    function readLegacyEntries() {
        const entries = {};
        try {
            const words = JSON.parse(localStorage.getItem(LEGACY_DAILY_WORDS_KEY) || '{}');
            Object.keys(words).forEach(date => { entries[date] = { word: words[date] }; });

            const hint = JSON.parse(localStorage.getItem(LEGACY_HINT_KEY) || 'null');
            if (hint && hint.date && hint.text) {
                entries[hint.date] = Object.assign(entries[hint.date] || {}, { hint: hint.text });
            }
        } catch (e) {
            console.warn('Could not read old browser-saved words:', e);
        }
        return entries;
    }

    function checkLegacyData() {
        const count = Object.keys(readLegacyEntries()).length;
        const panel = document.getElementById('migrate-panel');
        panel.style.display = count ? 'block' : 'none';
        document.getElementById('migrate-count').textContent = count;
    }

    async function handleMigrateLegacy() {
        const entries = readLegacyEntries();
        const message = document.getElementById('migrate-message');
        const batch = FirebaseDB.db.batch();

        Object.keys(entries).forEach(dateKey => {
            const entry = {
                revealAt: firebase.firestore.Timestamp.fromDate(DailyChallenge.revealAtFor(dateKey)),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: currentUser.uid
            };
            if (entries[dateKey].word) entry.word = TeluguUtils.normalizeTeluguText(entries[dateKey].word);
            if (entries[dateKey].hint) entry.hint = entries[dateKey].hint;
            // merge: don't wipe anything already scheduled in Firestore
            batch.set(dailyDoc(dateKey), entry, { merge: true });
        });

        try {
            await batch.commit();
            localStorage.removeItem(LEGACY_DAILY_WORDS_KEY);
            localStorage.removeItem(LEGACY_HINT_KEY);
            showMessage(message, `Uploaded ${Object.keys(entries).length} entries to Firestore.`, false);
            checkLegacyData();
            loadCurrentWord();
            loadWordHistory();
        } catch (error) {
            showMessage(message, describeError(error), true);
        }
    }

    // ============================================================================
    // WORD MANAGEMENT FUNCTIONS - FIRESTORE INTEGRATION
    // ============================================================================

    // Cache for Firestore words
    let firestoreWordsCache = null;

    // Get all words from Firestore (with cache)
    async function getAllFirestoreWords() {
        if (firestoreWordsCache) {
            return firestoreWordsCache;
        }

        // Try Firestore first
        if (FirebaseDB && FirebaseDB.isInitialized()) {
            try {
                const words = await FirestoreWords.fetchAllWords();
                firestoreWordsCache = words;
                return words;
            } catch (error) {
                console.error('Error fetching from Firestore:', error);
            }
        }

        // Fallback to localStorage custom words if Firestore unavailable
        const customWords = getCustomWordsFromLocalStorage();
        return customWords.map(word => ({
            word: word,
            category: 'Custom',
            units: TeluguUtils.splitTeluguWord(word).length,
            isTarget: false
        }));
    }

    // Get custom words from localStorage (fallback)
    function getCustomWordsFromLocalStorage() {
        const wordsJson = localStorage.getItem(CUSTOM_WORDS_KEY);
        return wordsJson ? JSON.parse(wordsJson) : [];
    }

    // Save custom words to localStorage (fallback)
    function saveCustomWordsToLocalStorage(words) {
        localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
    }

    // Handle adding a manual word (with Firestore)
    async function handleAddManualWord() {
        const manualWordInput = document.getElementById('manual-word');
        const messageDiv = document.getElementById('manual-word-message');
        const word = manualWordInput.value.trim();

        if (!word) {
            messageDiv.textContent = 'Please enter a word';
            messageDiv.className = 'error-message';
            return;
        }

        // Normalize the word
        const normalizedWord = TeluguUtils.normalizeTeluguText(word);

        // Validate it's a Telugu word (2-5 units)
        const wordParts = TeluguUtils.splitTeluguWord(normalizedWord);
        if (wordParts.length < 2 || wordParts.length > 5) {
            messageDiv.textContent = `Word must be 2-5 Telugu units (found ${wordParts.length} units)`;
            messageDiv.className = 'error-message';
            return;
        }

        // Show loading state
        messageDiv.textContent = 'Adding word...';
        messageDiv.className = 'success-message';

        // Try adding to Firestore first
        if (FirebaseDB && FirebaseDB.isInitialized()) {
            try {
                // Check if word already exists
                const existingWords = await getAllFirestoreWords();
                const wordExists = existingWords.some(w =>
                    TeluguUtils.normalizeTeluguText(w.word) === normalizedWord
                );

                if (wordExists) {
                    messageDiv.textContent = `"${normalizedWord}" already exists in the dictionary`;
                    messageDiv.className = 'error-message';
                    return;
                }

                // Add to Firestore
                const result = await FirestoreWords.addWord({
                    word: normalizedWord,
                    category: 'Custom',
                    units: wordParts.length,
                    isTarget: false
                });

                if (result.success) {
                    messageDiv.textContent = `✅ Added "${normalizedWord}" to Firestore (${wordParts.length} units)`;
                    messageDiv.className = 'success-message';
                    manualWordInput.value = '';

                    // Clear cache and refresh
                    firestoreWordsCache = null;
                    await updateWordCounts();
                    await displayCustomWords();

                    setTimeout(() => { messageDiv.textContent = ''; }, 3000);
                } else {
                    throw new Error(result.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Firestore add failed:', error);
                messageDiv.textContent = `❌ Error: ${error.message}. Word not added.`;
                messageDiv.className = 'error-message';
            }
        } else {
            // Fallback to localStorage
            const customWords = getCustomWordsFromLocalStorage();

            if (customWords.some(w => TeluguUtils.normalizeTeluguText(w) === normalizedWord) ||
                TeluguWordList.mainWordList.some(w => TeluguUtils.normalizeTeluguText(w) === normalizedWord)) {
                messageDiv.textContent = `"${normalizedWord}" already exists`;
                messageDiv.className = 'error-message';
                return;
            }

            customWords.push(normalizedWord);
            saveCustomWordsToLocalStorage(customWords);

            messageDiv.textContent = `Added "${normalizedWord}" to localStorage (${wordParts.length} units)`;
            messageDiv.className = 'success-message';
            manualWordInput.value = '';

            updateWordCounts();
            displayCustomWords();

            setTimeout(() => { messageDiv.textContent = ''; }, 3000);
        }
    }

    // Handle adding bulk words (with Firestore)
    async function handleAddBulkWords() {
        const bulkWordsTextarea = document.getElementById('bulk-words');
        const messageDiv = document.getElementById('bulk-word-message');
        const input = bulkWordsTextarea.value.trim();

        if (!input) {
            messageDiv.textContent = 'Please enter words (one per line)';
            messageDiv.className = 'error-message';
            return;
        }

        // Split by newlines and filter empty lines
        const words = input.split('\n')
            .map(w => TeluguUtils.normalizeTeluguText(w.trim()))
            .filter(w => w.length > 0);

        if (words.length === 0) {
            messageDiv.textContent = 'No valid words found';
            messageDiv.className = 'error-message';
            return;
        }

        // Show loading state
        messageDiv.textContent = `Processing ${words.length} words...`;
        messageDiv.className = 'success-message';

        // Try Firestore batch add first
        if (FirebaseDB && FirebaseDB.isInitialized()) {
            try {
                const existingWords = await getAllFirestoreWords();
                const wordsToAdd = [];
                let skippedCount = 0;
                const errors = [];

                words.forEach(word => {
                    // Validate word length
                    const wordParts = TeluguUtils.splitTeluguWord(word);
                    if (wordParts.length < 2 || wordParts.length > 5) {
                        errors.push(`"${word}" - invalid length (${wordParts.length} units)`);
                        skippedCount++;
                        return;
                    }

                    // Check if already exists
                    const wordExists = existingWords.some(w =>
                        TeluguUtils.normalizeTeluguText(w.word) === word
                    );

                    if (wordExists) {
                        skippedCount++;
                        return;
                    }

                    // Add to batch
                    wordsToAdd.push({
                        word: word,
                        category: 'Custom',
                        units: wordParts.length,
                        isTarget: false
                    });
                });

                if (wordsToAdd.length > 0) {
                    const result = await FirestoreWords.addWordsBatch(wordsToAdd);

                    if (result.success) {
                        let message = `✅ Added ${result.count} words to Firestore`;
                        if (skippedCount > 0) {
                            message += `, skipped ${skippedCount} duplicates/invalid`;
                        }
                        if (errors.length > 0 && errors.length <= 5) {
                            message += '\n' + errors.join(', ');
                        }

                        messageDiv.textContent = message;
                        messageDiv.className = 'success-message';
                        bulkWordsTextarea.value = '';

                        // Clear cache and refresh
                        firestoreWordsCache = null;
                        await updateWordCounts();
                        await displayCustomWords();
                    } else {
                        throw new Error(result.error || 'Batch add failed');
                    }
                } else {
                    messageDiv.textContent = `No new words to add (${skippedCount} duplicates/invalid)`;
                    messageDiv.className = 'error-message';
                }

                setTimeout(() => { messageDiv.textContent = ''; }, 5000);
            } catch (error) {
                console.error('Firestore batch add failed:', error);
                messageDiv.textContent = `❌ Error: ${error.message}`;
                messageDiv.className = 'error-message';
            }
        } else {
            // Fallback to localStorage
            const customWords = getCustomWordsFromLocalStorage();
            let addedCount = 0;
            let skippedCount = 0;
            const errors = [];

            words.forEach(word => {
                const wordParts = TeluguUtils.splitTeluguWord(word);
                if (wordParts.length < 2 || wordParts.length > 5) {
                    errors.push(`"${word}" - invalid length (${wordParts.length} units)`);
                    skippedCount++;
                    return;
                }

                if (customWords.some(w => TeluguUtils.normalizeTeluguText(w) === word) ||
                    TeluguWordList.mainWordList.some(w => TeluguUtils.normalizeTeluguText(w) === word)) {
                    skippedCount++;
                    return;
                }

                customWords.push(word);
                addedCount++;
            });

            saveCustomWordsToLocalStorage(customWords);

            let message = `Added ${addedCount} words to localStorage`;
            if (skippedCount > 0) {
                message += `, skipped ${skippedCount} duplicates/invalid`;
            }

            messageDiv.textContent = message;
            messageDiv.className = addedCount > 0 ? 'success-message' : 'error-message';

            if (addedCount > 0) {
                bulkWordsTextarea.value = '';
            }

            updateWordCounts();
            displayCustomWords();

            setTimeout(() => { messageDiv.textContent = ''; }, 5000);
        }
    }

    // Handle clearing all custom words (Firestore-aware)
    async function handleClearCustomWords() {
        if (!confirm('Are you sure you want to clear all custom words? This cannot be undone.')) {
            return;
        }

        // For now, just clear localStorage (Firestore words remain in cloud)
        // In future, could delete all words with category='Custom' from Firestore
        localStorage.removeItem(CUSTOM_WORDS_KEY);

        // Update UI
        await updateWordCounts();
        await displayCustomWords();

        alert('All custom words have been cleared from localStorage.');
    }

    // Update word counts in the UI (async for Firestore)
    async function updateWordCounts() {
        const baseCount = TeluguWordList.mainWordList.length;

        // Try to get count from Firestore
        if (FirebaseDB && FirebaseDB.isInitialized()) {
            try {
                const allWords = await getAllFirestoreWords();
                const firestoreCount = allWords.length;
                const totalCount = baseCount + firestoreCount;

                document.getElementById('base-word-count').textContent = baseCount;
                document.getElementById('custom-word-count').textContent = firestoreCount;
                document.getElementById('total-word-count').textContent = totalCount;
            } catch (error) {
                console.error('Error updating counts:', error);
                // Fallback to localStorage
                const customCount = getCustomWordsFromLocalStorage().length;
                const totalCount = baseCount + customCount;

                document.getElementById('base-word-count').textContent = baseCount;
                document.getElementById('custom-word-count').textContent = customCount;
                document.getElementById('total-word-count').textContent = totalCount;
            }
        } else {
            // Use localStorage counts
            const customCount = getCustomWordsFromLocalStorage().length;
            const totalCount = baseCount + customCount;

            document.getElementById('base-word-count').textContent = baseCount;
            document.getElementById('custom-word-count').textContent = customCount;
            document.getElementById('total-word-count').textContent = totalCount;
        }
    }

    // Display custom words list (async for Firestore)
    async function displayCustomWords() {
        const listDiv = document.getElementById('custom-words-list');
        listDiv.innerHTML = '<p>Loading words...</p>';

        try {
            let wordsToDisplay = [];

            // Try Firestore first
            if (FirebaseDB && FirebaseDB.isInitialized()) {
                const allWords = await getAllFirestoreWords();
                wordsToDisplay = allWords.map(w => ({
                    word: w.word,
                    units: w.units,
                    id: w.id,
                    source: 'firestore'
                }));
            } else {
                // Fallback to localStorage
                const customWords = getCustomWordsFromLocalStorage();
                wordsToDisplay = customWords.map((word, index) => ({
                    word: word,
                    units: TeluguUtils.splitTeluguWord(word).length,
                    id: index,
                    source: 'localStorage'
                }));
            }

            if (wordsToDisplay.length === 0) {
                listDiv.innerHTML = '<p>No custom words added yet.</p>';
                return;
            }

            // Sort alphabetically
            wordsToDisplay.sort((a, b) => a.word.localeCompare(b.word));

            let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 5px;">';
            wordsToDisplay.forEach((item) => {
                html += `<div style="padding: 5px; background: #f5f5f5; border-radius: 3px; text-align: center;" title="${item.units} units">
                    ${item.word}
                    <button onclick="removeCustomWord('${item.id}', '${item.source}')" style="margin-left: 5px; padding: 2px 5px; font-size: 10px; background: #e74c3c;">×</button>
                </div>`;
            });
            html += '</div>';
            html += `<p style="margin-top: 10px; font-size: 12px; color: #666;">Total: ${wordsToDisplay.length} custom words</p>`;

            listDiv.innerHTML = html;
        } catch (error) {
            console.error('Error displaying words:', error);
            listDiv.innerHTML = '<p style="color: red;">Error loading words. Check console.</p>';
        }
    }

    // Remove a specific custom word (Firestore-aware)
    window.removeCustomWord = async function(id, source) {
        if (source === 'firestore') {
            if (!confirm('Remove this word from Firestore?')) {
                return;
            }

            try {
                const result = await FirestoreWords.deleteWord(id);
                if (result.success) {
                    // Clear cache and refresh
                    firestoreWordsCache = null;
                    await updateWordCounts();
                    await displayCustomWords();
                } else {
                    alert('Error removing word: ' + result.error);
                }
            } catch (error) {
                console.error('Error removing word:', error);
                alert('Error removing word. Check console.');
            }
        } else {
            // localStorage
            const customWords = getCustomWordsFromLocalStorage();
            const index = parseInt(id);
            const word = customWords[index];

            if (confirm(`Remove "${word}" from custom words?`)) {
                customWords.splice(index, 1);
                saveCustomWordsToLocalStorage(customWords);

                // Refresh displays
                await updateWordCounts();
                await displayCustomWords();
            }
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();