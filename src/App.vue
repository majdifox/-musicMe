<template>
  <v-app class="music-app">
    <!-- Main content with sidebar layout -->
    <div class="app-container">
      <!-- Sidebar navigation -->
      <div class="sidebar">
        <div class="logo-container">
          <div class="logo">
            <span class="music-icon">♫</span>
            <span class="logo-text">Tune<span class="accent">Find</span></span>
          </div>
        </div>
        
        <v-list class="sidebar-menu">
          <v-list-item prepend-icon="mdi-magnify" title="Search" value="search" class="menu-item active"></v-list-item>
          <v-list-item prepend-icon="mdi-history" title="History" value="history" class="menu-item"></v-list-item>
          <v-list-item prepend-icon="mdi-heart" title="Favorites" value="favorites" class="menu-item"></v-list-item>
          <v-list-item prepend-icon="mdi-playlist-music" title="Playlists" value="playlists" class="menu-item"></v-list-item>
        </v-list>
        
        <div class="now-playing-preview" v-if="currentSong">
          <v-img :src="currentSong.albumCover" width="48" height="48" class="rounded"></v-img>
          <div class="now-playing-info">
            <div class="song-title">{{ currentSong.title }}</div>
            <div class="artist-name">{{ currentSong.artist }}</div>
          </div>
          <v-btn icon="mdi-pause-circle" variant="text" color="accent" @click="stopPreview"></v-btn>
        </div>
      </div>

      <!-- Main content area -->
      <div class="content-area">
        <!-- Alert message -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          closable
          class="mb-4 error-alert"
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <!-- Header with search -->
        <div class="content-header">
          <h1 class="page-title">Find Lyrics</h1>
          
          <div class="search-container">
            <v-form @submit.prevent="searchLyrics" class="search-form">
              <div class="search-fields">
                <div class="search-field">
                  <v-text-field
                    v-model="searchQuery.title"
                    label="Song Title"
                    variant="solo"
                    hide-details
                    density="compact"
                    bg-color="surface-variant"
                    class="search-input"
                    prepend-inner-icon="mdi-music-note"
                    clearable
                  ></v-text-field>
                </div>
                
                <div class="search-field">
                  <v-text-field
                    v-model="searchQuery.artist"
                    label="Artist"
                    variant="solo"
                    hide-details
                    density="compact"
                    bg-color="surface-variant"
                    class="search-input"
                    prepend-inner-icon="mdi-account-music"
                    clearable
                  ></v-text-field>
                </div>
                
                <v-btn 
                  color="accent" 
                  type="submit" 
                  :loading="loading"
                  :disabled="!searchQuery.title && !searchQuery.artist"
                  class="search-button"
                >
                  <v-icon icon="mdi-magnify"></v-icon>
                </v-btn>
              </div>
            </v-form>
          </div>
        </div>

        <!-- Main content scrollable area -->
        <div class="scrollable-content">
          <!-- Results view when not viewing a song -->
          <div v-if="!selectedSong" class="results-view">
            <!-- No search performed yet -->
            <div v-if="!searchPerformed" class="welcome-screen">
              <v-icon icon="mdi-music-note-outline" size="x-large" class="welcome-icon"></v-icon>
              <h2>Search for lyrics</h2>
              <p>Enter a song title or artist to get started</p>
            </div>
            
            <!-- Search results -->
            <div v-else-if="searchResults.length > 0" class="search-results">
              <div class="results-header">
                <h2>Results <span class="results-count">{{ searchResults.length }}</span></h2>
              </div>
              
              <div class="results-grid">
                <div 
                  v-for="(song, index) in searchResults" 
                  :key="index" 
                  class="song-card"
                  @click="selectSong(song)"
                >
                  <div class="album-art">
                    <v-img 
                      :src="song.albumCover" 
                      :alt="song.title"
                      cover
                      height="170"
                      class="rounded-lg"
                    ></v-img>
                    <v-btn 
                      v-if="song.preview"
                      icon="mdi-play-circle" 
                      size="x-large"
                      variant="text" 
                      color="white" 
                      class="play-button"
                      @click.stop="playPreview(song)"
                    ></v-btn>
                  </div>
                  <div class="song-info">
                    <h3 class="song-title">{{ song.title }}</h3>
                    <p class="artist-name">{{ song.artist }}</p>
                    <p class="album-name" v-if="song.album">{{ song.album }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No results message -->
            <div v-else-if="searchPerformed && !loading" class="no-results">
              <v-icon icon="mdi-music-off" size="x-large"></v-icon>
              <h2>No results found</h2>
              <p>Try different keywords or check spelling</p>
            </div>
          </div>

          <!-- Song details view -->
          <div v-else class="song-details">
            <div class="song-header">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                @click="selectedSong = null"
                class="back-button"
              ></v-btn>
              
              <div class="song-cover">
                <v-img
                  :src="selectedSong.albumCover"
                  height="300"
                  width="300"
                  cover
                  class="rounded-lg mx-auto"
                ></v-img>
              </div>
              
              <div class="song-info-header">
                <h1 class="song-title">{{ selectedSong.title }}</h1>
                <h2 class="artist-name">{{ selectedSong.artist }}</h2>
                <p class="album-name" v-if="selectedSong.album">{{ selectedSong.album }}</p>
                
                <div class="controls">
                  <v-btn
                    v-if="selectedSong.preview"
                    color="accent"
                    prepend-icon="mdi-play"
                    class="play-button"
                    @click="playPreview(selectedSong)"
                  >
                    Play Preview
                  </v-btn>
                </div>
              </div>
            </div>
            
            <div class="lyrics-section">
              <h2 class="section-title">Lyrics</h2>
              
              <div v-if="loading" class="loading-container">
                <v-progress-circular indeterminate color="accent" size="70"></v-progress-circular>
                <p>Loading lyrics...</p>
              </div>
              
              <div v-else-if="selectedSong.lyrics" class="lyrics-content">
                {{ selectedSong.lyrics }}
              </div>
              
              <div v-else class="no-lyrics">
                <v-icon icon="mdi-music-note-off" size="large"></v-icon>
                <p>Lyrics not available</p>
                <v-btn
                  color="accent"
                  variant="text"
                  @click="retryGetLyrics"
                >
                  Try Again
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden audio player -->
    <audio ref="audioPlayer" @ended="audioEnded"></audio>
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
      currentSong: null
    };
  },
  
  methods: {
    async searchLyrics() {
      if (!this.searchQuery.title && !this.searchQuery.artist) {
        this.error = 'Please enter a song title or artist name';
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
        
        // Save search to history
        this.saveToHistory(this.searchQuery);
      } catch (err) {
        this.error = 'An error occurred during search. Please try again.';
        console.error('Search error:', err);
      } finally {
        this.loading = false;
      }
    },
    
    async selectSong(song) {
      this.stopPreview();
      this.selectedSong = { ...song };
      this.loading = true;
      
      try {
        // Use artist and title to get lyrics
        const lyricsData = await api.getLyrics(song.artist, song.title);
        this.selectedSong.lyrics = lyricsData.lyrics;
        
        // Save to recent favorites
        this.saveToRecent(song);
      } catch (err) {
        this.error = 'Unable to retrieve lyrics. Please try again.';
        console.error('Lyrics retrieval error:', err);
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
        this.error = 'Unable to retrieve lyrics. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    
    playPreview(song) {
      if (!song.preview) return;
      
      // Stop current playback if exists
      this.stopPreview();
      
      // Configure new track
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
        // Get existing history
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        // Add new search
        history.unshift({
          title: query.title,
          artist: query.artist,
          timestamp: new Date().toISOString()
        });
        
        // Limit to 10 entries
        const limitedHistory = history.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
      } catch (e) {
        console.error('Error saving search history:', e);
      }
    },
    
    saveToRecent(song) {
      try {
        // Get recent songs
        const recentSongs = JSON.parse(localStorage.getItem('recentSongs') || '[]');
        
        // Check if song already exists
        const existingIndex = recentSongs.findIndex(s => s.id === song.id);
        if (existingIndex !== -1) {
          // Remove existing entry
          recentSongs.splice(existingIndex, 1);
        }
        
        // Add song to beginning
        recentSongs.unshift({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          albumCover: song.albumCover,
          timestamp: new Date().toISOString()
        });
        
        // Limit to 10 entries
        const limitedRecent = recentSongs.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('recentSongs', JSON.stringify(limitedRecent));
      } catch (e) {
        console.error('Error saving recent songs:', e);
      }
    }
  },
  
  mounted() {
    // Set dark theme permanently
    this.$vuetify.theme.global.name = 'dark';
  }
};
</script>

