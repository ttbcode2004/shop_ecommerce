import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchNavbar() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearch = searchValue.trim();
    
    if (trimmedSearch) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
      setSearchValue("")
    } 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-1.5 border border-slate-400 rounded-full w-54 sm:w-60 ">
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown} 
        className="flex w-full outline-none text-[16px]"
      />
      <button type="submit" className="flex-shrink-0">
        <Search size={20} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
      </button>
    </form>
  );
}