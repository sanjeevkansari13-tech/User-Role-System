<template>
  <div>
    <!-- Impersonation Bar (shown only to admins) -->
    <v-alert
      v-if="auth.isImpersonating"
      type="info"
      variant="flat"
      class="ma-3"
      density="compact"
      closable
      @click:close="stopImpersonating"
    >
      You are viewing as <strong>{{ auth.currentUser.name }}</strong>. Click the close icon to return to the Admin Dashboard.
    </v-alert>

    <v-container>
      <v-row class="align-center mb-4">
        <v-col>
          <h1 class="text-h4">
            <v-icon icon="mdi-note-multiple" class="mr-2"></v-icon>
            {{ pageTitle }}
          </h1>
          <div class="text-grey">All your notes in one place.</div>
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" size="large" @click="openCreateNoteDialog">
            <v-icon left>mdi-plus</v-icon>
            Create Note
          </v-btn>
        </v-col>
      </v-row>

      <!-- Loading Skeleton -->
      <div v-if="notesStore.loading">
        <v-skeleton-loader v-for="n in 3" :key="n" type="card" class="mb-4"></v-skeleton-loader>
      </div>

      <!-- Notes Display -->
      <div v-else>
        <!-- No Notes Message -->
        <v-card v-if="!notesStore.sortedNotes.length" class="text-center pa-8" flat border>
          <v-icon size="64" color="grey-lighten-1">mdi-note-off-outline</v-icon>
          <h2 class="text-h6 mt-4">No notes yet</h2>
          <p class="text-grey">Click "Create Note" to get started.</p>
        </v-card>

        <!-- List of Notes -->
        <v-card
          v-for="note in notesStore.sortedNotes"
          :key="note.id"
          class="mb-4"
          @click="openEditNoteDialog(note)"
          hover
        >
          <v-card-item>
            <v-card-title>{{ note.title }}</v-card-title>
            <v-card-subtitle>
              Last modified: {{ new Date(note.lastModified).toLocaleString() }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text class="note-content" v-html="note.content.substring(0, 200) + (note.content.length > 200 ? '...' : '')">
          </v-card-text>
        </v-card>
      </div>
    </v-container>

    <!-- Note Editor Dialog -->
    <NoteEditor
      :is-open="isDialogVisible"
      :note="selectedNote"
      @close="closeDialog"
      @save="handleSaveNote"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useNotesStore } from '~/stores/notes';
import NoteEditor from '~/components/NoteEditor.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const notesStore = useNotesStore();

// Dialog state
const isDialogVisible = ref(false);
const selectedNote = ref(null);

// Get the user ID from the URL.
const userId = computed(() => parseInt(route.params.id));

// Dynamically set the page title
const pageTitle = computed(() => {
  // `currentUser` from the auth store handles both logged-in user and impersonation
  if (auth.currentUser?.id === userId.value) {
    return `${auth.currentUser.name}'s Notes`;
  }
  return 'User Notes';
});

// Fetch notes when the component is mounted.
onMounted(() => {
  // Check if there is a current user (either logged in or impersonated)
  if (!auth.currentUser) {
    // Redirect to login if no user context is available
    return router.push('/login');
  }
  notesStore.fetchNotes(userId.value);
});

// --- Dialog Methods ---
const openCreateNoteDialog = () => {
  selectedNote.value = null; // Clear selected note for creation
  isDialogVisible.value = true;
};

const openEditNoteDialog = (note) => {
  selectedNote.value = note;
  isDialogVisible.value = true;
};

const closeDialog = () => {
  isDialogVisible.value = false;
};

// --- Data Methods ---
const handleSaveNote = async (noteData) => {
  // Ensure the note is associated with the current user
  const noteToSave = { ...noteData, userId: userId.value };
  await notesStore.saveNote(noteToSave);
  closeDialog();
};

const stopImpersonating = () => {
  auth.stopImpersonating();
  router.push('/admin'); // Redirect back to the admin dashboard
};
</script>

<style scoped>
.note-content {
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Basic styling for content from the editor */
  ::v-deep(p) {
    margin-bottom: 0;
  }
}
</style>