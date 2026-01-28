import { useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:8080/api/search?q=${query}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Recherche globale</h3>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Mot-clé..."
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((r) => (
          <li key={`${r.type}-${r.id}`}>
            <b>{r.type}</b> — {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;