<style>
.music-app {
  background-color: #121212;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: white;
}

.app-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

/* Sidebar styles */
.sidebar {
  width: 240px;
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
}

.logo-container {
  padding: 24px 16px;
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-icon {
  font-size: 24px;
  margin-right: 8px;
  color: #ff2d55;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.accent {
  color: #ff2d55;
}

.sidebar-menu {
  flex-grow: 1;
  background-color: transparent;
}

.menu-item {
  border-radius: 8px;
  margin: 6px 8px;
}

.menu-item.active {
  background-color: rgba(255, 45, 85, 0.15);
}

.now-playing-preview {
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.now-playing-info {
  flex-grow: 1;
  margin: 0 12px;
  overflow: hidden;
}

.now-playing-info .song-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.now-playing-info .artist-name {
  font-size: 12px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main content area styles */
.content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 24px 32px 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
}

.search-container {
  margin-bottom: 16px;
}

.search-form {
  width: 100%;
}

.search-fields {
  display: flex;
  gap: 16px;
}

.search-field {
  flex-grow: 1;
}

.search-input {
  border-radius: 8px;
}

.search-button {
  height: 48px;
  width: 48px;
  min-width: 48px;
  border-radius: 24px;
}

.error-alert {
  margin: 16px 32px 0;
}

/* Scrollable content area */
.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 32px 32px;
}

/* Welcome screen */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
}

