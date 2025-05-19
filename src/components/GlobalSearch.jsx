import React, { useState, useCallback } from 'react';
import {
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Popper,
  Fade,
  ClickAwayListener,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  LocalHospital as PatientIcon,
  Medication as MedicationIcon,
  Inventory as ResourceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import SearchService from '../services/SearchService';

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        const results = await SearchService.searchGlobal(term);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget);
    setLoading(true);
    debouncedSearch(value);
  };

  const handleResultClick = (result) => {
    navigate(result.link, { state: { data: result.data } });
    setSearchTerm('');
    setSearchResults([]);
    setAnchorEl(null);
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

  const handleClickAway = () => {
    setAnchorEl(null);
    setSearchResults([]);
  };

  const open = Boolean(anchorEl) && (loading || searchResults.length > 0);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search patients, medications, resources..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        />
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          style={{ width: anchorEl?.offsetWidth, zIndex: 1400 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper 
                elevation={3}
                sx={{
                  mt: 1,
                  maxHeight: '400px',
                  overflow: 'auto',
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : searchResults.length > 0 ? (
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
                        <ListItemIcon>
                          {getIcon(result.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.subtitle}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : searchTerm && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No results found
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default GlobalSearch; 