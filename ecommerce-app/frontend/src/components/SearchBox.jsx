import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} class="flex items-center w-full max-w-md">
      <div class="relative w-full">
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search premium gear..."
          value={keyword}
          class="w-full bg-[#12131a]/80 text-gray-200 text-xs border border-white/10 focus:border-brand-500 rounded-full py-2 pl-4 pr-10 outline-none transition-all placeholder-gray-600"
        />
        <button
          type="submit"
          class="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-brand-400 hover:bg-white/5 rounded-full transition-all"
          aria-label="Search"
        >
          <Search class="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
