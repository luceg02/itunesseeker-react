// itunesApi.js
import axios from 'axios';

const BASE_URL = 'https://itunes.apple.com/search';

export const searchItunes = async (term, type = 'all', limit = 20) => {
  try {
    let params = { term, limit };
    
    // Définir le type de recherche
    if (type === 'artist') {
      params.entity = 'musicArtist';
    } else if (type === 'track') {
      params.entity = 'song';
    } else {
      params.media = 'music';
    }
    
    const response = await axios.get(BASE_URL, { params });
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la recherche iTunes:', error);
    throw error;
  }
};