import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import Loader from "../Loader";
import {
  Wrapper,
  Input,
  SuggestionsList,
  SuggestionItem,
  ClearButton,
} from "./style";
import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query";

export interface Option {
  key: string;
  label: string;
}
interface AutocompleteProps {
  onSelect: (id: string) => void;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  getQueryFn: (text: string) => QueryFunction<Option[], QueryKey, never>;
  getQueryKey: (text: string) => QueryKey;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  onSelect,
  className,
  onChange,
  onKeyDown,
  placeholder = "Search...",
  getQueryFn,
  getQueryKey,
  ...rest
}) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(true);

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { data, isLoading } = useQuery<Option[], Error>({
    queryKey: getQueryKey(query),
    queryFn: getQueryFn(query),
    enabled: query.length >= 2,
    staleTime: Infinity,
  });
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  useEffect(() => {
    if (data) {
      setSuggestions(data);
      setShowDropDown(true);
    }
  }, [data]);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setQuery(newValue);
    setValue(newValue);
    if (!newValue) {
      onSelect("");
    }
    if (onChange) {
      onChange(e);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (showDropDown) {
      if (e.key === "Enter") {
        const selectedSuggestion = suggestions[activeIndex];
        if (selectedSuggestion) {
          setValue(selectedSuggestion.label);
          setShowDropDown(false);
          setActiveIndex(-1);
          onSelect(selectedSuggestion.key);
        }
      } else if (e.key === "ArrowUp") {
        setActiveIndex(Math.max(0, activeIndex - 1));
      } else if (e.key === "ArrowDown") {
        setActiveIndex(Math.min(suggestions.length - 1, activeIndex + 1));
      }
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  }

  function handleClick(suggestion: Option) {
    setValue(suggestion.label);
    setShowDropDown(false);
    setActiveIndex(-1);
    onSelect(suggestion.key);
    setSuggestions([]);
  }
  function handleClear() {
    setQuery("");
    setValue("");
    setSuggestions([]);
    onSelect("");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null; // Type casting event.target as HTMLElement
      const targetClassName = target?.className || ""; // Ensure that target is an HTMLElement

      if (
        targetClassName.includes("autocomplete") ||
        targetClassName.includes("dropDown")
      ) {
        setShowDropDown(true);
      } else {
        setShowDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Wrapper>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <Input
          className={`autocomplete ${className}`}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          {...rest}
        />
        {value && (
          <ClearButton onClick={handleClear} aria-label="Clear input">
            ✖
          </ClearButton>
        )}
      </div>
      {isLoading && (
        <SuggestionsList className="dropDown">
          <Loader />
        </SuggestionsList>
      )}

      {!isLoading && suggestions.length > 0 && showDropDown && query !== "" && (
        <SuggestionsList>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion.key}
              isActive={index === activeIndex}
              onClick={() => handleClick(suggestion)}
              className="dropDown"
              onMouseEnter={() => setActiveIndex(index)}
            >
              {suggestion.label}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </Wrapper>
  );
};

export default Autocomplete;
