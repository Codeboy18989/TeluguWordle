# Telugu Wordle - Testing Checklist

## Device & Browser Testing

### Desktop Browsers
- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac)
- [ ] Edge (Windows)

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet (Android)
- [ ] Safari (iOS - iPhone)
- [ ] Safari (iOS - iPad)
- [ ] Firefox Mobile

### Screen Sizes
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet Portrait (768x1024)
- [ ] Tablet Landscape (1024x768)
- [ ] Phone Portrait (375x667 - iPhone SE)
- [ ] Phone Portrait (390x844 - iPhone 12/13)
- [ ] Phone Portrait (360x740 - Samsung Galaxy)
- [ ] Phone Landscape (667x375)

---

## 1. Core Gameplay

### Game Start
- [ ] Page loads without errors
- [ ] Telugu fonts render correctly
- [ ] Game board displays 6 rows
- [ ] Tiles adjust to word length (2-5 units)
- [ ] Header shows "తెలుగు Wordle"
- [ ] Help (?), Stats (📊), Settings (⚙️) buttons visible

### Typing & Input
- [ ] Can click Telugu keyboard to type
- [ ] Letters appear in tiles as typed
- [ ] Can switch between keyboard tabs (consonants, vowels, diacritics, conjuncts)
- [ ] Backspace (⌫) removes last letter
- [ ] Cannot type more letters than word length
- [ ] Active tile has light background
- [ ] Filled tiles have darker border

### Submitting Guesses
- [ ] Cannot submit incomplete word (shows error message)
- [ ] Invalid words show color feedback anyway (new feature)
- [ ] Invalid words show message: "నిఘంటువులో లేదు, కానీ రంగులు చూడండి"
- [ ] Valid words submit successfully
- [ ] Tiles flip with animation to reveal colors
- [ ] Each tile reveals with staggered delay

### Color Feedback
- [ ] **GREEN tiles**: Correct letter in correct position
- [ ] **YELLOW tiles - Case 1**: Same consonant, different vowel (e.g., కా vs కి)
- [ ] **YELLOW tiles - Case 2**: Same base consonant, different conjunct (e.g., క్క vs క్త)
- [ ] **YELLOW tiles - Case 3**: Letter exists elsewhere in word
- [ ] **GRAY tiles**: Letter not in word at all
- [ ] Keyboard keys update with same colors

### Winning
- [ ] Correct guess shows all GREEN tiles
- [ ] Win animation (tiles bounce)
- [ ] Success message: "అభినందనలు! (Congratulations!)"
- [ ] Result modal shows after animation
- [ ] Modal shows number of attempts
- [ ] "Play Again" button works
- [ ] Statistics update correctly

### Losing
- [ ] After 6 failed attempts, game ends
- [ ] Game over modal appears
- [ ] Modal shows correct word
- [ ] "Play Again" button works
- [ ] Statistics update correctly

### Game Reset
- [ ] "Reset" button in top-left corner
- [ ] Clicking reset clears game state
- [ ] Page reloads with new game
- [ ] New word is selected

---

## 2. Mobile-Specific Features

### Viewport & Display
- [ ] No horizontal scrolling
- [ ] Content fits screen width
- [ ] No unwanted zoom on input focus
- [ ] Safe area respected on notched devices (iPhone X+)

### Hint Display (CRITICAL - Recently Fixed)
- [ ] Hint appears above game board (if set by admin)
- [ ] Hint has yellow gradient background with 💡 icon
- [ ] Hint is fully visible (not cut off)
- [ ] Hint scrolls into view properly
- [ ] Hint text is readable on mobile

### Button Positioning (CRITICAL - Recently Fixed)
- [ ] **Keyboard Toggle Button**:
  - [ ] Positioned at bottom center
  - [ ] Shows "⌨️ Hide Keyboard" when keyboard visible
  - [ ] Positioned higher (bottom: 220px) when keyboard visible
  - [ ] Shows "⌨️ Show Keyboard" when keyboard hidden
  - [ ] Moves down (bottom: 20px) when keyboard hidden
  - [ ] Green gradient when hidden, purple when visible
