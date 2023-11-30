import axios from "axios";
import React, { useEffect, useState } from "react";
import requests from "../Requests";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();
  const movie = movies[Math.floor(Math.random() * movies.length)];

  useEffect(() => {
    axios.get(requests.requestPopular).then((response) => {
      setMovies(response.data.results);
    });
  }, []);

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };
  const handleChooseFilm = (e) => {
    e.preventDefault();
    navigate(`/movie/${movie.id}`);
  };
  return (
    <div className="w-full h-[650px] text-white pt-[72px]">
      <div className="w-full h-full">
        <div className="absolute w-full h-[550px-72px] bg-gradient-to-r from-black"></div>
        <img
          className="w-full h-full object-cover object-top opacity-80"
          src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
          alt={movie?.title}
        />
        <div className="absolute w-full top-[20%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold">{movie?.title}</h1>
          <div className="my-4">
            <button
              className="border bg-gray-300 text-black border-gray-300 py-2 px-5 hover:bg-red-500 duration-200 hover:text-white rounded-lg"
              onClick={handleChooseFilm}
            >
              Play
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Released: {movie?.release_date}
          </p>
          <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
            {truncateString(movie?.overview, 150)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
