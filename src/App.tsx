import { useState } from "react";
import "./App.css";
import CityAutocomplete from "./components/CityAutocomplete";

function App() {
  const [cityUUID, setCityUUID] = useState("");
  return (
    <>
      <CityAutocomplete
        onSelect={(cityUUID) => setCityUUID(cityUUID)}
        placeholder="seach city ..."
      />
      <div style={{ minHeight: 100 }}>
        city UUID Selected:
        <br />
        {cityUUID}
      </div>
    </>
  );
}

export default App;
