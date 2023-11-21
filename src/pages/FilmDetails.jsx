import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import requests from "../Requests";
import Layout from "../components/Layout";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";

const FilmDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState();
  const [videos, setVideos] = useState();
  const [credit, setCredit] = useState();
  useEffect(() => {
    axios
      .get(requests.requestFilmById.replace("id", id))
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(requests.requestFilmCreditById.replace("id", id))
      .then((response) => {
        console.log(response.data);
        setCredit(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(requests.requestVideosFilmById.replace("id", id))
      .then((response) => {
        setVideos(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);
  return (
    <Layout>
      <div className="w-full min-h-screen text-white overflow-hidden">
        {/* Poster and Information of Film */}
        <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center relative">
          <img
            className="w-full h-full absolute top-0 left-0 object-cover opacity-10"
            src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`}
            alt={movie?.title}
          />
          {/* Poster */}
          <div className="w-[350px] h-[550px] relative">
            <img
              className="w-full h-auto block"
              src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
              alt={movie?.title}
            />
          </div>

          {/* Information of Film */}
          <div className="w-full md:w-1/3 h-auto relative flex flex-col p-8 gap-2">
            <div className="text-white text-2xl font-sans font-bold w-full">
              {movie?.title}
            </div>
            <div className="w-full flex items-center gap-4">
              <div className="bg-red-500 text-white p-1 rounded-md font-bold">
                HD 4K
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt />
                <div>{movie?.release_date}</div>
              </div>
            </div>
            <div className="w-full flex">
              {movie?.genres.map((genre) => (
                <div key={genre.id} className="p-2 font-bold">
                  {genre.name}
                </div>
              ))}
            </div>
            <div className="w-full flex">
              <div>{movie?.overview}</div>
            </div>
            <div className="w-full p-4">
              <div className="flex justify-center gap-2 items-center border border-red-500 py-4 px-8 rounded-3xl duration-300 hover:bg-red-500">
                <span>Watch Now</span>
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
        {/* Trailer and Teaser */}
        <div className="flex flex-col">
          <div className="w-full flex flex-col-reverse md:flex-row justify-center p-8 gap-4">
            <div className="flex flex-col w-full md:w-3/4 items-center justify-center">
              {videos?.map((video) => (
                <iframe
                  key={video?.id}
                  src={`https://www.youtube.com/embed/${video?.key}`}
                  title={video?.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="p-4 w-full h-[350px] md:h-[500px]"
                ></iframe>
              ))}
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <h2 className="font-bold p-4 text-2xl">CAST</h2>
              <div className="w-full flex-col h-[400px] scrollbar scrollbar-thumb-red-500 pr-2 overflow-auto">
                {credit?.cast.map((cast) => (
                  <div
                    key={cast?.id}
                    className="w-full h-[85px] flex justify-between items-center"
                  >
                    <img
                      className="w-[75px] h-[75px] rounded-full object-cover"
                      src={`https://image.tmdb.org/t/p/w500/${cast?.profile_path}`}
                      alt={cast?.name}
                    />
                    <div className="text-center flex flex-col">
                      <div className="text-center">{cast?.name}</div>
                      <div className="text-center font-bold">
                        {cast?.character}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FilmDetails;
