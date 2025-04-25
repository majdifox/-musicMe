<template>
  <v-app>
    <v-app-bar color="deep-orange darken-1" dark app>
      <v-app-bar-title class="text-uppercase font-weight-bold">
        Lyrics.ovh
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Message d'erreur -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          closable
          class="mb-6"
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <!-- Formulaire de recherche -->
        <v-card class="mx-auto mb-6" max-width="800" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">
            Rechercher des paroles
          </v-card-title>
          <v-card-subtitle>
            Entrez le titre d'une chanson ou le nom d'un artiste
          </v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="searchLyrics">
              <v-row>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="searchQuery.title"
                    label="Titre de la chanson"
                    prepend-icon="mdi-music-note"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="searchQuery.artist"
                    label="Artiste"
                    prepend-icon="mdi-account-music"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center">
                  <v-btn
                    color="deep-orange"
                    block
                    type="submit"
                    :loading="loading"
                    :disabled="!searchQuery.title && !searchQuery.artist"
                  >
                    Rechercher
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Résultats de recherche -->
        <v-card v-if="searchResults.length > 0 && !selectedSong" class="mx-auto mb-6" max-width="800" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">
            Résultats de recherche
            <v-chip class="ml-2" color="deep-orange" text-color="white">{{ searchResults.length }}</v-chip>
          </v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="(song, index) in searchResults"
              :key="index"
              @click="selectSong(song)"
              :ripple="true"
            >
              <template v-slot:prepend>
                <v-avatar size="50" rounded="lg">
                  <v-img :src="song.albumCover" :alt="song.album"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ song.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ song.artist }} • {{ song.album }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  icon="mdi-play-circle"
                  variant="text"
                  color="deep-orange"
                  @click.stop="playPreview(song)"
                  v-if="song.preview"
                ></v-btn>
                <v-icon icon="mdi-chevron-right" class="ml-2"></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Détails de la chanson -->
        <v-card v-if="selectedSong" class="mx-auto" max-width="800" elevation="3">
          <v-img
            v-if="selectedSong.albumCover"
            :src="selectedSong.albumCover"
            height="200"
            cover
            class="align-end"
            gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%"
          >
            <v-card-title class="text-white text-h4 font-weight-bold">
              {{ selectedSong.title }}
            </v-card-title>
          </v-img>
          <v-toolbar color="deep-orange darken-1" dark v-else>
            <v-btn icon="mdi-arrow-left" @click="selectedSong = null"></v-btn>
            <v-toolbar-title>{{ selectedSong.title }}</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-row class="mt-2">
              <v-col cols="12" md="8">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-account-music" size="small" class="mr-2"></v-icon>
                  <span class="text-subtitle-1 font-weight-medium">{{ selectedSong.artist }}</span>
                </div>
                <div v-if="selectedSong.album" class="d-flex align-center mb-4">
                  <v-icon icon="mdi-album" size="small" class="mr-2"></v-icon>
                  <span class="text-subtitle-1">{{ selectedSong.album }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="d-flex justify-end">
                <v-btn
                  color="deep-orange"
                  variant="outlined"
                  prepend-icon="mdi-arrow-left"
                  @click="selectedSong = null"
                >
                  Retour
                </v-btn>
                <v-btn
                  v-if="selectedSong.preview"
                  color="deep-orange"
                  class="ml-2"
                  prepend-icon="mdi-play"
                  @click="playPreview(selectedSong)"
                >
                  Écouter
                </v-btn>
              </v-col>
            </v-row>
            
            <v-divider class="mb-4"></v-divider>
            
            <div v-if="loading" class="text-center py-4">
              <v-progress-circular indeterminate color="deep-orange"></v-progress-circular>
              <div class="mt-2">Chargement des paroles...</div>
            </div>
            <div v-else-if="selectedSong.lyrics" class="lyrics-container">
              <h3 class="text-h5 font-weight-bold mb-4">Paroles</h3>
              <div class="lyrics-text">
                {{ selectedSong.lyrics }}
              </div>
            </div>
            <div v-else class="text-center py-4">
              <v-icon icon="mdi-music-note-off" size="large" color="grey"></v-icon>
              <div class="mt-2">Paroles non disponibles pour cette chanson.</div>
              <v-btn
                color="deep-orange"
                variant="text"
                class="mt-4"
                @click="retryGetLyrics"
              >
                Réessayer
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Message si aucun résultat -->
        <v-card v-if="searchPerformed && searchResults.length === 0 && !loading && !error" class="mx-auto text-center py-4" max-width="800" elevation="3">
          <v-icon icon="mdi-playlist-remove" size="large" color="grey"></v-icon>
          <div class="mt-2 text-body-1">Aucun résultat trouvé. Veuillez essayer une autre recherche.</div>
          <div class="text-caption mt-2">Conseil: Essayez d'utiliser moins de mots ou vérifiez l'orthographe</div>
        </v-card>
      </v-container>
    </v-main>

    <!-- Lecteur audio -->
    <audio ref="audioPlayer" @ended="audioEnded"></audio>

    <!-- Notification de lecture -->
    <v-snackbar
      v-model="isPlaying"
      :timeout="-1"
      color="deep-orange"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-music" class="mr-2"></v-icon>
        <span v-if="currentSong">{{ currentSong.title }} - {{ currentSong.artist }}</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-stop" @click="stopPreview"></v-btn>
      </div>
    </v-snackbar>

    <v-footer app class="pa-0">
      <v-card flat tile width="100%" class="text-center">
        <v-card-text>
          <v-btn
            v-for="icon in ['mdi-github', 'mdi-twitter', 'mdi-instagram']"
            :key="icon"
            class="mx-2"
            :icon="icon"
            variant="text"
          ></v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          {{ new Date().getFullYear() }} — <strong>Recherche de Paroles</strong> | Propulsé par <a href="https://lyrics.ovh" target="_blank" class="text-decoration-none">Lyrics.ovh</a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import api from './services/api';

export default {
  name: 'App',
  
  data() {
    return {
      searchQuery: {
        title: '',
        artist: ''
      },
      searchResults: [],
      selectedSong: null,
      loading: false,
      error: '',
      searchPerformed: false,
      isPlaying: false,
      currentSong: null,
      theme: 'light'
    };
  },
  
  methods: {
    async searchLyrics() {
      if (!this.searchQuery.title && !this.searchQuery.artist) {
        this.error = 'Veuillez entrer un titre de chanson ou un nom d\'artiste';
        return;
      }
      
      this.loading = true;
      this.error = '';
      this.searchPerformed = true;
      this.selectedSong = null;
      this.stopPreview();
      
      try {
        const results = await api.searchSongs(this.searchQuery.title, this.searchQuery.artist);
        this.searchResults = results;
        
        // Sauvegarder la recherche dans l'historique
        this.saveToHistory(this.searchQuery);
      } catch (err) {
        this.error = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
        console.error('Erreur de recherche:', err);
      } finally {
        this.loading = false;
      }
    },
    
    async selectSong(song) {
      this.stopPreview();
      this.selectedSong = { ...song };
      this.loading = true;
      
      try {
        // Utiliser l'artiste et le titre pour récupérer les paroles
        const lyricsData = await api.getLyrics(song.artist, song.title);
        this.selectedSong.lyrics = lyricsData.lyrics;
        
        // Sauvegarder dans les favoris récents
        this.saveToRecent(song);
      } catch (err) {
        this.error = 'Impossible de récupérer les paroles. Veuillez réessayer.';
        console.error('Erreur de récupération des paroles:', err);
      } finally {
        this.loading = false;
      }
    },
    
    async retryGetLyrics() {
      if (!this.selectedSong) return;
      
      this.loading = true;
      try {
        const lyricsData = await api.getLyrics(this.selectedSong.artist, this.selectedSong.title);
        this.selectedSong.lyrics = lyricsData.lyrics;
      } catch (err) {
        this.error = 'Impossible de récupérer les paroles. Veuillez réessayer plus tard.';
      } finally {
        this.loading = false;
      }
    },
    
    playPreview(song) {
      if (!song.preview) return;
      
      // Arrêter la lecture en cours si elle existe
      this.stopPreview();
      
      // Configurer le nouveau morceau
      const audioPlayer = this.$refs.audioPlayer;
      audioPlayer.src = song.preview;
      audioPlayer.play();
      
      this.isPlaying = true;
      this.currentSong = song;
    },
    
    stopPreview() {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
      
      this.isPlaying = false;
      this.currentSong = null;
    },
    
    audioEnded() {
      this.isPlaying = false;
      this.currentSong = null;
    },
    
    saveToHistory(query) {
      try {
        // Récupérer l'historique existant
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        // Ajouter la nouvelle recherche
        history.unshift({
          title: query.title,
          artist: query.artist,
          timestamp: new Date().toISOString()
        });
        
        // Limiter à 10 entrées
        const limitedHistory = history.slice(0, 10);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
      } catch (e) {
        console.error('Erreur lors de la sauvegarde de l\'historique:', e);
      }
    },
    
    saveToRecent(song) {
      try {
        // Récupérer les chansons récentes
        const recentSongs = JSON.parse(localStorage.getItem('recentSongs') || '[]');
        
        // Vérifier si la chanson existe déjà
        const existingIndex = recentSongs.findIndex(s => s.id === song.id);
        if (existingIndex !== -1) {
          // Supprimer l'entrée existante
          recentSongs.splice(existingIndex, 1);
        }
        
        // Ajouter la chanson au début
        recentSongs.unshift({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          albumCover: song.albumCover,
          timestamp: new Date().toISOString()
        });
        
        // Limiter à 10 entrées
        const limitedRecent = recentSongs.slice(0, 10);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('recentSongs', JSON.stringify(limitedRecent));
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des chansons récentes:', e);
      }
    },
    
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.$vuetify.theme.global.name = this.theme;
    }
  },
  
  mounted() {
    // Initialiser le thème
    this.$vuetify.theme.global.name = this.theme;
  }
};
</script>

<style>
.lyrics-container {
  white-space: pre-line;
  line-height: 1.8;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.lyrics-text {
  font-size: 1.1rem;
  padding: 1rem 0;
}

.v-card {
  transition: transform 0.3s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>