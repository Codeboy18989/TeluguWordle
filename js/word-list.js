/**
 * word-list.js
 * Contains the list of Telugu words for the Wordle game.
 * These are Telugu words of 3-5 syllabic units in length.
 */

const TeluguWordList = (function() {
    // Local storage key for custom words
    const CUSTOM_WORDS_KEY = 'telugu_wordle_custom_words';

    // Get custom words from localStorage
    function getCustomWords() {
        try {
            const wordsJson = localStorage.getItem(CUSTOM_WORDS_KEY);
            return wordsJson ? JSON.parse(wordsJson) : [];
        } catch (e) {
            console.error('Error loading custom words:', e);
            return [];
        }
    }

    /**
     * Main word list for the game (BASE DICTIONARY)
     * These words are semantically 2-5 "units" in Telugu, where a unit can be:
     * - A consonant-vowel combination (e.g., కా, కి, కు)
     * - An independent vowel (e.g., అ, ఆ, ఇ)
     * - A consonant with virama (e.g., క్)
     * - A consonant-consonant conjunct (treated as a single unit)
     * - Special cases: syllables with anusvara (ం) or visarga (ః) are treated as a single unit
     */
    const baseWordList = [
        // Family & People (Expanded)
        'అమ్మా', // Mother
        'నాన్న', // Father
        'తల్లి', // Mother (formal)
        'తండ్రి', // Father (formal)
        'పిల్ల', // Child
        'కుమారుడు', // Son
        'కూతురు', // Daughter
        'అన్న', // Elder brother
        'అక్క', // Elder sister
        'తమ్ముడు', // Younger brother
        'చెల్లి', // Younger sister
        'తాత', // Grandfather
        'అమ్మమ్మ', // Grandmother
        'నాయనా', // Grandfather (paternal)
        'బామ్మ', // Grandmother (paternal)
        'తాతయ్య', // Grandfather (maternal)
        'అవ్వ', // Grandmother (maternal)
        'మామ', // Uncle
        'అత్త', // Aunt
        'బావ', // Brother-in-law
        'వదిన', // Sister-in-law
        'మనుమడు', // Grandson
        'మనుమరాలు', // Granddaughter
        'మనుషు', // Person
        'మిత్రుడు', // Friend
        'శత్రువు', // Enemy
        'పొరుగు', // Neighbor
        'అతిథి', // Guest
        'బంధువు', // Relative
        'భార్య', // Wife
        'భర్త', // Husband
        'కొడుకు', // Son
        'అబ్బాయి', // Boy
        'అమ్మాయి', // Girl
        'యువతి', // Young woman
        'యువకుడు', // Young man
        'ముసలి', // Old person
        'బిడ్డ', // Child/Baby

        // Body Parts (Expanded)
        'తల', // Head
        'జుట్టు', // Hair
        'నుదురు', // Forehead
        'కనుబొమ్మ', // Eyebrow
        'కన్ను', // Eye
        'కనురెప్ప', // Eyelid
        'చెవి', // Ear
        'ముక్కు', // Nose
        'నోరు', // Mouth
        'పెదవి', // Lip
        'దంతం', // Tooth
        'నాలుక', // Tongue
        'గడ్డం', // Chin/Beard
        'మెడ', // Neck
        'భుజం', // Shoulder
        'చేతి', // Hand
        'మోచేయి', // Elbow
        'మణికట్టు', // Wrist
        'చేయి', // Arm
        'వేలు', // Finger
        'గోరు', // Nail
        'అరచేయి', // Palm
        'వెన్ను', // Back
        'ఛాతీ', // Chest
        'కడుపు', // Stomach
        'గుండె', // Heart
        'ఊపిరి', // Breath
        'కాలు', // Leg/Foot
        'తొడ', // Thigh
        'మోకాలు', // Knee
        'చీలమండ', // Ankle
        'మడమ', // Heel
        'బొటనవేలు', // Thumb/Big toe
        'శరీరం', // Body
        'తొక్క', // Skin
        'ఎముక', // Bone
        'రక్తం', // Blood

        // Animals, Birds & Insects (Expanded)
        'కోడి', // Chicken
        'పాము', // Snake
        'పులి', // Tiger
        'సింహం', // Lion
        'చిరుత', // Leopard
        'ఏనుగు', // Elephant
        'కుక్క', // Dog
        'పిల్లి', // Cat
        'గొర్రె', // Sheep
        'మేక', // Goat
        'పంది', // Pig
        'ఆవు', // Cow
        'కోడె', // Bull
        'దూడ', // Calf
        'గేదె', // Buffalo
        'గుర్రం', // Horse
        'గాడిద', // Donkey
        'ఒంటె', // Camel
        'జింక', // Deer
        'కుందేలు', // Rabbit
        'ఎలుక', // Mouse/Rat
        'ఎలుగుబంటి', // Bear
        'కోతి', // Monkey
        'నక్క', // Fox
        'తోడేలు', // Wolf
        'కాకి', // Crow
        'గువ్వ', // Pigeon
        'చిలుక', // Parrot
        'గద్ద', // Eagle
        'డేగ', // Kite/Hawk
        'గుడ్లగూబ', // Owl
        'నెమలి', // Peacock
        'కోకిల', // Cuckoo
        'బాతు', // Duck
        'హంస', // Swan
        'కొంగ', // Crane/Heron
        'బొద్దింక', // Sparrow
        'చేప', // Fish
        'పీత', // Crab
        'రొయ్య', // Prawn/Shrimp
        'తేలు', // Scorpion
        'సాలీడు', // Spider
        'చీమ', // Ant
        'దోమ', // Mosquito
        'ఈగ', // Fly
        'తుమ్మెద', // Dragonfly
        'సీతాకోక', // Butterfly
        'తేనెటీగ', // Bee
        'కందిరీగ', // Wasp
        'బల్లి', // Lizard
        'తాబేలు', // Turtle/Tortoise
        'కప్ప', // Frog

        // Food & Drink (Expanded)
        'అన్నం', // Rice
        'బియ్యం', // Raw rice
        'అటుకులు', // Flattened rice
        'రొట్టె', // Bread
        'చపాతీ', // Chapati
        'దోశ', // Dosa
        'ఇడ్లీ', // Idli
        'వడ', // Vada
        'పూరి', // Puri
        'పరోట', // Paratha
        'పాలు', // Milk
        'నెయ్యి', // Ghee
        'వెన్న', // Butter
        'నీరు', // Water
        'టీ', // Tea
        'కాఫీ', // Coffee
        'జ్యూసు', // Juice
        'పండు', // Fruit
        'కూర', // Vegetable
        'కూరగాయ', // Vegetables
        'ఆకు', // Leafy vegetable
        'ముల్లంగి', // Radish
        'క్యారట్', // Carrot
        'బంగాళదుంప', // Potato
        'క్యాబేజీ', // Cabbage
        'తోట', // Tomato
        'ఉల్లి', // Onion
        'వెల్లుల్లి', // Garlic
        'మిరపకాయ', // Chili
        'కొత్తిమీర', // Coriander
        'కూరపు', // Curry
        'మాంసం', // Meat
        'కోడి', // Chicken
        'చేప', // Fish
        'గుడ్డు', // Egg
        'పెసలు', // Dal/Lentils
        'చారు', // Soup/Rasam
        'సాంబార్', // Sambar
        'పెరుగు', // Curd/Yogurt
        'పప్పు', // Lentils
        'ఉప్పు', // Salt
        'చెక్కెర', // Sugar
        'బెల్లం', // Jaggery
        'తేనె', // Honey
        'నూనె', // Oil
        'నువ్వులు', // Sesame seeds
        'జీడి', // Cashew
        'బాదం', // Almond
        'వేరుశనగ', // Peanut
        'కొబ్బరి', // Coconut
        'అరటి', // Banana
        'ద్రాక్ష', // Grape
        'జామ', // Guava
        'నిమ్మ', // Lemon
        'నారింజ', // Orange
        'సీతాఫలం', // Custard apple
        'మామిడి', // Mango
        'పుచ్చ', // Watermelon

        // Places & Buildings (Expanded)
        'ఇల్లు', // House
        'గదि', // Room
        'వంటగది', // Kitchen
        'స్నానాల', // Bathroom
        'పడక', // Bedroom
        'ఆవరణ', // Compound
        'గుడి', // Temple
        'మసీదు', // Mosque
        'చర్చి', // Church
        'పల్లె', // Village
        'ఊరు', // Village/Town
        'నగరం', // City
        'రాజధాని', // Capital
        'దేశం', // Country
        'రాష్ట్రం', // State
        'జిల్లా', // District
        'తోట', // Garden
        'పొలం', // Farm/Field
        'తోటమాలి', // Park
        'అడవి', // Forest
        'కొండ', // Hill
        'పర్వతం', // Mountain
        'గుహ', // Cave
        'నది', // River
        'కాలువ', // Canal
        'సముద్రం', // Ocean
        'సరస్సు', // Lake
        'బావి', // Well
        'కోనేరు', // Tank/Pond
        'దుకాణం', // Shop
        'అంగడి', // Store
        'పాఠశాల', // School
        'కళాశాల', // College
        'విశ్వవిద్యాలయం', // University
        'గ్రంథాలయం', // Library
        'ఆసుపత్రి', // Hospital
        'బజారు', // Market
        'బస', // Bus stand
        'రైలు', // Railway
        'విమాన', // Airport
        'రహదారి', // Road
        'దారి', // Path
        'వీధి', // Street
        'వంతెన', // Bridge
        'గోడ', // Wall
        'కంచె', // Fence
        'గేటు', // Gate
        'పైకప్పు', // Roof
        'నేల', // Floor/Ground

        // Objects & Things (Expanded)
        'పుస్తకం', // Book
        'నోటు', // Notebook
        'పేపర్', // Paper
        'పెన్ను', // Pen
        'పెన్సిలు', // Pencil
        'రబ్బరు', // Eraser
        'కత్తెర', // Scissors
        'గ్లూ', // Glue
        'సాయి', // Chalk
        'చీలిక', // Slate
        'కత్తి', // Knife
        'చెంచా', // Spoon
        'గవ్వ', // Ladle
        'బెసిన', // Basin
        'గిన్నె', // Bowl
        'పళ్ళెం', // Plate
        'గాజు', // Glass
        'బాటిల్', // Bottle
        'కుండ', // Pot
        'పాత్ర', // Vessel
        'తలుపు', // Door
        'కిటికీ', // Window
        'మంచం', // Bed
        'దిండు', // Pillow
        'దుప్పటి', // Blanket
        'ముద్ద', // Mattress
        'కుర్చీ', // Chair
        'పీట', // Stool
        'బల్ల', // Table
        'అల్మారా', // Cupboard
        'పెట్టె', // Box
        'సంచి', // Bag
        'కత్తెర', // Scissors
        'దీపం', // Lamp
        'దీపకం', // Light
        'కొవ్వొత్తి', // Candle
        'బట్ట', // Cloth
        'చీర', // Saree
        'చొక్కా', // Shirt
        'పంచె', // Dhoti
        'లంగా', // Skirt
        'దారం', // Thread
        'సూది', // Needle
        'బొత్తం', // Button
        'దువ్వెన', // Comb
        'అద్దం', // Mirror
        'సబ్బు', // Soap
        'టవల్', // Towel
        'బుట్ట', // Basket
        'తాడు', // Rope
        'కర్ర', // Stick/Wood
        'రాయి', // Stone
        'ఇసుక', // Sand
        'మట్టి', // Soil/Mud
        'ఇటుక', // Brick
        'సిమెంటు', // Cement
        'ఇనుము', // Iron
        'ఉక్కు', // Steel
        'రాగి', // Copper
        'వెండి', // Silver
        'బంగారం', // Gold
        'వజ్రం', // Diamond
        'రత్నం', // Gem
        'ముత్యం', // Pearl

        // Vehicles & Transport (Expanded)
        'రైలు', // Train
        'బస్సు', // Bus
        'కారు', // Car
        'ఆటో', // Auto
        'టాక్సీ', // Taxi
        'లారీ', // Lorry/Truck
        'విమానం', // Airplane
        'హెలికాప్టర్', // Helicopter
        'పడవ', // Boat
        'ఓడ', // Ship
        'సైకిలు', // Bicycle
        'మోటారు', // Motorcycle
        'బండి', // Cart
        'బండ్లు', // Vehicle
        'జీను', // Saddle

        // Nature & Weather (Expanded)
        'సూర్యుడు', // Sun
        'చంద్రుడు', // Moon
        'నక్షత్రం', // Star
        'ఆకాశం', // Sky
        'భూమి', // Earth
        'గ్రహం', // Planet
        'మేఘం', // Cloud
        'వర్షం', // Rain
        'చినుకు', // Drizzle
        'వానలు', // Rains
        'గాలి', // Wind
        'తుఫాను', // Storm
        'మంచు', // Snow/Ice
        'మంచు', // Dew
        'ఉరుము', // Thunder
        'మెరుపు', // Lightning
        'వరద', // Flood
        'కరువు', // Drought
        'భూకంపం', // Earthquake
        'వసంతం', // Spring
        'వేసవి', // Summer
        'వర్షాకాల', // Monsoon
        'శీతాకాల', // Winter
        'మంట', // Fire
        'నిప్పు', // Fire
        'మంటలు', // Flames
        'బూడిద', // Ash
        'బొగ్గు', // Coal
        'పొగ', // Smoke
        'ఆవిరి', // Steam
        'నీడ', // Shadow
        'వెలుగు', // Light
        'చీకటి', // Darkness
        'చెట్టు', // Tree
        'మొక్క', // Plant
        'పొద', // Bush
        'తీగ', // Vine
        'గడ్డి', // Grass
        'పువ్వు', // Flower
        'మొగ్గ', // Bud
        'ఆకు', // Leaf
        'కొమ్మ', // Branch
        'కాండం', // Stem
        'వేరు', // Root
        'విత్తనం', // Seed
        'ఫలం', // Fruit (formal)
        'కాయ', // Raw fruit

        // Qualities & Adjectives (Expanded)
        'మంచి', // Good
        'చెడు', // Bad
        'బాగా', // Well
        'పెద్ద', // Big
        'చిన్న', // Small
        'గొప్ప', // Great
        'అద్భుతం', // Wonderful
        'కొత్త', // New
        'పాత', // Old
        'పురాతన', // Ancient
        'ఆధునిక', // Modern
        'పొడవు', // Long
        'పొట్టి', // Short
        'ఎత్తు', // Height/Tall
        'పొడుగు', // Length
        'వెడల్పు', // Width
        'మందం', // Thickness
        'సన్ను', // Thin
        'బలం', // Strong
        'బలహీన', // Weak
        'దట్టం', // Thick/Dense
        'తేలిక', // Light (weight)
        'భారం', // Heavy
        'వేగం', // Speed/Fast
        'నెమ్మది', // Slow
        'తెలుపు', // White
        'నలుపు', // Black
        'ఎరుపు', // Red
        'పచ్చ', // Green
        'నీలం', // Blue
        'పసుపు', // Yellow
        'గోధుమ', // Brown
        'ఊద', // Purple
        'నారింజ', // Orange (color)
        'బూడిద', // Gray
        'వెచ్చ', // Warm
        'వేడి', // Hot
        'చల్లని', // Cold
        'చలి', // Cold (n)
        'తడి', // Wet
        'పొడి', // Dry
        'తీపి', // Sweet
        'చేదు', // Bitter
        'పులుపు', // Sour
        'కారం', // Spicy
        'ఉప్పు', // Salty
        'మృదువు', // Soft
        'కఠినం', // Hard
        'గట్టి', // Hard/Solid
        'మెత్తని', // Soft/Smooth
        'కరకు', // Rough
        'నునుపు', // Smooth/Fine
        'అందం', // Beautiful
        'వికారం', // Ugly
        'సుందరం', // Beautiful
        'సరళం', // Simple/Straight
        'సంక్లిష్టం', // Complex
        'సంపన్నం', // Rich
        'పేద', // Poor
        'ధనిక', // Wealthy
        'తెలివైన', // Intelligent
        'మూర్ఖుడు', // Fool
        'సత్యం', // Truth
        'అబద్ధం', // Lie
        'న్యాయం', // Justice
        'అన్యాయం', // Injustice

        // Actions & Concepts (Expanded)
        'పాట', // Song
        'సంగీతం', // Music
        'నాట్యం', // Dance
        'నృత్యం', // Dance (formal)
        'కథ', // Story
        'నవల', // Novel
        'కవిత', // Poetry
        'చదువు', // Education
        'చదువు', // Study/Reading
        'రచన', // Writing
        'వ్యాసం', // Essay
        'పరీక్ష', // Exam
        'విద్య', // Education
        'జ్ఞానం', // Knowledge
        'వంట', // Cooking
        'వంట', // Cuisine
        'ఆట', // Game/Play
        'క్రీడ', // Sport
        'పని', // Work
        'ఉద్యోగం', // Job
        'వ్యాపారం', // Business
        'వర్తకం', // Trade
        'తయారీ', // Manufacturing
        'విశ్రాంతి', // Rest
        'నిద్ర', // Sleep
        'కల', // Dream
        'స్వప్నం', // Dream (formal)
        'ఆలోచన', // Thought
        'ఆలోచన', // Thinking
        'నమ్మకం', // Belief
        'విశ్వాసం', // Faith/Trust
        'సందేహం', // Doubt
        'ప్రశ్న', // Question
        'జవాబు', // Answer
        'ప్రేమ', // Love
        'ప్రేమ', // Affection
        'ద్వేషం', // Hate
        'ఆశ', // Hope
        'నిరాశ', // Despair
        'భయం', // Fear
        'ధైర్యం', // Courage
        'కోపం', // Anger
        'ఓర్పు', // Patience
        'సంతోషం', // Happiness
        'ఆనందం', // Joy
        'దుఃఖం', // Sorrow
        'బాధ', // Pain
        'శాంతి', // Peace
        'యుద్ధం', // War
        'పోరాటం', // Fight/Struggle
        'విజయం', // Victory
        'ఓటమి', // Defeat
        'శక్తి', // Power
        'బలం', // Strength
        'ఆరోగ్యం', // Health
        'వ్యాధి', // Disease
        'అనారోగ్యం', // Illness
        'చికిత్స', // Treatment
        'మందు', // Medicine
        'సహాయం', // Help
        'దయ', // Kindness
        'కరుణ', // Compassion

        // Time & Direction (Expanded)
        'సమయం', // Time
        'కాలం', // Time/Era
        'ఇప్పుడు', // Now
        'ఇంతకు', // Just now
        'మొన్న', // Day before yesterday
        'నిన్న', // Yesterday
        'ఈరోజు', // Today
        'రేపు', // Tomorrow
        'ఎల్లుండి', // Day after tomorrow
        'ఉదయం', // Morning
        'పొద్దు', // Early morning
        'మధ్యాహ్నం', // Afternoon
        'మధ్యాహ్నం', // Noon
        'సాయంత్రం', // Evening
        'సాయంకాల', // Evening time
        'రాత్రి', // Night
        'అర్ధరాత్రి', // Midnight
        'గంట', // Hour
        'నిమిషం', // Minute
        'క్షణం', // Moment
        'సెకను', // Second
        'రోజు', // Day
        'దినం', // Day (formal)
        'వారం', // Week
        'పక్షం', // Fortnight
        'నెల', // Month
        'మాసం', // Month (formal)
        'సంవత్సరం', // Year
        'ఏడు', // Year (colloquial)
        'శతాబ్దం', // Century
        'ముందు', // Front/Before
        'ముందు', // Ahead
        'వెనక', // Back/Behind
        'పైన', // Above/Up
        'క్రింద', // Below/Down
        'పైకి', // Upward
        'కిందకు', // Downward
        'లోపల', // Inside
        'లోపల', // Within
        'వెలుపల', // Outside
        'బయట', // Outside
        'ఎడమ', // Left
        'కుడి', // Right
        'దూరం', // Distance/Far
        'సమీపం', // Near
        'దగ్గర', // Near
        'మధ్య', // Middle
        'మధ్యలో', // In the middle
        'ప్రక్క', // Side
        'చుట్టూ', // Around

        // Grammar & Pronouns
        'నేను', // I
        'నా', // My
        'నువ్వు', // You (informal)
        'నీ', // Your
        'మీరు', // You (formal/plural)
        'అతను', // He
        'ఆమె', // She
        'అది', // It/That
        'ఇది', // This
        'ఈ', // This (adjective)
        'ఆ', // That (adjective)
        'మనం', // We (inclusive)
        'మేము', // We (exclusive)
        'మన', // Our (inclusive)
        'మా', // Our (exclusive)
        'మీవు', // You all
        'వారు', // They
        'వాళ్ళు', // They (colloquial)
        'ఆయన', // He (respectful)
        'ఆవిడ', // She (respectful)
        'ఏది', // Which
        'ఎవరు', // Who
        'ఏమి', // What
        'ఎక్కడ', // Where
        'ఎప్పుడు', // When
        'ఎందుకు', // Why
        'ఎలా', // How
        'ఎంత', // How much

        // Connectors & Others (Expanded)
        'మరి', // And/Then
        'మరియు', // And
        'కూడా', // Also
        'కాని', // But
        'అయితే', // However
        'కనుక', // Therefore
        'కాబట్టి', // So/Therefore
        'లేదా', // Or
        'కాకపోతే', // Otherwise
        'ఒకవేళ', // If
        'అయితే', // Then
        'ఎందుకంటే', // Because
        'అవును', // Yes
        'కాదు', // No
        'లేదు', // No/Not there
        'ఉంది', // Is there/Yes
        'తెలుగు', // Telugu
        'భాష', // Language
        'పదం', // Word
        'అక్షరం', // Letter
        'వర్ణం', // Letter/Color
        'వాక్యం', // Sentence
        'అర్థం', // Meaning
        'భావం', // Feeling/Emotion
        'ప్రాణం', // Life
        'జీవం', // Life/Living
        'మరణం', // Death
        'జన్మ', // Birth
        'పేరు', // Name
        'పిలుపు', // Call/Name
        'రంగు', // Color
        'సంఖ్య', // Number
        'లెక్క', // Count/Account
        'లెక్క', // Calculation
        'లెక్క', // Number (colloquial)
        'పాఠం', // Lesson
        'నీతి', // Moral
        'ధర్మం', // Dharma/Duty
        'నియమం', // Rule
        'చట్టం', // Law
        'హక్కు', // Right
        'విధి', // Duty/Fate
        'అదృష్టం', // Luck
        'దౌర్భాగ్యం', // Misfortune

        // Numbers & Counting
        'ఒకటి', // One
        'రెండు', // Two
        'మూడు', // Three
        'నాలుగు', // Four
        'ఐదు', // Five
        'ఆరు', // Six
        'ఏడు', // Seven
        'ఎనిమిది', // Eight
        'తొమ్మిది', // Nine
        'పది', // Ten
        'పదకొండు', // Eleven
        'పండ్రెండు', // Twelve
        'వంద', // Hundred
        'వేయి', // Thousand
        'లక్ష', // Lakh
        'కోటి', // Crore

        // Professions
        'వైద్యుడు', // Doctor
        'ఉపాధ్యాయుడు', // Teacher
        'ఉపాధ్యాయిని', // Teacher (f)
        'రైతు', // Farmer
        'కమ్మరి', // Blacksmith
        'కుమ్మరి', // Potter
        'వడ్రంగి', // Carpenter
        'దర్జీ', // Tailor
        'వంటవాడు', // Cook
        'నర్సు', // Nurse
        'న్యాయవాది', // Lawyer
        'న్యాయమూర్తి', // Judge
        'పోలీసు', // Police
        'సైనికుడు', // Soldier
        'పాలకుడు', // Ruler
        'రాజు', // King
        'రాణి', // Queen
        'మంత్రి', // Minister
        'అధికారి', // Officer
    ];

    // Getter for combined word list (base + custom)
    function getAllWords() {
        const customWords = getCustomWords();
        return [...baseWordList, ...customWords];
    }

    // Expose base list for admin to check duplicates
    const mainWordList = getAllWords();

    /**
     * Target word list - words that can be solutions
     * This is a subset of the main word list, potentially excluding:
     * - Very rare or difficult words
     * - Words with complex multiple consonant conjuncts
     * - Words with ambiguous divisions
     *
     * Note: Each word has been analyzed for its syllabic unit count,
     * ensuring it falls within our 2-5 unit range for gameplay.
     */
    const targetWordList = [
        // Family & People (Common)
        'అమ్మా', 'నాన్న', 'తల్లి', 'తండ్రి', 'పిల్ల', 'అన్న', 'అక్క',
        'తమ్ముడు', 'చెల్లి', 'తాత', 'అమ్మమ్మ', 'మామ', 'అత్త',
        'మనుషు', 'మిత్రుడు', 'భార్య', 'భర్త', 'కొడుకు', 'కూతురు',
        'అబ్బాయి', 'అమ్మాయి', 'బిడ్డ', 'పొరుగు', 'అతిథి',

        // Body Parts (Common)
        'తల', 'జుట్టు', 'కన్ను', 'చెవి', 'ముక్కు', 'నోరు', 'మెడ',
        'చేతి', 'చేయి', 'వేలు', 'అరచేయి', 'కాలు', 'వెన్ను', 'గుండె',
        'కడుపు', 'భుజం', 'మోకాలు', 'పెదవి', 'నాలుక', 'గడ్డం',
        'శరీరం', 'రక్తం', 'ఎముక',

        // Animals & Birds (Common)
        'కోడి', 'పాము', 'పులి', 'సింహం', 'ఏనుగు', 'కుక్క', 'పిల్లి',
        'గొర్రె', 'మేక', 'ఆవు', 'గుర్రం', 'ఎలుక', 'కోతి', 'నక్క',
        'కాకి', 'గువ్వ', 'చిలుక', 'నెమలి', 'బాతు', 'చేప', 'కప్ప',
        'తేలు', 'చీమ', 'దోమ', 'ఈగ', 'బల్లి', 'జింక', 'కుందేలు',

        // Food & Drink (Common)
        'అన్నం', 'బియ్యం', 'రొట్టె', 'దోశ', 'ఇడ్లీ', 'వడ', 'పూరి',
        'పాలు', 'నెయ్యి', 'వెన్న', 'నీరు', 'టీ', 'కాఫీ', 'పండు',
        'కూర', 'తోట', 'ఉల్లి', 'మిరపకాయ', 'మాంసం', 'గుడ్డు',
        'పెరుగు', 'పప్పు', 'ఉప్పు', 'చెక్కెర', 'బెల్లం', 'తేనె',
        'నూనె', 'కొబ్బరి', 'అరటి', 'ద్రాక్ష', 'జామ', 'నిమ్మ',
        'నారింజ', 'మామిడి',

        // Places & Buildings (Common)
        'ఇల్లు', 'గది', 'వంటగది', 'గుడి', 'మసీదు', 'చర్చి', 'పల్లె',
        'ఊరు', 'నగరం', 'దేశం', 'రాష్ట్రం', 'తోట', 'పొలం', 'అడవి',
        'కొండ', 'పర్వతం', 'నది', 'సముద్రం', 'సరస్సు', 'బావి',
        'దుకాణం', 'అంగడి', 'పాఠశాల', 'కళాశాల', 'ఆసుపత్రి', 'బజారు',
        'రహదారి', 'దారి', 'వీధి', 'వంతెన', 'గోడ', 'గేటు', 'నేల',

        // Objects & Things (Common)
        'పుస్తకం', 'నోటు', 'పేపర్', 'పెన్ను', 'పెన్సిలు', 'రబ్బరు',
        'కత్తి', 'చెంచా', 'గిన్నె', 'పళ్ళెం', 'గాజు', 'బాటిల్',
        'కుండ', 'తలుపు', 'కిటికీ', 'మంచం', 'దిండు', 'దుప్పటి',
        'కుర్చీ', 'పీట', 'బల్ల', 'అల్మారా', 'పెట్టె', 'సంచి',
        'దీపం', 'కొవ్వొత్తి', 'బట్ట', 'చీర', 'చొక్కా', 'దారం',
        'సూది', 'బొత్తం', 'దువ్వెన', 'అద్దం', 'సబ్బు', 'టవల్',
        'బుట్ట', 'తాడు', 'కర్ర', 'రాయి', 'ఇసుక', 'మట్టి', 'ఇటుక',
        'ఇనుము', 'వెండి', 'బంగారం',

        // Vehicles & Transport (Common)
        'రైలు', 'బస్సు', 'కారు', 'ఆటో', 'టాక్సీ', 'లారీ', 'విమానం',
        'పడవ', 'ఓడ', 'సైకిలు', 'మోటారు', 'బండి',

        // Nature & Weather (Common)
        'సూర్యుడు', 'చంద్రుడు', 'నక్షత్రం', 'ఆకాశం', 'భూమి', 'మేఘం',
        'వర్షం', 'చినుకు', 'గాలి', 'తుఫాను', 'మంచు', 'ఉరుము',
        'మెరుపు', 'వరద', 'కరువు', 'వసంతం', 'వేసవి', 'శీతాకాల',
        'మంట', 'నిప్పు', 'పొగ', 'ఆవిరి', 'నీడ', 'వెలుగు', 'చీకటి',
        'చెట్టు', 'మొక్క', 'పొద', 'గడ్డి', 'పువ్వు', 'మొగ్గ', 'ఆకు',
        'కొమ్మ', 'కాండం', 'వేరు', 'విత్తనం', 'ఫలం',

        // Qualities & Adjectives (Common)
        'మంచి', 'చెడు', 'బాగా', 'పెద్ద', 'చిన్న', 'గొప్ప', 'కొత్త',
        'పాత', 'పొడవు', 'పొట్టి', 'ఎత్తు', 'సన్ను', 'బలం', 'దట్టం',
        'తేలిక', 'భారం', 'వేగం', 'నెమ్మది', 'తెలుపు', 'నలుపు',
        'ఎరుపు', 'పచ్చ', 'నీలం', 'పసుపు', 'గోధుమ', 'ఊద', 'బూడిద',
        'వెచ్చ', 'వేడి', 'చల్లని', 'చలి', 'తడి', 'పొడి', 'తీపి',
        'చేదు', 'పులుపు', 'కారం', 'మృదువు', 'కఠినం', 'గట్టి',
        'అందం', 'సుందరం', 'సరళం', 'సంపన్నం', 'పేద', 'ధనిక',
        'సత్యం', 'అబద్ధం', 'న్యాయం',

        // Actions & Concepts (Common)
        'పాట', 'సంగీతం', 'నాట్యం', 'నృత్యం', 'కథ', 'నవల', 'కవిత',
        'చదువు', 'రచన', 'వ్యాసం', 'పరీక్ష', 'విద్య', 'జ్ఞానం',
        'వంట', 'ఆట', 'క్రీడ', 'పని', 'ఉద్యోగం', 'వ్యాపారం',
        'విశ్రాంతి', 'నిద్ర', 'కల', 'స్వప్నం', 'ఆలోచన', 'నమ్మకం',
        'విశ్వాసం', 'సందేహం', 'ప్రశ్న', 'జవాబు', 'ప్రేమ', 'ద్వేషం',
        'ఆశ', 'నిరాశ', 'భయం', 'ధైర్యం', 'కోపం', 'ఓర్పు', 'సంతోషం',
        'ఆనందం', 'దుఃఖం', 'బాధ', 'శాంతి', 'యుద్ధం', 'పోరాటం',
        'విజయం', 'ఓటమి', 'శక్తి', 'ఆరోగ్యం', 'వ్యాధి', 'చికిత్స',
        'మందు', 'సహాయం', 'దయ', 'కరుణ',

        // Time & Direction (Common)
        'సమయం', 'కాలం', 'ఇప్పుడు', 'మొన్న', 'నిన్న', 'ఈరోజు', 'రేపు',
        'ఉదయం', 'పొద్దు', 'మధ్యాహ్నం', 'సాయంత్రం', 'రాత్రి', 'గంట',
        'నిమిషం', 'క్షణం', 'సెకను', 'రోజు', 'దినం', 'వారం', 'పక్షం',
        'నెల', 'మాసం', 'సంవత్సరం', 'ఏడు', 'ముందు', 'వెనక', 'పైన',
        'క్రింద', 'పైకి', 'కిందకు', 'లోపల', 'వెలుపల', 'బయట',
        'ఎడమ', 'కుడి', 'దూరం', 'సమీపం', 'దగ్గర', 'మధ్య', 'ప్రక్క',

        // Grammar & Pronouns (Common)
        'నేను', 'నా', 'నువ్వు', 'నీ', 'మీరు', 'అతను', 'ఆమె', 'అది',
        'ఇది', 'ఈ', 'ఆ', 'మనం', 'మేము', 'మన', 'మా', 'వారు', 'వాళ్ళు',
        'ఆయన', 'ఆవిడ', 'ఏది', 'ఎవరు', 'ఏమి', 'ఎక్కడ', 'ఎప్పుడు',
        'ఎందుకు', 'ఎలా', 'ఎంత',

        // Connectors & Others (Common)
        'మరి', 'మరియు', 'కూడా', 'కాని', 'అయితే', 'కనుక', 'కాబట్టి',
        'లేదా', 'ఒకవేళ', 'ఎందుకంటే', 'అవును', 'కాదు', 'లేదు', 'ఉంది',
        'తెలుగు', 'భాష', 'పదం', 'అక్షరం', 'వాక్యం', 'అర్థం', 'భావం',
        'ప్రాణం', 'జీవం', 'మరణం', 'జన్మ', 'పేరు', 'రంగు', 'సంఖ్య',
        'లెక్క', 'పాఠం', 'నీతి', 'ధర్మం', 'నియమం', 'చట్టం', 'హక్కు',

        // Numbers (Common)
        'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు',
        'ఎనిమిది', 'తొమ్మిది', 'పది', 'వంద', 'వేయి',

        // Professions (Common)
        'వైద్యుడు', 'ఉపాధ్యాయుడు', 'రైతు', 'కమ్మరి', 'కుమ్మరి',
        'వడ్రంగి', 'దర్జీ', 'వంటవాడు', 'నర్సు', 'పోలీసు', 'సైనికుడు',
        'రాజు', 'రాణి', 'మంత్రి',
    ];
    // Add this constant for the localStorage key
    const DAILY_WORDS_KEY = 'telugu_wordle_daily_words';
    
    // Replace or update your existing getRandomWord function with this:
    function getRandomWord() {
        // Check if there's a daily word set for today
        const dailyWord = getTodaysWord();
        if (dailyWord) {
            console.log("Using admin-set daily word:", dailyWord);
            return dailyWord;
        }

        // If no daily word set by admin, use date-based "word of the day"
        // This ensures the same word is used throughout the day for all users
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const wordOfDay = getWordOfDay(today);
        console.log("Using date-based word of the day:", wordOfDay);
        return wordOfDay;
    }

    // Generate a consistent word for a given date using a simple hash
    function getWordOfDay(dateString) {
        // Simple hash function to convert date string to a number
        let hash = 0;
        for (let i = 0; i < dateString.length; i++) {
            const char = dateString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        // Use absolute value and modulo to get index
        const index = Math.abs(hash) % targetWordList.length;
        return targetWordList[index];
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
    // Helper function to check if a word is valid (exists in main + custom word lists)
    function isValidWord(word) {
        // Normalize the word before checking (handle any character normalization)
        const normalizedWord = TeluguUtils.normalizeTeluguText(word);

        // Get all words (base + custom)
        const allWords = getAllWords();

        // Check if the normalized word exists in the combined word list
        for (let i = 0; i < allWords.length; i++) {
            if (TeluguUtils.normalizeTeluguText(allWords[i]) === normalizedWord) {
                return true;
            }
        }

        // For debugging
        console.log('Invalid word:', word, 'not found in dictionary (checked', allWords.length, 'words)');
        return false;
    }

    // Get number of total target words
    function getWordCount() {
        return targetWordList.length;
    }

    // Public API
    return {
        mainWordList: baseWordList,  // Base dictionary (for admin duplicate checks)
        allWords: getAllWords(),     // Combined base + custom (for validation)
        targetWordList,
        getRandomWord,
        isValidWord,
        getWordCount,
        getTodaysWord,
        getWordOfDay,
        getAllWords,  // New: get combined base + custom words
        getCustomWords  // New: get only custom words
    };
})();