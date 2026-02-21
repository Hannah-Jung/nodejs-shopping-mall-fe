import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface SearchBoxProps {
  searchQuery: Record<string, string>;
  setSearchQuery: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  placeholder: string;
  field: string;
}

const SearchBox = ({ placeholder, field }: SearchBoxProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get(field) ?? "");

  useEffect(() => {
    setKeyword(searchParams.get(field) ?? "");
  }, [searchParams, field]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(field, value);
    } else {
      params.delete(field);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const onCheckEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(keyword);
    }
  };

  const onClear = () => {
    setKeyword("");
    handleSearch("");
  };

  return (
    <div className="w-full max-w-l">
      <div className="group flex items-center gap-2 rounded-md border border-input bg-muted/30 px-4 py-2 transition-all duration-300 ease-out focus-within:border-primary/75 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/20">
        <Search className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          onKeyDown={onCheckEnter}
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
        {keyword && (
          <button
            onClick={onClear}
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
