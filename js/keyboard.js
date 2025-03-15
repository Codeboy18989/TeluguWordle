/**
 * keyboard.js
 * Handles the Telugu virtual keyboard functionality.
 */

const TeluguKeyboard = (function() {
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

    // Current state
    let currentTab = 'consonants';
    let activeElement = null;
    let keyboardContainer = null;
    let keyboardElement = null;
    let combinationPanel = null;
    let handleKeyPress = null;
    let compositionDisplay = null;
    let currentComposition = '';
    
    /**
     * Initialize the keyboard
     * @param {HTMLElement} container - The container element for the keyboard
     * @param {Function} onKeyPress - Callback function for key press events
     */
    function init(container, onKeyPress) {
        keyboardContainer = container;
        handleKeyPress = onKeyPress;
        
        // Create the main keyboard structure
        createKeyboardStructure();
        
        // Set up composition area
        setupCompositionArea();

        // Set up event listeners
        setupEventListeners();
        
        // Show initial tab
        showTab(currentTab);
    }
    
    /**
     * Create the keyboard DOM structure
     */
    function createKeyboardStructure() {
        // Create main keyboard element
        keyboardElement = document.createElement('div');
        keyboardElement.className = 'keyboard';
        
        // Create tabs for switching between keyboard sections
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
        
        keyboardElement.appendChild(tabsContainer);
        
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
        
        // Add special function keys (backspace, enter, etc.)
        addFunctionKeys();
        
        // Create combination panel (initially hidden)
        createCombinationPanel();
        
        // Append keyboard to container
        keyboardContainer.appendChild(keyboardElement);
    }
    
    /**
     * Add function keys to the keyboard
     */
    function addFunctionKeys() {
        // Create a row for function keys
        const functionRow = document.createElement('div');
        functionRow.className = 'keyboard-row';
        
        // Backspace key
        const backspaceKey = document.createElement('button');
        backspaceKey.className = 'key wide backspace';
        backspaceKey.dataset.action = 'backspace';
        backspaceKey.setAttribute('aria-label', 'Backspace');
        functionRow.appendChild(backspaceKey);
        
        // Space key
        const spaceKey = document.createElement('button');
        spaceKey.className = 'key extra-wide';
        spaceKey.dataset.char = ' ';
        spaceKey.textContent = 'Space';
        functionRow.appendChild(spaceKey);
        
        // Enter key
        const enterKey = document.createElement('button');
        enterKey.className = 'key wide enter';
        enterKey.dataset.action = 'enter';
        enterKey.textContent = 'Enter';
        functionRow.appendChild(enterKey);
        
        // Add function row to all keyboard sections
        const sections = keyboardElement.querySelectorAll('.keyboard-section');
        sections.forEach(section => {
            const clonedRow = functionRow.cloneNode(true);
            section.appendChild(clonedRow);
        });
    }
    
    /**
     * Create the combination panel for consonant-vowel combinations
     */
    function createCombinationPanel() {
        combinationPanel = document.createElement('div');
        combinationPanel.className = 'combination-panel';
        combinationPanel.style.display = 'none';
        
        keyboardContainer.appendChild(combinationPanel);
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
    
    /**
     * Show the combination panel for a consonant
     * @param {string} consonant - The consonant to show combinations for
     * @param {HTMLElement} targetElement - The element that triggered the panel
     */
    function showCombinationPanel(consonant, targetElement) {
        // Clear previous content
        combinationPanel.innerHTML = '';
        
        // Add the base consonant
        addCombinationKey(consonant);
        
        // Add virama form (consonant without vowel)
        addCombinationKey(consonant + '్');
        
        // Add all vowel diacritic combinations
        for (const diacriticRow of keyboardLayout.vowelDiacritics) {
            for (const diacritic of diacriticRow) {
                if (diacritic !== '్') { // Skip virama as we already added it
                    addCombinationKey(consonant + diacritic);
                }
            }
        }
        
        // Position panel near the clicked consonant
        positionCombinationPanel(targetElement);
        
        // Show the panel
        combinationPanel.style.display = 'grid';
        
        // Store reference to active element
        activeElement = targetElement;
    }
    
    /**
     * Add a key to the combination panel
     * @param {string} combo - The character combination to add
     */
    function addCombinationKey(combo) {
        const key = document.createElement('button');
        key.className = 'combo-key';
        key.textContent = combo;
        key.dataset.char = combo;
        
        key.addEventListener('click', () => {
            console.log('Combo key clicked:', combo);
            handleKeyPress(combo);
            combinationPanel.style.display = 'none';
        });
        
        combinationPanel.appendChild(key);
    }
    
    /**
     * Position the combination panel relative to the target element
     * @param {HTMLElement} targetElement - The reference element
     */
    function positionCombinationPanel(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        
        // Position panel above the key, considering that keyboard is now fixed
        combinationPanel.style.position = 'absolute';
        combinationPanel.style.left = rect.left + 'px';
        combinationPanel.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
        
        // Adjust panel position to ensure it stays within viewport
        setTimeout(() => {
            const panelRect = combinationPanel.getBoundingClientRect();
            
            // Ensure panel doesn't go beyond right edge
            if (panelRect.right > window.innerWidth) {
                const overflow = panelRect.right - window.innerWidth;
                combinationPanel.style.left = (rect.left - overflow - 10) + 'px';
            }
            
            // Ensure panel doesn't go beyond left edge
            if (panelRect.left < 0) {
                combinationPanel.style.left = '10px';
            }
        }, 0);
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
    
    /**
     * Reset all key statuses to default
     */
    function resetKeyStatuses() {
        const keys = keyboardElement.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
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
                    handleKeyPress('submit-composition', currentComposition);
                    
                    // Clear the composition area
                    compositionDisplay.textContent = '';
                    currentComposition = '';
                }
            });
        }
    }
    
    // Modify the key press handling
    function handleKeyPress(key) {
        console.log('Handling key press:', key);
        if (key === 'enter') {
            // Submit the current composition if any
            if (currentComposition) {
                console.log('Submitting composition:', currentComposition);
                handleKeyPress('submit-composition', currentComposition);
                compositionDisplay.textContent = '';
                currentComposition = '';
            } else {
                // Regular enter behavior
                handleKeyPress('enter');
            }
        } else if (key === 'backspace') {
            // If we have composition text, delete from that
            if (currentComposition) {
                console.log('Backspace in composition');
                currentComposition = currentComposition.slice(0, -1);
                compositionDisplay.textContent = currentComposition;
            } else {
                // Regular backspace behavior
                handleKeyPress('backspace');
            }
        } else {
            // Add to composition
            console.log('Adding to composition:', key);
            currentComposition += key;
            compositionDisplay.textContent = currentComposition;
        }
    }
    // Public API
    return {
        init,
        updateKeyStatus,
        resetKeyStatuses,
        showTab
    };
})();