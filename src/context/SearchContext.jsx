import React, { createContext, useContext, useState, useCallback } from 'react';
import SearchService from '../services/SearchService';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchResults([]);
  };

  const addToHistory = (term) => {
    if (!term.trim()) return;
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(item => item !== term)].slice(0, 5);
      return newHistory;
    });
  };

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await SearchService.searchGlobal(query);
      setSearchResults(results);
      addToHistory(query);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = () => setSearchHistory([]);

  const value = {
    isSearchOpen,
    searchResults,
    loading,
    searchHistory,
    openSearch,
    closeSearch,
    performSearch,
    clearHistory,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 