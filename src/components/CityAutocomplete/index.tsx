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
  placeholder?: string;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  onSelect,
  className,
  onChange,
  onKeyDown,
  placeholder = "Search...",

  ...rest
}) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(true);

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { data, isLoading } = useFetchCities({ query });
  const suggestions = data || [];

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
    if (e.key === "Enter" && showDropDown) {
      const selectedSuggestion = suggestions[0];
      setValue(selectedSuggestion.name);
      setShowDropDown(false);
      setActiveIndex(-1);
      onSelect(selectedSuggestion.id);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  }

  function handleClick(suggestion: City) {
    setValue(suggestion.name);
    setShowDropDown(false);
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
        placeholder={placeholder}
        {...rest}
      />

      {isLoading && (
        <SuggestionsList className="dropDown">
          <Loader />
        </SuggestionsList>
      )}

      {suggestions.length > 0 && showDropDown && query !== "" && (
        <SuggestionsList>
          {suggestions.map((suggestion, index) => (
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
