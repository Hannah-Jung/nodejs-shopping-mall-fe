import { useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface SearchBoxProps {
  searchQuery: Record<string, unknown>;
  setSearchQuery: (query: Record<string, unknown>) => void;
  placeholder: string;
  field: string;
}

const SearchBox = ({
  searchQuery,
  setSearchQuery,
  placeholder,
  field,
}: SearchBoxProps) => {
  const [query] = useSearchParams();
  const [keyword, setKeyword] = useState(query.get(field) ?? "");

  const onCheckEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value;
      setSearchQuery({ ...searchQuery, page: 1, [field]: value });
    }
  };

  return (
    <div className="search-box">
      <Search className="size-4" />
      <input
        type="text"
        placeholder={placeholder}
        onKeyDown={onCheckEnter}
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
      />
    </div>
  );
};

export default SearchBox;
