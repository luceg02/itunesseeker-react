// SearchScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Image
} from 'react-native';
import { searchItunes } from './iTunesApi';

const SearchScreen = ({ navigation, viewItemDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await searchItunes(searchTerm, searchType);
      setResults(data);
    } catch (error) {
      console.error('Erreur:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isTrack = item.wrapperType !== 'artist';
    
    return (
      <TouchableOpacity 
        style={styles.resultItem}
        onPress={() => viewItemDetail(item)}
      >
        <Image 
          source={{ uri: item.artworkUrl100 || 'https://via.placeholder.com/60' }}
          style={styles.thumbnail}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>
            {isTrack ? item.trackName : item.artistName}
          </Text>
          {isTrack && (
            <Text style={styles.itemArtist}>{item.artistName}</Text>
          )}
          <Text style={styles.itemGenre}>
            {item.primaryGenreName || 'Musique'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher sur iTunes..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, searchType === 'all' && styles.activeFilter]}
          onPress={() => setSearchType('all')}
        >
          <Text style={searchType === 'all' ? styles.activeFilterText : styles.filterText}>
            Tous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, searchType === 'artist' && styles.activeFilter]}
          onPress={() => setSearchType('artist')}
        >
          <Text style={searchType === 'artist' ? styles.activeFilterText : styles.filterText}>
            Artistes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, searchType === 'track' && styles.activeFilter]}
          onPress={() => setSearchType('track')}
        >
          <Text style={searchType === 'track' ? styles.activeFilterText : styles.filterText}>
            Chansons
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loaderText}>Recherche en cours...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => (item.trackId || item.artistId || Math.random()).toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchTerm.length > 0 
                  ? "Aucun résultat trouvé" 
                  : "Recherchez votre musique préférée"}
              </Text>
            </View>
          }
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
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
  },
  resultItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  itemInfo: {
    marginLeft: 15,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemGenre: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen;