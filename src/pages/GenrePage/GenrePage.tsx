import styles from "./GenrePage.module.css";
import globalStyles from "../../index.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface MovieDetails {
  id: number;
  title: string;
  plot: string;
  tmdbRating: number;
  releaseYear: number;
  genres: string;
  runtime: number;
  posterUrl: string;
  trailerYouTubeId?: string;
  language: string;
  budget: string;
  revenue: number;
  director: string;
  production: string;
  awardsSummary: string;
}

export function GenrePage() {
  const { genre } = useParams<{ genre: string }>();
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [moviesCount, setMoviesCount] = useState(15);

  useEffect(() => {
    fetch("https://cinemaguide.skillbox.cc/movie", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((topData) => {
        setMovies(topData);
      });
  }, []);

  if (!movies) return;

  const filteredMovies = movies.filter((movie) =>
    movie.genres.includes(genre?.toLowerCase() ?? ""),
  );

  const showMore = () => {
    setMoviesCount((prev) => prev + 10);
  };

  if (!genre) {
    return <div>Жанр не найден</div>;
  }

  return (
    <main>
      <div className={`${styles.genre}  ${globalStyles.container}`}>
        <h2>
          <Link to={"/genres"}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.047 20.0012L26.2967 28.2507L23.9397 30.6077L13.333 20.0012L23.9397 9.39453L26.2967 11.7515L18.047 20.0012Z"
                fill="white"
              />
            </svg>
          </Link>

          {genre}
        </h2>

        <div className={`${globalStyles.flex} ${styles.genreCards}`}>
          {filteredMovies.slice(0, moviesCount).map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              className={`${globalStyles.flex} ${styles.genresCardItem}`}
            >
              <img src={movie.posterUrl} alt="" />
            </Link>
          ))}
          {moviesCount < filteredMovies.length && (
            <button onClick={showMore}>Показать еще</button>
          )}
        </div>
      </div>
    </main>
  );
}
