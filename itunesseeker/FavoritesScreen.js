// FavoritesScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = ({ viewItemDetail, favorites, ratings }) => {
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptySubtitle}>
        Les éléments que vous ajoutez à vos favoris apparaîtront ici
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isTrack = item.wrapperType !== 'artist';
    const itemId = item.trackId || item.artistId;
    const itemRating = ratings[itemId] || 0;
    
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => viewItemDetail(item)}
      >
        <Image 
          source={{ uri: item.artworkUrl100 || 'https://via.placeholder.com/60' }}
          style={isTrack ? styles.trackImage : styles.artistImage} 
        />
        
        <View style={styles.itemInfo}>
          <Text style={styles.titleText} numberOfLines={1}>
            {isTrack ? item.trackName : item.artistName}
          </Text>
          
          {isTrack && (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {item.artistName}
            </Text>
          )}
          
          <Text style={styles.genreText}>
            {item.primaryGenreName || 'Musique'}
          </Text>
          
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons 
                key={star}
                name={star <= itemRating ? 'star' : 'star-outline'}
                size={16}
                color={star <= itemRating ? '#FFD700' : '#bdbdbd'}
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={24} color="#aaa" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => (item.trackId || item.artistId || Math.random()).toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  listContainer: {
    padding: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subtitleText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  genreText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  ratingStars: {
    flexDirection: 'row',
  },
});

export default FavoritesScreen;