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
    // Make sure TeluguWordle is initialized first
    if (typeof TeluguWordle === 'undefined') {
        console.error('TeluguWordle not defined!');
        return;
    }
    // Check if elements exist
    console.log('Game board element:', document.getElementById('game-board'));
    console.log('Keyboard container:', document.getElementById('keyboard-container'));
    
    // Initialize the keyboard
    if (typeof TeluguKeyboard === 'undefined') {
        console.error('TeluguKeyboard not defined!');
        return;
    }

    // First initialize the keyboard
    const keyboardContainer = document.getElementById('keyboard-container');
    if (!keyboardContainer) {
        console.error('ERROR: Keyboard container not found!');
    } else {
        console.log('Initializing keyboard...');
        try {
            TeluguKeyboard.init(keyboardContainer, TeluguWordle.handleKeyInput);
            TeluguKeyboard.restoreKeyboardState();
        } catch (e) {
            console.error('Error initializing keyboard:', e);
        }
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
        const toggleButton = document.getElementById('toggle-keyboard') || createToggleButton();
        
        let keyboardVisible = true;
        
        toggleButton.addEventListener('click', function() {
            keyboardVisible = !keyboardVisible;
            
            if (keyboardVisible) {
                keyboardContainer.classList.remove('minimized');
                toggleButton.classList.remove('minimized');
                toggleButton.innerHTML = '🔽'; // Down arrow
            } else {
                keyboardContainer.classList.add('minimized');
                toggleButton.classList.add('minimized');
                toggleButton.innerHTML = '🔼'; // Up arrow
            }
        });
        
        // Check initial state when page loads
        if (keyboardContainer.classList.contains('minimized')) {
            keyboardVisible = false;
            toggleButton.classList.add('minimized');
            toggleButton.innerHTML = '🔼';
        }
    }
    
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'toggle-keyboard';
        button.innerHTML = '🔽';
        document.body.appendChild(button);
        return button;
    }
    
    
});