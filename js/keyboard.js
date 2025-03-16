/**
 * keyboard.js
 * Handles the Telugu virtual keyboard functionality.
 */

const TeluguKeyboard = (function() {
    // Current state
    let isMinimized = false;
    let keyboardContainer = null;
    let keyHandler = null;
    let compositionDisplay = null;
    let currentComposition = '';
    let currentTab = 'consonants';
    let combinationPanel = null;
    let keyboardElement = null;

    // Keyboard sections and layouts
    const keyboardLayout = {
        // Consonants layout - main characters
        consonants: [
            ['క', 'ఖ', 'గ', 'ఘ', 'ఙ'],
            ['చ', 'ఛ', 'జ', 'ఝ', 'ఞ'],
            ['ట', 'ఠ', 'డ', 'ఢ', 'ణ'],
            ['త', 'థ', 'ద', 'ధ', 'న'],
            ['ప', 'ఫ', 'బ', 'భ', 'మ'],
            ['య', 'ర', 'ల', 'వ', 'శ'],
            ['ష', 'స', 'హ', 'ళ', 'క్ష'],
        ],
        
        // Vowels layout
        vowels: [
            ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ'],
            ['ఊ', 'ఋ', 'ౠ', 'ఌ', 'ౡ'],
            ['ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ'],
            ['ఔ', 'అం', 'అః'],
        ],
        
        // Vowel diacritics (for combining with consonants)
        vowelDiacritics: [
            ['ా', 'ి', 'ీ', 'ు', 'ూ'],
            ['ృ', 'ౄ', 'ె', 'ే', 'ై'],
            ['ొ', 'ో', 'ౌ', 'ం', 'ః'],
            ['్'] // Virama (Pollu) - removes inherent vowel
        ]
    };
    
    // Initialize the keyboard
    function init(container, onKeyPress) {
        keyboardContainer = container; // Store container reference
        keyHandler = onKeyPress;

        console.log('Initializing keyboard with container:', container);

        try {
            // First clear any existing content
            container.innerHTML = '';
            
            // Create keyboard header
            createKeyboardHeader();
            
            // Create keyboard structure
            createKeyboardStructure();
            
            // Setup composition area
            setupCompositionArea();
            
            // Setup event listeners
            setupEventListeners();
            
            // Show keyboard by default
            container.classList.remove('minimized');
            
            // Show initial tab
            showTab(currentTab);
            
            return true;
        } catch (e) {
            console.error("Error in keyboard init:", e);
            return false;
        }
    }

    function createKeyboardHeader() {
        console.log('Creating keyboard header');
    
        const header = document.createElement('div');
        header.className = 'keyboard-header';
        
        const title = document.createElement('span');
        title.textContent = 'తెలుగు Keyboard';
        
        const minimizeBtn = document.createElement('button');
        minimizeBtn.id = 'minimize-keyboard';
        minimizeBtn.className = 'minimize-button';
        minimizeBtn.textContent = '▼';
        
        header.appendChild(title);
        header.appendChild(minimizeBtn);
        keyboardContainer.appendChild(header);
        
        // Setup minimize button functionality
        minimizeBtn.addEventListener('click', toggleKeyboard);
        console.log('Minimize button event listener attached');
    }

    function createKeyboardStructure() {
        // Create the keyboard div
        keyboardElement = document.createElement('div'); // Store reference
        keyboardElement.id = 'keyboard';
        keyboardContainer.appendChild(keyboardElement);

        // Create tabs
        createTabs(keyboardElement);
        
        // Create sections for each keyboard layout
        for (const [sectionId, layout] of Object.entries(keyboardLayout)) {
            const section = document.createElement('div');
            section.className = `keyboard-section ${sectionId === currentTab ? 'active' : ''}`;
            section.dataset.section = sectionId;
            
            // Create rows and keys
            layout.forEach(row => {
                const keyboardRow = document.createElement('div');
                keyboardRow.className = 'keyboard-row';
                
                row.forEach(char => {
                    const key = document.createElement('button');
                    key.className = 'key';
                    key.dataset.char = char;
                    key.textContent = char;
                    keyboardRow.appendChild(key);
                });
                
                section.appendChild(keyboardRow);
            });
            
            keyboardElement.appendChild(section);
        }
        
        // Add function keys
        addFunctionKeys(keyboardElement);

        // Create combination panel
        createCombinationPanel();
    }

    function createTabs(keyboard) {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'keyboard-tabs';
        
        // Add tabs
        const tabs = {
            'consonants': 'హల్లులు (Consonants)',
            'vowels': 'అచ్చులు (Vowels)',
            'vowelDiacritics': 'గుణింతాలు (Vowel Signs)'
        };
        
        for (const [tabId, tabLabel] of Object.entries(tabs)) {
            const tab = document.createElement('button');
            tab.className = `keyboard-tab ${tabId === currentTab ? 'active' : ''}`;
            tab.dataset.tab = tabId;
            tab.textContent = tabLabel;
            tabsContainer.appendChild(tab);
        }
        
        keyboard.appendChild(tabsContainer);
    }

    // Add function keys to the keyboard
    function addFunctionKeys(keyboard) {
        // Create a row for function keys
        const functionRow = document.createElement('div');
        functionRow.className = 'keyboard-row function-row';
        
        // Define function keys
        const functionKeys = [
            { action: 'backspace', label: '⌫' },
            { action: 'space', label: 'Space' },
            { action: 'enter', label: 'Enter' }
        ]
        
        // Add each function key
        functionKeys.forEach(funcKey => {
            const key = document.createElement('button');
            key.className = 'function-key';
            key.dataset.action = funcKey.action;
            key.textContent = funcKey.label;
            functionRow.appendChild(key);
        });
        
        keyboard.appendChild(functionRow);
    }

    // Create the combination panel for consonant-vowel combinations
    function createCombinationPanel() {
        combinationPanel = document.createElement('div');
        combinationPanel.className = 'combination-panel hidden';
        keyboardContainer.appendChild(combinationPanel);
    }

    // Add this new function
    function setupCompositionArea() {
        console.log('Setting up composition area');
        compositionDisplay = document.querySelector('.composition-display');
        
        if (!compositionDisplay) {
            console.error('Composition display element not found!');
            return;
        }

        console.log('Composition display found:', compositionDisplay);

        // Clear button
        const clearButton = document.querySelector('.composition-clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                console.log('Clearing composition');
                compositionDisplay.textContent = '';
                currentComposition = '';
            });
        }
        
        // Submit button
        const submitButton = document.querySelector('.composition-submit');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                console.log('Submitting composition:', currentComposition);
                if (currentComposition) {
                    // Submit the composed text to the game
                    keyHandler('submit-composition', currentComposition);
                    
                    // Clear the composition area
                    compositionDisplay.textContent = '';
                    currentComposition = '';
                }
            });
        }
    }

    /**
     * Set up event listeners for the keyboard
     */
    function setupEventListeners() {
        // Tab switching
        const tabs = keyboardElement.querySelectorAll('.keyboard-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                showTab(tab.dataset.tab);
            });
        });
        
        // Key press handling
        keyboardElement.addEventListener('click', (event) => {
            const target = event.target;
            
            console.log('Keyboard click:', target.dataset);
            
            // Handle character keys
            if (target.dataset.char) {
                console.log('Character key pressed:', target.dataset.char);
                handleKeyPress(target.dataset.char);
            }
            // Handle function keys
            else if (target.dataset.action) {
                console.log('Action key pressed:', target.dataset.action);
                handleKeyPress(target.dataset.action);
            }
            // Handle consonant keys for combination panel
            else if (target.classList.contains('key') && 
                     target.parentElement && 
                     target.parentElement.parentElement && 
                     target.parentElement.parentElement.dataset.section === 'consonants') {
                const consonant = target.textContent;
                console.log('Consonant key pressed for combinations:', consonant);
                showCombinationPanel(consonant, target);
            } else {
                console.log('Unhandled keyboard click:', target);
            }
        });
        
        // Handle clicks outside the combination panel to close it
        document.addEventListener('click', (event) => {
            if (combinationPanel.style.display !== 'none') {
                if (!combinationPanel.contains(event.target) && 
                    !event.target.classList.contains('key')) {
                    combinationPanel.style.display = 'none';
                }
            }
        });
        // Add touch event handlers
        const keys = document.querySelectorAll('.keyboard-button');
        keys.forEach(key => {
            key.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent double-firing on mobile
                handleKeyPress(key.dataset.key);
            });
        });

    }

    /**
     * Show a specific keyboard tab
     * @param {string} tabId - The ID of the tab to show
     */
    function showTab(tabId) {
        // Update current tab
        currentTab = tabId;
        
        // Update tab styling
        const tabs = keyboardElement.querySelectorAll('.keyboard-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Show/hide sections
        const sections = keyboardElement.querySelectorAll('.keyboard-section');
        sections.forEach(section => {
            section.classList.toggle('active', section.dataset.section === tabId);
        });
        
        // Hide combination panel when switching tabs
        combinationPanel.style.display = 'none';
    }

    function toggleKeyboard() {
        console.log('Toggle keyboard called');
        if (!keyboardContainer) {
            console.error('Keyboard container not found');
            return;
        }
        
        isMinimized = !isMinimized;
        console.log('Keyboard minimized:', isMinimized);
        
        keyboardContainer.classList.toggle('minimized', isMinimized);
        
        const minimizeBtn = document.getElementById('minimize-keyboard');
        if (minimizeBtn) {
            minimizeBtn.textContent = isMinimized ? '▲' : '▼';
        }
        
        // Save preference
        localStorage.setItem('keyboardMinimized', isMinimized);
    }

    // Modify the key press handling
    function handleKeyPress(key) {
        console.log('Handling key press:', key);
        if (key === 'enter') {
            // Submit the current composition if any
            if (currentComposition) {
                console.log('Submitting composition:', currentComposition);
                keyHandler('submit-composition', currentComposition); // Use keyHandler instead
                compositionDisplay.textContent = '';
                currentComposition = '';
            } else {
                // Regular enter behavior
                keyHandler('enter'); // Use keyHandler instead
            }
        } else if (key === 'backspace') {
            // If we have composition text, delete from that
            if (currentComposition) {
                console.log('Backspace in composition');
                currentComposition = currentComposition.slice(0, -1);
                compositionDisplay.textContent = currentComposition;
            } else {
                // Regular backspace behavior
                keyHandler('backspace'); // Use keyHandler instead
            }
        } else {
            // Add to composition
            console.log('Adding to composition:', key);
            currentComposition += key;
            compositionDisplay.textContent = currentComposition;
        }
    }

    /**
     * Update key status based on game feedback
     * @param {string} char - The character to update
     * @param {string} status - The status ('correct', 'present', 'absent')
     */
    function updateKeyStatus(char, status) {
        // Find all keys with this character
        const keys = keyboardElement.querySelectorAll(`.key[data-char="${char}"]`);
        
        keys.forEach(key => {
            // Remove existing status classes
            key.classList.remove('correct', 'present', 'absent');
            
            // Don't downgrade statuses (e.g., from 'correct' to 'present')
            if (key.classList.contains('correct')) {
                return;
            }
            if (key.classList.contains('present') && status === 'absent') {
                return;
            }
            
            // Add new status class
            key.classList.add(status);
        });
    }
    
    // Fix the resetKeyStatuses function to not rely on keyboardElement
    function resetKeyStatuses() {
        if (!keyboardContainer) return;
        
        const keys = keyboardContainer.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
    }
    

    // Restore keyboard state on page load
    function restoreKeyboardState() {
        const savedState = localStorage.getItem('keyboardMinimized');
        if (savedState !== null) {
            isMinimized = savedState === 'true';
            const container = document.getElementById('keyboard-container');
            const minimizeBtn = document.getElementById('minimize-keyboard');
            
            if (isMinimized) {
                container.classList.add('minimized');
                minimizeBtn.textContent = '▲';
            }
        }
    }
    
    
    // Public API
    return {
        init,
        toggleKeyboard,
        restoreKeyboardState,
        updateKeyStatus,
        resetKeyStatuses,
        showTab,
        handleKeyPress
    };
})();