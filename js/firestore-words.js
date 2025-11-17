/**
 * firestore-words.js
 * Firestore operations for word management
 */

const FirestoreWords = (function() {
    const CACHE_KEY = 'telugu_wordle_words_cache';
    const CACHE_TIMESTAMP_KEY = 'telugu_wordle_cache_timestamp';
    const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

    // Check if cached data is still valid
    function isCacheValid() {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        if (!timestamp) return false;

        const age = Date.now() - parseInt(timestamp);
        return age < CACHE_DURATION;
    }

    // Get words from cache
    function getFromCache() {
        try {
            if (!isCacheValid()) return null;

            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const data = JSON.parse(cached);
            console.log('📦 Loaded', data.length, 'words from cache');
            return data;
        } catch (e) {
            console.error('Cache read error:', e);
            return null;
        }
    }

    // Save words to cache
    function saveToCache(words) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(words));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            console.log('💾 Cached', words.length, 'words');
        } catch (e) {
            console.error('Cache write error:', e);
        }
    }

    // Fetch all words from Firestore
    async function fetchAllWords() {
        if (!FirebaseDB.isInitialized()) {
            console.warn('⚠️ Firebase not initialized, using cache/fallback');
            return getFromCache() || [];
        }

        try {
            console.log('🔄 Fetching words from Firestore...');

            const snapshot = await FirebaseDB.collections.words().get();
            const words = [];

            snapshot.forEach(doc => {
                const data = doc.data();
                words.push({
                    id: doc.id,
                    word: data.word,
                    category: data.category || 'Uncategorized',
                    units: data.units || 0,
                    isTarget: data.isTarget || false,
                    createdAt: data.createdAt,
                    createdBy: data.createdBy || 'unknown'
                });
            });

            console.log('✅ Fetched', words.length, 'words from Firestore');

            // Cache the results
            saveToCache(words);

            return words;
        } catch (error) {
            console.error('❌ Error fetching words:', error);

            // Fallback to cache
            const cached = getFromCache();
            if (cached) {
                console.log('📦 Using cached words as fallback');
                return cached;
            }

            return [];
        }
    }

    // Add a new word to Firestore
    async function addWord(wordData) {
        if (!FirebaseDB.isInitialized()) {
            throw new Error('Firebase not initialized');
        }

        try {
            const docData = {
                word: wordData.word,
                category: wordData.category || 'Custom',
                units: wordData.units,
                isTarget: wordData.isTarget !== false, // default true
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: 'admin'
            };

            const docRef = await FirebaseDB.collections.words().add(docData);
            console.log('✅ Word added to Firestore:', wordData.word, 'ID:', docRef.id);

            // Invalidate cache
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);

            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error adding word:', error);
            return { success: false, error: error.message };
        }
    }

    // Add multiple words in batch
    async function addWordsBatch(wordsArray) {
        if (!FirebaseDB.isInitialized()) {
            throw new Error('Firebase not initialized');
        }

        try {
            const batch = FirebaseDB.db.batch();
            const results = [];

            wordsArray.forEach(wordData => {
                const docRef = FirebaseDB.collections.words().doc();
                batch.set(docRef, {
                    word: wordData.word,
                    category: wordData.category || 'Custom',
                    units: wordData.units,
                    isTarget: wordData.isTarget !== false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: 'admin'
                });

                results.push({ word: wordData.word, id: docRef.id });
            });

            await batch.commit();
            console.log('✅ Batch added', wordsArray.length, 'words to Firestore');

            // Invalidate cache
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);

            return { success: true, count: wordsArray.length, results };
        } catch (error) {
            console.error('❌ Error in batch add:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete a word from Firestore
    async function deleteWord(wordId) {
        if (!FirebaseDB.isInitialized()) {
            throw new Error('Firebase not initialized');
        }

        try {
            await FirebaseDB.collections.words().doc(wordId).delete();
            console.log('✅ Word deleted from Firestore:', wordId);

            // Invalidate cache
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);

            return { success: true };
        } catch (error) {
            console.error('❌ Error deleting word:', error);
            return { success: false, error: error.message };
        }
    }

    // Update a word in Firestore
    async function updateWord(wordId, updates) {
        if (!FirebaseDB.isInitialized()) {
            throw new Error('Firebase not initialized');
        }

        try {
            await FirebaseDB.collections.words().doc(wordId).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Word updated in Firestore:', wordId);

            // Invalidate cache
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);

            return { success: true };
        } catch (error) {
            console.error('❌ Error updating word:', error);
            return { success: false, error: error.message };
        }
    }

    // Clear local cache
    function clearCache() {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        console.log('🗑️ Cache cleared');
    }

    // Get word statistics
    async function getWordStats() {
        const words = await fetchAllWords();

        const stats = {
            total: words.length,
            byCategory: {},
            byUnits: {},
            targetWords: words.filter(w => w.isTarget).length
        };

        words.forEach(w => {
            // Count by category
            stats.byCategory[w.category] = (stats.byCategory[w.category] || 0) + 1;

            // Count by units
            stats.byUnits[w.units] = (stats.byUnits[w.units] || 0) + 1;
        });

        return stats;
    }

    // Public API
    return {
        fetchAllWords,
        addWord,
        addWordsBatch,
        deleteWord,
        updateWord,
        clearCache,
        getWordStats,
        isCacheValid,
        getFromCache
    };
})();

// Make available globally
window.FirestoreWords = FirestoreWords;
