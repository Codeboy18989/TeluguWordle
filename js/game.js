/**
 * game.js
 * Core game logic for the Telugu Wordle game.
 */

const TeluguWordle = (function() {
    // Game configuration
    const CONFIG = {
        // Number of attempts allowed
        MAX_ATTEMPTS: 6,
        // Min and max word length (in Telugu units, not characters)
        MIN_WORD_LENGTH: 3,
        MAX_WORD_LENGTH: 5,
        // Animation timing
        FLIP_ANIMATION_DURATION: 500, // ms
        DANCE_ANIMATION_DURATION: 300, // ms,
        // Delay between revealing tiles
        REVEAL_DELAY: 200 // ms
    };
    
    // Game state
    let state = {
        targetWord: '',          // Current target word
        targetWordParts: [],     // Target word split into parts
        guesses: [],             // Array of guesses
        currentGuess: '',        // Current guess being typed
        gameStatus: 'playing',   // 'playing', 'won', 'lost'
        revealingRow: false,     // Flag to track revealing animation
        currentRow: 0,           // Current row (attempt)
        gameBoard: null,         // Reference to game board element
        initialized: false       // Flag to track initialization
    };
    
    // Initialize the game
    function init() {
        if (state.initialized) return;
        
        // Get DOM references
        state.gameBoard = document.getElementById('game-board');
        
        // Create the game board grid
        createGameBoard();
        
        // Initialize keyboard
        TeluguKeyboard.init(
            document.getElementById('keyboard-container'),
            handleKeyInput
        );
        
        // Check for saved game state
        const savedState = GameStorage.loadGameState();
        if (savedState) {
            // Restore saved game
            restoreGameState(savedState);
        } else {
            // Start a new game
            startNewGame();
        }
        
        // Set initialized flag
        state.initialized = true;
        
        // Set up event listeners for modals
        setupModalListeners();
    }
    
    /**
     * Create the game board DOM elements
     */
    function createGameBoard() {
        // Clear existing board
        state.gameBoard.innerHTML = '';
        
        // Create rows
        for (let i = 0; i < CONFIG.MAX_ATTEMPTS; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            row.dataset.row = i;
            
            // Create tiles in the row based on the current word length
            // We'll adjust this dynamically when a new word is selected
            for (let j = 0; j < CONFIG.MAX_WORD_LENGTH; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.col = j;
                
                // Initially hide tiles that exceed the minimum length
                if (j >= CONFIG.MIN_WORD_LENGTH) {
                    tile.classList.add('hidden-tile');
                }
                
                row.appendChild(tile);
            }
            
            state.gameBoard.appendChild(row);
        }
    }
    
    /**
     * Start a new game with a random target word
     */
    function startNewGame() {
        // Clear the board
        clearBoard();
        
        // Select a random target word
        state.targetWord = TeluguWordList.getRandomWord();
        state.targetWordParts = TeluguUtils.splitTeluguWord(state.targetWord);
        
        // Log for debugging - you can remove these later
        console.log('New game word:', state.targetWord);
        console.log('Word parts:', state.targetWordParts);
        console.log('Word length:', state.targetWordParts.length);
        
        // Reset game state
        state.guesses = [];
        state.currentGuess = '';
        state.gameStatus = 'playing';
        state.currentRow = 0;
        
        // Reset keyboard
        TeluguKeyboard.resetKeyStatuses();
        
        // THIS IS THE KEY PART - Update UI based on the word length
        adjustTileVisibility(state.targetWordParts.length);
        
        // Save initial state
        saveGameState();
        
        // Update the current row to highlight active tiles
        updateCurrentRow();
    }
    
    /**
     * Adjust the number of visible tiles based on the target word length
     * @param {number} wordLength - The length of the current target word
     */
    function adjustTileVisibility(wordLength) {
        console.log('Adjusting tile visibility for word length:', wordLength);
        
        // Ensure wordLength is within our supported range
        wordLength = Math.max(CONFIG.MIN_WORD_LENGTH, Math.min(wordLength, CONFIG.MAX_WORD_LENGTH));
        
        // Update all rows to show only the required number of tiles
        for (let i = 0; i < CONFIG.MAX_ATTEMPTS; i++) {
            const row = state.gameBoard.querySelector(`.row[data-row="${i}"]`);
            const tiles = row.querySelectorAll('.tile');
            
            tiles.forEach((tile, index) => {
                if (index < wordLength) {
                    tile.classList.remove('hidden-tile');
                } else {
                    tile.classList.add('hidden-tile');
                }
            });
        }
        
        // Also adjust the row styles for proper centering
        document.documentElement.style.setProperty('--current-word-length', wordLength);
    }
    
    /**
     * Restore a saved game state
     * @param {Object} savedState - The saved game state
     */
    function restoreGameState(savedState) {
        // Update state
        state.targetWord = savedState.targetWord;
        state.targetWordParts = savedState.targetWordParts || TeluguUtils.splitTeluguWord(state.targetWord);
        state.guesses = savedState.guesses;
        state.currentGuess = savedState.currentGuess || '';
        state.gameStatus = savedState.gameStatus;
        state.currentRow = savedState.currentRow;
        
        console.log('Restoring game state with word:', state.targetWord);
        console.log('Word parts:', state.targetWordParts);
        
        // THIS IS THE KEY PART - Adjust tiles for the restored word
        adjustTileVisibility(state.targetWordParts.length);
        
        // Update UI
        clearBoard();
        
        // Render previous guesses
        for (let i = 0; i < state.guesses.length; i++) {
            const guessString = state.guesses[i];
            const guessParts = TeluguUtils.splitTeluguWord(guessString);
            
            // Fill in the guessed rows
            const row = state.gameBoard.querySelector(`.row[data-row="${i}"]`);
            
            // Fill in the tiles
            const tiles = row.querySelectorAll('.tile:not(.hidden-tile)');
            for (let j = 0; j < guessParts.length; j++) {
                if (j < tiles.length) {
                    tiles[j].textContent = guessParts[j];
                    tiles[j].classList.add('filled');
                }
            }
            
            // Apply evaluation results
            const evaluation = evaluateGuess(guessString);
            for (let j = 0; j < evaluation.length; j++) {
                if (j < tiles.length) {
                    tiles[j].classList.add(evaluation[j].status);
                    
                    // Update keyboard status
                    TeluguKeyboard.updateKeyStatus(guessParts[j], evaluation[j].status);
                }
            }
        }
        
        // Render current guess if any
        if (state.currentGuess && state.gameStatus === 'playing') {
            const currentGuessParts = TeluguUtils.splitTeluguWord(state.currentGuess);
            const currentRow = state.gameBoard.querySelector(`.row[data-row="${state.currentRow}"]`);
            const tiles = currentRow.querySelectorAll('.tile:not(.hidden-tile)');
            
            for (let j = 0; j < currentGuessParts.length; j++) {
                if (j < tiles.length) {
                    tiles[j].textContent = currentGuessParts[j];
                    tiles[j].classList.add('filled');
                }
            }
        }
        
        // Check if game is over and show appropriate screens
        if (state.gameStatus !== 'playing') {
            setTimeout(() => {
                showGameResult();
            }, 500);
        }
    }
    
    /**
     * Clear the game board UI
     */
    function clearBoard() {
        // Reset all tiles
        const tiles = state.gameBoard.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.textContent = '';
            tile.className = 'tile';
        });
    }
    
    /**
     * Handle keyboard input
     * @param {string} input - The keyboard input (character or action)
     */
    function handleKeyInput(input) {
        // Ignore input if game is not in playing state or if animation is in progress
        if (state.gameStatus !== 'playing' || state.revealingRow) {
            return;
        }
        
        // Handle special actions
        if (input === 'enter') {
            submitGuess();
        } else if (input === 'backspace') {
            deleteLetter();
        } else {
            // Handle character input
            addLetter(input);
        }
    }
    
    /**
     * Add a letter to the current guess
     * @param {string} letter - The letter to add
     */
    function addLetter(letter) {
        const isVowelDiacritic = TeluguUtils.isVowelDiacritic(letter);

        console.log('=== ADD LETTER DEBUG ===');
        console.log('Letter to add:', letter, 'Is diacritic:', isVowelDiacritic);
        console.log('Current guess:', state.currentGuess);
        console.log('Current guess length (chars):', state.currentGuess.length);

        // For vowel diacritics, we need at least one character to attach to
        if (isVowelDiacritic && state.currentGuess.length === 0) {
            console.log('BLOCKED: Diacritic with no base character');
            return;
        }

        // Get current parts
        const currentParts = TeluguUtils.splitTeluguWord(state.currentGuess);
        console.log('Current parts:', currentParts, 'Count:', currentParts.length);

        // Try adding the letter temporarily to see what the result would be
        const testGuess = state.currentGuess + letter;
        const testParts = TeluguUtils.splitTeluguWord(testGuess);

        console.log('Test guess:', testGuess);
        console.log('Test parts:', testParts, 'Count:', testParts.length);
        console.log('Target parts:', state.targetWordParts, 'Count:', state.targetWordParts.length);
        console.log('Would exceed?', testParts.length, '>', state.targetWordParts.length, '=', testParts.length > state.targetWordParts.length);

        // For vowel diacritics, always allow (they combine with existing chars)
        // For other characters, only allow if we won't exceed max length
        if (!isVowelDiacritic && testParts.length > state.targetWordParts.length) {
            console.log('BLOCKED: Would exceed max length');
            return;
        }

        console.log('ALLOWED: Adding letter to guess');

        // Add the letter to current guess
        state.currentGuess += letter;

        // Update the UI
        updateCurrentRow();

        // Save game state
        saveGameState();

        console.log('=== END ADD LETTER ===');
    }
    
    /**
     * Delete the last letter from the current guess
     */
    function deleteLetter() {
        if (state.currentGuess.length === 0) {
            return;
        }
        
        // Get current guess parts
        const currentGuessParts = TeluguUtils.splitTeluguWord(state.currentGuess);
        
        // Remove the last part
        if (currentGuessParts.length > 0) {
            // Reconstruct the guess without the last part
            const newParts = currentGuessParts.slice(0, -1);
            state.currentGuess = newParts.join('');
        }
        
        // Update the UI
        updateCurrentRow();
        
        // Save game state
        saveGameState();
    }
    
    /**
     * Update the display of the current guess row
     */
    function updateCurrentRow() {
        const currentGuessParts = TeluguUtils.splitTeluguWord(state.currentGuess);
        const currentRow = state.gameBoard.querySelector(`.row[data-row="${state.currentRow}"]`);
        const tiles = currentRow.querySelectorAll('.tile:not(.hidden-tile)');
        
        // Reset all tiles in the current row
        tiles.forEach(tile => {
            tile.textContent = '';
            tile.classList.remove('filled');
        });
        
        // Fill in the current guess
        for (let i = 0; i < currentGuessParts.length; i++) {
            if (i < tiles.length) {
                tiles[i].textContent = currentGuessParts[i];
                tiles[i].classList.add('filled');
            }
        }
    }
    
    /**
     * Submit the current guess
     * Enhanced to accept partial guesses with at least 2 correct positions
     */
    function submitGuess() {
        const currentGuessParts = TeluguUtils.splitTeluguWord(state.currentGuess);
        const targetWordLength = state.targetWordParts.length; // DYNAMIC length

        console.log('Submitting guess:', state.currentGuess);
        console.log('Guess parts:', currentGuessParts);
        console.log('Target length:', targetWordLength);

        // Check if we have at least some input
        if (currentGuessParts.length === 0) {
            showNotification('దయచేసి అక్షరాలు నమోదు చేయండి (Please enter letters)');
            shakeCurrentRow();
            return;
        }

        // If guess doesn't match target length, check if it has at least 2 correct positions
        if (currentGuessParts.length !== targetWordLength) {
            // Pad the guess with empty units for evaluation
            const paddedGuess = currentGuessParts.join('');
            const tempEval = evaluateGuessPartial(paddedGuess, currentGuessParts.length);

            // Count correct positions
            const correctCount = tempEval.filter(r => r.status === 'correct').length;

            if (correctCount < 2) {
                showNotification(`కనీసం 2 సరైన అక్షరాలు లేదా ${targetWordLength} అక్షరాల పదం ఉండాలి (Need at least 2 correct letters or ${targetWordLength} units)`);
                shakeCurrentRow();
                return;
            }

            // Has at least 2 correct - allow submission
            console.log(`Accepting partial guess with ${correctCount} correct positions`);
        } else {
            // Full length guess - check if it's a valid Telugu word
            if (!TeluguWordList.isValidWord(state.currentGuess)) {
                console.log('Word validation failed:', state.currentGuess);
                showNotification('చెల్లుబాటు అయ్యే తెలుగు పదం కాదు (Not a valid Telugu word)');
                shakeCurrentRow();
                return;
            }
        }

        // Add to guesses
        state.guesses.push(state.currentGuess);

        // Evaluate the guess
        const evaluation = evaluateGuess(state.currentGuess);

        // Start the reveal animation
        state.revealingRow = true;
        revealRowAnimation(evaluation);

        // Log success
        console.log('Guess submitted successfully:', state.currentGuess);
    }

    /**
     * Evaluate a partial guess (for validation before submission)
     * @param {string} guess - The partial guess
     * @param {number} guessLength - The actual length of the guess
     * @returns {Array} Evaluation results for the partial guess
     */
    function evaluateGuessPartial(guess, guessLength) {
        const guessParts = TeluguUtils.splitTeluguWord(guess);
        const results = [];

        // Only evaluate positions that exist in the guess
        for (let i = 0; i < Math.min(guessLength, state.targetWordParts.length); i++) {
            if (TeluguUtils.normalizeTeluguText(guessParts[i]) === TeluguUtils.normalizeTeluguText(state.targetWordParts[i])) {
                results[i] = { letter: guessParts[i], status: 'correct' };
            } else {
                results[i] = { letter: guessParts[i], status: 'absent' };
            }
        }

        return results;
    }
    
    /**
     * Evaluate a guess against the target word
     * Enhanced to detect partial matches (same base consonant, different vowel sign)
     * @param {string} guess - The guess to evaluate
     * @returns {Array} Array of evaluation results
     */
    function evaluateGuess(guess) {
        const guessParts = TeluguUtils.splitTeluguWord(guess);
        const results = [];

        // Make copies to avoid modifying originals
        const targetCopy = [...state.targetWordParts];
        const guessCopy = [...guessParts];

        // Create a map to track which target parts have been matched
        const matched = new Array(targetCopy.length).fill(false);

        // First pass: Identify correct positions (green) - exact matches
        for (let i = 0; i < guessCopy.length; i++) {
            if (i < targetCopy.length) {
                if (TeluguUtils.normalizeTeluguText(guessCopy[i]) === TeluguUtils.normalizeTeluguText(targetCopy[i])) {
                    results[i] = { letter: guessCopy[i], status: 'correct' };
                    matched[i] = true;
                } else {
                    // Placeholder for now
                    results[i] = { letter: guessCopy[i], status: 'absent' };
                }
            } else {
                // Handle case where guess is longer than target
                results[i] = { letter: guessCopy[i], status: 'absent' };
            }
        }

        // Second pass: Check for partial matches in same position
        // (same base consonant but different vowel sign)
        for (let i = 0; i < guessCopy.length; i++) {
            if (results[i].status === 'correct') {
                continue; // Skip exact matches
            }

            if (i < targetCopy.length) {
                // Check if same base consonant but different vowel sign at this position
                if (TeluguUtils.hasSameBaseConsonant(guessCopy[i], targetCopy[i])) {
                    results[i].status = 'present';
                    // Don't mark as matched - this is a partial match
                    console.log(`Partial match at position ${i}: ${guessCopy[i]} vs ${targetCopy[i]}`);
                }
            }
        }

        // Third pass: Identify characters that exist elsewhere in the target (yellow)
        for (let i = 0; i < guessCopy.length; i++) {
            if (results[i].status === 'correct' || results[i].status === 'present') {
                continue; // Skip already matched positions
            }

            let foundMatch = false;

            // Check if this exact character exists elsewhere in the target
            for (let j = 0; j < targetCopy.length; j++) {
                // Skip positions that are already perfectly matched
                if (matched[j]) continue;

                // Compare normalized characters
                if (TeluguUtils.normalizeTeluguText(guessCopy[i]) === TeluguUtils.normalizeTeluguText(targetCopy[j])) {
                    results[i].status = 'present';
                    matched[j] = true; // Mark this target position as matched
                    foundMatch = true;
                    break;
                }
            }

            // If still no match, check for base consonant match elsewhere
            if (!foundMatch) {
                for (let j = 0; j < targetCopy.length; j++) {
                    if (matched[j]) continue;

                    if (TeluguUtils.hasSameBaseConsonant(guessCopy[i], targetCopy[j])) {
                        results[i].status = 'present';
                        // Don't mark as fully matched since it's only a partial match
                        foundMatch = true;
                        break;
                    }
                }
            }

            // If no match found, it remains 'absent'
            if (!foundMatch) {
                results[i].status = 'absent';
            }
        }

        console.log('Evaluation:', guess, results.map(r => r.status).join(', ')); // Debug output
        return results;
    }
    
    /**
     * Animate revealing the evaluation of a row
     * @param {Array} evaluation - The evaluation results
     */
    function revealRowAnimation(evaluation) {
        const currentRow = state.gameBoard.querySelector(`.row[data-row="${state.currentRow}"]`);
        const tiles = currentRow.querySelectorAll('.tile:not(.hidden-tile)');
        
        console.log('Revealing row animation for row:', state.currentRow);
        
        // Reveal tiles one by one with delay
        for (let i = 0; i < tiles.length; i++) {
            if (i < evaluation.length) {
                // Use setTimeout to stagger the animation
                setTimeout(() => {
                    // Apply flip animation
                    tiles[i].classList.add('reveal');
                    
                    // After half the animation (when tile is flipped halfway), apply the status class
                    setTimeout(() => {
                        // Apply status class (correct, present, absent)
                        tiles[i].classList.add(evaluation[i].status);
                        
                        // Update keyboard status
                        TeluguKeyboard.updateKeyStatus(evaluation[i].letter, evaluation[i].status);
                        
                        // If last tile, finalize the guess after animation completes
                        if (i === Math.min(tiles.length, evaluation.length) - 1) {
                            setTimeout(() => {
                                finalizeGuess(evaluation);
                            }, CONFIG.FLIP_ANIMATION_DURATION / 2);
                        }
                    }, CONFIG.FLIP_ANIMATION_DURATION / 2);
                }, i * CONFIG.REVEAL_DELAY);
            }
        }
    }
    
    /**
     * Finalize the guess after animation completes
     * @param {Array} evaluation - The evaluation results
     */
    function finalizeGuess(evaluation) {
        console.log('Finalizing guess, current row:', state.currentRow);
        
        // Check for win - all letters must be 'correct'
        const isWin = evaluation.every(result => result.status === 'correct');
        
        if (isWin) {
            state.gameStatus = 'won';
            GameStorage.updateStatistics(true, state.currentRow + 1);
            showNotification('అభినందనలు! (Congratulations!)');
            animateWin();
            console.log('Game won at row:', state.currentRow + 1);
        } else {
            // Move to next row or end game
            state.currentRow++;
            console.log('Moving to next row:', state.currentRow);
            
            if (state.currentRow >= CONFIG.MAX_ATTEMPTS) {
                state.gameStatus = 'lost';
                GameStorage.updateStatistics(false);
                console.log('Game lost, max attempts reached');
            }
        }
        
        // Reset current guess
        state.currentGuess = '';
        
        // Animation complete
        state.revealingRow = false;
        
        // Save game state
        saveGameState();
        
        // Show game result if game is over
        if (state.gameStatus !== 'playing') {
            setTimeout(() => {
                showGameResult();
            }, 1500);
        } else {
            // Ensure the next row is ready for input
            updateCurrentRow();
        }
    }
    
    /**
     * Save the current game state to local storage
     */
    function saveGameState() {
        const gameState = {
            targetWord: state.targetWord,
            targetWordParts: state.targetWordParts,
            guesses: state.guesses,
            currentGuess: state.currentGuess,
            gameStatus: state.gameStatus,
            currentRow: state.currentRow,
            wordLength: state.targetWordParts.length // Save word length for proper UI restoration
        };
        
        GameStorage.saveGameState(gameState);
    }
    
    /**
     * Show a notification to the player
     * @param {string} message - The message to display
     */
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.remove('hidden');
        notification.classList.add('show');
        
        // Hide after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 300);
        }, 2000);
    }
    
    /**
     * Shake the current row (for invalid input)
     */
    function shakeCurrentRow() {
        const currentRow = state.gameBoard.querySelector(`.row[data-row="${state.currentRow}"]`);
        currentRow.classList.add('shake');
        
        // Remove class after animation completes
        setTimeout(() => {
            currentRow.classList.remove('shake');
        }, 500);
    }
    
    /**
     * Animate the win celebration
     */
    function animateWin() {
        const currentRow = state.gameBoard.querySelector(`.row[data-row="${state.currentRow}"]`);
        const tiles = currentRow.querySelectorAll('.tile:not(.hidden-tile)');
        
        // Add dance animation to each tile with delay
        for (let i = 0; i < tiles.length; i++) {
            // Set animation order as a CSS variable for proper sequencing
            tiles[i].style.setProperty('--animation-order', i);
            
            // Add dance class with slight delay to ensure proper sequencing
            setTimeout(() => {
                tiles[i].classList.add('dance');
            }, i * 100);
        }
        
        // Remove animation classes after they complete
        setTimeout(() => {
            tiles.forEach(tile => {
                tile.classList.remove('dance');
            });
        }, 1500);
    }
    
    /**
     * Show the game result modal
     */
    function showGameResult() {
        const modal = document.getElementById('game-result-modal');
        const titleElement = document.getElementById('result-title');
        const messageElement = document.getElementById('result-message');
        const correctWordElement = document.getElementById('correct-word');
        const statsElement = document.getElementById('result-stats');
        
        // Set content based on game result
        if (state.gameStatus === 'won') {
            titleElement.textContent = 'విజయం! (Victory!)';
            messageElement.textContent = `మీరు ${state.currentRow + 1} ప్రయత్నాలలో గెలిచారు.`;
        } else {
            titleElement.textContent = 'అయ్యో! (Oops!)';
            messageElement.textContent = 'మీరు పదాన్ని ఊహించలేకపోయారు.';
        }
        
        // Show correct word
        correctWordElement.textContent = `సరైన పదం: ${state.targetWord}`;
        
        // Show statistics
        const stats = GameStorage.getStatistics();
        statsElement.innerHTML = `
            <div class="stat-box">
                <div class="stat-value">${stats.gamesPlayed}</div>
                <div class="stat-label">ఆటలు (Games)</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${Math.round((stats.gamesWon / Math.max(1, stats.gamesPlayed)) * 100)}%</div>
                <div class="stat-label">విజయాలు (Wins)</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${stats.currentStreak}</div>
                <div class="stat-label">ప్రస్తుత విజయాల వరుస (Current Streak)</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${stats.maxStreak}</div>
                <div class="stat-label">గరిష్ట విజయాల వరుస (Max Streak)</div>
            </div>
        `;
        
        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }
    
    /**
     * Set up event listeners for modals
     */
    function setupModalListeners() {
        // Help button
        document.getElementById('help-button').addEventListener('click', () => {
            const helpModal = document.getElementById('help-modal');
            helpModal.classList.remove('hidden');
            helpModal.classList.add('show');
        });
        
        // Stats button
        document.getElementById('stats-button').addEventListener('click', () => {
            showStatsModal();
        });
        
        // Close buttons for all modals
        document.querySelectorAll('.close-button').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            });
        });
        
        // Play again button
        document.getElementById('play-again-button').addEventListener('click', () => {
            const modal = document.getElementById('game-result-modal');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('hidden');
                startNewGame();
            }, 300);
        });
    }
    
    /**
     * Show the statistics modal
     */
    function showStatsModal() {
        const stats = GameStorage.getStatistics();
        const statsContainer = document.getElementById('stats-container');
        
        // Set up statistics content
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-number">${stats.gamesPlayed}</div>
                <div class="stat-text">ఆటలు<br>(Games)</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${Math.round((stats.gamesWon / Math.max(1, stats.gamesPlayed)) * 100)}%</div>
                <div class="stat-text">విజయాలు<br>(Wins)</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.currentStreak}</div>
                <div class="stat-text">ప్రస్తుత వరుస<br>(Current Streak)</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.maxStreak}</div>
                <div class="stat-text">గరిష్ట వరుస<br>(Max Streak)</div>
            </div>
        `;
        
        // Add guess distribution
        const distributionHTML = `
            <h3>ఊహలు పంపిణీ (Guess Distribution)</h3>
            <div class="guess-distribution">
                ${Object.entries(stats.guessDistribution).map(([guess, count]) => `
                    <div class="distribution-row">
                        <div class="guess-number">${guess}</div>
                        <div class="guess-bar-container">
                            <div class="guess-bar" style="width: ${Math.max(5, count * 5)}%;">
                                ${count}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        statsContainer.innerHTML += distributionHTML;
        
        // Show modal
        const statsModal = document.getElementById('stats-modal');
        statsModal.classList.remove('hidden');
        statsModal.classList.add('show');
    }
    
    // Public API
    return {
        init,
        startNewGame,
        handleKeyInput,
        CONFIG
    };
})();