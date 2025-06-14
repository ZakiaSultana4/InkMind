'use client'
import { useEffect, useState } from 'react';
import AllBlogs from '@/components/AllBlogs';
import Banner from '@/components/Banner';

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  useEffect(() => {
    if (searchInput.trim() === '') {
      setSearchQuery(''); // Auto-refresh posts when input cleared
    }
  }, [searchInput]);

  return (
    <main>
      <Banner
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
      />
      <AllBlogs searchQuery={searchQuery} />
    </main>
  );
}
