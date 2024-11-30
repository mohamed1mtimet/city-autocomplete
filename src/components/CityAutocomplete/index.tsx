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
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({ onSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");

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
  }
  function handelClickingOutside() {
    setFilteredSuggestions([]);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && filteredSuggestions.length > 0) {
      const selectedSuggestion = filteredSuggestions[0];
      setValue(selectedSuggestion.name);
      setFilteredSuggestions([]);
      setActiveIndex(-1);
      onSelect(selectedSuggestion.id);
    }
  }

  function handleClick(suggestion: City) {
    setValue(suggestion.name);
    setFilteredSuggestions([]);
    setActiveIndex(-1);
    onSelect(suggestion.id);
  }

  return (
    <Wrapper>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        onBlur={handelClickingOutside}
      />

      {isLoading && (
        <SuggestionsList>
          <Loader />
        </SuggestionsList>
      )}

      {filteredSuggestions.length > 0 && query !== "" && (
        <SuggestionsList>
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion.id}
              isActive={index === activeIndex}
              onClick={() => handleClick(suggestion)}
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
