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
    
    // Admin credentials - in a real app, this would be server-side!
    // For better security, consider using a hash function and salt
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'telugu123'; // Change this to something secure!
    
    // Local storage keys
    const AUTH_TOKEN_KEY = 'telugu_wordle_auth';
    const DAILY_WORDS_KEY = 'telugu_wordle_daily_words';
    
    // Initialize
    function init() {
        // Set up event listeners
        loginButton.addEventListener('click', handleLogin);
        logoutButton.addEventListener('click', handleLogout);
        setWordButton.addEventListener('click', handleSetWord);
        
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
    
    function loadAdminPanel() {
        // Existing code...
        
        // Add level dropdown to the form
        const levelSelect = document.createElement('select');
        levelSelect.id = 'word-level';
        levelSelect.innerHTML = `
            <option value="1">Level 1 (2 letters)</option>
            <option value="2">Level 2 (3 letters)</option>
            <option value="3">Level 3 (4 letters)</option>
            <option value="4">Level 4 (5 letters)</option>
        `;
        
        // Add level selection to the form
        const levelGroup = document.createElement('div');
        levelGroup.className = 'form-group';
        levelGroup.innerHTML = `<label for="word-level">Level:</label>`;
        levelGroup.appendChild(levelSelect);
        
        // Insert after the new-word input
        const newWordGroup = document.getElementById('new-word').parentElement;
        newWordGroup.after(levelGroup);
        
        // Validate word length based on selected level
        document.getElementById('new-word').addEventListener('input', function() {
            validateWordForLevel(this.value, levelSelect.value);
        });
        
        levelSelect.addEventListener('change', function() {
            validateWordForLevel(document.getElementById('new-word').value, this.value);
        });
    }
    
    // Show admin panel, hide login
    function showAdminPanel() {
        loginPanel.style.display = 'none';
        adminContainer.style.display = 'block';
        
        // Load current word and history
        loadCurrentWord();
        loadWordHistory();
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
        const dailyWords = getDailyWords();
        const today = formatDate(new Date());
        
        if (dailyWords[today]) {
            currentWordDisplay.textContent = dailyWords[today];
        } else {
            // If no word set for today, show the random word that would be selected
            currentWordDisplay.textContent = TeluguWordList.getRandomWord() + ' (random)';
        }
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
    
    // Add validation for word length based on level
    function validateWordForLevel(word, level) {
        if (!word) return;
        
        const wordParts = TeluguUtils.splitTeluguWord(word);
        const expectedLength = parseInt(level) + 1; // Level 1 = 2 letters, etc.
        
        const wordMessage = document.getElementById('word-message');
        
        if (wordParts.length !== expectedLength) {
            wordMessage.textContent = `Word must be ${expectedLength} Telugu units for Level ${level}`;
            wordMessage.className = 'error-message';
            return false;
        } else {
            wordMessage.textContent = '';
            return true;
        }
    }

    // Update the set word function to store level info
    function handleSetWord() {
        const newWord = document.getElementById('new-word').value.trim();
        const selectedLevel = document.getElementById('word-level').value;
        const targetDate = document.getElementById('word-date').valueAsDate || new Date();
        
        // Validate
        if (!newWord || !validateWordForLevel(newWord, selectedLevel)) {
            return;
        }
        
        // Get date string
        const dateString = formatDate(targetDate);
        
        // Save the word with level info
        const dailyWords = getDailyWords();
        dailyWords[dateString] = {
            word: newWord,
            level: parseInt(selectedLevel)
        };
        saveDailyWords(dailyWords);
        
        // Update UI
        const wordMessage = document.getElementById('word-message');
        wordMessage.textContent = `Word "${newWord}" (Level ${selectedLevel}) set for ${dateString}`;
        wordMessage.className = 'success-message';
        document.getElementById('new-word').value = '';
        
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
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();