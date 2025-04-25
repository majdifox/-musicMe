<template>
  <v-card v-if="results.length > 0" class="mx-auto mb-6" max-width="800">
    <v-card-title>Résultats de recherche</v-card-title>
    <v-list>
      <v-list-item
        v-for="(song, index) in results"
        :key="index"
        @click="$emit('select-song', song)"
        link
      >




        <template v-slot:prepend>
          <v-icon icon="mdi-music"></v-icon>
        </template>
        <v-list-item-title>{{ song.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
        <template v-slot:append>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  
  <v-card v-else-if="searchPerformed && !loading" class="mx-auto text-center py-4" max-width="800">
    <v-icon icon="mdi-playlist-remove" size="large" color="grey"></v-icon>
    <div class="mt-2">Aucun résultat trouvé. Veuillez essayer une autre recherche.</div>
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
  }
}
</script>