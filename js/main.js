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

    // Size the tiles so the whole board fits in the space above the keyboard
    setupBoardSizing();

    /**
     * Fit the game board into the space the layout gives it.
     * Tiles shrink when the keyboard takes more room (or the window is short)
     * and grow back (up to 60px) when the keyboard is hidden.
     */
    function setupBoardSizing() {
        const board = document.getElementById('game-board');
        const root = document.documentElement;
        if (!board) return;

        const MAX_TILE = 60;
        const MIN_TILE = 24;

        function fitBoard() {
            const boardStyle = getComputedStyle(board);
            const wordLength = parseInt(getComputedStyle(root).getPropertyValue('--current-word-length'), 10) || 5;
            const rowCount = board.querySelectorAll('.row').length || 6;
            const gap = parseFloat(boardStyle.rowGap) || 5;

            const availableHeight = board.clientHeight
                - parseFloat(boardStyle.paddingTop) - parseFloat(boardStyle.paddingBottom);
            const availableWidth = board.clientWidth
                - parseFloat(boardStyle.paddingLeft) - parseFloat(boardStyle.paddingRight);

            const byHeight = (availableHeight - gap * (rowCount - 1)) / rowCount;
            const byWidth = (availableWidth - gap * (wordLength - 1)) / wordLength;
            const size = Math.max(MIN_TILE, Math.floor(Math.min(MAX_TILE, byHeight, byWidth)));

            const newValue = size + 'px';
            if (root.style.getPropertyValue('--tile-size') !== newValue) {
                root.style.setProperty('--tile-size', newValue);
            }
        }

        fitBoard();

        if (typeof ResizeObserver !== 'undefined') {
            // Board area changes on window resize and when the keyboard is hidden/shown
            new ResizeObserver(fitBoard).observe(board);
        } else {
            window.addEventListener('resize', fitBoard);
        }

        // Word length changes for each new word (game.js updates --current-word-length)
        new MutationObserver(fitBoard).observe(root, { attributes: true, attributeFilter: ['style'] });
    }

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
        // Wait for keyboard to be initialized
        setTimeout(() => {
            const keyboardContainer = document.getElementById('keyboard-container');
            const keyboardSections = document.querySelectorAll('.keyboard-section');
            const toggleButton = document.getElementById('toggle-keyboard');

            if (!keyboardSections.length || !toggleButton || !keyboardContainer) {
                console.warn('Keyboard elements not found');
                return;
            }

            // Initialize keyboard state - visible by default
            let keyboardVisible = true;

            // Toggle keyboard visibility when button is clicked
            toggleButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                keyboardVisible = !keyboardVisible;

                if (keyboardVisible) {
                    // Show the active section
                    keyboardSections.forEach(section => {
                        if (section.classList.contains('active')) {
                            section.style.display = 'block';
                        }
                    });
                    keyboardContainer.classList.remove('keyboard-minimized');
                    toggleButton.classList.remove('hidden-state');
                    toggleButton.innerHTML = '▼ Hide';
                    toggleButton.setAttribute('aria-label', 'Hide Keyboard');
                } else {
                    // Hide all sections but keep tabs visible
                    keyboardSections.forEach(section => {
                        section.style.display = 'none';
                    });
                    keyboardContainer.classList.add('keyboard-minimized');
                    toggleButton.classList.add('hidden-state');
                    toggleButton.innerHTML = '▲ Show';
                    toggleButton.setAttribute('aria-label', 'Show Keyboard');
                }
            });

            console.log('✅ Keyboard toggle initialized');
        }, 500);
    }

    // Load and display hint from admin
    function loadHint() {
        const HINT_KEY = 'telugu_wordle_hint';
        const hintElement = document.getElementById('hint-text');

        console.log('🔍 [HINT DEBUG] Starting hint load...');
        console.log('🔍 [HINT DEBUG] Hint element:', hintElement);

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
                    hintElement.textContent = hint.text;
                    hintElement.style.display = 'block';

                    console.log('✅ [HINT DEBUG] Hint displayed successfully!');
                    console.log('✅ [HINT DEBUG] Hint text:', hint.text);
                } else {
                    hintElement.style.display = 'none';
                    console.log('ℹ️ [HINT DEBUG] Hint hidden (expired or empty)');
                }
            } else {
                hintElement.style.display = 'none';
                console.log('ℹ️ [HINT DEBUG] No hint data found in localStorage');
            }
        } catch (e) {
            console.error('❌ [HINT DEBUG] Error loading hint:', e);
            hintElement.style.display = 'none';
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