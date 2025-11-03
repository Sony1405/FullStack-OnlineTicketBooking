import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5000;
app.use(cors());

const RAPID_API_KEY = "ba2319d3bbmsh6eca0ea5671752cp1ec09ejsn07d1f95db3bd";

// Ongoing movies endpoint
app.get("/api/ongoing", async (req, res) => {
  try {
    const movies = [];
    const ids = new Set();
    let attempts = 0;

    // Try to get 10 unique movies
    while (movies.length < 10 && attempts < 20) {
      attempts++;
      const response = await axios.get(
        "https://tmdb-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com/v1/tmdb/random",
        {
          headers: {
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host":
              "tmdb-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com",
          },
        }
      );

      const movie = response.data;

      if (!ids.has(movie.id)) {
        ids.add(movie.id);
        movies.push(movie);
      }
    }

    res.json(movies);
  } catch (error) {
    console.error("❌ Error fetching ongoing movies:", error.message);
    res.status(500).json({ error: "Failed to fetch ongoing movies" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
