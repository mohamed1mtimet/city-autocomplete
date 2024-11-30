import { useState } from "react";
import "./App.css";
import CityAutocomplete from "./components/CityAutocomplete";

function App() {
  const [cityUUID, setCityUUID] = useState("");
  return (
    <>
      <CityAutocomplete onSelect={(cityUUID) => setCityUUID(cityUUID)} />
      <div>
        city UUID Selected:
        <br />
        {cityUUID}
      </div>
    </>
  );
}

export default App;
