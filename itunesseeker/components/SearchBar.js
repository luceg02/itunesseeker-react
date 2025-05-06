// src/components/SearchBar.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ onSearch, searchType, setSearchType }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Rechercher..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.searchTypesContainer}>
        <TouchableOpacity 
          style={[
            styles.searchTypeButton, 
            searchType === 'artist' && styles.activeSearchType
          ]}
          onPress={() => setSearchType('artist')}
        >
          <Text 
            style={[
              styles.searchTypeText, 
              searchType === 'artist' && styles.activeSearchTypeText
            ]}
          >
            Artiste
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.searchTypeButton, 
            searchType === 'track' && styles.activeSearchType
          ]}
          onPress={() => setSearchType('track')}
        >
          <Text 
            style={[
              styles.searchTypeText, 
              searchType === 'track' && styles.activeSearchTypeText
            ]}
          >
            Chanson
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.searchTypeButton, 
            searchType === 'both' && styles.activeSearchType
          ]}
          onPress={() => setSearchType('both')}
        >
          <Text 
            style={[
              styles.searchTypeText, 
              searchType === 'both' && styles.activeSearchTypeText
            ]}
          >
            Les deux
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Rechercher</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchTypesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  searchTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeSearchType: {
    backgroundColor: '#007bff',
  },
  searchTypeText: {
    fontSize: 14,
    color: '#333',
  },
  activeSearchTypeText: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchBar;