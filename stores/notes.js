import { defineStore } from 'pinia'

// MOCK Data
const allNotes = [
  { id: 101, userId: 2, title: 'Meeting Notes for Project Alpha', content: '<p>Discussed the new UI mockups. <b>Alice</b> to follow up with the design team.</p>', lastModified: '2025-08-15T10:00:00Z' },
  { id: 102, userId: 2, title: 'Grocery List', content: '<ul><li>Milk</li><li>Bread</li><li>Cheese</li></ul>', lastModified: '2025-08-14T15:30:00Z' },
  { id: 103, userId: 3, title: 'My Book Ideas', content: '<p>A story about a time-traveling librarian.</p>', lastModified: '2025-08-13T11:00:00Z' },
  { id: 104, userId: 2, title: 'Personal Goals for Q3', content: '<h1>Q3 Goals</h1><p>Finish the Nuxt 3 course.</p>', lastModified: '2025-08-12T09:00:00Z' },
];

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    loading: false,
  }),

  getters: {
    // Sorts notes by the most recently modified
    sortedNotes: (state) => {
      return [...state.notes].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    },
  },

  actions: {
    /**
     * Fetches notes for a specific user.
     * @param {number} userId The ID of the user whose notes to fetch.
     */
    async fetchNotes(userId) {
      this.loading = true;
      console.log(`Fetching notes for user ID: ${userId}...`);
      // Simulate API delay
      await new Promise(res => setTimeout(res, 500));
      
      // Filter the mock data for the given user
      this.notes = allNotes.filter(note => note.userId === userId);
      
      this.loading = false;
      console.log(`Found ${this.notes.length} notes.`);
    },

    /**
     * Saves a note (either creates a new one or updates an existing one).
     * @param {object} noteData The note object to save. Must include userId.
     */
    async saveNote(noteData) {
      this.loading = true;
      // Simulate API delay
      await new Promise(res => setTimeout(res, 300));

      if (noteData.id) {
        // Update existing note
        const index = allNotes.findIndex(n => n.id === noteData.id);
        if (index !== -1) {
          allNotes[index] = { ...noteData, lastModified: new Date().toISOString() };
        }
      } else {
        // Create new note
        const newNote = {
          ...noteData,
          id: Date.now(), // simple unique ID
          lastModified: new Date().toISOString(),
        };
        allNotes.push(newNote);
      }
      
      // Refetch notes for the current user to update the list
      await this.fetchNotes(noteData.userId);
      this.loading = false;
    },
  },
});