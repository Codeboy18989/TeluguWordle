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
        // Family & People
        'అమ్మా', // Mother
        'నాన్న', // Father
        'పిల్ల', // Child
        'అన్న', // Elder brother
        'అక్క', // Elder sister
        'తమ్ముడు', // Younger brother
        'చెల్లి', // Younger sister
        'తాత', // Grandfather
        'అమ్మమ్మ', // Grandmother
        'మామ', // Uncle
        'అత్త', // Aunt
        'మనుషు', // Person
        'మిత్రుడు', // Friend
        'శత్రువు', // Enemy

        // Body Parts
        'తల', // Head
        'చేతి', // Hand
        'కాలు', // Leg/Foot
        'ముక్కు', // Nose
        'చెవి', // Ear
        'కన్ను', // Eye
        'నోరు', // Mouth
        'దంతం', // Tooth
        'వేలు', // Finger
        'వెన్ను', // Back
        'మెడ', // Neck
        'గుండె', // Heart

        // Animals & Birds
        'కోడి', // Chicken
        'పాము', // Snake
        'పులి', // Tiger
        'ఏనుగు', // Elephant
        'కుక్క', // Dog
        'పిల్లి', // Cat
        'గొర్రె', // Sheep
        'ఆవు', // Cow
        'గేదె', // Buffalo
        'గుర్రం', // Horse
        'ఎలుక', // Mouse/Rat
        'కోతి', // Monkey
        'నక్క', // Fox
        'కాకి', // Crow
        'గువ్వ', // Pigeon
        'చిలుక', // Parrot
        'నెమలి', // Peacock
        'బాతు', // Duck
        'చేప', // Fish
        'తేలు', // Scorpion

        // Food & Drink
        'అన్నం', // Rice
        'రొట్టె', // Bread
        'పాలు', // Milk
        'నీరు', // Water
        'పండు', // Fruit
        'కూర', // Vegetable
        'మాంసం', // Meat
        'గుడ్డు', // Egg
        'పెసలు', // Dal/Lentils
        'చారు', // Soup
        'పెరుగు', // Curd/Yogurt
        'పప్పు', // Lentils
        'ఉప్పు', // Salt
        'చెక్కెర', // Sugar
        'తేనె', // Honey
        'నూనె', // Oil

        // Places & Buildings
        'ఇల్లు', // House
        'గుడి', // Temple
        'ఊరు', // Village/Town
        'నగరం', // City
        'దేశం', // Country
        'తోట', // Garden
        'అడవి', // Forest
        'పర్వతం', // Mountain
        'నది', // River
        'సముద్రం', // Ocean
        'దుకాణం', // Shop
        'పాఠశాల', // School
        'ఆసుపత్రి', // Hospital
        'బజారు', // Market
        'రహదారి', // Road
        'వంతెన', // Bridge

        // Objects & Things
        'పుస్తకం', // Book
        'పేపర్', // Paper
        'పెన్ను', // Pen
        'కత్తి', // Knife
        'గాజు', // Glass
        'తలుపు', // Door
        'కిటికీ', // Window
        'మంచం', // Bed
        'కుర్చీ', // Chair
        'బల్ల', // Table
        'దీపం', // Lamp
        'బట్ట', // Cloth
        'దారం', // Thread
        'సూది', // Needle
        'కర్ర', // Stick/Wood
        'రాయి', // Stone
        'ఇసుక', // Sand

        // Vehicles & Transport
        'రైలు', // Train
        'బస్సు', // Bus
        'కారు', // Car
        'విమానం', // Airplane
        'పడవ', // Boat
        'సైకిలు', // Bicycle

        // Nature & Weather
        'సూర్యుడు', // Sun
        'చంద్రుడు', // Moon
        'నక్షత్రం', // Star
        'మేఘం', // Cloud
        'వర్షం', // Rain
        'గాలి', // Wind
        'మంచు', // Snow/Ice
        'ఉరుము', // Thunder
        'మెరుపు', // Lightning
        'మంట', // Fire
        'పొగ', // Smoke
        'నీడ', // Shadow
        'చెట్టు', // Tree
        'పువ్వు', // Flower
        'ఆకు', // Leaf
        'కొమ్మ', // Branch
        'వేరు', // Root

        // Qualities & Adjectives
        'మంచి', // Good
        'చెడు', // Bad
        'పెద్ద', // Big
        'చిన్న', // Small
        'కొత్త', // New
        'పాత', // Old
        'పొడవు', // Long
        'పొట్టి', // Short
        'సన్ను', // Thin
        'దట్టం', // Thick
        'తెలుపు', // White
        'నలుపు', // Black
        'ఎరుపు', // Red
        'పచ్చ', // Green
        'నీలం', // Blue
        'పసుపు', // Yellow
        'వెచ్చ', // Warm
        'చల్లని', // Cold
        'తీపి', // Sweet
        'చేదు', // Bitter
        'పులుపు', // Sour

        // Actions & Concepts
        'పాట', // Song
        'నాట్యం', // Dance
        'కథ', // Story
        'చదువు', // Education
        'వంట', // Cooking
        'ఆట', // Game/Play
        'పని', // Work
        'విశ్రాంతి', // Rest
        'నిద్ర', // Sleep
        'కల', // Dream
        'ఆలోచన', // Thought
        'ప్రేమ', // Love
        'ద్వేషం', // Hate
        'ఆశ', // Hope
        'భయం', // Fear
        'కోపం', // Anger
        'సంతోషం', // Happiness
        'దుఃఖం', // Sorrow
        'శాంతి', // Peace
        'యుద్ధం', // War

        // Time & Direction
        'ఇప్పుడు', // Now
        'మొన్న', // Day before yesterday
        'నిన్న', // Yesterday
        'ఈరోజు', // Today
        'రేపు', // Tomorrow
        'ఉదయం', // Morning
        'మధ్యాహ్నం', // Afternoon
        'సాయంత్రం', // Evening
        'రాత్రి', // Night
        'గంట', // Hour
        'నిమిషం', // Minute
        'రోజు', // Day
        'వారం', // Week
        'నెల', // Month
        'సంవత్సరం', // Year
        'ముందు', // Front/Before
        'వెనక', // Back/Behind
        'పైన', // Above/Up
        'క్రింద', // Below/Down
        'లోపల', // Inside
        'వెలుపల', // Outside

        // Grammar & Pronouns
        'నేను', // I
        'నువ్వు', // You (informal)
        'మీరు', // You (formal/plural)
        'అతను', // He
        'ఆమె', // She
        'అది', // It/That
        'ఇది', // This
        'మనం', // We (inclusive)
        'మేము', // We (exclusive)
        'మీవు', // You all
        'వారు', // They
        'ఆయన', // He (respectful)
        'ఆవిడ', // She (respectful)
        'ఏది', // Which

        // Connectors & Others
        'మరి', // And/Then
        'కాని', // But
        'కనుక', // Therefore
        'లేదా', // Or
        'తెలుగు', // Telugu
        'భాష', // Language
        'పదం', // Word
        'వాక్యం', // Sentence
        'అర్థం', // Meaning
        'ప్రాణం', // Life
        'మరణం', // Death
        'జన్మ', // Birth
        'పేరు', // Name
        'రంగు', // Color
        'సంఖ్య', // Number
        'లెక్క', // Count/Account
        'పాఠం', // Lesson
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
        // Family & People (Common words)
        'అమ్మా', // Mother
        'నాన్న', // Father
        'పిల్ల', // Child
        'అన్న', // Elder brother
        'అక్క', // Elder sister
        'తాత', // Grandfather
        'మామ', // Uncle
        'అత్త', // Aunt
        'మనుషు', // Person

        // Body Parts
        'తల', // Head
        'చేతి', // Hand
        'కాలు', // Leg/Foot
        'ముక్కు', // Nose
        'చెవి', // Ear
        'కన్ను', // Eye
        'నోరు', // Mouth
        'వేలు', // Finger
        'మెడ', // Neck

        // Animals & Birds (Common)
        'కోడి', // Chicken
        'పాము', // Snake
        'పులి', // Tiger
        'కుక్క', // Dog
        'పిల్లి', // Cat
        'ఆవు', // Cow
        'గుర్రం', // Horse
        'ఎలుక', // Mouse/Rat
        'కోతి', // Monkey
        'నక్క', // Fox
        'కాకి', // Crow
        'గువ్వ', // Pigeon
        'చిలుక', // Parrot
        'బాతు', // Duck
        'చేప', // Fish

        // Food & Drink (Common)
        'అన్నం', // Rice
        'రొట్టె', // Bread
        'పాలు', // Milk
        'నీరు', // Water
        'పండు', // Fruit
        'కూర', // Vegetable
        'మాంసం', // Meat
        'గుడ్డు', // Egg
        'పెరుగు', // Curd/Yogurt
        'పప్పు', // Lentils
        'ఉప్పు', // Salt
        'తేనె', // Honey
        'నూనె', // Oil

        // Places & Buildings
        'ఇల్లు', // House
        'గుడి', // Temple
        'ఊరు', // Village/Town
        'నగరం', // City
        'దేశం', // Country
        'తోట', // Garden
        'అడవి', // Forest
        'నది', // River
        'బజారు', // Market

        // Objects & Things (Common)
        'పుస్తకం', // Book
        'పేపర్', // Paper
        'పెన్ను', // Pen
        'కత్తి', // Knife
        'గాజు', // Glass
        'తలుపు', // Door
        'మంచం', // Bed
        'కుర్చీ', // Chair
        'బల్ల', // Table
        'దీపం', // Lamp
        'బట్ట', // Cloth
        'దారం', // Thread
        'సూది', // Needle
        'కర్ర', // Stick/Wood
        'రాయి', // Stone
        'ఇసుక', // Sand

        // Vehicles & Transport
        'రైలు', // Train
        'బస్సు', // Bus
        'కారు', // Car
        'పడవ', // Boat

        // Nature & Weather
        'మేఘం', // Cloud
        'వర్షం', // Rain
        'గాలి', // Wind
        'మంచు', // Snow/Ice
        'మంట', // Fire
        'పొగ', // Smoke
        'నీడ', // Shadow
        'చెట్టు', // Tree
        'పువ్వు', // Flower
        'ఆకు', // Leaf
        'కొమ్మ', // Branch
        'వేరు', // Root

        // Qualities & Adjectives (Common)
        'మంచి', // Good
        'చెడు', // Bad
        'పెద్ద', // Big
        'చిన్న', // Small
        'కొత్త', // New
        'పాత', // Old
        'పొడవు', // Long
        'తెలుపు', // White
        'నలుపు', // Black
        'ఎరుపు', // Red
        'పచ్చ', // Green
        'నీలం', // Blue
        'పసుపు', // Yellow
        'తీపి', // Sweet
        'చేదు', // Bitter

        // Actions & Concepts (Common)
        'పాట', // Song
        'కథ', // Story
        'చదువు', // Education
        'వంట', // Cooking
        'ఆట', // Game/Play
        'పని', // Work
        'నిద్ర', // Sleep
        'కల', // Dream
        'ప్రేమ', // Love
        'ఆశ', // Hope
        'భయం', // Fear
        'కోపం', // Anger
        'శాంతి', // Peace

        // Time & Direction (Common)
        'ఇప్పుడు', // Now
        'నిన్న', // Yesterday
        'ఈరోజు', // Today
        'రేపు', // Tomorrow
        'ఉదయం', // Morning
        'రాత్రి', // Night
        'గంట', // Hour
        'రోజు', // Day
        'వారం', // Week
        'నెల', // Month
        'ముందు', // Front/Before
        'వెనక', // Back/Behind
        'పైన', // Above/Up
        'క్రింద', // Below/Down
        'లోపల', // Inside

        // Grammar & Pronouns
        'నేను', // I
        'నువ్వు', // You (informal)
        'మీరు', // You (formal/plural)
        'అతను', // He
        'ఆమె', // She
        'అది', // It/That
        'ఇది', // This
        'మనం', // We (inclusive)
        'మేము', // We (exclusive)
        'వారు', // They
        'ఆయన', // He (respectful)
        'ఆవిడ', // She (respectful)

        // Connectors & Others
        'మరి', // And/Then
        'కాని', // But
        'కనుక', // Therefore
        'తెలుగు', // Telugu
        'భాష', // Language
        'పదం', // Word
        'అర్థం', // Meaning
        'ప్రాణం', // Life
        'జన్మ', // Birth
        'పేరు', // Name
        'రంగు', // Color
        'పాఠం', // Lesson
    ];
    // Add this constant for the localStorage key
    const DAILY_WORDS_KEY = 'telugu_wordle_daily_words';
    
    // Replace or update your existing getRandomWord function with this:
    function getRandomWord() {
        // Check if there's a daily word set for today
        const dailyWord = getTodaysWord();
        if (dailyWord) {
            console.log("Using daily word:", dailyWord);
            return dailyWord;
        }
        
        // If no daily word, select a random one
        const randomIndex = Math.floor(Math.random() * targetWordList.length);
        return targetWordList[randomIndex];
    }
    // Add this new function to get today's word
    function getTodaysWord() {
        try {
            const dailyWordsJson = localStorage.getItem(DAILY_WORDS_KEY);
            if (!dailyWordsJson) return null;
            
            const dailyWords = JSON.parse(dailyWordsJson);
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            
            return dailyWords[today] || null;
        } catch (e) {
            console.error("Error getting today's word:", e);
            return null;
        }
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
        getWordCount,
        getTodaysWord
    };
})();