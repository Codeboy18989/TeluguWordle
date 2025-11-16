 /**
 * admin.js
 * Admin panel functionality for Telugu Wordle
 */

(function() {
    // DOM Elements
    const loginPanel = document.getElementById('login-panel');
    const adminContainer = document.getElementById('admin-container');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const currentWordDisplay = document.getElementById('current-word');
    const newWordInput = document.getElementById('new-word');
    const wordDateInput = document.getElementById('word-date');
    const setWordButton = document.getElementById('set-word-button');
    const wordMessage = document.getElementById('word-message');
    const wordHistory = document.getElementById('word-history');
    
    // ============================================================================
    // WARNING: INSECURE CLIENT-SIDE AUTHENTICATION
    // ============================================================================
    // This is a client-side only authentication system for demonstration purposes.
    // It provides NO REAL SECURITY since anyone can view the source code!
    //
    // For production use, you should:
    // 1. Implement proper server-side authentication
    // 2. Use secure password hashing (bcrypt, argon2, etc.)
    // 3. Implement HTTPS and secure session management
    // 4. Add CSRF protection
    // 5. Consider OAuth or other proper authentication mechanisms
    //
    // This current implementation is ONLY suitable for:
    // - Personal/private use where code inspection isn't a concern
    // - Demonstration/educational purposes
    // - Development/testing environments
    // ============================================================================

    // CHANGE THESE CREDENTIALS if using this code!
    // Anyone who can view the source code can see these values!
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'telugu123';
    
    // Local storage keys
    const AUTH_TOKEN_KEY = 'telugu_wordle_auth';
    const DAILY_WORDS_KEY = 'telugu_wordle_daily_words';
    const CUSTOM_WORDS_KEY = 'telugu_wordle_custom_words';
    
    // Initialize
    function init() {
        // Set up event listeners
        loginButton.addEventListener('click', handleLogin);
        logoutButton.addEventListener('click', handleLogout);
        setWordButton.addEventListener('click', handleSetWord);

        // Word management listeners
        const addManualWordButton = document.getElementById('add-manual-word-button');
        const addBulkWordsButton = document.getElementById('add-bulk-words-button');
        const clearCustomWordsButton = document.getElementById('clear-custom-words-button');

        if (addManualWordButton) addManualWordButton.addEventListener('click', handleAddManualWord);
        if (addBulkWordsButton) addBulkWordsButton.addEventListener('click', handleAddBulkWords);
        if (clearCustomWordsButton) clearCustomWordsButton.addEventListener('click', handleClearCustomWords);

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        wordDateInput.valueAsDate = tomorrow;

        // Check if already logged in
        checkAuthStatus();
    }
    
    // Check authentication status
    function checkAuthStatus() {
        const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
        
        if (authToken === 'authenticated') {
            showAdminPanel();
        } else {
            showLoginPanel();
        }
    }
    
    // Handle login attempt
    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Set auth token in local storage
            localStorage.setItem(AUTH_TOKEN_KEY, 'authenticated');
            loginError.textContent = '';
            showAdminPanel();
        } else {
            loginError.textContent = 'Invalid username or password';
            passwordInput.value = '';
        }
    }
    
    // Handle logout
    function handleLogout() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        showLoginPanel();
    }
    
    // Show admin panel, hide login
    function showAdminPanel() {
        loginPanel.style.display = 'none';
        adminContainer.style.display = 'block';

        // Load current word and history
        loadCurrentWord();
        loadWordHistory();

        // Load word management data
        updateWordCounts();
        displayCustomWords();
    }
    
    // Show login panel, hide admin
    function showLoginPanel() {
        loginPanel.style.display = 'block';
        adminContainer.style.display = 'none';
        
        // Clear inputs
        usernameInput.value = '';
        passwordInput.value = '';
    }
    
    // Load and display the current word
    function loadCurrentWord() {
        // Use the SAME logic as the game to get today's word
        // This ensures admin and game always show the same word
        const displayWord = TeluguWordList.getRandomWord();

        // Split to show unit count
        const wordParts = TeluguUtils.splitTeluguWord(displayWord);
        currentWordDisplay.textContent = `${displayWord} (${wordParts.length} units)`;

        console.log('Admin - Current word:', displayWord);
        console.log('Admin - Word parts:', wordParts);
        console.log('Admin - Unit count:', wordParts.length);
    }
    
    // Load and display word history
    function loadWordHistory() {
        const dailyWords = getDailyWords();
        let historyHTML = '';
        
        // Sort dates in descending order
        const sortedDates = Object.keys(dailyWords).sort().reverse();
        
        if (sortedDates.length === 0) {
            historyHTML = '<p>No words have been set yet.</p>';
        } else {
            historyHTML = '<ul>';
            sortedDates.forEach(date => {
                historyHTML += `<li><strong>${date}:</strong> ${dailyWords[date]}</li>`;
            });
            historyHTML += '</ul>';
        }
        
        wordHistory.innerHTML = historyHTML;
    }
    
    // Handle setting a new word
    function handleSetWord() {
        const newWord = newWordInput.value.trim();

        // Validate the word is not empty
        if (!newWord) {
            wordMessage.textContent = 'Please enter a word';
            wordMessage.className = 'error-message';
            return;
        }

        // Normalize the word for consistent validation
        const normalizedWord = TeluguUtils.normalizeTeluguText(newWord);

        // Check if it's a valid Telugu word from the dictionary
        if (!TeluguWordList.isValidWord(normalizedWord)) {
            wordMessage.textContent = `"${newWord}" is not in the word dictionary. Please use a valid Telugu word from the game's word list.`;
            wordMessage.className = 'error-message';
            return;
        }

        // Check word length (2-5 Telugu units)
        const wordParts = TeluguUtils.splitTeluguWord(normalizedWord);
        if (wordParts.length < 2 || wordParts.length > 5) {
            wordMessage.textContent = `Word must be 2-5 Telugu units in length (found ${wordParts.length} units)`;
            wordMessage.className = 'error-message';
            return;
        }

        // Check if word is in target word list (suitable as a solution)
        const isTargetWord = TeluguWordList.targetWordList.some(word =>
            TeluguUtils.normalizeTeluguText(word) === normalizedWord
        );

        if (!isTargetWord) {
            wordMessage.textContent = `"${newWord}" is in the dictionary but not in the target word list. It can be used as a guess but not as a solution.`;
            wordMessage.className = 'error-message';
            return;
        }

        // Get the target date
        const targetDate = wordDateInput.valueAsDate || new Date();
        const dateString = formatDate(targetDate);

        // Check if a word is already set for this date
        const dailyWords = getDailyWords();
        if (dailyWords[dateString]) {
            const confirmOverwrite = confirm(
                `A word "${dailyWords[dateString]}" is already set for ${dateString}. Do you want to replace it with "${newWord}"?`
            );
            if (!confirmOverwrite) {
                return;
            }
        }

        // Save the word
        dailyWords[dateString] = normalizedWord;
        saveDailyWords(dailyWords);

        // Update UI
        wordMessage.textContent = `Word "${normalizedWord}" set for ${dateString} (${wordParts.length} units)`;
        wordMessage.className = 'success-message';
        newWordInput.value = '';

        // Refresh displays
        loadCurrentWord();
        loadWordHistory();
    }
    
    // Get daily words from storage
    function getDailyWords() {
        const wordsJson = localStorage.getItem(DAILY_WORDS_KEY);
        return wordsJson ? JSON.parse(wordsJson) : {};
    }
    
    // Save daily words to storage
    function saveDailyWords(dailyWords) {
        localStorage.setItem(DAILY_WORDS_KEY, JSON.stringify(dailyWords));
    }
    
    // Format date as YYYY-MM-DD
    function formatDate(date) {
        return date.toISOString().split('T')[0];
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