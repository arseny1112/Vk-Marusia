import { useParams } from "react-router-dom";
import globalStyles from "../../index.module.css";
import styles from "./MovieInfo.module.css";
import { useEffect, useState, useContext } from "react";
import underlineImg from "../../assets/imgs/underline.svg";
import { MovieMetaInfo } from "../../Components/MovieMetaInfo.tsx/MovieMetaInfo";
import { useFavorites } from "../../contexts/FavoritesContext";
import { ModalContext } from "../../contexts/ModalContext";

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

export function MovieInfo() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const modalContext = useContext(ModalContext);
  if (!modalContext) return null;
  const {openModal } = modalContext;

  useEffect(() => {
    if (id) {
      fetch(`https://cinemaguide.skillbox.cc/movie/${id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setMovie(data);
          setLoading(false);
        });
    }
  }, [id]);

  const isFavorite = movie
    ? favorites.some((item) => item.id === movie.id)
    : false;

  const handleToggleFavorite = () => {
    const authorized = localStorage.getItem("isLoggedIn") === "true";

    if (!authorized) {
      openModal();
      return;
    }
    if (!movie) return;
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const movieTrailer = () => {
    setOpened(!opened);
  };

  if (!movie) return;

  return (
    <main>
      <div
        className={`${styles.overlay} ${opened ? styles.overlayShow : ""}`}
      ></div>

      <div className={` ${globalStyles.container}`}>
        <div className={`${globalStyles.flex} ${styles.movie}`}>
          <div className={styles.movieInfo}>
            <MovieMetaInfo
              rating={movie.tmdbRating}
              releaseYear={movie.releaseYear}
              genres={movie.genres}
              runtime={movie.runtime}
            />

            <div className={`${styles.movieInfoSect2}`}>
              <h1>{movie.title}</h1>
              <p>{movie.plot}</p>
            </div>

            <div className={`${globalStyles.flex} ${styles.movieInfoSect2}`}>
              {movie.trailerYouTubeId && (
                <button
                  className={styles.movieInfoSect2Trailer}
                  onClick={movieTrailer}
                >
                  Трейлер
                </button>
              )}
              {opened && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <iframe
                      src={`https://www.youtube.com/embed/${movie.trailerYouTubeId}`}
                      title="Трейлер"
                      width="640"
                      height="360"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                    <button onClick={() => setOpened(false)}>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="48" height="48" rx="24" fill="white" />
                        <path
                          d="M22.5859 24L14.793 16.2071L16.2072 14.7928L24.0001 22.5857L31.793 14.7928L33.2072 16.2071L25.4143 24L33.2072 31.7928L31.793 33.2071L24.0001 25.4142L16.2072 33.2071L14.793 31.7928L22.5859 24Z"
                          fill="black"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleToggleFavorite}
                className={isFavorite ? styles.inFavorites : ""}
              >
                <svg
                  width="24"
                  height="24"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  fill="red"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
       2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
       C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
       22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
          </div>
          <img className={styles.movieImg} src={movie.posterUrl} alt="" />
        </div>

        <div className={styles.aboutMovie}>
          <h3>О фильме</h3>
          <ul className={styles.aboutMovieList}>
            <li className={`${globalStyles.flex} ${styles.aboutMovieListItem}`}>
              <p>Язык оригинала</p>
              <img src={underlineImg} alt="" />
              <p>{movie.language}</p>
            </li>

            <li
              className={`${globalStyles.flex} ${`${globalStyles.flex} ${styles.aboutMovieListItem}`}`}
            >
              <p>Бюджет</p>
              <img src={underlineImg} alt="" />
              <p>
                {movie.budget && !isNaN(Number(movie.budget))
                  ? Number(movie.budget).toLocaleString("ru-RU")
                  : "Не указано"}
              </p>
            </li>

            <li className={`${globalStyles.flex} ${styles.aboutMovieListItem}`}>
              <p>Выручка </p>
              <img src={underlineImg} alt="" />
              <p>
                {movie.revenue && !isNaN(Number(movie.revenue))
                  ? Number(movie.revenue).toLocaleString("ru-RU")
                  : "Не указано"}
              </p>
            </li>

            <li className={`${globalStyles.flex} ${styles.aboutMovieListItem}`}>
              <p>Режиссёр</p>
              <img src={underlineImg} alt="" />
              <p>{movie.director ? movie.director : "Не указано"}</p>
            </li>

            <li className={`${globalStyles.flex} ${styles.aboutMovieListItem}`}>
              <p> Продакшен</p>
              <img src={underlineImg} alt="" />
              <p>{movie.production ? movie.production : "Не указано"}</p>
            </li>

            <li className={`${globalStyles.flex} ${styles.aboutMovieListItem}`}>
              <p>Награды</p>
              <img src={underlineImg} alt="" />
              <p>{movie.awardsSummary ? movie.awardsSummary : "Не указано"}</p>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
