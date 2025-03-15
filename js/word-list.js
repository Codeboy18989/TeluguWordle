/**
 * word-list.js
 * Contains the Telugu word list for the game.
 */

const TeluguWordList = (function() {
    // Organize words by length (letter count)
    const wordsByLevel = {
        2: [ // 3-letter words
            'ఒకటి', //One
            /*'నాలుగు', //Four
            'విద్యార్థి', // Student
            'వంటలు', // Cooking
            'ఆకాశం', // Sky
            'బడిలో', // In school
            'ప్రేమించు', // To love
            */
        ],
        3: [ // 4-letter words
            /* 'ఎనిమిది', //Eight
            'పుస్తకం', // Book
            'కుటుంబం', // 
            'నమస్కారం', // Hello/Greeting
            'అందమైన', // Beautiful
            */
            'పంచదార', // Sugar
            // Add more 4-letter words
        ],
        4: [ // 5-letter words
            //'మనదేశము', // Our country
            'భారతదేశం', // India
            // Add more 5-letter words
        ]
    };
    
    // Current game level (default to 2 - 3 letter words)
    let currentLevel = 2;
    
    // Local storage keys
    const LEVEL_KEY = 'telugu_wordle_level';
    const DAILY_WORDS_KEY = 'telugu_wordle_daily_words';
    
    /**
     * Initialize the word list
     */
    function init() {
        // Load saved level preference
        const savedLevel = localStorage.getItem(LEVEL_KEY);
        if (savedLevel) {
            currentLevel = parseInt(savedLevel);
        }
    }
    
    /**
     * Get a random word for the current level
     * @returns {string} A random Telugu word
     */
    function getRandomWord() {
        // Check if there's a word set for today at the current level
        const dailyWord = getTodaysWord();
        if (dailyWord) {
            // Verify word matches level length requirement
            const wordParts = TeluguUtils.splitTeluguWord(dailyWord);
            const expectedLength = getLevelWordLength(currentLevel);
            
            if (wordParts.length === expectedLength) {
                console.log("Using daily word:", dailyWord);
                return dailyWord;
            } else {
                console.log("Daily word doesn't match level length, using random word");
            }
        }
        
        // Otherwise select a random word from the current level
        const levelWords = wordsByLevel[currentLevel];
        const randomIndex = Math.floor(Math.random() * levelWords.length);
        return levelWords[randomIndex];
    }
    
    /**
     * Get today's word if it has been set by admin
     * @returns {string|null} Today's word or null if not set
     */
    function getTodaysWord() {
        try {
            const dailyWordsJson = localStorage.getItem(DAILY_WORDS_KEY);
            if (!dailyWordsJson) return null;
            
            const dailyWords = JSON.parse(dailyWordsJson);
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            
            return dailyWords[today] || null;
        } catch (e) {
            console.error("Error getting today's word:", e);
            return null;
        }
    }
    
    /**
     * Check if a word is valid for the current level
     * @param {string} word - The word to check
     * @returns {boolean} True if the word is valid
     */
    function isValidWord(word) {
        // Check if the word length matches the current level
        const wordParts = TeluguUtils.splitTeluguWord(word);
        const expectedLength = getLevelWordLength(currentLevel);
        
        if (wordParts.length !== expectedLength) {
            return false;
        }
        
        // For development, accept any word with correct length
        // In production, check against the level word list
        return wordsByLevel[currentLevel].includes(word) || true;
    }
    
    /**
     * Get expected word length for a level in terms of syllabic units
     * @param {number} level - The level (1-4)
     * @returns {number} The expected syllabic unit count for the level
     */
    function getLevelWordLength(level) {
        // Adjust this mapping based on your actual Telugu word structure
        switch(level) {
            case 1: return 3; // Level 1: always 3 boxes
            case 2: return 4; // Level 2: always 4 boxes
            case 3: return 5; // Level 3: always 5 boxes
            default: return 4; // Default to level 2
        }
    }
    
    /**
     * Set the current game level
     * @param {number} level - The level (1-4)
     */
    function setLevel(level) {
        if (level >= 1 && level <= 4) {
            currentLevel = level;
            localStorage.setItem(LEVEL_KEY, level.toString());
        }
    }
    
    /**
     * Get the current game level
     * @returns {number} Current level (1-4)
     */
    function getLevel() {
        return currentLevel;
    }
    
    /**
     * Get the word length for the current level
     * @returns {number} Word length for current level
     */
    function getCurrentLevelWordLength() {
        return getLevelWordLength(currentLevel);
    }
    
    // Initialize on load
    init();
    
    // Public API
    return {
        getRandomWord,
        isValidWord,
        setLevel,
        getLevel,
        getLevelWordLength,
        getCurrentLevelWordLength
    };
})();