import styles from './MovieMetaInfo.module.css'
import globalStyles from '../../index.module.css'

interface MovieMetaInfoProps {
    rating: number;
    releaseYear: number;
    genres: string;
    runtime: number; 
    isHeader?: boolean;
  }



  
export function MovieMetaInfo({ rating, releaseYear, genres, runtime, isHeader = false }: MovieMetaInfoProps) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

      let color: string = '';

     if(rating < 5){
      color = 'ratingRed'
     }else if(rating >= 5 && rating < 7){
      color = 'ratingGrey'
     }else if(rating >=7 && rating < 8){
      color = 'ratingGreen'
     }else if(rating >= 8){
      color = 'ratingYellow'
     }

     const genreList = Array.isArray(genres)
     ? genres
     : typeof genres === 'string'
       ? genres.split(', ')
       : [];
   
     const formattedGenres = genreList.length > 1 ? genreList.join(', '): genreList[0]

    return (
      <div className={`${globalStyles.flex} ${styles.movieInfoSect1} ${isHeader ? styles.isHeader : ''}`}>
        <span className={`${styles.ratingSpan} ${styles[color]}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00105 12.1734L3.29875 14.8055L4.34897 9.51997L0.392578 5.86124L5.74394 5.22675L8.00105 0.333374L10.2581 5.22675L15.6095 5.86124L11.6531 9.51997L12.7033 14.8055L8.00105 12.1734Z" fill="white"/>
          </svg>
          {rating}
        </span>
        <p>{releaseYear}</p>
        <p>{formattedGenres}</p>
        <p>{hours} ч {minutes} мин</p>
      </div>
    );
  }