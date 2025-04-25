import axios from 'axios';

// Proxy CORS Anywhere
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Base URL pour l'API Lyrics.ovh
const LYRICS_API_URL = 'https://api.lyrics.ovh/v1';

// Base URL pour l'API Deezer (pour la recherche de chansons)
const DEEZER_API_URL = 'https://api.deezer.com';

export default {
  // Recherche de chansons via Deezer
  async searchSongs(title, artist) {
    try {
      let query = '';
      
      if (title && artist) {
        query = `${artist} ${title}`;
      } else if (title) {
        query = title;
      } else if (artist) {
        query = artist;
      }
      
      const response = await axios.get(`${CORS_PROXY}${DEEZER_API_URL}/search`, {
        params: {
          q: query,
          limit: 15
        }
      });
      
      // Transformer les résultats au format attendu par notre application
      return response.data.data.map(item => ({
        id: item.id,
        title: item.title,
        artist: item.artist.name,
        album: item.album.title,
        albumCover: item.album.cover_medium,
        duration: item.duration,
        preview: item.preview // URL pour l'aperçu audio
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  },
  
  // Récupération des paroles via Lyrics.ovh
  async getLyrics(artist, title) {
    try {
      // Nettoyer le titre et l'artiste pour éviter les problèmes d'URL
      const cleanArtist = encodeURIComponent(artist.trim());
      const cleanTitle = encodeURIComponent(title.trim());
      
      const response = await axios.get(`${LYRICS_API_URL}/${cleanArtist}/${cleanTitle}`);
      return { lyrics: response.data.lyrics };
    } catch (error) {
      console.error('Erreur lors de la récupération des paroles:', error);
      // Si l'API ne trouve pas les paroles, retourner un message
      return { lyrics: "Paroles non disponibles pour cette chanson." };
    }
  }
};