- [ ] **Reset Button**:
  - [ ] Positioned at top-left (top: 70px, left: 10px)
  - [ ] Shows "Reset" text
  - [ ] Red background, small and unobtrusive
- [ ] **Enter Key**: Does NOT overlap with toggle button
- [ ] NO button overlap at any screen size

### Keyboard Functionality
- [ ] Keyboard visible by default on first load
- [ ] Toggle button hides/shows keyboard smoothly
- [ ] Keyboard auto-hides on very small screens (< 600px height)
- [ ] Keyboard tabs work in portrait mode
- [ ] Keyboard tabs work in landscape mode
- [ ] Keys are touch-friendly (minimum 40x40px)
- [ ] No accidental taps
- [ ] Visual feedback when key pressed

### Orientation Changes
- [ ] **Portrait Mode**:
  - [ ] Game board fully visible
  - [ ] Hint displays correctly
  - [ ] Toggle button accessible
  - [ ] All 6 rows visible
- [ ] **Landscape Mode**:
  - [ ] Keyboard becomes compact
  - [ ] Content scrollable if needed
  - [ ] Toggle button repositions
  - [ ] Game still playable

### Touch & Gestures
- [ ] Tap feedback on keyboard keys
- [ ] Tap feedback on buttons
- [ ] No double-tap zoom
- [ ] Smooth scrolling
- [ ] Modal scroll works with one finger

---

## 3. Admin Panel Features

