/**
 * Telugu-Utils.js
 * Utility functions and data structures for handling Telugu script in the Wordle game.
 */

const TeluguUtils = (function() {
    // Telugu vowels (అచ్చులు)
    const vowels = {
        // Independent vowels
        'అ': { type: 'vowel', transliteration: 'a', code: '\u0C05' },
        'ఆ': { type: 'vowel', transliteration: 'aa', code: '\u0C06' },
        'ఇ': { type: 'vowel', transliteration: 'i', code: '\u0C07' },
        'ఈ': { type: 'vowel', transliteration: 'ii', code: '\u0C08' },
        'ఉ': { type: 'vowel', transliteration: 'u', code: '\u0C09' },
        'ఊ': { type: 'vowel', transliteration: 'uu', code: '\u0C0A' },
        'ఋ': { type: 'vowel', transliteration: 'ru', code: '\u0C0B' },
        'ౠ': { type: 'vowel', transliteration: 'ruu', code: '\u0C60' },
        'ఌ': { type: 'vowel', transliteration: 'lu', code: '\u0C0C' },
        'ౡ': { type: 'vowel', transliteration: 'luu', code: '\u0C61' },
        'ఎ': { type: 'vowel', transliteration: 'e', code: '\u0C0E' },
        'ఏ': { type: 'vowel', transliteration: 'ee', code: '\u0C0F' },
        'ఐ': { type: 'vowel', transliteration: 'ai', code: '\u0C10' },
        'ఒ': { type: 'vowel', transliteration: 'o', code: '\u0C12' },
        'ఓ': { type: 'vowel', transliteration: 'oo', code: '\u0C13' },
        'ఔ': { type: 'vowel', transliteration: 'au', code: '\u0C14' },
        'అం': { type: 'vowel', transliteration: 'am', code: '\u0C05\u0C02' },
        'అః': { type: 'vowel', transliteration: 'aha', code: '\u0C05\u0C03' }
    };

    // Vowel diacritics (గుణింతాలు)
    const vowelDiacritics = {
        'ా': { baseVowel: 'ఆ', transliteration: 'aa', code: '\u0C3E' },
        'ి': { baseVowel: 'ఇ', transliteration: 'i', code: '\u0C3F' },
        'ీ': { baseVowel: 'ఈ', transliteration: 'ii', code: '\u0C40' },
        'ు': { baseVowel: 'ఉ', transliteration: 'u', code: '\u0C41' },
        'ూ': { baseVowel: 'ఊ', transliteration: 'uu', code: '\u0C42' },
        'ృ': { baseVowel: 'ఋ', transliteration: 'ru', code: '\u0C43' },
        'ౄ': { baseVowel: 'ౠ', transliteration: 'ruu', code: '\u0C44' },
        'ౢ': { baseVowel: 'ఌ', transliteration: 'lu', code: '\u0C62' },
        'ౣ': { baseVowel: 'ౡ', transliteration: 'luu', code: '\u0C63' },
        'ె': { baseVowel: 'ఎ', transliteration: 'e', code: '\u0C46' },
        'ే': { baseVowel: 'ఏ', transliteration: 'ee', code: '\u0C47' },
        'ై': { baseVowel: 'ఐ', transliteration: 'ai', code: '\u0C48' },
        'ొ': { baseVowel: 'ఒ', transliteration: 'o', code: '\u0C4A' },
        'ో': { baseVowel: 'ఓ', transliteration: 'oo', code: '\u0C4B' },
        'ౌ': { baseVowel: 'ఔ', transliteration: 'au', code: '\u0C4C' },
        'ం': { baseVowel: 'అం', transliteration: 'am', code: '\u0C02' },  // Anusvara
        'ః': { baseVowel: 'అః', transliteration: 'aha', code: '\u0C03' }  // Visarga
    };

    // Special modifiers
    const specialModifiers = {
        '్': { type: 'virama', transliteration: '', code: '\u0C4D' }, // Virama/Pollu - Suppresses inherent vowel
        '్‌': { type: 'zwnj', transliteration: '', code: '\u0C4D\u200C' }, // Virama + ZWNJ
        '్‍': { type: 'zwj', transliteration: '', code: '\u0C4D\u200D' }  // Virama + ZWJ
    };

    // Telugu consonants (హల్లులు)
    const consonants = {
        'క': { type: 'consonant', transliteration: 'ka', code: '\u0C15' },
        'ఖ': { type: 'consonant', transliteration: 'kha', code: '\u0C16' },
        'గ': { type: 'consonant', transliteration: 'ga', code: '\u0C17' },
        'ఘ': { type: 'consonant', transliteration: 'gha', code: '\u0C18' },
        'ఙ': { type: 'consonant', transliteration: 'nga', code: '\u0C19' },
        'చ': { type: 'consonant', transliteration: 'cha', code: '\u0C1A' },
        'ఛ': { type: 'consonant', transliteration: 'chha', code: '\u0C1B' },
        'జ': { type: 'consonant', transliteration: 'ja', code: '\u0C1C' },
        'ఝ': { type: 'consonant', transliteration: 'jha', code: '\u0C1D' },
        'ఞ': { type: 'consonant', transliteration: 'nya', code: '\u0C1E' },
        'ట': { type: 'consonant', transliteration: 'ta', code: '\u0C1F' },
        'ఠ': { type: 'consonant', transliteration: 'tha', code: '\u0C20' },
        'డ': { type: 'consonant', transliteration: 'da', code: '\u0C21' },
        'ఢ': { type: 'consonant', transliteration: 'dha', code: '\u0C22' },
        'ణ': { type: 'consonant', transliteration: 'na', code: '\u0C23' },
        'త': { type: 'consonant', transliteration: 'ta', code: '\u0C24' },
        'థ': { type: 'consonant', transliteration: 'tha', code: '\u0C25' },
        'ద': { type: 'consonant', transliteration: 'da', code: '\u0C26' },
        'ధ': { type: 'consonant', transliteration: 'dha', code: '\u0C27' },
        'న': { type: 'consonant', transliteration: 'na', code: '\u0C28' },
        'ప': { type: 'consonant', transliteration: 'pa', code: '\u0C2A' },
        'ఫ': { type: 'consonant', transliteration: 'pha', code: '\u0C2B' },
        'బ': { type: 'consonant', transliteration: 'ba', code: '\u0C2C' },
        'భ': { type: 'consonant', transliteration: 'bha', code: '\u0C2D' },
        'మ': { type: 'consonant', transliteration: 'ma', code: '\u0C2E' },
        'య': { type: 'consonant', transliteration: 'ya', code: '\u0C2F' },
        'ర': { type: 'consonant', transliteration: 'ra', code: '\u0C30' },
        'ఱ': { type: 'consonant', transliteration: 'rra', code: '\u0C31' }, // RRA
        'ల': { type: 'consonant', transliteration: 'la', code: '\u0C32' },
        'ళ': { type: 'consonant', transliteration: 'lla', code: '\u0C33' }, // LLA
        'వ': { type: 'consonant', transliteration: 'va', code: '\u0C35' },
        'శ': { type: 'consonant', transliteration: 'sha', code: '\u0C36' },
        'ష': { type: 'consonant', transliteration: 'sha', code: '\u0C37' },
        'స': { type: 'consonant', transliteration: 'sa', code: '\u0C38' },
        'హ': { type: 'consonant', transliteration: 'ha', code: '\u0C39' },
        'క్ష': { type: 'consonant', transliteration: 'ksha', code: '\u0C15\u0C4D\u0C37' }, // Special compound
        'ఋ': { type: 'both', transliteration: 'ru', code: '\u0C0B' } // Treated as both vowel and consonant in some contexts
    };

    // Common telugu digits
    const digits = {
        '౦': { value: 0, code: '\u0C66' },
        '౧': { value: 1, code: '\u0C67' },
        '౨': { value: 2, code: '\u0C68' },
        '౩': { value: 3, code: '\u0C69' },
        '౪': { value: 4, code: '\u0C6A' },
        '౫': { value: 5, code: '\u0C6B' },
        '౬': { value: 6, code: '\u0C6C' },
        '౭': { value: 7, code: '\u0C6D' },
        '౮': { value: 8, code: '\u0C6E' },
        '౯': { value: 9, code: '\u0C6F' }
    };

    // Helper function to check if a character is a vowel
    function isVowel(char) {
        return vowels.hasOwnProperty(char);
    }

    // Helper function to check if a character is a consonant
    function isConsonant(char) {
        return consonants.hasOwnProperty(char);
    }

    // Helper function to check if a character is a vowel diacritic
    function isVowelDiacritic(char) {
        return vowelDiacritics.hasOwnProperty(char);
    }

    // Helper function to check if a character is Virama (Pollu)
    function isVirama(char) {
        return char === '్';
    }

    // Helper function to normalize Telugu text (handle special cases and conjuncts)
    function normalizeTeluguText(text) {
        // Replace any zero-width characters if they're standing alone
        text = text.replace(/[\u200C\u200D]/g, '');
        
        // Handle other normalization if needed
        return text;
    }

    // Generate all possible consonant-vowel combinations
    function generateConsonantVowelCombinations() {
        const combinations = {};
        
        for (const consonant in consonants) {
            if (consonants.hasOwnProperty(consonant)) {
                // Base consonant with inherent 'a' sound
                combinations[consonant] = consonant;
                
                // Consonant with various vowel diacritics
                for (const diacritic in vowelDiacritics) {
                    if (vowelDiacritics.hasOwnProperty(diacritic)) {
                        // Skip some uncommon combinations
                        combinations[consonant + diacritic] = consonant + diacritic;
                    }
                }
                
                // Consonant with virama (no vowel)
                combinations[consonant + '్'] = consonant + '్';
            }
        }
        
        return combinations;
    }

    // Split a Telugu word into its constituent parts for game logic
    function splitTeluguWord(word) {
        // This is a more linguistically accurate approach
        const syllabicUnits = [];
        let currentUnit = '';
        let i = 0;
        
        while (i < word.length) {
            const char = word[i];
            
            // If it's an independent vowel or consonant, start a new unit
            if (isIndependentVowel(char) || isConsonant(char)) {
                // If we already have a unit, push it
                if (currentUnit) {
                    syllabicUnits.push(currentUnit);
                    currentUnit = '';
                }
                
                // Start new unit with this character
                currentUnit = char;
                
                // Look ahead for vowel marks or virama that modify this character
                let j = i + 1;
                while (j < word.length && (isVowelMark(word[j]) || isVirama(word[j]))) {
                    currentUnit += word[j];
                    j++;
                }
                
                // If we found a virama followed by another consonant, this is a conjunct
                // and should be treated as a single unit
                if (j < word.length && currentUnit.endsWith('్') && isConsonant(word[j])) {
                    currentUnit += word[j];
                    
                    // Look ahead for any vowel marks on the second consonant
                    j++;
                    while (j < word.length && isVowelMark(word[j])) {
                        currentUnit += word[j];
                        j++;
                    }
                }
                
                i = j - 1; // Adjust main loop counter (will be incremented at end of loop)
            } else {
                // For any other characters (punctuation, etc.)
                if (currentUnit) {
                    syllabicUnits.push(currentUnit);
                }
                currentUnit = char;
            }
            
            i++;
        }
        
        // Add the last unit if any
        if (currentUnit) {
            syllabicUnits.push(currentUnit);
        }
        
        return syllabicUnits;
    }

    // Compare two Telugu characters (or character combinations) for equality
    function compareTeluguChars(char1, char2) {
        // Normalize both characters first
        const norm1 = normalizeTeluguText(char1);
        const norm2 = normalizeTeluguText(char2);
        
        return norm1 === norm2;
    }

    // Get all Telugu characters for keyboard layout
    function getAllTeluguChars() {
        const allChars = {
            vowels: Object.keys(vowels),
            consonants: Object.keys(consonants),
            vowelDiacritics: Object.keys(vowelDiacritics),
            combinations: generateConsonantVowelCombinations()
        };
        
        return allChars;
    }

    // Public API
    return {
        vowels,
        consonants,
        vowelDiacritics,
        specialModifiers,
        isVowel,
        isConsonant,
        isVowelDiacritic,
        isVirama,
        normalizeTeluguText,
        splitTeluguWord,
        compareTeluguChars,
        getAllTeluguChars,
        generateConsonantVowelCombinations
    };
})();