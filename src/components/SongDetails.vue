<template>
  <v-card v-if="song" class="mx-auto" max-width="800">
    <v-toolbar color="primary" dark>
      <v-btn icon="mdi-arrow-left" @click="$emit('back')"></v-btn>
      <v-toolbar-title>Détails de la chanson</v-toolbar-title>
    </v-toolbar>
    <v-card-title class="text-h5">
      {{ song.title }}
    </v-card-title>
    <v-card-subtitle>
      <div class="d-flex align-center">
        <v-icon icon="mdi-account-music" size="small" class="mr-1"></v-icon>
        {{ song.artist }}
      </div>
      <div v-if="song.album" class="d-flex align-center mt-1">
        <v-icon icon="mdi-album" size="small" class="mr-1"></v-icon>
        {{ song.album }}
      </div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-2">Chargement des paroles...</div>
      </div>
      <div v-else-if="song.lyrics" class="lyrics-container">
        <h3 class="mb-4">Paroles</h3>
        <div class="lyrics-text">
          {{ song.lyrics }}
        </div>
      </div>
      <div v-else class="text-center py-4">
        <v-icon icon="mdi-music-note-off" size="large" color="grey"></v-icon>
        <div class="mt-2">Paroles non disponibles</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SongDetails',
  
  props: {
    song: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.lyrics-container {
  white-space: pre-line;
  line-height: 1.6;
}

.lyrics-text {
  font-size: 1.1rem;
  padding: 1rem 0;
}
</style>