.welcome-icon {
  font-size: 64px;
  opacity: 0.6;
  margin-bottom: 24px;
}

.welcome-screen h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.welcome-screen p {
  opacity: 0.7;
}

/* Search results */
.results-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.results-header h2 {
  font-size: 22px;
  font-weight: 600;
}

.results-count {
  display: inline-block;
  background-color: #ff2d55;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 14px;
  margin-left: 8px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.song-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.song-card:hover {
  transform: translateY(-4px);
}

.album-art {
  position: relative;
  margin-bottom: 12px;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.album-art:hover .play-button {
  opacity: 1;
}

.song-info {
  padding: 0 4px;
}

.song-info .song-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-info .artist-name {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-info .album-name {
  font-size: 12px;
  opacity: 0.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* No results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  opacity: 0.7;
}

.no-results h2 {
  margin: 16px 0 8px;
}

/* Song details */
.song-details {
  padding-bottom: 48px;
}

.song-header {
  position: relative;
  padding: 24px 0 48px;
  text-align: center;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
}

.song-cover {
  margin-bottom: 24px;
}

.song-info-header {
  max-width: 500px;
  margin: 0 auto;
}

.song-info-header .song-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.song-info-header .artist-name {
  font-size: 20px;
  font-weight: 500;
  opacity: 0.8;
  margin-bottom: 4px;
}

.song-info-header .album-name {
  font-size: 16px;
  opacity: 0.6;
  margin-bottom: 16px;
}

.controls {
  margin: 24px 0;
}

.lyrics-section {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-container p {
  margin-top: 16px;
}

.lyrics-content {
  white-space: pre-line;
  line-height: 1.8;
  font-size: 16px;
}

.no-lyrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.no-lyrics p {
  margin: 16px 0;
}

/* Mobile responsiveness */
@media (max-width: 960px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #333;
    padding: 8px 16px;
  }
  
  .logo-container {
    padding: 8px 0;
  }
  
  .sidebar-menu {
    display: flex;
    flex-direction: row;
    padding: 0 16px;
  }
  
  .menu-item {
    margin: 0 4px;
  }
  
  .now-playing-preview {
    display: none;
  }
  
  .content-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .search-fields {
    flex-direction: column;
    gap: 8px;
  }
  
  .scrollable-content {
    padding: 0 16px 16px;
  }
  
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
  
  .song-header {
    padding: 16px 0 32px;
  }
  
  .song-cover img {
    width: 200px;
    height: 200px;
  }
  
  .song-info-header .song-title {
    font-size: 24px;
  }
  
  .song-info-header .artist-name {
    font-size: 18px;
  }
  
  .lyrics-section {
    padding: 16px;
  }
}
</style>