<template>
  <v-card v-if="results.length > 0" class="mx-auto mb-6 rounded-xl" max-width="800">
    <v-card-title class="d-flex align-center">
      Search Results 
      <v-chip class="ml-2" color="pink" text-color="white">{{ results.length }}</v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-list class="results-list">
      <v-list-item
        v-for="(song, index) in results"
        :key="index"
        @click="$emit('select-song', song)"
        :ripple="true"
        class="my-2 mx-2 rounded-lg"
      >
        <template v-slot:prepend>
          <v-avatar size="48" rounded="lg" class="mr-3">
            <v-img 
              :src="song.albumCover || 'https://via.placeholder.com/48'" 
              :alt="song.title"
            ></v-img>
          </v-avatar>
        </template>
        
        <v-list-item-title class="text-subtitle-1 font-weight-medium">{{ song.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
        
        <template v-slot:append>
          <v-btn
            v-if="song.preview"
            icon="mdi-play-circle"
            variant="text"
            color="pink"
            @click.stop="$emit('play-preview', song)"
            class="mr-2"
          ></v-btn>
          <v-icon icon="mdi-chevron-right" color="grey-darken-1"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  
  <v-card v-else-if="searchPerformed && !loading" class="mx-auto text-center py-6 rounded-xl" max-width="800">
    <v-icon icon="mdi-playlist-remove" size="x-large" color="grey-darken-1"></v-icon>
    <div class="mt-4 text-body-1">No results found. Please try another search.</div>
    <div class="text-caption mt-2">Tip: Try using fewer words or check spelling</div>
  </v-card>
</template>

<script>
export default {
  name: 'SearchResults',
  
  props: {
    results: {
      type: Array,
      required: true
    },
    searchPerformed: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['select-song', 'play-preview']
}
</script>

<style scoped>
.results-list .v-list-item {
  transition: background-color 0.2s ease;
}

.results-list .v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.v-theme--dark .results-list .v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>