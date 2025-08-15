<template>
  <v-dialog :model-value="isOpen" @update:model-value="$emit('close')" max-width="800px" persistent>
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">{{ isEditing ? 'Edit Note' : 'Create New Note' }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field
          v-model="editableNote.title"
          label="Note Title"
          variant="outlined"
          class="mb-4"
          autofocus
        ></v-text-field>
        <!-- The Rich Text Editor -->
        <div class="editor-container">
          <QuillEditor
            theme="snow"
            toolbar="full"
            v-model:content="editableNote.content"
            contentType="html"
          />
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="save" :disabled="!editableNote.title">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Props definition
const props = defineProps({
  isOpen: Boolean,
  note: Object, // The note to be edited, or null for a new note
});

// Emits definition
const emit = defineEmits(['close', 'save']);

// Local state for the note being edited
const editableNote = ref({ title: '', content: '' });

// Dynamically import QuillEditor to ensure it's client-side only
let QuillEditor = ref(null);
onMounted(async () => {
  if (process.client) {
    const module = await import('@vueup/vue-quill');
    QuillEditor.value = module.QuillEditor;
    // Import Quill's CSS
    await import('@vueup/vue-quill/dist/vue-quill.snow.css');
  }
});

watch(() => props.note, (newNote) => {
  if (newNote) {
    // Editing an existing note, create a copy to avoid modifying the original directly
    editableNote.value = { ...newNote };
  } else {
    editableNote.value = { title: '', content: '' };
  }
}, { immediate: true, deep: true });

const isEditing = computed(() => !!props.note?.id);

const save = () => {
  emit('save', editableNote.value);
};
</script>

<style>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}
.ql-editor {
  min-height: 250px;
}
</style>