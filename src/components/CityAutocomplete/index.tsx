import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { useFetchCities } from "../../api";
import Loader from "../Loader";
import { Wrapper, Input, SuggestionsList, SuggestionItem } from "./style";

interface City {
  id: string;
  name: string;
}

interface CityAutocompleteProps {
  onSelect: (id: string) => void;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  onSelect,
  className,
  onChange,
  onKeyDown,
  ...rest
}) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(true);

  const [filteredSuggestions, setFilteredSuggestions] = useState<City[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { data, isLoading } = useFetchCities({ query });

  useEffect(() => {
    if (data?.length) {
      const filtered = data.filter((suggestion) =>
        suggestion.name.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [data, query]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setQuery(newValue);
    setValue(newValue);
    if (!newValue) {
      onSelect("");
    }
    if (onchange) {
      onChange(e);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && filteredSuggestions.length > 0) {
      const selectedSuggestion = filteredSuggestions[0];
      setValue(selectedSuggestion.name);
      setFilteredSuggestions([]);
      setActiveIndex(-1);
      onSelect(selectedSuggestion.id);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  }

  function handleClick(suggestion: City) {
    setValue(suggestion.name);
    setFilteredSuggestions([]);
    setActiveIndex(-1);
    onSelect(suggestion.id);
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
      <Input
        className={`autocomplete ${className}`}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        {...rest}
      />

      {isLoading && (
        <SuggestionsList className="dropDown">
          <Loader />
        </SuggestionsList>
      )}

      {filteredSuggestions.length > 0 && showDropDown && query !== "" && (
        <SuggestionsList>
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion.id}
              isActive={index === activeIndex}
              onClick={() => handleClick(suggestion)}
              className="dropDown"
            >
              {suggestion.name}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </Wrapper>
  );
};

export default CityAutocomplete;
