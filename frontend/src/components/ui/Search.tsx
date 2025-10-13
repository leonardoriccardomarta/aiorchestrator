import React, { useState, useCallback } from 'react';
import { Input } from './Input';
import { Icons } from './Icon';
import { useDebounce } from '../../hooks/useDebounce';

export interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
}

export const Search: React.FC<SearchProps> = ({
  placeholder = 'Cerca...',
  onSearch,
  debounceMs = 300,
  className,
  disabled = false,
  defaultValue = '',
}) => {
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, debounceMs);

  const handleSearch = useCallback((searchQuery: string) => {
    onSearch(searchQuery);
  }, [onSearch]);

  React.useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  return (
    <div className={className}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<Icons.Search />}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}; 