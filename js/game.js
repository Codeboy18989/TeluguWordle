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
        MIN_WORD_LENGTH: 2,
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
        initialized: false,       // Flag to track initialization
        level: 2
    };
    
    // Initialize the game
    function init() {
        // Get DOM references
        state.gameBoard = document.getElementById('game-board');
        
        // Create the game board
        createGameBoard();
        
        // Load saved game state or start new game
        const savedState = GameStorage.loadGameState();
        if (savedState) {
            restoreGameState(savedState);
        } else {
            startNewGame();
        }
        
        // Set up level selector
        setupLevelSelector();
        if (window.innerWidth <= 480) {
            setupCompactViewToggle();
        }
    }
    /**
     * Set up level selector
     */
    function setupLevelSelector() {
        const levelButtons = document.querySelectorAll('.level-btn');
        
        levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                const level = parseInt(button.dataset.level);
                changeLevel(level);
            });
        });
    }
    
    /**
     * Change the game level
     * @param {number} level - The level to change to (1-4)
     */
    function changeLevel(level) {
        // Only change if level is different
        if (level === state.level) return;
        
        // Update level
        state.level = level;
        TeluguWordList.setLevel(level);
        
        // Update UI
        updateLevelUI();
        
        // Start a new game
        startNewGame();
    }
    
    /**
     * Update level UI
     */
    function updateLevelUI() {
        const levelButtons = document.querySelectorAll('.level-btn');
        
        levelButtons.forEach(button => {
            const buttonLevel = parseInt(button.dataset.level);
            if (buttonLevel === state.level) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    /**
     * Create the game board DOM elements
     */
    function createGameBoard() {
        const board = document.getElementById('game-board');
        if (!board) {
            console.error('Game board element not found!');
            return;
        }
        board.innerHTML = ''; // Clear existing board
        
        // Get the current level's word length
        const currentBoxCount = TeluguWordList.getLevelWordLength(TeluguWordList.getLevel());
        console.log('Creating game board with box count:', currentBoxCount);

        // Create rows
        for (let i = 0; i < CONFIG.MAX_ATTEMPTS; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            
            // Create only the number of tiles needed for current level
            for (let j = 0; j < currentBoxCount; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.display = 'flex'; // Explicitly set display
                row.appendChild(tile);
            }
            board.appendChild(row);
        }
        
    }
    
    /**
     * Start a new game with a random target word
     */
    function startNewGame() {
        // Reset game state
        state.guesses = [];
        state.evaluations = [];
        state.currentRow = 0;
        state.currentGuess = '';
        state.gameStatus = 'playing';
        state.targetWord = TeluguWordList.getRandomWord();
        state.level = TeluguWordList.getLevel();
        
        // Log information for debugging
        const wordParts = TeluguUtils.splitTeluguWord(state.targetWord);
        console.log('New game word:', state.targetWord);
        console.log('Word parts:', wordParts);
        console.log('Word length:', state.targetWord.length);
        console.log('Current level:', state.level);
        
        // Clear keyboard statuses
        if (TeluguKeyboard) {
            TeluguKeyboard.resetKeyStatuses();
        }
        
        // Adjust tiles based on current level's word length
        const currentBoxCount = TeluguWordList.getLevelWordLength(state.level);
        resetGameBoard(currentBoxCount);
        
        // Save game state
        saveGameState();
    }
    
    // Add this function to reset the game board
    function resetGameBoard(boxCount) {
        // Clear the game board
        state.gameBoard.innerHTML = '';
        
        // Recreate the game board with the correct number of boxes
        createGameBoard();
    }

    /**
     * Adjust the number of visible tiles based on the target word length
     * @param {number} wordLength - The length of the current target word
     */
    function adjustTileVisibility(boxCount) {
        const rows = document.querySelectorAll('.row');
        rows.forEach(row => {
            const tiles = row.querySelectorAll('.tile');
            tiles.forEach((tile, index) => {
                // Show only tiles up to boxCount, hide the rest
                tile.style.display = index < boxCount ? 'flex' : 'none';
            });
        });
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
        state.level = savedState.level || TeluguWordList.getLevel(); // Restore level
        
        console.log('Restoring game state with word:', state.targetWord);
        console.log('Word parts:', state.targetWordParts);
        
        // Update level in word list
        TeluguWordList.setLevel(state.level);
        
        // Update level UI
        updateLevelUI();

        // Use fixed box count based on level
        const boxCount = TeluguWordList.getLevelWordLength(state.level);
        adjustTileVisibility(boxCount);
        
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
     * @param {string} [composedtext] - Optional composed text for Telugu input
     */
    function handleKeyInput(input, composedtext) {
        console.log('Game received input:', input, composedtext);

        // Ignore input if game is not in playing state or if animation is in progress
        if (state.gameStatus !== 'playing' || state.revealingRow) {
            return;
        }
        
        // Handle special actions
        if (input === 'enter') {
            submitGuess();
        } else if (input === 'backspace') {
            deleteLetter();
        } else if (input === 'submit-composition' && composedtext) {
            console.log('Handling composed text:', composedtext);
            // Handle composed Telugu text
            addComposedText(composedtext);
        } else {
            // Handle character input
            addLetter(input);
        }
    }
    function handleKeyPress(key) {
        if (key === 'enter') {
            if (currentComposition) {
                handleKeyPress('submit-composition', currentComposition); // This calls itself recursively
            }
        }
    }
    /**
     * Add composed Telugu text to the current guess
     * @param {string} text - The composed Telugu text
     */
    function addComposedText(composedtext) {
        console.log('Adding composed text:', composedtext);
    
        // Split the text into proper Telugu characters
        const teluguUnits = TeluguUtils.splitTeluguWord(composedtext);
        console.log('Telugu units:', teluguUnits, 'count:', teluguUnits.length);
        // Get current word length for the selected level
        const currentLevelBoxCount = TeluguWordList.getLevelWordLength(TeluguWordList.getLevel());
        
        // Check if there's space for this composed text using the correct unit count
        if (teluguUnits.length > currentLevelBoxCount) {
            console.warn('Composed text too long for current level');
            console.warn(`Units: ${teluguUnits.length}, Level boxes: ${currentLevelBoxCount}`);
            showNotification('Text too long for this level');
            shakeCurrentRow();
            return;
        }
        
        // Set the current guess directly to the composed text
        state.currentGuess = composedtext;
        
        // Update the display to show the composed text
        updateCurrentRowWithComposedText(composedtext, teluguUnits);
        
        // Automatically submit the guess
        submitGuess();
    }
    
    // New function to update row with composed text
    function updateCurrentRowWithComposedText(rowIndex, teluguUnits, evaluation) {
        const currentRowIndex = state.currentRow;
        const rows = state.gameBoard.querySelectorAll('.row');
        
        if (currentRowIndex < 0 || currentRowIndex >= rows.length) {
            console.error('Invalid row index');
            return;
        }
        
        const currentRow = rows[currentRowIndex];
        if (!currentRow) {
            console.error('Current row element not found');
            return;
        }
        
        const tiles = currentRow.querySelectorAll('.tile');
        
        // Display each Telugu character as a single unit
        for (let i = 0; i < tiles.length; i++) {
            if (i < teluguUnits.length) {
                tiles[i].textContent = teluguUnits[i];
                tiles[i].classList.add('filled');
            } else {
                tiles[i].textContent = '';
                tiles[i].classList.remove('filled');
            }
        }
    }

    /**
     * Add a letter to the current guess
     * @param {string} letter - The letter to add
     */
    function addLetter(letter) {
        const currentGuessParts = TeluguUtils.splitTeluguWord(state.currentGuess);
        
        // Check if we've reached word length limit
        if (currentGuessParts.length >= CONFIG.WORD_LENGTH) {
            return;
        }
        
        // Add the letter to current guess
        state.currentGuess += letter;
        
        // Update the UI
        updateCurrentRow();
        
        // Save game state
        saveGameState();
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
        // Get current row element
        const currentRowIndex = state.currentRow;
        
        // Check if we have a valid row index
        if (currentRowIndex < 0 || currentRowIndex >= CONFIG.MAX_ATTEMPTS) {
            console.error('Invalid current row index:', currentRowIndex);
            return;
        }
        
        // Get all row elements
        const rows = state.gameBoard.querySelectorAll('.row');
        if (!rows || rows.length === 0) {
            console.error('No row elements found');
            return;
        }
        
        const currentRow = rows[currentRowIndex];
        if (!currentRow) {
            console.error('Current row element not found');
            return;
        }
        
        // Get all tiles in the current row
        const tiles = currentRow.querySelectorAll('.tile');
        if (!tiles || tiles.length === 0) {
            console.error('No tile elements found in current row');
            return;
        }
        
        // Update the tiles with the current guess
        const currentGuess = state.currentGuess || '';
        
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            if (i < currentGuess.length) {
                tile.textContent = currentGuess[i];
                tile.classList.add('filled');
            } else {
                tile.textContent = '';
                tile.classList.remove('filled');
            }
        }
    }
    
    /**
     * Submit the current guess
     */
    function submitGuess() {
        // Validate current guess
        if (!state.currentGuess) {
            showNotification('Please enter a word');
            shakeCurrentRow();
            return;
        }
        
        // Split into Telugu character units for proper counting
        const teluguUnits = TeluguUtils.splitTeluguWord(state.currentGuess);
        const currentLevelBoxCount = TeluguWordList.getLevelWordLength(state.level);
        
        // Check if the guess has the correct number of units
        if (teluguUnits.length !== currentLevelBoxCount) {
            showNotification(`Word must be ${currentLevelBoxCount} Telugu units`);
            shakeCurrentRow();
            return;
        }
        
        // Check if the word is valid
        if (!TeluguWordList.isValidWord(state.currentGuess)) {
            showNotification('Not in word list');
            shakeCurrentRow();
            return;
        }
        
        // Add the guess to the list
        state.guesses.push(state.currentGuess);
        
        // Evaluate the guess
        const evaluation = evaluateGuess(state.currentGuess);
        state.evaluations.push(evaluation);
        
        // Update the UI based on evaluation - pass the Telugu units
        updateRowWithEvaluation(state.currentRow, teluguUnits, evaluation);
        
        // Check if the game is won
        if (evaluation.every(e => e === 'correct')) {
            gameWon();
        } else if (state.currentRow >= CONFIG.MAX_ATTEMPTS - 1) {
            gameLost();
        } else {
            // Move to the next row
            state.currentRow++;
            state.currentGuess = '';
            updateCurrentRow();
        }
        
        // Save the game state
        saveGameState();
    }
    
    /**
     * Update a row with evaluation results
     * @param {number} rowIndex - The row index to update
     * @param {string} guess - The guess to display
     * @param {Array} evaluation - The evaluation results for each character
     */
    function updateRowWithEvaluation(rowIndex, teluguUnits, evaluation) {
        // Get the row element
        const rows = state.gameBoard.querySelectorAll('.row');
        if (rowIndex < 0 || rowIndex >= rows.length) {
            console.error('Invalid row index:', rowIndex);
            return;
        }
        
        const row = rows[rowIndex];
        const tiles = row.querySelectorAll('.tile');
        
        // Check if tiles and evaluation have the same length
        if (tiles.length < teluguUnits.length || evaluation.length !== teluguUnits.length) {
            console.error('Mismatch between tiles, units, and evaluation lengths');
            console.error('Tiles:', tiles.length, 'Units:', teluguUnits.length, 'Evaluation:', evaluation.length);
            return;
        }
        
        // Update each tile with its character and evaluation status
        for (let i = 0; i < teluguUnits.length; i++) {
            const tile = tiles[i];
            const unit = teluguUnits[i];
            const status = evaluation[i];
            
            // Set the character
            tile.textContent = unit;
            tile.classList.add('filled');
            
            // Set the evaluation status (with animation)
            setTimeout(() => {
                // Remove any previous status classes
                tile.classList.remove('correct', 'present', 'absent');
                
                // Add the appropriate status class
                tile.classList.add(status);
                
                // Update the keyboard key status
                if (TeluguKeyboard) {
                    TeluguKeyboard.updateKeyStatus(unit, status);
                }
            }, i * 250); // Stagger the reveal animation
        }
    }
    /**
     * Evaluate a guess against the target word
     * @param {string} guess - The guess to evaluate
     * @returns {Array} Array of evaluation results
     */
    function evaluateGuess(guess) {
        const evaluation = [];
        const targetChars = state.targetWord.split('');
        
        // Copy of target characters to track which have been matched
        const remainingTargetChars = [...targetChars];
        
        // First pass: find correct letters
        for (let i = 0; i < guess.length; i++) {
            const guessChar = guess[i];
            
            // Exact match (correct position)
            if (i < targetChars.length && guessChar === targetChars[i]) {
                evaluation[i] = 'correct';
                
                // Remove this character from remaining targets
                const index = remainingTargetChars.indexOf(guessChar);
                if (index !== -1) {
                    remainingTargetChars.splice(index, 1);
                }
            } else {
                evaluation[i] = null; // Placeholder for second pass
            }
        }
        
        // Second pass: find present letters
        for (let i = 0; i < guess.length; i++) {
            const guessChar = guess[i];
            
            // Skip already determined "correct" positions
            if (evaluation[i] === 'correct') {
                continue;
            }
            
            // Check if this character exists elsewhere in the target
            const index = remainingTargetChars.indexOf(guessChar);
            if (index !== -1) {
                // Character exists elsewhere (present)
                evaluation[i] = 'present';
                
                // Remove this character from remaining targets
                remainingTargetChars.splice(index, 1);
            } else {
                // Character doesn't exist (absent)
                evaluation[i] = 'absent';
            }
        }
        
        console.log('Evaluation:', guess, evaluation.join(', '));
        return evaluation;
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
            level: state.level // Save level
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
        const currentRowIndex = state.currentRow;
        const rows = state.gameBoard.querySelectorAll('.row');
        
        // Check if row exists
        if (currentRowIndex < 0 || currentRowIndex >= rows.length) {
            console.error('Invalid row index in shakeCurrentRow:', currentRowIndex);
            return;
        }
        
        const currentRow = rows[currentRowIndex];
        if (!currentRow) {
            console.error('Current row element not found in shakeCurrentRow');
            return;
        }
        
        // Apply shake animation
        currentRow.classList.add('shake');
        
        // Remove animation class after it completes
        setTimeout(() => {
            if (currentRow) {
                currentRow.classList.remove('shake');
            }
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

    /**
     * Change the game level
     * @param {number} level - The level to change to (1-4)
     */
    function changeLevel(level) {
        TeluguWordList.setLevel(level);
        
        startNewGame();
        updateLevelUI();
        
    }

    function gameLost(){
        //update game status
        state.gameStatus = 'lost';

        //save game state
        saveGameState();

        // Show game over message with the correct word
        const message = `Game Over! The word was: ${state.targetWord}`;
        showNotification(message, 5000); // Show for 5 seconds
        
        // Optional: Show a game over modal
        showGameOverModal(false, state.targetWord);
    }

    /**
     * Handle game won scenario
     */
    function gameWon() {
        // Update game status
        state.gameStatus = 'won';
        
        // Save game state
        saveGameState();
        
        // Show success message
        showNotification('Congratulations! You guessed the word!', 3000);
        
        // Optional: Show a victory modal
        showGameOverModal(true);
    }
    
    /**
     * Show game over modal
     * @param {boolean} won - Whether the player won or lost
     * @param {string} [correctWord] - The correct word (for lost games)
     */
    function showGameOverModal(won, correctWord = '') {
        // Create modal content
        let modalContent = '';
        
        if (won) {
            modalContent = `
                <h2>Congratulations!</h2>
                <p>You guessed the word in ${state.currentRow + 1} ${state.currentRow === 0 ? 'try' : 'tries'}!</p>
                <button id="new-game-btn" class="modal-button">New Game</button>
            `;
        } else {
            modalContent = `
                <h2>Game Over</h2>
                <p>The word was: <strong>${correctWord}</strong></p>
                <button id="new-game-btn" class="modal-button">New Game</button>
            `;
        }
        
        // Show the modal
        const modal = document.getElementById('game-over-modal') || createGameOverModal();
        modal.querySelector('.modal-content').innerHTML = modalContent;
        modal.style.display = 'flex';
        
        // Add event listener to new game button
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                startNewGame();
            });
        }
    }

    /**
     * Create game over modal if it doesn't exist
     * @returns {HTMLElement} The modal element
     */
    function createGameOverModal() {
        const modal = document.createElement('div');
        modal.id = 'game-over-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <!-- Content will be added dynamically -->
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    function setupCompactViewToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'compact-view-toggle';
        toggleButton.textContent = 'Compact View';
        toggleButton.className = 'mobile-only';
        
        const header = document.querySelector('header');
        header.after(toggleButton);
        
        let compactView = false;
        
        toggleButton.addEventListener('click', function() {
            compactView = !compactView;
            document.body.classList.toggle('compact-view', compactView);
            toggleButton.textContent = compactView ? 'Regular View' : 'Compact View';
        });
    }
    // Public API
    return {
        init,
        startNewGame,
        handleKeyInput,
        CONFIG
    };
})();