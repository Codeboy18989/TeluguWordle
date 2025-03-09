# Telugu Wordle - తెలుగు Wordle

A web-based implementation of the popular Wordle game adapted for the Telugu language. This game is built with HTML, CSS, and vanilla JavaScript, focusing on proper handling of the Telugu script.

## Features

### Core Game Features

- **Word Guessing Game**: Players have 6 attempts to guess a Telugu word.
- **Flexible Word Length**: Supports Telugu words of 3-5 syllabic units, respecting the natural structure of Telugu words.
- **Color-coded Feedback**: 
  - Green: Letter is correct and in the correct position
  - Yellow: Letter is in the word but in the wrong position
  - Gray: Letter is not in the word
- **Telugu Script Support**: Full support for all 56 Telugu alphabet characters including vowels, consonants, and their combinations
- **On-screen Telugu Keyboard**: Virtual keyboard with intuitive layout for Telugu input
- **Local Storage**: Game state and statistics are saved in browser storage
- **Statistics Tracking**: Track games played, win percentage, and guess distribution

## Technical Details

### Script Handling

This implementation pays special attention to the unique challenges of working with Telugu script:

- **Character Handling**: Properly handles the 18 vowels and 38 consonants of Telugu
- **Conjunct Support**: Supports consonant-consonant conjuncts using zero-width joiners (ZWJ) and non-joiners (ZWNJ)
- **Syllabic Processing**: Correctly processes syllabic units rather than individual Unicode code points
- **Special Character Handling**: Proper treatment of anusvara (ం) and visarga (ః) as part of syllabic units
- **UTF-8 Encoding**: Uses proper UTF-8 encoding for Telugu characters

### Telugu Linguistic Implementation

The game handles Telugu words according to their natural syllabic structure:

- **Consonant-vowel combinations** (e.g., కా, కి, కు) are treated as single units
- **Independent vowels** (e.g., అ, ఆ, ఇ) form their own units
- **Consonants with virama** (e.g., క్) are single units
- **Consonant conjuncts** (e.g., క్ష) are treated as single units
- **Special characters**: Syllables with anusvara (ం) or visarga (ః) are treated as single units

### Architecture

The application follows a modular design pattern with clear separation of concerns:

- **HTML**: Structured semantic markup
- **CSS**: Responsive styling with mobile support
- **JavaScript**:
  - `telugu-utils.js`: Utilities for handling Telugu script
  - `word-list.js`: Dictionary of Telugu words
  - `storage.js`: Local storage management
  - `keyboard.js`: Virtual keyboard implementation
  - `game.js`: Core game logic
  - `main.js`: Application entry point

## Installation and Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (optional, for local development)

### Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/telugu-wordle.git
   cd telugu-wordle
   ```

2. Serve the directory with a local web server:
   - Using Python:
     ```
     python -m http.server
     ```
   - Using Node.js:
     ```
     npx serve
     ```

3. Open in your browser:
   ```
   http://localhost:8000/
   ```

### Deployment

The application can be deployed on any static web hosting service:

1. Upload all files to your web server
2. Ensure proper MIME types are configured for UTF-8 encoding
3. For better offline capabilities, consider setting up a service worker

## Telugu Word List Management

The game comes with a pre-built set of Telugu words. To modify or extend the word list:

1. Open `js/word-list.js`
2. Add new words to the `mainWordList` array for valid guesses
3. Add new words to the `targetWordList` array for possible solutions

Note: When adding words, ensure they are semantically 5 "units" in Telugu, where a unit can be a consonant-vowel combination, an independent vowel, or a consonant with virama.

## Browser Compatibility

- Tested on modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design works on mobile and desktop
- Requires localStorage support

## Known Limitations

- No explicit transliteration support from English keyboard input
- Limited word corpus in the initial version
- Basic handling of complex Telugu conjuncts

## Future Enhancements

- Transliteration support for physical keyboard input
- Expanded word dictionary
- Daily challenge mode
- Theme customization
- More sophisticated Telugu script handling for rare conjuncts
- Advanced statistics and sharing capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Original Wordle game by Josh Wardle
- Noto Sans Telugu font by Google Fonts
- Telugu language resources and dictionaries