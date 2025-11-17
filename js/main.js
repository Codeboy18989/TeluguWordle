/**
 * main.js
 * Entry point for the Telugu Wordle game application.
 * Initializes the game and sets up event listeners.
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Firestore words first (if available)
    if (typeof TeluguWordList !== 'undefined' && TeluguWordList.initFirestoreWords) {
        try {
            await TeluguWordList.initFirestoreWords();
        } catch (error) {
            console.warn('Firestore initialization failed, using base dictionary:', error);
        }
    }

    // Initialize the game
    TeluguWordle.init();

    // Add event listeners for physical keyboard input
    document.addEventListener('keydown', handlePhysicalKeyboard);

    // Setup keyboard toggle button for mobile view
    setupKeyboardToggle();

    // Load and display hint
    loadHint();
    
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
    
    // Set up keyboard toggle functionality
    function setupKeyboardToggle() {
        const keyboardContainer = document.getElementById('keyboard-container');
        const toggleButton = document.getElementById('toggle-keyboard');
        const toggleText = toggleButton.querySelector('.toggle-text');

        // Initialize keyboard state - visible by default
        let keyboardVisible = true;

        // Toggle keyboard visibility when button is clicked
        toggleButton.addEventListener('click', function() {
            keyboardVisible = !keyboardVisible;

            if (keyboardVisible) {
                keyboardContainer.style.display = 'block';
                toggleButton.classList.remove('keyboard-hidden');
                toggleText.textContent = 'Hide Keyboard';
            } else {
                keyboardContainer.style.display = 'none';
                toggleButton.classList.add('keyboard-hidden');
                toggleText.textContent = 'Keyboard';
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

    // Load and display hint from admin
    function loadHint() {
        const HINT_KEY = 'telugu_wordle_hint';
        const hintContainer = document.getElementById('hint-container');
        const hintText = document.getElementById('hint-text');

        console.log('🔍 [HINT DEBUG] Starting hint load...');
        console.log('🔍 [HINT DEBUG] Container element:', hintContainer);
        console.log('🔍 [HINT DEBUG] Text element:', hintText);

        try {
            const hintData = localStorage.getItem(HINT_KEY);
            console.log('🔍 [HINT DEBUG] Raw hint data from localStorage:', hintData);

            if (hintData) {
                const hint = JSON.parse(hintData);
                const today = new Date().toISOString().split('T')[0];

                console.log('🔍 [HINT DEBUG] Parsed hint:', hint);
                console.log('🔍 [HINT DEBUG] Today\'s date:', today);
                console.log('🔍 [HINT DEBUG] Hint date:', hint.date);
                console.log('🔍 [HINT DEBUG] Dates match:', hint.date === today);

                // Check if hint is for today's word
                if (hint.date === today && hint.text && hint.text.trim()) {
                    hintText.textContent = hint.text;
                    hintContainer.style.display = 'block';
                    hintContainer.style.visibility = 'visible';
                    hintContainer.style.opacity = '1';

                    console.log('✅ [HINT DEBUG] Hint displayed successfully!');
                    console.log('✅ [HINT DEBUG] Hint text:', hint.text);
                    console.log('✅ [HINT DEBUG] Container display:', hintContainer.style.display);
                    console.log('✅ [HINT DEBUG] Container visibility:', hintContainer.style.visibility);

                    // Scroll hint into view on mobile
                    setTimeout(() => {
                        hintContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                } else {
                    hintContainer.style.display = 'none';
                    console.log('ℹ️ [HINT DEBUG] Hint hidden (expired or empty)');
                }
            } else {
                hintContainer.style.display = 'none';
                console.log('ℹ️ [HINT DEBUG] No hint data found in localStorage');
            }
        } catch (e) {
            console.error('❌ [HINT DEBUG] Error loading hint:', e);
            hintContainer.style.display = 'none';
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
            // Use relative path for flexible deployment (works in subdirectories)
            navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    
});