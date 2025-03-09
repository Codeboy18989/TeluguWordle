/**
 * storage.js
 * Handles local storage for the Telugu Wordle game.
 * Manages game state persistence and statistics.
 */

const GameStorage = (function() {
    // Local storage keys
    const GAME_STATE_KEY = 'telugu_wordle_game_state';
    const STATISTICS_KEY = 'telugu_wordle_statistics';
    const SETTINGS_KEY = 'telugu_wordle_settings';
    
    // Default statistics object
    const DEFAULT_STATISTICS = {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0
        },
        lastCompleted: null
    };
    
    // Default settings object
    const DEFAULT_SETTINGS = {
        hardMode: false,
        darkTheme: false
    };
    
    /**
     * Save the current game state to local storage
     * @param {Object} gameState - The current game state to save
     */
    function saveGameState(gameState) {
        try {
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
            return true;
        } catch (error) {
            console.error('Failed to save game state:', error);
            return false;
        }
    }
    
    /**
     * Load the saved game state from local storage
     * @returns {Object|null} The saved game state or null if none exists
     */
    function loadGameState() {
        try {
            const savedState = localStorage.getItem(GAME_STATE_KEY);
            return savedState ? JSON.parse(savedState) : null;
        } catch (error) {
            console.error('Failed to load game state:', error);
            return null;
        }
    }
    
    /**
     * Clear the saved game state from local storage
     */
    function clearGameState() {
        try {
            localStorage.removeItem(GAME_STATE_KEY);
            return true;
        } catch (error) {
            console.error('Failed to clear game state:', error);
            return false;
        }
    }
    
    /**
     * Load the game statistics from local storage
     * @returns {Object} The game statistics
     */
    function getStatistics() {
        try {
            const savedStats = localStorage.getItem(STATISTICS_KEY);
            if (savedStats) {
                return JSON.parse(savedStats);
            }
            return {...DEFAULT_STATISTICS};
        } catch (error) {
            console.error('Failed to load statistics:', error);
            return {...DEFAULT_STATISTICS};
        }
    }
    
    /**
     * Update the game statistics after completing a game
     * @param {boolean} won - Whether the game was won
     * @param {number} attempts - Number of attempts taken (if won)
     */
    function updateStatistics(won, attempts = null) {
        try {
            const stats = getStatistics();
            
            // Update basic stats
            stats.gamesPlayed++;
            
            if (won) {
                stats.gamesWon++;
                stats.currentStreak++;
                stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
                
                // Update guess distribution
                if (attempts >= 1 && attempts <= 6) {
                    stats.guessDistribution[attempts]++;
                }
            } else {
                stats.currentStreak = 0;
            }
            
            stats.lastCompleted = new Date().toISOString();
            
            // Save updated stats
            localStorage.setItem(STATISTICS_KEY, JSON.stringify(stats));
            return true;
        } catch (error) {
            console.error('Failed to update statistics:', error);
            return false;
        }
    }
    
    /**
     * Get the win percentage from the statistics
     * @returns {number} Win percentage (0-100)
     */
    function getWinPercentage() {
        const stats = getStatistics();
        if (stats.gamesPlayed === 0) return 0;
        return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
    }
    
    /**
     * Save user settings to local storage
     * @param {Object} settings - User settings object
     */
    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }
    
    /**
     * Load user settings from local storage
     * @returns {Object} User settings
     */
    function getSettings() {
        try {
            const savedSettings = localStorage.getItem(SETTINGS_KEY);
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
            return {...DEFAULT_SETTINGS};
        } catch (error) {
            console.error('Failed to load settings:', error);
            return {...DEFAULT_SETTINGS};
        }
    }
    
    /**
     * Check if the player has played today already
     * @returns {boolean} True if the player has completed a game today
     */
    function hasPlayedToday() {
        const stats = getStatistics();
        if (!stats.lastCompleted) return false;
        
        const lastPlayed = new Date(stats.lastCompleted);
        const today = new Date();
        
        return lastPlayed.getDate() === today.getDate() &&
               lastPlayed.getMonth() === today.getMonth() &&
               lastPlayed.getFullYear() === today.getFullYear();
    }
    
    // Public API
    return {
        saveGameState,
        loadGameState,
        clearGameState,
        getStatistics,
        updateStatistics,
        getWinPercentage,
        saveSettings,
        getSettings,
        hasPlayedToday,
        DEFAULT_STATISTICS,
        DEFAULT_SETTINGS
    };
})();