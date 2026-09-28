import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const isValidUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setShortUrl(data.short_url);
    } catch {
      setError("Could not reach the server");
    }
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a long URL"
        />
        <button type="submit">Shorten</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={`http://localhost:4000${shortUrl}`} target="_blank" rel="noreferrer">
            {`http://localhost:4000${shortUrl}`}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;