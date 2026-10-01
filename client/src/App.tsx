import { useState } from "react";

function App() {
  // url = input field, shortUrl = result to display, error = validation/server error
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  // same validation idea as the backend, here just for instant feedback before any network call
  const isValidUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops the browser's default full page reload on submit
    setError("");
    setShortUrl("");

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    try {
      // POST straight to the backend on port 4000
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

      // updates state -> React re-renders, no reload needed
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
          {/* full backend address, not the relative shortUrl - a relative /abc123 would
              resolve against this page's own origin (5173), not the backend (4000) */}
          <a href={`http://localhost:4000${shortUrl}`} target="_blank" rel="noreferrer">
            {`http://localhost:4000${shortUrl}`}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;