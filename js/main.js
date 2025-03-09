/**
 * main.js
 * Entry point for the Telugu Wordle game application.
 * Initializes the game and sets up event listeners.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the game
    TeluguWordle.init();
    
    // Add event listeners for physical keyboard input
    document.addEventListener('keydown', handlePhysicalKeyboard);
    
    // Handle physical keyboard input
    function handlePhysicalKeyboard(event) {
        // Ignore if focused on an input element
        if (document.activeElement.tagName === 'INPUT') {
            return;
        }
        
        const key = event.key;
        
        // Handle Enter key
        if (key === 'Enter') {
            TeluguWordle.handleKeyInput('enter');
            event.preventDefault();
        }
        // Handle Backspace key
        else if (key === 'Backspace') {
            TeluguWordle.handleKeyInput('backspace');
            event.preventDefault();
        }
        // Handle common transliteration for Telugu typing
        // This is a simple mapping and can be extended
        else if (/^[a-zA-Z0-9]$/.test(key)) {
            // For MVP, we'll just ignore physical keyboard Latin characters
            // In a future version, we could implement transliteration or mapping
            // event.preventDefault();
        }
    }
    
    // Handle dark mode toggle if implemented in settings
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        const settings = GameStorage.getSettings();
        
        // Set initial state
        if (settings.darkTheme) {
            document.body.classList.add('dark-theme');
        }
        
        darkModeToggle.addEventListener('click', function() {
            // Toggle dark mode class on body
            document.body.classList.toggle('dark-theme');
            
            // Update settings
            const newSettings = GameStorage.getSettings();
            newSettings.darkTheme = document.body.classList.contains('dark-theme');
            GameStorage.saveSettings(newSettings);
        });
    }
    
    // Register service worker for offline capabilities if supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});