### Access & Login
- [ ] Navigate to `/admin.html`
- [ ] Login page appears
- [ ] Username: `admin`, Password: `telugu123` works
- [ ] Invalid credentials show error
- [ ] Login persists (refresh doesn't log out)
- [ ] Logout button works

### Daily Word Management
- [ ] Current word displays correctly
- [ ] Current word matches game word
- [ ] Can set new word for specific date
- [ ] Cannot set invalid Telugu word
- [ ] Cannot set word outside 2-5 units
- [ ] Word must be in target word list
- [ ] Confirmation prompt for overwriting existing word
- [ ] Word history shows all set words
- [ ] Word persists until midnight

### Daily Hint Management (CRITICAL)
- [ ] Hint input field accepts Telugu and English text
- [ ] "Set Hint" button saves hint
- [ ] Success message appears
- [ ] Current hint displays below input
- [ ] "Clear Hint" button removes hint
- [ ] Hint only shows for today's date
- [ ] Old hints automatically hidden next day
- [ ] Hint immediately visible on game page after setting

### Word Dictionary Management
- [ ] Base word count shows 692 words
- [ ] Custom word count shows correct number
- [ ] Total count = base + custom

#### Manual Word Addition
- [ ] Can add single Telugu word
- [ ] Word must be 2-5 units
- [ ] Duplicate check works
- [ ] Success message shows word + unit count
- [ ] Word appears in custom words list

#### Bulk Word Addition
- [ ] Can paste multiple words (one per line)
- [ ] Valid words added successfully
- [ ] Invalid words skipped with count
- [ ] Duplicate words skipped
- [ ] Success message shows added/skipped counts
- [ ] All valid words appear in list

#### Custom Words Display
- [ ] Words displayed in grid layout
- [ ] Words sorted alphabetically
- [ ] Each word shows unit count on hover
- [ ] Delete button (×) on each word
- [ ] Deleting word shows confirmation
- [ ] Deleted word removed from list
- [ ] Word counts update after deletion

#### Clear All Custom Words
- [ ] Confirmation prompt appears
- [ ] Clicking OK clears all custom words
- [ ] List shows "No custom words added yet"
- [ ] Counts update to 0

---

## 4. Modals & Popups

### Help Modal (?)
- [ ] Opens when clicking ? button
- [ ] Close button (×) works
- [ ] Clicking outside modal closes it
- [ ] Scrollable on mobile
- [ ] All sections visible:
  - [ ] Game objective (Telugu + English)
  - [ ] How to play
  - [ ] Color meanings (3 types of yellow)
  - [ ] Tip about conjuncts
- [ ] Example tiles show correct colors
- [ ] Text readable on all screen sizes

### Statistics Modal (📊)
- [ ] Opens when clicking 📊 button
- [ ] Shows games played
- [ ] Shows win percentage
- [ ] Shows current streak
- [ ] Shows max streak
- [ ] Numbers update after each game
- [ ] Modal scrollable on mobile

### Game Result Modal
- [ ] Appears after win/loss
- [ ] Shows result title (win/loss)
- [ ] Shows correct word
- [ ] Shows attempt number (if won)
- [ ] "Play Again" button works
- [ ] Modal cannot be dismissed during animation
- [ ] Modal closes after playing again

---

## 5. Notifications

### Error Messages
- [ ] "Word must be X units" - shows correct count
- [ ] "Not in dictionary, but check colors" - shows for invalid words
- [ ] Messages appear at top center
- [ ] Messages auto-hide after 2-3 seconds
- [ ] Messages readable on mobile
- [ ] Multiple messages don't overlap

### Success Messages
- [ ] "అభినందనలు!" on win
- [ ] Appears briefly then shows modal

---

## 6. Word Validation & Dictionary

### Valid Word Recognition
- [ ] Common Telugu words accepted
- [ ] Words from base dictionary (692) work
- [ ] Custom words added by admin work
- [ ] Conjunct words work (క్క, క్త, etc.)
- [ ] Words with vowel signs work (కా, కి, కు, etc.)

### Invalid Word Handling (NEW FEATURE)
- [ ] Invalid words still submit
- [ ] Color feedback shown even for invalid words
- [ ] Notification says "not in dictionary"
- [ ] Can learn from colors despite invalid word
- [ ] Game continues normally

### Word Length Detection
- [ ] 2-unit words work
- [ ] 3-unit words work
- [ ] 4-unit words work
- [ ] 5-unit words work
- [ ] Grid adjusts to word length correctly
- [ ] Tiles scale responsively

---

## 7. Keyboard Features

### Tab System
- [ ] **Consonants tab (హల్లులు)**:
  - [ ] All Telugu consonants present
  - [ ] Organized in logical rows
- [ ] **Vowels tab (అచ్చులు)**:
  - [ ] Standalone vowels (అ, ఆ, ఇ, etc.)
  - [ ] Can type vowel-only units
- [ ] **Vowel Signs tab (గుణింతాలు)**:
  - [ ] All diacritics (ా, ి, ీ, etc.)
  - [ ] Virama (్) present
- [ ] **Conjuncts tab (యుక్తాలు)**:
  - [ ] Common conjuncts (క్క, గ్గ, చ్చ, etc.)
  - [ ] 40+ conjuncts available
  - [ ] Organized in logical rows

### Keyboard State
- [ ] Active tab highlighted
- [ ] Keys show correct status colors
- [ ] Enter key always green
- [ ] Backspace shows ⌫ symbol

---

## 8. Performance & UX

### Loading
- [ ] Page loads in < 3 seconds
- [ ] Telugu fonts load properly
- [ ] No FOUC (flash of unstyled content)
- [ ] No JavaScript errors in console

### Animations
- [ ] Tile flip animation smooth (60fps)
- [ ] Bounce animation on win smooth
- [ ] Shake animation on invalid word smooth
- [ ] Keyboard toggle smooth
- [ ] No janky scrolling
- [ ] No lag when typing

### Accessibility
- [ ] All buttons have proper labels
- [ ] Focus states visible
- [ ] Touch targets ≥ 40x40px
- [ ] Text contrast sufficient
- [ ] Works with screen reader (bonus)

---

## 9. Firebase Integration (Optional)

**Note**: Only test if Firebase has been configured

### Firestore Connection
- [ ] Console shows "✅ Firebase initialized successfully"
- [ ] Console shows "✅ Firestore offline persistence enabled"
- [ ] Words load from Firestore
- [ ] Cache works (check localStorage)

### Admin Panel - Firestore
- [ ] Adding word saves to Firestore
- [ ] Success message shows "✅ Added to Firestore"
- [ ] Bulk add uses batch operation
- [ ] Words sync across devices
- [ ] Delete removes from Firestore
- [ ] Word counts match Firestore

### Offline Mode
- [ ] Game works without internet (after first load)
- [ ] Cached words available offline
- [ ] Words sync when back online

---

## 10. Edge Cases & Bugs

### Data Persistence
- [ ] Game state saves on refresh
- [ ] Can continue game after closing browser
- [ ] Statistics persist across sessions
- [ ] Word of the day consistent all day
- [ ] Daily word changes at midnight

### Unusual Input
- [ ] Cannot submit empty tiles
- [ ] Cannot type after game ends
- [ ] Cannot type more than word length
- [ ] Rapid clicking doesn't break game
- [ ] Mashing keyboard doesn't break game

### Memory & Storage
- [ ] localStorage doesn't fill up
- [ ] No memory leaks (play 10+ games)
- [ ] Performance doesn't degrade over time
- [ ] Browser back button doesn't break game

---

## 11. Visual Regression

### Layout
- [ ] No overlapping elements at any screen size
- [ ] Consistent spacing and padding
- [ ] Buttons aligned properly
- [ ] Text not cut off anywhere
- [ ] Scrollbars only where needed

### Colors & Styling
- [ ] Theme color matches header bar (mobile)
- [ ] Gradient buttons render correctly
- [ ] Tile colors distinct and clear
- [ ] High contrast for accessibility
- [ ] Dark borders on filled tiles

### Fonts
- [ ] Telugu text renders clearly
- [ ] No missing characters (□)
- [ ] Consistent font sizing
- [ ] Proper line height
- [ ] Readable on all screens

---

## 12. Progressive Web App (PWA)

### Installation
- [ ] "Add to Home Screen" option available (mobile)
- [ ] App installs successfully
- [ ] Custom icon shows (when added)
- [ ] Splash screen appears on launch
- [ ] Opens in standalone mode (no browser bars)

### Offline Capability
- [ ] Service worker registers
- [ ] Works offline after first load
- [ ] Assets cached properly

---

## Critical Issues to Report

### P0 (Blocker - Must Fix)
- Game doesn't load
- Cannot type or submit guesses
- Game crashes or freezes
- Complete button overlap (unusable)
- Hint not visible at all on mobile

### P1 (High Priority)
- Incorrect color feedback
- Word validation broken
- Statistics not saving
- Admin panel doesn't work
- Keyboard doesn't toggle

### P2 (Medium Priority)
- Visual glitches
- Slow animations
- Minor layout issues
- Console errors (non-breaking)

### P3 (Low Priority - Nice to Have)
- Minor text issues
- Inconsistent spacing
- Better error messages

---

## Test Results Template

```
Device: [Samsung Galaxy S21 / iPhone 12 / Desktop Chrome]
OS: [Android 12 / iOS 15 / Windows 11]
Browser: [Chrome 120 / Safari 15]
Screen Size: [390x844]
Date Tested: [YYYY-MM-DD]

✅ PASS: [Feature worked correctly]
❌ FAIL: [Feature broken - describe issue]
⚠️ PARTIAL: [Feature works but has issues]

Critical Issues Found:
1. [Description]
2. [Description]

Minor Issues Found:
1. [Description]
2. [Description]

Additional Notes:
[Any other observations]
```

---

## Testing Priority Order

1. **Mobile browser testing** (Samsung Galaxy S21) - CRITICAL
2. **Core gameplay** - Must work perfectly
3. **Admin panel** - Word and hint management
4. **Desktop browsers** - Chrome, Firefox, Safari
5. **Edge cases** - Unusual inputs, rapid clicking
6. **PWA features** - Installation, offline mode
7. **Performance** - Animations, loading speed

---

## Notes for Tester

- Test on **actual devices** when possible (not just browser dev tools)
- Clear browser cache between major test sessions
- Test both **portrait and landscape** on mobile
- Try **rapid clicking/tapping** to find race conditions
- Check **browser console** for errors (F12 → Console)
- Take **screenshots** of any issues found
- Note exact **device model and OS version** for mobile issues

Good luck with testing! 🎉
