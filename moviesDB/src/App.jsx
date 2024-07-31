import { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true); // To track if more data is available
  const observer = useRef();
  const [searchTerm,setSearchTerm] = useState('')
console.log(searchTerm,"searchTermsearchTermsearchTerm");
  const fetchMoviesData = async (page) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=38ea5e7c8561a585923cb35fd520dfa3&page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData((prevData) => [...prevData, ...result.results]);
      setHasMore(result.results.length > 0);
    } catch (error) {
      console.error("Error while fetching movies data", error);
    }
  };

  const getsearchData = async() => {
    try {
      console.log(`https://api.themoviedb.org/3/search/movie?api_key=38ea5e7c8561a585923cb35fd520dfa3&query=${searchTerm}`);
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=38ea5e7c8561a585923cb35fd520dfa3&query=${searchTerm}`)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.results)
    } catch (error) {
      console.log(error,"ERROR FETCHING SEARCH DATA");
    }
  }

  useEffect(() => {
    fetchMoviesData(pageNumber);
  }, [pageNumber]);

  const lastMovieElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  return (
    <div>
      <h1>Movies DB</h1>

      <div>
        <p>Search</p>
    <input type='text'  onChange={(e) => {
      // Add search functionality here
      setTimeout(() => {
        setSearchTerm(e.target.value)
      },200)
    }} />
    <button onClick = {() => {
      setPageNumber(1)
      setData([])
      getsearchData()
      setSearchTerm('')
    }}>Search</button>
      </div>
      <div className="movie-grid">
        {data.map((movie, index) => (
          <div key={index} ref={index === data.length - 1 ? lastMovieElementRef : null} className="movie-card">
            <div className="movie-item">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                alt={movie?.original_title}
                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
              />
            </div>
            <div className="movie-info">
              <h2>{movie?.original_title}</h2>
              <h2>{movie?.vote_average}</h2>
            </div>
            <p>{movie?.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
