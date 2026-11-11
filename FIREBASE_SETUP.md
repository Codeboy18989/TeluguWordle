# Firebase Setup Guide for Telugu Wordle

This guide will help you set up Firebase Firestore for your Telugu Wordle word database.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" (or "Create a project")
3. Enter project name: `telugu-wordle` (or your choice)
4. Disable Google Analytics (optional, not needed for this project)
5. Click "Create project"

## Step 2: Set Up Firestore Database

1. In Firebase Console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose **production mode** (for security rules)
4. Select a Cloud Firestore location (choose closest to your users, e.g., `asia-south1` for India)
5. Click "Enable"

## Step 3: Admin Sign-in, Security Rules & Daily Words

The daily word and hint live in Firestore (`dailyWords/{YYYY-MM-DD}`), so every
player gets the same puzzle. Only admins can change them, which is enforced by
Firestore security rules, not just by hiding buttons.

### 3a. Turn on Google sign-in
1. Firebase Console → **Authentication** → **Get started**
2. **Sign-in method** tab → **Google** → Enable → Save
3. **Settings** tab → **Authorized domains** → make sure the domain you host
   the game on is listed (e.g. `yourname.github.io`). `localhost` is there by default.

### 3b. Publish the security rules
1. Firebase Console → **Firestore Database** → **Rules**
2. Replace everything with the contents of [`firestore.rules`](firestore.rules)
3. Click **Publish**

What the rules do:
| Collection | Players | Admins |
|---|---|---|
| `words` | read | read + write |
| `dailyWords` | read **one day at a time**, only once that day has started (no peeking at future words) | read, list, write |
| `admins` | can only check their own entry | same (edit admins in the Console) |

### 3c. Make yourself an admin
1. Open `admin.html` and click **Sign in with Google**
2. The page says "Not an admin yet" and shows your **UID**. Click **Copy UID**
3. Firebase Console → Firestore → **Start collection** → Collection ID: `admins`
4. **Document ID**: paste your UID. Add any field, e.g. `name` = `Admin`. Save
5. Refresh `admin.html`. You now see the admin panel

### 3d. Schedule words
In the admin panel, choose a date and enter a word, a hint, or both:
- **Word + hint**: that word is the answer for everyone that day
- **Hint only**: players get the automatic word, plus your hint
- **Nothing scheduled**: players get an automatic word picked from the target
  list using the date (the same for everyone)

Each entry is stored as:
```
dailyWords/2026-11-12
  word:      "నాన్న"            (optional)
  hint:      "కుటుంబం (Family)"  (optional)
  revealAt:  timestamp          (when players may read it)
  updatedAt: timestamp
  updatedBy: "<admin uid>"
```

Words and hints saved by the old browser-only admin page show up in a
"Move browser-saved words to Firestore" box the first time you sign in on that
browser. Click **Upload to Firestore** to share them.

## Step 4: Get Your Firebase Config

1. Go to Project Settings (gear icon) > General
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app: name it "Telugu Wordle Web"
5. Copy the `firebaseConfig` object

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "telugu-wordle.firebaseapp.com",
  projectId: "telugu-wordle",
  storageBucket: "telugu-wordle.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Update Your Code

1. Open `js/firebase-config.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## Step 6: Add Firebase SDK to HTML

Add these scripts BEFORE your app scripts in `index.html` and `admin.html`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<!-- admin.html only: -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>

<!-- Your app scripts -->
<script src="js/firebase-config.js"></script>
<script src="js/firestore-words.js"></script>
<!-- ... rest of your scripts ... -->
```

## Step 7: Migrate Existing Words to Firestore

### Option A: Using Firebase Console (Manual)

1. Go to Firestore > Data
2. Click "Start collection"
3. Collection ID: `words`
4. Add documents manually with fields:
   - `word` (string): "అమ్మా"
   - `category` (string): "Family"
   - `units` (number): 2
   - `isTarget` (boolean): true
   - `createdAt` (timestamp): auto
   - `createdBy` (string): "admin"

### Option B: Using Admin Panel Migration Script

1. Sign in to `admin.html` as an admin (Step 3c). The rules allow admins to write words

2. Keep `admin.html` open
3. Open browser console
4. Run migration script:

```javascript
// Migration script - run in browser console
async function migrateWordsToFirestore() {
    const baseWords = TeluguWordList.mainWordList;
    const targetWords = TeluguWordList.targetWordList;

    const wordsToAdd = baseWords.map(word => {
        const wordParts = TeluguUtils.splitTeluguWord(word);
        return {
            word: word,
            category: 'Base Dictionary',
            units: wordParts.length,
            isTarget: targetWords.includes(word)
        };
    });

    // Add in batches of 100 (Firestore limit is 500 per batch)
    for (let i = 0; i < wordsToAdd.length; i += 100) {
        const batch = wordsToAdd.slice(i, i + 100);
        const result = await FirestoreWords.addWordsBatch(batch);
        console.log(`Batch ${Math.floor(i/100) + 1}: Added ${result.count} words`);
        await new Promise(r => setTimeout(r, 1000)); // Wait 1 second between batches
    }

    console.log('✅ Migration complete!');
}

// Run migration
migrateWordsToFirestore();
```

## Step 8: Test the Integration

1. Open `index.html` in browser
2. Open browser console
3. Check for Firebase initialization messages:
   ```
   ✅ Firebase initialized successfully
   ✅ Firestore offline persistence enabled
   🔄 Fetching words from Firestore...
   ✅ Fetched XXX words from Firestore
   ```

## Firebase Free Tier Limits

Your app should easily stay within these limits:

- ✅ **Stored data**: 1 GB (more than enough for text data)
- ✅ **Reads**: 50,000/day (each page load = 1 read, cached for 1 hour)
- ✅ **Writes**: 20,000/day (only when adding new words)
- ✅ **Deletes**: 20,000/day

With caching, your app will use approximately:
- 100-500 reads/day (depending on traffic)
- 1-10 writes/day (when adding new words)

## Caching Strategy

The app implements smart caching:
- ✅ First load: Fetch from Firestore
- ✅ Cache for 1 hour in localStorage
- ✅ Subsequent loads: Use cache (faster, no Firestore reads)
- ✅ Offline support: Firestore persistence enabled
- ✅ Auto-invalidation: Cache clears when words are added/deleted

## Security Best Practices

For production:

1. **Admin authentication**: done. Google sign-in plus the `admins` allowlist (Step 3)

2. **Restrict API Key**:
   - Go to Google Cloud Console
   - Restrict your API key to your domain only

3. **Use Environment Variables**:
   - Don't commit Firebase config to public repos
   - Use `.env` files (add to `.gitignore`)

## Troubleshooting

### "Permission denied" errors
- Check the rules from `firestore.rules` are published (Step 3b)
- In the admin panel: check your UID is in the `admins` collection (Step 3c)
- Check Firebase config is correct

### "Firebase not initialized"
- Check Firebase SDK scripts are loaded before your app scripts
- Check browser console for initialization errors
- Verify firebaseConfig has correct values

### Slow initial load
- Normal for first load (fetching from cloud)
- Subsequent loads use cache and are fast
- Enable offline persistence for better performance

### Cache not updating
- Admin panel automatically invalidates cache when adding/deleting words
- Manually clear cache: `FirestoreWords.clearCache()`

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure Firestore
3. ✅ Update firebase-config.js
4. ✅ Add Firebase SDK to HTML files
5. ✅ Migrate existing words
6. ✅ Test the integration
7. ✅ Google sign-in + security rules for admin access (Step 3)

## Support

For Firebase documentation:
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Web SDK Guide](https://firebase.google.com/docs/web/setup)
