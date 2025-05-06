// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchScreen from './SearchScreen';
import FavoritesScreen from './FavoritesScreen';
import DetailScreen from './DetailScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});

  // Charger les favoris au démarrage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const storedRatings = await AsyncStorage.getItem('ratings');
        
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        
        if (storedRatings) {
          setRatings(JSON.parse(storedRatings));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    };
    
    loadFavorites();
  }, []);

  // Sauvegarder les favoris lorsqu'ils changent
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        await AsyncStorage.setItem('ratings', JSON.stringify(ratings));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des favoris:', error);
      }
    };
    
    saveFavorites();
  }, [favorites, ratings]);

  // Fonctions pour gérer les favoris
  const addToFavorites = (item) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(fav => fav.trackId === item.trackId || fav.artistId === item.artistId)) {
        return [...prevFavorites, item];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (item) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(fav => 
        fav.trackId !== item.trackId && fav.artistId !== item.artistId
      )
    );
  };

  const isFavorite = (item) => {
    return favorites.some(fav => 
      fav.trackId === item.trackId || fav.artistId === item.artistId
    );
  };

  // Fonctions pour gérer les ratings
  const rateItem = (item, rating) => {
    const itemId = item.trackId || item.artistId;
    setRatings(prevRatings => ({
      ...prevRatings,
      [itemId]: rating
    }));
  };

  const getItemRating = (item) => {
    const itemId = item.trackId || item.artistId;
    return ratings[itemId] || 0;
  };

  // Navigation
  const viewItemDetail = (item) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  const goBack = () => {
    setShowDetail(false);
  };

  // Si nous sommes en mode détail, montrer l'écran de détail
  if (showDetail && selectedItem) {
    return (
      <NavigationContainer>
        <DetailScreen 
          item={selectedItem} 
          goBack={goBack} 
          isFavorite={isFavorite(selectedItem)}
          addToFavorites={() => addToFavorites(selectedItem)}
          removeFromFavorites={() => removeFromFavorites(selectedItem)}
          rating={getItemRating(selectedItem)}
          rateItem={(rating) => rateItem(selectedItem, rating)}
        />
      </NavigationContainer>
    );
  }

  // Sinon, montrer les onglets normaux
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart' : 'heart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Search" 
          options={{ title: 'Rechercher' }}
        >
          {(props) => <SearchScreen {...props} viewItemDetail={viewItemDetail} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Favorites" 
          options={{ title: 'Favoris' }}
        >
          {(props) => (
            <FavoritesScreen 
              {...props} 
              favorites={favorites} 
              viewItemDetail={viewItemDetail}
              ratings={ratings}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}