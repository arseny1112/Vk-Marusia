import styles from './Genres.module.css'
import globalStyles from '../../index.module.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


const images = import.meta.glob('../../assets/imgs/genreImages/*.jpg', { eager: true });
const genreImages: Record<string, string> = {};

Object.entries(images).forEach(([path, module]) => {
  const genre = path.split('/').pop()?.replace('.jpg', '');
  if (genre && module && typeof module === 'object' && 'default' in module) {
    genreImages[genre] = module.default as string;
  }
});

export function Genres(){
    const [genres, setGenres] = useState<string[]>([]);

     useEffect(() => {
        fetch('https://cinemaguide.skillbox.cc/movie/genres', {
           method: 'GET',
           credentials: 'include'
        })
        .then((response) => response.json())
        .then(data => setGenres(data))
      }, []);

    return(
        <main>
             <div className={` ${globalStyles.container} ${styles.genres}`}>
            <h2>Жанры фильмов</h2>

            
              

            <div className={`${globalStyles.flex} ${styles.genresCards}`}>
  {genres.map((genre) => {
    const imageSrc = genreImages[genre] || '/imgs/placeholder.jpg';
    return (
      <Link to={`/genres/${genre}`} key={genre} className={`${globalStyles.flex} ${styles.genresCardItem}`}>
        <img src={imageSrc} alt={genre} />
        <p>{genre}</p>
      </Link>
    );
  })}
</div>

            </div>
        </main>
    )
}