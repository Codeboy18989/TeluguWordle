# Telugu Wordle Word Database

This directory contains the word database for the Telugu Wordle game.

## Files

### `telugu-words.json`

The main word database containing:
- **mainWordList** (692 words): All valid Telugu words that players can guess
- **targetWordList** (470 words): Curated subset used as daily solutions
- Metadata about word structure and usage

## Word Requirements

All words in the database must meet these criteria:
- **Length**: 2-5 Telugu syllabic units
- **Script**: Valid Telugu Unicode characters (U+0C00 to U+0C7F)
- **Structure**: Properly formed Telugu words with:
  - Consonant-vowel combinations (e.g., కా, కి, కు)
  - Independent vowels (e.g., అ, ఆ, ఇ)
  - Conjuncts (e.g., త్త, క్క, ప్ర)
  - Anusvara (ం) and Visarga (ః) modifiers

## Admin Panel Word Management

The admin panel (`admin.html`) provides tools to:

### 1. Add Words Manually
- Enter one word at a time
- Automatic validation (2-5 units, Telugu script)
- Duplicate detection

### 2. Add Words in Bulk
- Paste multiple words (one per line)
- Batch validation and import
- Skip duplicates automatically

### 3. Custom Words Storage
- Custom words stored in localStorage: `telugu_wordle_custom_words`
- Merged with base dictionary at runtime
- Removable individually via admin panel

## Word Storage Architecture

```
┌─────────────────────────────────────┐
│  telugu-words.json                  │
│  (Reference/Future Database)        │
│  - Base dictionary (692 words)      │
│  - Target words (470 words)         │
└─────────────────────────────────────┘
           │ (Currently not loaded)
           ▼
┌─────────────────────────────────────┐
│  js/word-list.js                    │
│  (Current Implementation)           │
│  - Hard-coded base words            │
│  - Loads custom words from storage  │
└─────────────────────────────────────┘
           │
           ├── Reads ──────────────────┐
           │                            │
           ▼                            ▼
┌─────────────────────┐      ┌──────────────────────┐
│  localStorage       │      │  Game Validation     │
│  custom words       │ ───> │  base + custom words │
└─────────────────────┘      └──────────────────────┘
```

## Future Enhancements

### Loading from JSON (Recommended)

To load words from `telugu-words.json` instead of hardcoding:

```javascript
// In js/word-list.js
async function loadWordsFromJSON() {
    const response = await fetch('data/telugu-words.json');
    const data = await response.json();
    return {
        mainWordList: data.mainWordList.words,
        targetWordList: data.targetWordList.words
    };
}
```

### Database Integration Options

1. **JSON File** (Current approach - simple, no server needed)
   - ✅ Easy to maintain
   - ✅ No backend required
   - ✅ Version controlled
   - ❌ Client downloads entire list

2. **IndexedDB** (For larger datasets)
   - ✅ Store 1000s of words
   - ✅ Fast client-side queries
   - ❌ More complex implementation

3. **Server Database** (For collaborative editing)
   - ✅ Shared word list across users
   - ✅ Real-time updates
   - ❌ Requires backend server
   - ❌ Additional infrastructure

## Maintaining the Word List

### Adding New Words

**Option A: Via Admin Panel** (Recommended)
1. Open `admin.html`
2. Login with credentials
3. Use "Word Dictionary Management" section
4. Add words manually or in bulk

**Option B: Edit JSON File**
1. Edit `telugu-words.json`
2. Add words to `mainWordList.words` array
3. Update `count` field
4. For solution words, also add to `targetWordList.words`

**Option C: Edit JavaScript**
1. Edit `js/word-list.js`
2. Add words to `baseWordList` array
3. Optionally add to `targetWordList`

### Word Categories

Words are organized by categories for easier maintenance:
- Family & People
- Body Parts
- Animals, Birds & Insects
- Food & Drink
- Places & Buildings
- Objects & Things
- Vehicles & Transport
- Nature & Weather
- Qualities & Adjectives
- Actions & Concepts
- Time & Direction
- Grammar & Pronouns
- Connectors & Others
- Numbers & Counting
- Professions

## Contributing

When adding new words, please:
1. Verify Telugu spelling accuracy
2. Check word length (2-5 units)
3. Test in the game
4. Add inline comments for English meanings
5. Place in appropriate category
6. Keep alphabetical order within categories (optional)

## License

The word database is part of the Telugu Wordle project. Telugu language content is in the public domain.
