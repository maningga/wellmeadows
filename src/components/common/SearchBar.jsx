import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import debounce from 'lodash/debounce';
import SearchService from '../../services/SearchService';

const SearchBar = ({
  category,
  onSearch,
  onRefresh,
  placeholder = 'Search...',
  initialSearchTerm = '',
  initialFilters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filters, setFilters] = useState(initialFilters);
  const [anchorEl, setAnchorEl] = useState(null);
  const [availableFilters] = useState(SearchService.getFilters(category));

  const debouncedSearch = useCallback(
    debounce((term, filters) => {
      onSearch(term, filters);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value, filters);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };
    setFilters(newFilters);
    debouncedSearch(searchTerm, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    debouncedSearch(searchTerm, {});
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    debouncedSearch('', filters);
  };

  const getFilterLabel = (filterName) => {
    return filterName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
      <TextField
        size="small"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ flexGrow: 1 }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          endAdornment: searchTerm && (
            <IconButton size="small" onClick={handleClearSearch}>
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />

      {availableFilters.length > 0 && (
        <>
          <Tooltip title="Filter">
            <IconButton onClick={handleFilterClick}>
              <FilterIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {availableFilters.map((filterName) => (
              <MenuItem key={filterName} sx={{ minWidth: 200 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{getFilterLabel(filterName)}</InputLabel>
                  <Select
                    value={filters[filterName] || ''}
                    onChange={(e) => handleFilterChange(filterName, e.target.value)}
                    label={getFilterLabel(filterName)}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {SearchService.getFilterValues(category, filterName).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleClearFilters}>
              <Button
                fullWidth
                size="small"
                startIcon={<ClearIcon />}
                color="primary"
              >
                Clear Filters
              </Button>
            </MenuItem>
          </Menu>
        </>
      )}

      <Tooltip title="Refresh">
        <IconButton onClick={onRefresh}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      {/* Active Filters */}
      {Object.entries(filters).length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(filters).map(([key, value]) => (
            value && (
              <Chip
                key={key}
                label={`${getFilterLabel(key)}: ${value}`}
                onDelete={() => handleFilterChange(key, '')}
                size="small"
              />
            )
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar; 