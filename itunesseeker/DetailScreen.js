// DetailScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DetailScreen = ({ 
  item, 
  goBack, 
  isFavorite, 
  addToFavorites, 
  removeFromFavorites,
  rating,
  rateItem
}) => {
  const isTrack = item.wrapperType !== 'artist';
  
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  };
  
  const handleRating = (value) => {
    rateItem(value);
  };
  
  const openLink = async (url) => {
    if (url && await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleRating(i)}>
          <Ionicons 
            name={i <= rating ? 'star' : 'star-outline'} 
            size={24} 
            color={i <= rating ? '#FFD700' : '#bdbdbd'} 
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        >
          <Ionicons name="arrow-back-circle" size={36} color="#007bff" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isTrack ? item.trackName : item.artistName}
        </Text>
      </View>
      
      <ScrollView>
        <View style={styles.artwork}>
          <Image 
            source={{ uri: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '500x500') : 'https://via.placeholder.com/300' }}
            style={styles.artworkImage} 
          />
          
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{isTrack ? item.trackName : item.artistName}</Text>
            {isTrack && <Text style={styles.subtitle}>{item.artistName}</Text>}
            {isTrack && item.collectionName && <Text style={styles.albumName}>{item.collectionName}</Text>}
            <Text style={styles.genre}>{item.primaryGenreName || 'Musique'}</Text>
          </View>
        </View>
        
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={28} color={isFavorite ? '#FF3B30' : '#333'} />
            <Text style={styles.actionText}>
              {isFavorite ? 'Favoris' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
          
          {isTrack && item.previewUrl && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => openLink(item.previewUrl)}
            >
              <Ionicons name="play-circle" size={28} color="#333" />
              <Text style={styles.actionText}>Écouter</Text>
            </TouchableOpacity>
          )}
          
          {(item.collectionViewUrl || item.artistLinkUrl) && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => openLink(item.collectionViewUrl || item.artistLinkUrl)}
            >
              <Ionicons name="open-outline" size={28} color="#333" />
              <Text style={styles.actionText}>iTunes</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.sectionTitle}>Votre note</Text>
          <View style={styles.stars}>
            {renderStars()}
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Informations</Text>
          
          {isTrack && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Titre</Text>
                <Text style={styles.detailValue}>{item.trackName}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Artiste</Text>
                <Text style={styles.detailValue}>{item.artistName}</Text>
              </View>
              
              {item.collectionName && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Album</Text>
                  <Text style={styles.detailValue}>{item.collectionName}</Text>
                </View>
              )}
              
              {item.trackTimeMillis && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Durée</Text>
                  <Text style={styles.detailValue}>
                    {Math.floor(item.trackTimeMillis / 60000)}:{String(Math.floor(item.trackTimeMillis / 1000) % 60).padStart(2, '0')}
                  </Text>
                </View>
              )}
              
              {item.releaseDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sortie</Text>
                  <Text style={styles.detailValue}>
                    {new Date(item.releaseDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Genre</Text>
            <Text style={styles.detailValue}>{item.primaryGenreName || 'Non spécifié'}</Text>
          </View>
        </View>
        
        <View style={styles.bottomBackButton}>
          <TouchableOpacity onPress={goBack} style={styles.backButtonLarge}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Retour à la recherche</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#007bff',
    marginLeft: 5,
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 30,
  },
  artwork: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  artworkImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  headerInfo: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 3,
  },
  albumName: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 3,
  },
  genre: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
  },
  ratingContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stars: {
    flexDirection: 'row',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  detailLabel: {
    width: 80,
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    flex: 1,
  },
  bottomBackButton: {
    padding: 20,
    alignItems: 'center',
  },
  backButtonLarge: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default DetailScreen;