<template>
  <v-card v-if="song" class="mx-auto rounded-xl overflow-hidden" max-width="800">
    <!-- Album cover header -->
    <v-img
      v-if="song.albumCover"
      :src="song.albumCover"
      height="240"
      cover
      class="align-end"
      gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%"
    >
      <v-card-title class="text-white text-h4 font-weight-bold pb-2">
        {{ song.title }}
      </v-card-title>
      <v-card-subtitle class="text-white pb-4">
        {{ song.artist }}
      </v-card-subtitle>
    </v-img>
    
    <!-- Alternative header if no album cover -->
    <v-toolbar color="black" dark v-else>
      <v-btn icon="mdi-arrow-left" @click="$emit('back')"></v-btn>
      <v-toolbar-title>{{ song.title }}</v-toolbar-title>
    </v-toolbar>
    
    <!-- Song details content -->
    <v-card-text>
      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-account-music" size="small" class="mr-2"></v-icon>
            <span class="text-subtitle-1 font-weight-medium">{{ song.artist }}</span>
          </div>
          <div v-if="song.album" class="d-flex align-center mb-4">
            <v-icon icon="mdi-album" size="small" class="mr-2"></v-icon>
            <span class="text-subtitle-1">{{ song.album }}</span>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end">
          <v-btn
            color="grey-darken-3"
            variant="tonal"
            prepend-icon="mdi-arrow-left"
            @click="$emit('back')"
            rounded="pill"
          >
            Back
          </v-btn>
          <v-btn
            v-if="song.preview"
            color="pink"
            class="ml-2"
            prepend-icon="mdi-play"
            @click="$emit('play-preview', song)"
            rounded="pill"
          >
            Listen
          </v-btn>
        </v-col>
      </v-row>
      
      <v-divider class="mb-6"></v-divider>
      
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-6">
        <v-progress-circular indeterminate color="pink" size="64"></v-progress-circular>
        <div class="mt-4 text-body-1">Loading lyrics...</div>
      </div>
      
      <!-- Lyrics display -->
      <div v-else-if="song.lyrics" class="lyrics-container">
        <h3 class="text-h5 font-weight-bold mb-4">Lyrics</h3>
        <div class="lyrics-text">
          {{ song.lyrics }}
        </div>
      </div>
      
      <!-- No lyrics available -->
      <div v-else class="text-center py-6">
        <v-icon icon="mdi-music-note-off" size="x-large" color="grey"></v-icon>
        <div class="mt-4 text-body-1">Lyrics not available</div>
        <v-btn
          color="pink"
          variant="text"
          class="mt-4"
          @click="$emit('retry')"
          rounded="pill"
        >
          Try Again
        </v-btn>
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
  },
  
  emits: ['back', 'play-preview', 'retry']
}
</script>

<style scoped>
.lyrics-container {
  white-space: pre-line;
  line-height: 1.8;
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.v-theme--dark .lyrics-container {
  background-color: rgba(255, 255, 255, 0.05);
}

.lyrics-text {
  font-size: 1.1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  padding: 1rem 0;
}
</style>