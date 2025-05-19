import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  LocalHospital as PatientIcon,
  Medication as MedicationIcon,
  Inventory as ResourceIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

const SearchModal = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    isSearchOpen,
    closeSearch,
    searchResults,
    loading,
    performSearch,
    searchHistory,
    clearHistory,
  } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');

  // Reset search term when modal closes
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const handleResultClick = (result) => {
    navigate(result.link, { state: { data: result.data } });
    closeSearch();
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    performSearch(term);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'patient':
        return <PatientIcon />;
      case 'medication':
        return <MedicationIcon />;
      case 'resource':
        return <ResourceIcon />;
      default:
        return <PersonIcon />;
    }
  };

  return (
    <Dialog
      open={isSearchOpen}
      onClose={closeSearch}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          minHeight: '50vh',
          maxHeight: '80vh',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchIcon color="action" />
        <TextField
          autoFocus
          fullWidth
          placeholder="Search patients, medications, resources..."
          value={searchTerm}
          onChange={handleSearchChange}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: '1.2rem' },
          }}
        />
        <IconButton onClick={closeSearch} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : searchTerm ? (
          searchResults.length > 0 ? (
            <List>
              {searchResults.map((result, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleResultClick(result)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>{getIcon(result.type)}</ListItemIcon>
                  <ListItemText
                    primary={result.title}
                    secondary={result.subtitle}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: theme.typography.fontWeightMedium,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No results found for "{searchTerm}"
              </Typography>
            </Box>
          )
        ) : searchHistory.length > 0 ? (
          <Box sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Recent Searches
              </Typography>
              <IconButton size="small" onClick={clearHistory}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {searchHistory.map((term, index) => (
                <Chip
                  key={index}
                  label={term}
                  onClick={() => handleHistoryClick(term)}
                  icon={<HistoryIcon />}
                  variant="outlined"
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Start typing to search...
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal; 