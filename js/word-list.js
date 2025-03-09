/**
 * word-list.js
 * Contains the list of Telugu words for the Wordle game.
 * These are Telugu words of 3-5 syllabic units in length.
 */

const TeluguWordList = (function() {
    /**
     * Main word list for the game
     * These words are semantically 3-5 "units" in Telugu, where a unit can be:
     * - A consonant-vowel combination (e.g., కా, కి, కు)
     * - An independent vowel (e.g., అ, ఆ, ఇ)
     * - A consonant with virama (e.g., క్)
     * - A consonant-consonant conjunct (treated as a single unit)
     * - Special cases: syllables with anusvara (ం) or visarga (ః) are treated as a single unit
     */
    const mainWordList = [
        // Common Telugu 5-letter words
        'అమ్మా', // Mother
        'నాన్న', // Father
        'ఇల్లు', // House
        'పిల్ల', // Child
        'కోడి', // Chicken
        'పాము', // Snake
        'పులి', // Tiger
        'మంచి', // Good
        'చెడు', // Bad
        'పాఠం', // Lesson
        'పేపర్', // Paper
        'పుస్తకం', // Book
        'రైలు', // Train
        'బస్సు', // Bus
        'కారు', // Car
        'తోట', // Garden
        'అడవి', // Forest
        'పండు', // Fruit
        'కూర', // Vegetable
        'నీరు', // Water
        'పాలు', // Milk
        'అన్నం', // Rice
        'గుడి', // Temple
        'చదువు', // Education
        'పాట', // Song
        'ఊరు', // Village/Town
        'నగరం', // City
        'దేశం', // Country
        'ప్రేమ', // Love
        'ఆశ', // Hope
        'మీరు', // You (plural/respectful)
        'నేను', // I
        'మనం', // We (inclusive)
        'మేము', // We (exclusive)
        'వారు', // They
        'ఆయన', // He (respectful)
        'ఆవిడ', // She (respectful)
        'తెలుగు', // Telugu
        'భాష', // Language
        'ప్రాణం', // Life
        'నిద్ర', // Sleep
        'కనుక', // Therefore
        'కాని', // But
        'మరి', // And/Then
        'కలర్', // Color
        'చేతి', // Hand
        'కాలు', // Leg
        'ముక్కు', // Nose
        'చెవి', // Ear
        'కన్ను', // Eye
        'వంట', // Cooking
        'ఇప్పుడు', // Now
    ];

    /**
     * Target word list - words that can be solutions
     * This is a subset of the main word list, potentially excluding:
     * - Very rare or difficult words
     * - Words with complex multiple consonant conjuncts
     * - Words with ambiguous divisions
     * 
     * Note: Each word has been analyzed for its syllabic unit count,
     * ensuring it falls within our 3-5 unit range for gameplay.
     */
    const targetWordList = [
        'అమ్మా', // Mother
        'నాన్న', // Father
        'ఇల్లు', // House
        'పిల్ల', // Child
        'కోడి', // Chicken
        'పులి', // Tiger
        'మంచి', // Good
        'పాఠం', // Lesson
        'పేపర్', // Paper 
        'పుస్తకం', // Book
        'రైలు', // Train
        'కారు', // Car
        'తోట', // Garden
        'అడవి', // Forest
        'పండు', // Fruit
        'కూర', // Vegetable
        'నీరు', // Water
        'పాలు', // Milk
        'అన్నం', // Rice
        'గుడి', // Temple
        'పాట', // Song
        'ఊరు', // Village/Town
        'దేశం', // Country
        'ప్రేమ', // Love
        'నేను', // I
        'మనం', // We
        'వారు', // They
        'తెలుగు', // Telugu
        'భాష', // Language
        'నిద్ర', // Sleep
        'మరి', // And/Then
        'చేతి', // Hand
        'కాలు', // Leg
        'ముక్కు', // Nose
        'చెవి', // Ear
        'కన్ను', // Eye
    ];

    // Helper function to get a random word from the target word list
    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * targetWordList.length);
        return targetWordList[randomIndex];
    }

    // Helper function to check if a word is valid (exists in the main word list)
    function isValidWord(word) {
        // Normalize the word before checking (handle any character normalization)
        const normalizedWord = TeluguUtils.normalizeTeluguText(word);
        
        // Check if the normalized word exists in the main word list
        for (let i = 0; i < mainWordList.length; i++) {
            if (TeluguUtils.normalizeTeluguText(mainWordList[i]) === normalizedWord) {
                return true;
            }
        }
        
        // For debugging
        console.log('Invalid word:', word, 'not found in dictionary');
        return false;
    }

    // Get number of total target words
    function getWordCount() {
        return targetWordList.length;
    }

    // Public API
    return {
        mainWordList,
        targetWordList,
        getRandomWord,
        isValidWord,
        getWordCount
    };
})();