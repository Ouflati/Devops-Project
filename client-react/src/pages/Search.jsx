import { useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/search?q=${query}`);

      if (!res.ok) {
        throw new Error("Erreur API");
      }

      const data = await res.json();
      setResults(data.results || []);
      setError(null);
    } catch (err) {
      setError("Impossible de contacter l’API");
      setResults([]);
    }
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

      {error && <p style={{ color: "red" }}>{error}</p>}

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
