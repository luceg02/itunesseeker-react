import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Charger les favoris et les ratings depuis le stockage local au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const storedRatings = await AsyncStorage.getItem('ratings');
        
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        
        if (storedRatings) {
          setRatings(JSON.parse(storedRatings));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data from storage:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Sauvegarder les favoris dans le stockage local à chaque modification
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        await AsyncStorage.setItem('ratings', JSON.stringify(ratings));
      } catch (error) {
        console.error('Error saving data to storage:', error);
      }
    };
    
    if (!isLoading) {
      saveData();
    }
  }, [favorites, ratings, isLoading]);

  // Ajouter un élément aux favoris
  const addToFavorites = (item) => {
    setFavorites((prevFavorites) => {
      // Vérifier si l'élément existe déjà
      if (prevFavorites.some((fav) => fav.trackId === item.trackId || fav.artistId === item.artistId)) {
        return prevFavorites;
      }
      return [...prevFavorites, item];
    });
  };

  // Supprimer un élément des favoris
  const removeFromFavorites = (itemId) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((item) => 
        (item.trackId !== itemId && item.artistId !== itemId)
      )
    );
  };

  // Vérifier si un élément est dans les favoris
  const isFavorite = (itemId) => {
    return favorites.some((item) => item.trackId === itemId || item.artistId === itemId);
  };

  // Ajouter ou mettre à jour le rating d'un élément
  const rateItem = (itemId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [itemId]: rating,
    }));
  };

  // Obtenir le rating d'un élément
  const getItemRating = (itemId) => {
    return ratings[itemId] || 0;
  };

  const value = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    rateItem,
    getItemRating,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};