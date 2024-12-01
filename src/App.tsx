import { useState } from "react";
import "./App.css";
import Autocomplete from "./components/Autocomplete";
import axios from "axios";

function App() {
  const [cityUUID, setCityUUID] = useState("");
  return (
    <>
      <Autocomplete
        onSelect={(cityUUID) => setCityUUID(cityUUID)}
        placeholder="seach city ..."
        getQueryKey={(query) => ["cities", query]}
        getQueryFn={(query) => async () => {
          if (!query) return [];
          const response = await axios.get(
            `https://etherqmshqkpehcowxqh.supabase.co/functions/v1/cities?search=${query}`
          );
          return response.data
            .filter(
              (e: { name: string; id: string }) =>
                e.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
            )
            .map((e: { id: string; name: string }) => ({
              key: e.id,
              label: e.name,
            }));
        }}
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
