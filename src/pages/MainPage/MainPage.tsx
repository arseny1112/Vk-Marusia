import styles from "./MainPage.module.css";
import globalStyles from "../../index.module.css";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MovieMetaInfo } from "../../Components/MovieMetaInfo.tsx/MovieMetaInfo";
import { useFavorites } from "../../contexts/FavoritesContext";
import { ModalContext } from "../../contexts/ModalContext";
import { useContext } from "react";
import notFound from "../../assets/imgs/noImage.jpg";

interface ApiData {
  id: number;
  title: string;
  plot: string;
  tmdbRating: number;
  releaseYear: number;
  genres: string;
  runtime: number;
  posterUrl: string;
  trailerYouTubeId?: string;
}

export const MainPage: React.FC = () => {
  const [randomData, setData] = useState<ApiData | null>(null);
  const [topData, setTop] = useState<ApiData[] | null>(null);
  const [, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [trailerYouTubeId, setTrailerUrl] = useState<string | null>(null);
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();

  const modalContext = useContext(ModalContext);
  if (!modalContext) return null;
  const { openModal } = modalContext;

  useEffect(() => {
    fetch("https://cinemaguide.skillbox.cc/movie/top10?language=ru-RU", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((topData) => {
        setTop(topData);
        setLoading(false);
      });

    fetchRandomMovie();
  }, []);

  const fetchRandomMovie = () => {
    fetch("https://cinemaguide.skillbox.cc/movie/random?language=ru-RU")
      .then((response) => response.json())
      .then((randomData) => {
        setData(randomData);
        setLoading(false);
        if (randomData.trailerYouTubeId) {
          setTrailerUrl(randomData.trailerYouTubeId);
        }
      });
  };

  const isFavorite = randomData
    ? favorites.some((item) => item.id === randomData.id)
    : false;

  const handleToggleFavorite = () => {
    const authorized = localStorage.getItem("isLoggedIn") === "true";

    if (!authorized) {
      openModal();
      return;
    }

    if (!randomData) return;
    if (isFavorite) {
      removeFromFavorites(randomData.id);
    } else {
      addToFavorites(randomData);
    }
  };

  const movieTrailer = () => {
    if (trailerYouTubeId) {
      setOpened(true);
    }
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    const wrapper = scrollRef.current;

    wrapper.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <main>
      <div
        className={`${styles.overlay} ${opened ? styles.overlayShow : ""}`}
      ></div>

      <div className={globalStyles.container}>
        {opened && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <iframe
                src={
                  trailerYouTubeId
                    ? `https://www.youtube.com/embed/${trailerYouTubeId}`
                    : undefined
                }
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

        <div>
          {randomData && (
            <div className={`${styles.movie} ${globalStyles.flex}`}>
              <div className={styles.movieInfo}>
                <MovieMetaInfo
                  rating={randomData.tmdbRating}
                  releaseYear={randomData.releaseYear}
                  genres={randomData.genres}
                  runtime={randomData.runtime}
                />

                <div className={`${styles.movieInfoSect2}`}>
                  <h1>{randomData.title}</h1>
                  <p>{randomData.plot}</p>
                </div>

                <div
                  className={`${globalStyles.flex} ${styles.movieInfoSect2}`}
                >
                  <button
                    className={styles.movieInfoSect2Trailer}
                    onClick={movieTrailer}
                  >
                    Трейлер
                  </button>
                  <Link
                    className={styles.movieInfoSect2About}
                    to={`/movie/${randomData.id}`}
                    key={randomData.id}
                  >
                    О фильме
                  </Link>

                  <button
                    className={isFavorite ? styles.inFavorites : ""}
                    onClick={handleToggleFavorite}
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

                  <button onClick={fetchRandomMovie}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4C14.7486 4 17.1749 5.38626 18.6156 7.5H16V9.5H22V3.5H20V5.99936C18.1762 3.57166 15.2724 2 12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20C9.25144 20 6.82508 18.6137 5.38443 16.5H8V14.5H2V20.5H4V18.0006C5.82381 20.4283 8.72764 22 12 22C17.5228 22 22 17.5228 22 12H20Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <img
                className={styles.movieImg}
                src={randomData.posterUrl}
                alt=""
              />
            </div>
          )}

          {topData && (
            <div className={styles.top}>
              <h3>Топ 10 фильмов</h3>

              <div className={styles.scrollContainer}>
                <div
                  className={`${styles.gradientButton} ${styles.leftGradient}`}
                  onClick={() => scroll("left")}
                />

                <div className={styles.scrollWrapper} ref={scrollRef}>
                  <ul className={`${styles.topList} ${globalStyles.flex}`}>
                    {topData.map((movie, index) => (
                      <li className={styles.topListItem} key={movie.id}>
                        <Link to={`/movie/${movie.id}`}>
                          <p>{index + 1}</p>
                          {movie.posterUrl ? (
                            <img src={movie.posterUrl} />
                          ) : (
                            <img src={notFound} alt="Постер не найден" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`${styles.gradientButton} ${styles.rightGradient}`}
                  onClick={() => scroll("right")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
