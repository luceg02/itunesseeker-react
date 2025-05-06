// src/components/ResultItem.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import Icon from 'react-native-vector-icons/Ionicons';

const ResultItem = ({ item, onPress }) => {
  const { isFavorite } = useFavorites();
  
  const getItemId = () => {
    return item.trackId || item.artistId;
  };
  
  const renderArtistItem = () => (
    <View style={styles.containerArtist}>
      <Image 
        source={item.artistLinkUrl ? { uri: item.artistLinkUrl } : require('../assets/artist-placeholder.png')} 
        style={styles.artistImage} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.artistName}>{item.artistName}</Text>
        <Text style={styles.genre}>{item.primaryGenreName}</Text>
      </View>
      {isFavorite(getItemId()) && (
        <Icon name="heart" size={24} color="#ff3b30" style={styles.favoriteIcon} />
      )}
    </View>
  );
  
  const renderTrackItem = () => (
    <View style={styles.containerTrack}>
      <Image 
        source={item.artworkUrl100 ? { uri: item.artworkUrl100 } : require('../assets/track-placeholder.png')} 
        style={styles.trackImage} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.trackName} numberOfLines={1}>{item.trackName}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{item.artistName}</Text>
        <Text style={styles.albumName} numberOfLines={1}>{item.collectionName}</Text>
      </View>
      {isFavorite(getItemId()) && (
        <Icon name="heart" size={24} color="#ff3b30" style={styles.favoriteIcon} />
      )}
    </View>
  );
  
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      {item.wrapperType === 'artist' ? renderArtistItem() : renderTrackItem()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerTrack: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  containerArtist: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  trackName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  albumName: {
    fontSize: 12,
    color: '#999',
  },
  genre: {
    fontSize: 14,
    color: '#666',
  },
  favoriteIcon: {
    marginLeft: 10,
  },
});

export default ResultItem;