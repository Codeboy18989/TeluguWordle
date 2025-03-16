/**
 * main.js
 * Entry point for the Telugu Wordle game application.
 * Initializes the game and sets up event listeners.
 */
// Register service worker for offline capabilities if supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    
    // Check if elements exist
    console.log('Game board element:', document.getElementById('game-board'));
    console.log('Keyboard container:', document.getElementById('keyboard-container'));
    
    // First initialize the keyboard
    const keyboardContainer = document.getElementById('keyboard-container');
    if (!keyboardContainer) {
        console.error('ERROR: Keyboard container not found!');
    } else {
        console.log('Initializing keyboard...');
        TeluguKeyboard.init(keyboardContainer, TeluguWordle.handleKeyInput);
        TeluguKeyboard.restoreKeyboardState();
    }

    // Initialize the game
    console.log('Initializing game...')
    TeluguWordle.init();

    // Initialize level indicator based on saved level
    updateLevelIndicator(TeluguWordList.getLevel());

    // Helper function to update level indicator
    function updateLevelIndicator(level) {
        const levelButtons = document.querySelectorAll('.level-btn');
        levelButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.level) === level);
        });
        
        // Update document title to include level
        document.title = `Level ${level} - తెలుగు Wordle`;
    }
    
    // Add event listeners for physical keyboard input
    document.addEventListener('keydown', handlePhysicalKeyboard);
    
    // Setup keyboard toggle button for mobile view
    setupKeyboardToggle();
    
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
    
    // Set up keyboard toggle functionality for mobile
    function setupKeyboardToggle() {
        const keyboardContainer = document.getElementById('keyboard-container');
        const toggleButton = document.getElementById('toggle-keyboard');
        
        // Initialize keyboard state - visible by default
        let keyboardVisible = true;
        
        // Toggle keyboard visibility when button is clicked
        toggleButton.addEventListener('click', function() {
            keyboardVisible = !keyboardVisible;
            
            if (keyboardVisible) {
                keyboardContainer.style.display = 'block';
                document.getElementById('game-board').style.paddingBottom = '140px';
            } else {
                keyboardContainer.style.display = 'none';
                document.getElementById('game-board').style.paddingBottom = '10px';
            }
        });
        
        // Auto-hide keyboard on small screens in portrait orientation
        function checkOrientation() {
            // Only apply auto-hide on very small screens in portrait mode
            if (window.innerHeight < 600 && window.innerWidth < window.innerHeight) {
                if (keyboardVisible) {
                    toggleButton.click(); // Auto-hide on first load for small screens
                }
            }
        }
        
        // Check on page load and resize
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
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
    
});