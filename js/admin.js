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
    
    // Handle setting a new word
    function handleSetWord() {
        const newWord = newWordInput.value.trim();
        
        // Validate the word
        if (!newWord) {
            wordMessage.textContent = 'Please enter a word';
            wordMessage.className = 'error-message';
            return;
        }
        
        // Check if it's a valid Telugu word
        const wordParts = TeluguUtils.splitTeluguWord(newWord);
        if (wordParts.length < 3 || wordParts.length > 5) {
            wordMessage.textContent = 'Word must be 3-5 Telugu units in length';
            wordMessage.className = 'error-message';
            return;
        }
        
        // Get the target date
        const targetDate = wordDateInput.valueAsDate || new Date();
        const dateString = formatDate(targetDate);
        
        // Save the word
        const dailyWords = getDailyWords();
        dailyWords[dateString] = newWord;
        saveDailyWords(dailyWords);
        
        // Update UI
        wordMessage.textContent = `Word "${newWord}" set for ${dateString}`;
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
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();